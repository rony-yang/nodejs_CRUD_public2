//pm2 start ./pm2-config.json
//pm2 logs 0

/*

<< nodeJS를 사용한 CRUD 구현 >>
1. 개발 목표 : CRUD를 사용한 페이지 구현
2. git : https://github.com/rony-yang/nodejs_CRUD_public

	순서
	
	1. setting
	2. DB
	3. 페이지 렌더링
	4. register.ejs 사용
	5. login.ejs 사용
	6. headnavbar.ejs 사용
	7. customerInfo.ejs 사용
	8. summarySheet.ejs 사용
  10. americano.ejs 사용

*/

/////////////////////////////////// 1. setting 시작 ///////////////////////////////////

const PORT = 5157;

const express = require('express');
const app = express();
const path = require('path');
const cron = require('node-cron'); // 스케쥴기능
const moment = require('moment'); // 현재시간 받아오기

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/css', express.static(path.join(__dirname, '/css')));
app.use('/img', express.static(path.join(__dirname, '/img')));
app.use('/js', express.static(path.join(__dirname, '/js')));

app.listen(PORT, '0.0.0.0', () => {
	console.log(`server started on PORT ${PORT} // ${new Date()}`);
});

const bodyParser = require('body-parser') 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    limit: '150mb',
    extended: true
}))

let sessionID = "";

// 비밀번호 암호화 모듈
const bcrypt = require('bcrypt');
const saltRounds = 10;

// npm install express-session
const requestIp = require('request-ip');

// session 설정
// npm install express-session memorystore
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

app.use(session({
    secret: 'my key',
    resave: false, 
    saveUninitialized: true,
    // store: new MemoryStore({
    //     checkPeriod: 7200000 // 2시간마다 만료된 세션 제거
    // })
}));

/////////////////////////////////// 1. setting 종료 ///////////////////////////////////

/////////////////////////////////// 2. DB 시작 ///////////////////////////////////

// data.json 파일 읽기 위해 사용
const fs = require('fs');

// 비동기적으로 파일 읽기
async function readDataFromJson() {
  try {
    const data = await fs.promises.readFile('views/data.json', 'utf8');
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (error) {
    console.error('data.json에서 데이터를 읽는 중 오류 발생:', error);
    return null;
  }
}

// DB 연결
async function _getPool() {
  try {
    const jsonData = readDataFromJson();
    const pool = mysql2.createPool({
      host: jsonData.host,
      user: jsonData.user,
      password: jsonData.password,
      database: jsonData.database
    });
    return pool;
  } catch (error) {
    console.error('연결 풀을 생성하는 중 오류 발생:', error);
    return null;
  }
}

// DB 연결
async function _getConn() {
  try {
    const pool = await _getPool();
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('연결 객체를 가져오는 중 오류 발생:', error);
    return null;
  }
}

async function asyncQuery(sql, params = []) {
	const conn = await _getConn();

	try {
		const [rows, _] = await conn.query(sql, params);
		return rows;
	} catch (err) {
		console.log(`!! asyncQuery Error \n::${err}\n[sql]::${sql}\n[Param]::${params}`);
	} finally {
		if (conn) {
			conn.release();
		}
  	}
	return false;
}

/////////////////////////////////// 2. DB 종료 ///////////////////////////////////

/////////////////////////////////// 3. 페이지 렌더링 시작 ///////////////////////////////////

app.get("/", async (req, res) => {
  if (req.session.user) {
      const lastPage = req.get('referer')
      sessionID = req.session.user.id;
  console.log(sessionID + "으로 로그인 중");
  
      return res.send(
          `<script>alert("이미 로그인 되어 있습니다. 로그인 중인 아이디는 ${sessionID} 입니다."); location='${lastPage}'</script>`
      );
  } else {
      res.render("index");
  }
});

// 회원가입
app.get('/register', async (req, res) => {
	if (!req.session.user || req.session.user === undefined) {
        res.render('register');
    } else {
        sessionID = req.session.user.id;
        res.render('register', {sessionID: sessionID});
    }	
});


// 거래처정보 페이지 렌더링
app.get('/customerInfo', async (req, res) => {
	const data = await readDataFromJson();
	  if (!data || !data.customerInfo) {
		res.status(500).send('Error reading data from data.json');
		return;
	  }

	const customerInfo = data.customerInfo;
	
	if (!req.session.user || req.session.user === undefined) {
		res.render('customerInfo', { rows: customerInfo });
	} else {
		sessionID = req.session.user.id;
		res.render('customerInfo', { rows: customerInfo, sessionID: sessionID });
	}	
});


// 집계표
app.get('/summarySheet', async (req, res) => {
  var today = new Date().toISOString().slice(0, 10);
  // 한달 전 날짜 계산
  var oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  var oneMonthAgoStr = oneMonthAgo.toISOString().slice(0, 10);

  const data = await readDataFromJson();
  if (!data || !data.ledger) {
    res.status(500).send('Error reading data from data.json');
    return;
  }

  const ledger = data.ledger;

  // 날짜 검색해서 거르기
  let rows = ledger.filter((item) => {
    const itemDate = new Date(item.date).toISOString().slice(0, 10);
    return itemDate >= oneMonthAgoStr && itemDate <= today;
  });

  // 월 합계 계산하기
  let monthly_total = {};
  for (const item of rows) {
    const month = new Date(item.date).getMonth() + 1;
    monthly_total[month] = (monthly_total[month] || 0) + parseInt(item.money);
  }

  const monthly_total_array = Object.entries(monthly_total).map(([month, total]) => ({
    month: parseInt(month),
    total: total,
  }));

  if (!req.session.user || req.session.user === undefined) {
    res.render('summarySheet', { rows: rows, monthly_total: monthly_total_array, today: today, oneMonthAgoStr: oneMonthAgoStr });
  } else {
    sessionID = req.session.user.id;
    res.render('summarySheet', { rows: rows, monthly_total: monthly_total_array, sessionID: sessionID, today: today, oneMonthAgoStr: oneMonthAgoStr });
  }
});

// 회원가입 시 아이디 중복확인
app.post("/id_duplicate", async (req, res, err) => {
  const userID = req.body.userID;
  const data = await readDataFromJson();
  if (!data || !data.members) {
    res.status(500).send("Error reading data from data.json");
    return;
  }

  const members = data.members;
  const userExists = members.some((member) => member.userID === userID);

  if (userExists) {
    res.send("fail");
  } else {
    res.send("ok");
  }
});

// 회원 가입
app.post('/register', async (req, res, err) => {
  // 비밀번호 암호화
  let saltRounds = 10;

  let userID = req.body.userID;
  let password = req.body.password;
  let name = req.body.name;
  let birth = req.body.birth;
  let zipcode = req.body.zipcode;
  let address = req.body.address;
  let number = req.body.number;
  let email = req.body.email;

  const data = await readDataFromJson();
  if (!data || !data.members) {
    res.status(500).send('Error reading data from data.json');
    return;
  }

  const members = data.members;

  // 아이디 중복확인
  const userExists = members.some((member) => member.userID === userID);
  if (userExists) {
    res.send('fail');
    console.log('회원가입 실패');
    return;
  }

  // 비밀번호 암호화
  const password_bcrypt = bcrypt.hashSync(password, saltRounds);

  // 신규가입
  const newMember = {
    userID, password: password_bcrypt, name, birth, zipcode, address, number, email
  };

  members.push(newMember);

  // data.json 업데이트
  try {
    await fs.promises.writeFile('views/data.json', JSON.stringify(data, null, 2), 'utf8');
    res.send('ok');
    console.log('회원가입 완료');
  } catch (error) {
    res.status(500).send('Error writing data to data.json');
    console.log('회원가입 실패');
  }
});

// 로그인
app.post("/loginaction", async (req, res, err) => {
  let userIP = requestIp.getClientIp(req);
  let userID = req.body.userID;
  let password = req.body.password;

  const data = await readDataFromJson();
  if (!data || !data.members) {
    res.status(500).send('Error reading data from data.json');
    return;
  }

  const members = data.members;

  // 아이디 있는지 확인
  const user = members.find((member) => member.userID === userID);
  if (!user) {
    res.send("fail");
    return;
  }

  let hashed = user.password;
  let check_password = bcrypt.compareSync(password, hashed);

  // 비밀번호까지 맞을 때 : 로그인 성공
  if (check_password) {
    console.log("ID: " + userID + " - login successful");

    // Set the session user data
    req.session.user = {
      id: userID
    };

    req.session.save(function () {
      res.send("ok");
    });
  } else {
    // 비밀번호 틀렸을 때
    res.send("fail");
  }
});

// 거래처정보 테이블
app.post('/customerInfo_get', async (req, res) => {
  try {
    const data = await readDataFromJson(); // 비동기로 데이터 로딩
    if (!data || !data.customerInfo) {
      res.status(500).json({ error: 'Error reading data from data.json' });
      return;
    }
    const customerInfo = data.customerInfo;
    res.json(customerInfo);
  } catch (error) {
    console.error('Error processing customerInfo_get:', error);
    res.status(500).json({ error: 'Error processing customerInfo_get' });
  }
});

// 정보 상세보기
app.post('/customer_detail', async (req, res) => {
  let check_No = req.body.No;
  const data = await readDataFromJson();
  if (!data || !data.customerInfo) {
    res.status(500).send('Error reading data from data.json');
    return;
  }

  const customerInfo = data.customerInfo;

  const customer = customerInfo.find((customer) => customer.No === check_No);
  if (customer) {
    res.send(customer);
  } else {
    res.send('fail');
  }
});

// 신규등록
app.post('/customer_add', async (req, res) => {
  let registrationNum = req.body.registrationNum;
  let name = req.body.name;
  let representative = req.body.representative;
  let date = req.body.date;
  let corporateRegistrationNum = req.body.corporateRegistrationNum;
  let location = req.body.location;
  let locationOfHeadOffice = req.body.locationOfHeadOffice;
  let typeOfBusiness = req.body.typeOfBusiness;
  let item = req.body.item;
  let email = req.body.email;
  let callNum = req.body.callNum;
  let personInCharge = req.body.personInCharge;
  let memo = req.body.memo;

  const data = await readDataFromJson();
  if (!data || !data.customerInfo) {
    res.status(500).send('Error reading data from data.json');
    return;
  }

  const customerInfo = data.customerInfo;

  // 새로운 항목 생성
  const newCustomer = {
    No: (customerInfo.length + 1).toString(),
    registrationNum, name, representative, date, corporateRegistrationNum, location, locationOfHeadOffice, typeOfBusiness,
    item, email, callNum, personInCharge, memo,
  };

  customerInfo.push(newCustomer);

  try {
    await fs.promises.writeFile('views/data.json', JSON.stringify(data, null, 2), 'utf8');
    res.send('ok');
    console.log('거래처 정보 등록완료');
  } catch (error) {
    res.status(500).send('Error writing data to data.json');
    console.log('거래처 정보 등록 실패');
  }
});

// 거래처정보 수정하기
app.post("/customer_modify", async (req, res) => {
  let registrationNum = req.body.registrationNum;
  let name = req.body.name;
  let representative = req.body.representative;
  let date = req.body.date;
  let corporateRegistrationNum = req.body.corporateRegistrationNum;
  let location = req.body.location;
  let locationOfHeadOffice = req.body.locationOfHeadOffice;
  let typeOfBusiness = req.body.typeOfBusiness;
  let item = req.body.item;
  let email = req.body.email;
  let callNum = req.body.callNum;
  let personInCharge = req.body.personInCharge;
  let memo = req.body.memo;
  let No = req.body.No;

  const data = await readDataFromJson();
  if (!data || !data.customerInfo) {
    res.status(500).send('Error reading data from data.json');
    return;
  }

  const customerInfo = data.customerInfo;

  const customer = customerInfo.find((customer) => customer.No === No);
  if (!customer) {
    res.send('fail');
    console.log("거래처 정보 수정 실패");
    return;
  }

  customer.registrationNum = registrationNum;
  customer.name = name;
  customer.representative = representative;
  customer.date = date;
  customer.corporateRegistrationNum = corporateRegistrationNum;
  customer.location = location;
  customer.locationOfHeadOffice = locationOfHeadOffice;
  customer.typeOfBusiness = typeOfBusiness;
  customer.item = item;
  customer.email = email;
  customer.callNum = callNum;
  customer.personInCharge = personInCharge;
  customer.memo = memo;

  // data.json 파일 업데이트
  try {
    await fs.promises.writeFile('views/data.json', JSON.stringify(data, null, 2), 'utf8');
    res.send('ok');
    console.log(No + "번 정보 수정완료");
  } catch (error) {
    res.status(500).send('Error writing data to data.json');
    console.log("거래처 정보 수정 실패");
  }
});

// 체크항목 다중 삭제하기
app.post('/customer_delete', async (req, res) => {
  let check_No = JSON.parse(req.body.No);
  const data = await readDataFromJson();
  if (!data || !data.customerInfo) {
    res.status(500).send('Error reading data from data.json');
    return;
  }

  data.customerInfo = data.customerInfo.filter((customer) => !check_No.includes(customer.No));

  // data.json 파일 업데이트
  try {
    await fs.promises.writeFile('views/data.json', JSON.stringify(data, null, 2), 'utf8');
    res.send('ok');
    console.log(check_No + "번 정보 삭제 완료");
  } catch (error) {
    res.status(500).send('Error writing data to data.json');
    console.log("거래처 정보 삭제 실패");
  }
});

// 날짜 필터로 검색하기
app.post('/viewBtnSearch', async (req, res) => {
  try {
    const beforeDate = req.body.beforeDate;
    const afterDate = req.body.afterDate;
    const jsonData = await readDataFromJson();

    if (!jsonData || !jsonData.ledger) {
      res.status(500).json({ error: 'Error reading data from data.json' });
      return;
    }

    // 데이터 검색하기
    const rows = jsonData.ledger.filter((entry) => {
      const entryDate = new Date(entry.date).toISOString().slice(0, 10);
      return entryDate >= beforeDate && entryDate <= afterDate;
    });
    // 날짜 오름차순 정렬
    rows.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(rows);
    
  } catch (error) {
    console.error('Error processing viewBtnSearch request:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
});

// 게시판
app.post('/board_get', async (req, res) => {
  try {
    const data = await readDataFromJson(); // 비동기로 데이터 로딩
    if (!data || !data.board) {
      res.status(500).json({ error: 'Error reading data from data.json' });
      return;
    }
    const board = data.board;
    res.json(board);
  } catch (error) {
    console.error('Error processing board_get:', error);
    res.status(500).json({ error: 'Error processing board_get' });
  }
});

