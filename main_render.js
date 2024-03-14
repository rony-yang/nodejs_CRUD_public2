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

const PORT = process.env.PORT || 5157;

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

// const { pool } = require('./password_render.js'); // 로컬에서 바로 연결할 때 gitignore 파일의 접속 비밀번호를 사용하여 접속

// render 사이트의 secret files을 사용하여 접속
const fs = require('fs');
const { Pool } = require('pg');
const connectionString = fs.readFileSync('/etc/secrets/password_render', 'utf8'); // secret files 접속경로
const pool = new Pool({
  connectionString: connectionString,
});

async function asyncQuery(sql, params = []) {
  try {
    const client = await pool.connect(); // 풀에서 클라이언트 가져오기
    const { rows } = await client.query(sql, params); // 쿼리 실행
    client.release(); // 클라이언트를 풀에 반환
    return rows; // 결과 반환
  } catch (err) {
    console.error(`!! asyncQuery 에러 \n::${err}\n[sql]::${sql}\n[파라미터]::${params}`);
    return false;
  }
}

const inputDB = 'public'; // render DB

// 구글 캘린더 OAuth
const credentials = JSON.parse(fs.readFileSync('views/etc/credentials.json', 'utf8'));

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

// 메뉴
app.get('/lunchMenu', async (req, res) => {
	res.render('etc/lunchMenu');
});

/////////////////////////////////// 3. 페이지 렌더링 종료 ///////////////////////////////////

/////////////////////////////////// 4. register.ejs 사용 시작 ///////////////////////////////////

// 회원가입
app.get('/register', async (req, res) => {
	if (!req.session.user || req.session.user === undefined) {
        res.render('register');
    } else {
        sessionID = req.session.user.id;
        res.render('register', {sessionID: sessionID});
    }	
});

// 회원가입 시 아이디 중복확인
app.post("/id_duplicate", async (req, res, err) => {
  let userID = req.body.userID

  let rows = await asyncQuery(`SELECT * FROM ${inputDB}.members WHERE "userID"='${userID}'`); // postgresql
  if (rows != '') {
      res.send("fail");
  } else {
      res.send("ok");
  }
});

// 회원 가입
app.post('/register', async (req, res, err) => {
	
	// 비밀번호 암호화
    let saltRounds = 10; // salt가 높을 수록 암호화가 강력해지지만 속도가 느려진다

	let userID 			    = req.body.userID;
	// let password 	  = req.body.password;
	let password_bcrypt = bcrypt.hashSync(req.body.password, saltRounds);
	let name 			      = req.body.name;
	let birth 			    = req.body.birth;
	let zipcode		    	= req.body.zipcode;
	let address		    	= req.body.address;
	let number 		    	= req.body.number;
	let email 		    	= req.body.email;

// postgresql
let rows = await asyncQuery(`INSERT INTO ${inputDB}.members 
                                ("userID", "password", "name", "birth", "zipcode", "address", "number", "email") 
                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, 
                                [userID, password_bcrypt, name, birth, zipcode, address, number, email]);

	if (rows.affectedRows != 0 && rows.errno == undefined) {
	  res.send('ok');
	  console.log("회원가입 완료");
	} else {
	  res.send('fail');
	  console.log("회원가입 실패");
	}
});

/////////////////////////////////// 4. register.ejs 사용 종료 ///////////////////////////////////

/////////////////////////////////// 5. login.ejs 사용 시작 ///////////////////////////////////

// 로그인
app.post("/loginaction", async (req, res, err) => {
  let userIP		= requestIp.getClientIp(req);
  let userID		= req.body.userID;
  let password	= req.body.password;

  let rows = await asyncQuery(`SELECT * FROM ${inputDB}.members WHERE "userID" = '${userID}'`); // postgresql

  // 값이 존재하지 않을 경우
  if (rows == null || rows == undefined || rows == '') {
      res.end("fail");
  // 값이 존재할 경우
} else {
  let hashed = rows[0].password; // 암호화된 비밀번호 출력
  let check_password = bcrypt.compareSync(password, hashed); // true, false로 출력

  // 비밀번호가 일치할때
  if (check_password == true) {
    console.log("ID : " + userID + " - 로그인 성공");

    // 아이디, 비번 체크
    req.session.user = {
      id: userID
    };

    req.session.save(function() {
      res.send("ok");
    });
  // 비밀번호가 틀렸을때
  } else {
    res.send("fail");
  }
}
});

/////////////////////////////////// 5. login.ejs 사용 종료 ///////////////////////////////////

/////////////////////////////////// 6. headnavbar.ejs 사용 시작 ///////////////////////////////////

app.get("/common/headernavbar", async (req, res) => {
	if (!req.session.user || req.session.user == undefined) {
        res.render('/common/headernavbar');
    } else {
        sessionID = req.session.user.id;
        res.render('/common/headernavbar', {sessionID: sessionID});
    }
});

// 로그아웃
app.post("/logoutaction", async (req, res, err) => {

    sessionID = req.body.sessionID;
	// 로그인 여부 확인
    if (req.session.user) {
        req.session.destroy(
            function(err) {
                if (err) {
					console.log('로그아웃 실패');
                    res.send("error");
                } else {
					console.log('로그아웃 성공');
                	res.send("ok");
				}   
            })
    } else {
        console.log('로그인 되어 있지 않습니다.');
        res.send("fail");
    }
});

/////////////////////////////////// 6. headnavbar.ejs 사용 종료 ///////////////////////////////////

/////////////////////////////////// 7. customerInfo.ejs 사용 시작 ///////////////////////////////////

// 거래처정보
app.get('/customerInfo', async (req, res) => {
	let rows = await asyncQuery(`SELECT * FROM ${inputDB}.customerInfo`);

	if (!req.session.user || req.session.user === undefined) {
        res.render('customerInfo', {rows: rows});
    } else {
        sessionID = req.session.user.id;
        res.render('customerInfo', {rows: rows, sessionID: sessionID});
    }
});

// 거래처정보 테이블
app.post('/customerInfo_get', async (req, res) => {
  let rows = await asyncQuery(`SELECT * FROM ${inputDB}.customerInfo`);
res.json(rows);
});

// 정보 상세보기
app.post('/customer_detail', async (req, res) => {
  let check_No = req.body.No;
  let rows = await asyncQuery(`SELECT * FROM ${inputDB}.customerInfo WHERE "No" = '${check_No}'`); // postgresql
  if (rows.affectedRows != 0 && rows.errno == undefined) {
  res.send(rows);
} else {
  res.send('fail');
}
});

// 신규등록
app.post('/customer_add', async (req, res) => {
let registrationNum 		    	= req.body.registrationNum;
let name 					          	= req.body.name;
let representative				    = req.body.representative;
let date						          = req.body.date;
let corporateRegistrationNum 	= req.body.corporateRegistrationNum;
let location					        = req.body.location;
let locationOfHeadOffice	  	= req.body.locationOfHeadOffice;
let typeOfBusiness			    	= req.body.typeOfBusiness;
let item					          	= req.body.item;
let email					          	= req.body.email;
let callNum					        	= req.body.callNum;
let personInCharge		    		= req.body.personInCharge;
let memo						          = req.body.memo;

// postgresql
let rows = await asyncQuery(`INSERT INTO ${inputDB}.customerInfo 
  ("registrationNum", "name", "representative", "date", "corporateRegistrationNum", "location", "locationOfHeadOffice", "typeOfBusiness", "item", "email", "callNum", "personInCharge", "memo")             
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,[
  registrationNum, name, representative, date, corporateRegistrationNum, location, locationOfHeadOffice, typeOfBusiness, item, email, callNum, personInCharge, memo]);
              
if (rows.affectedRows != 0 && rows.errno == undefined) {
  res.send('ok');
  console.log("거래처 정보 등록완료");
} else {
  res.send('fail');
  console.log("거래처 정보 등록 실패");
}
});

// 거래처정보 수정하기
app.post("/customer_modify", async (req, res) => {
let registrationNum 		    	= req.body.registrationNum;
let name 						          = req.body.name;
let representative				    = req.body.representative;
let date						          = req.body.date;
let corporateRegistrationNum 	= req.body.corporateRegistrationNum;
let location				         	= req.body.location;
let locationOfHeadOffice		  = req.body.locationOfHeadOffice;
let typeOfBusiness				    = req.body.typeOfBusiness;
let item						          = req.body.item;
let email					          	= req.body.email;
let callNum					        	= req.body.callNum;
let personInCharge	    			= req.body.personInCharge;
let memo					          	= req.body.memo;
let No						          	= req.body.No;

// postgresql
let rows = await asyncQuery(`UPDATE ${inputDB}.customerInfo 
              SET "registrationNum" = '${registrationNum}',
                "name" = '${name}',
                "representative" = '${representative}',
                "date" = '${date}',
                "corporateRegistrationNum" = '${corporateRegistrationNum}',
                "location" = '${location}',
                "locationOfHeadOffice" = '${locationOfHeadOffice}',
                "typeOfBusiness" = '${typeOfBusiness}',
                "item" = '${item}',
                "email" = '${email}',
                "callNum" = '${callNum}',
                "personInCharge" = '${personInCharge}',
                "memo" = '${memo}'
                WHERE "No" ='${No}'
              `);


if (rows.affectedRows != 0 && rows.errno == undefined) {
  res.send('ok');
  console.log(No + "번 정보 수정완료");
} else {
  res.send('fail');
  console.log("거래처 정보 수정 실패");
}
});

// 체크항목 다중 삭제하기
app.post('/customer_delete', async (req, res) => {
let check_No = JSON.parse(req.body.No);
let rows = await asyncQuery(`DELETE FROM ${inputDB}.customerInfo WHERE "No" IN (${check_No.map(value => `'${value}'`).join(',')})`); // postgresql

if (rows.affectedRows != 0 && rows.errno == undefined) {
  res.send('ok');
  console.log(check_No + "번 정보 삭제완료");
} else {
  res.send('fail');
  console.log("거래처 정보 삭제 실패");
}
});

/////////////////////////////////// 7. customerInfo.ejs 사용 종료 ///////////////////////////////////

/////////////////////////////////// 8. summarySheet.ejs 사용 ///////////////////////////////////

// 집계표
app.get('/summarySheet', async (req, res) => {
	var today = new Date().toISOString().slice(0, 10);
	// 한달 전 날짜 계산
	var oneMonthAgo = new Date();
	oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
	var oneMonthAgoStr = oneMonthAgo.toISOString().slice(0, 10);

	let rows = await asyncQuery(`
								SELECT id, 
									   date, 
									   money 
								FROM ${inputDB}.ledger 
								WHERE date BETWEEN '${oneMonthAgoStr}' AND '${today}'
								ORDER BY date
								`);

  // postgresql
	let monthly_total = await asyncQuery(`
    SELECT EXTRACT(month FROM date) AS month,
    SUM(money) AS total
    FROM ${inputDB}.ledger
    WHERE date BETWEEN '${oneMonthAgoStr}' AND '${today}'
    GROUP BY EXTRACT(month FROM date)
    ORDER BY MIN(date);
	`);
	
	if (!req.session.user || req.session.user === undefined) {
        res.render('summarySheet', { rows: rows, monthly_total: monthly_total, today : today, oneMonthAgoStr : oneMonthAgoStr});
    } else {
        sessionID = req.session.user.id;
        res.render('summarySheet', { rows: rows, monthly_total: monthly_total, sessionID: sessionID, today : today, oneMonthAgoStr : oneMonthAgoStr});
    }
});

// 날짜 필터로 검색하기
app.post('/viewBtnSearch', async (req, res) => {
	let beforeDate = req.body.beforeDate;
	let afterDate  = req.body.afterDate;
	let rows = await asyncQuery(`SELECT id, 
									    date, 
									    money 
								 FROM ${inputDB}.ledger
								 WHERE date BETWEEN '${beforeDate}' AND '${afterDate}'
								 ORDER BY date
								`);
	res.json(rows);
});

/////////////////////////////////// 8. summarySheet.ejs 사용 종료 ///////////////////////////////////

/////////////////////////////////// 9. board.ejs 사용 ///////////////////////////////////

// 게시판
app.get('/board', async (req, res) => {
	if (!req.session.user || req.session.user === undefined) {
    res.render('./board/board');
  } else {
    sessionID = req.session.user.id;
    res.render('./board/board', {sessionID: sessionID});
  }	
});

// 거래처정보 테이블
app.post('/board_get', async (req, res) => {
  let rows = await asyncQuery(`SELECT * FROM ${inputDB}.board`);
  res.json(rows);
});

// 상세페이지 이동 : 예) board_detailed_page?board_no=1
app.get('/board_detailed_page', async function(req, res) {
  let board_no = req.query.board_no;
  let rows = await asyncQuery(`SELECT * FROM ${inputDB}.board WHERE board_no = '${board_no}'`);

  if (rows.length > 0) {
    let board_title = rows[0].board_title;
    let board_user  = rows[0].board_user;
    let board_date  = rows[0].board_date;
    let board_contents  = rows[0].board_contents;

    // 로그인 한 아이디와 게시판 글 작성 아이디 비교
    let loggedInUserID = sessionID ? sessionID : '';
    // 동일할 경우 수정, 삭제 버튼 활성화 : true, false로 출력
    let edit_Btn = (loggedInUserID === board_user);
    let delete_context = (loggedInUserID === board_user);
    res.render('./board/board_detailed_page', 
    { board_no: board_no, board_title: board_title, board_user: board_user, board_date: board_date, board_contents:board_contents, 
      edit_Btn:edit_Btn, delete_context:delete_context, sessionID:sessionID });
  } else {
    res.status(404).send("페이지를 찾을 수 없습니다.");
  }
});

// 게시판 글쓰기 페이지 렌더링
app.get('/board_write', async (req, res) => {
  var today = new Date().toISOString().slice(0, 10);
  // 게시판 번호 최대값 가져와서 그 다음 숫자로 넣어주기
  let rows = await asyncQuery(`SELECT MAX(board_no) as max_board_no FROM ${inputDB}.board`);
  let next_board_no;
  if (rows && rows.length > 0 && rows[0].max_board_no !== null) {
    // 다음 board_no 값 계산
    next_board_no = rows[0].max_board_no + 1;
  } else {
    // 테이블에 아무 데이터도 없는 경우
    next_board_no = 1; // 1부터 시작하도록 설정
  }

	if (!req.session.user || req.session.user === undefined) {
    res.render('./board/board_write');
  } else {
    sessionID = req.session.user.id;
    res.render('./board/board_write', {sessionID: sessionID, today:today, next_board_no:next_board_no});
  }	
});

// 글 작성하기 버튼
app.post('/save_board', async (req, res) => {
  let board_no = req.body.board_no;
  let board_user = req.body.board_user;
  let board_date = req.body.board_date;
  let board_title = req.body.board_title;
  let board_contents = req.body.board_contents;

  // postgresql
	let rows = await asyncQuery(`INSERT INTO ${inputDB}.board
									("board_no", "board_user", "board_date", "board_title", "board_contents") VALUES ($1, $2, $3, $4, $5)`, 
									[board_no,	board_user, board_date, board_title, board_contents]);

	if (rows.affectedRows != 0 && rows.errno == undefined) {
	  res.send('ok');
	} else {
	  res.send('fail');
	}
});

// 글 수정하기 버튼
app.post('/edit_board', async (req, res) => {
  let board_no = req.body.board_no;
  let board_title = req.body.board_title;
  let board_contents = req.body.board_contents;

	let rows = await asyncQuery(`UPDATE ${inputDB}.board
    SET board_title = '${board_title}',
    board_contents = '${board_contents}'
    WHERE board_no ='${board_no}'
    `);

	if (rows.affectedRows != 0 && rows.errno == undefined) {
	  res.send('ok');
	} else {
	  res.send('fail');
	}
});

// 글 삭제하기 버튼
app.post('/delete_board', async (req, res) => {
  let board_no = req.body.board_no;

	let rows = await asyncQuery(`DELETE FROM ${inputDB}.board 
    WHERE board_no = '${board_no}'
    `);

	if (rows.affectedRows != 0 && rows.errno == undefined) {
	  res.send('ok');
	} else {
	  res.send('fail');
	}
});

// 내 글만 모아보기
app.post('/board_get_my', async (req, res) => {
  let sessionID = req.body.sessionID; // 현재 로그인한 사용자의 세션 ID
  if (!sessionID) {
    // 세션 ID가 없으면 에러 응답
    return res.status(400).json({ error: "세션 ID가 없습니다." });
  }

  try {
    // 현재 로그인한 사용자의 아이디를 기준으로 해당 사용자가 작성한 게시물을 데이터베이스에서 조회
    let rows = await asyncQuery(`SELECT * FROM ${inputDB}.board WHERE board_user = $1`, [sessionID]); // postgresql
    // 조회 결과를 JSON 형태로 응답
    res.json(rows);
  } catch (error) {
    // 오류가 발생하면 에러 응답
    console.error("게시물 조회 중 오류:", error);
    res.status(500).json({ error: "게시물 조회 중 오류가 발생했습니다." });
  }
});



/////////////////////////////////// 9. board.ejs 사용 ///////////////////////////////////

/////////////////////////////////// 10. americano.ejs 사용 ///////////////////////////////////

// 페이지 렌더링
app.get('/ame', async (req, res) => {
  let rows = await asyncQuery(`SELECT check_date, is_check FROM ${inputDB}.calendar`);
  res.render('etc/americano', { rows:rows });
});

// 체크박스 체크하면 DB로 저장
app.post('/cal_checked', async (req, res) => {

    let selected_date = req.body.selected_date;
    let selected_value = req.body.selected_value;

    // 해당 날짜의 레코드가 있는지 확인
    let rows1 = await asyncQuery(`
                                  SELECT check_date FROM ${inputDB}.calendar 
                                  WHERE check_date = ?`, [selected_date]);

      // 기존 값이 있을 경우 체크값 업데이트하기
      if(rows1.length > 0) {
        let rows2 = await asyncQuery(`
                                      UPDATE ${inputDB}.calendar 
                                      SET is_check = '${selected_value}' 
                                      WHERE check_date ='${selected_date}'`);

        if (rows2.affectedRows != 0 && rows2.errno == undefined) {
          res.send('ok');
        } else {
          res.send('fail');
        }

      // 기존 값이 없을 경우 새로 삽입
      } else {
        let rows3 = await asyncQuery(`
                                      INSERT INTO ${inputDB}.calendar (check_date, is_check) 
                                      VALUES (?, ?)`, [selected_date, selected_value]);

        if (rows3.affectedRows != 0 && rows3.errno == undefined) {
          res.send('ok');
        } else {
          res.send('fail');
        }
      }
});


/////////////////////////////////// 10. americano.ejs 사용 ///////////////////////////////////