const fs = require('fs');

const customerInfoJSON = {
	"customerInfo": [
		{
			"No": "1",
			"registrationNum": "100-10-10000",
			"name": "테스트회사",
			"representative": "홍대표",
			"date" : "2001-01-01",
			"corporateRegistrationNum" : "10000-100000",
			"location" : "서울광역시 중구 세종대로",
			"locationOfHeadOffice" : "경남 창원시 성산구 중앙대로",
			"typeOfBusiness" : "제조업",
			"item" : "물품제조",
			"email" : "a@a.net",
			"callNum" : "010-1111-2222",
			"personInCharge" : "김담당",
			"memo" : "매달 15일 물품결제일"		
		},
		{
			"No": "2",
			"registrationNum": "200-20-20000",
			"name": "샘플회사",
			"representative": "김사장",
			"date" : "2010-11-01",
			"corporateRegistrationNum" : "20000-200000",
			"location" : "제주광역시 제주시 광양9길",
			"locationOfHeadOffice" : "제주광역시 제주시 광양9길",
			"typeOfBusiness" : "서비스업",
			"item" : "관광",
			"email" : "bbb@gmail.com",
			"callNum" : "010-2222-3333",
			"personInCharge" : "최대리",
			"memo" : ""	
		},
		{
			"No": "3",
			"registrationNum": "300-30-30000",
			"name": "무역회사",
			"representative": "박회장",
			"date" : "1999-05-01",
			"corporateRegistrationNum" : "30000-300000",
			"location" : "대구광역시 중구 공평로",
			"locationOfHeadOffice" : "대구광역시 중구 공평로",
			"typeOfBusiness" : "도매업",
			"item" : "판매",
			"email" : "c1@c.net",
			"callNum" : "010-3333-4444",
			"personInCharge" : "박사원",
			"memo" : ""		  
		}
	],
	"members": [
		{
			"No" : "1",
			"userID" : "abc",
			"password" : "1234",
			"name" : "홍길동",
			"birth" : "1990-01-01",
			"zipcode" : "12345",
			"address" : "경상남도 창원시 의창구",
			"number" : "010-1111-2222",
			"email" : "hong@a.net"
		},
		{
			"No" : "2",
			"userID" : "zxy",
			"password" : "1234",
			"name" : "유관순",
			"birth" : "1980-01-01",
			"zipcode" : "12345",
			"address" : "경상남도 창원시 성산구",
			"number" : "010-3333-4444",
			"email" : "yu@a.net"
		}
	],
	"ledger": [
		{
			"id" : "1",
			"date" : "2023-06-01 00:00:00",
			"money" : "12827"
		},
		{
			"id" : "2",
			"date" : "2023-06-15 00:00:00",
			"money" : "2345532"
		},
		{
			"id" : "3",
			"date" : "2023-06-26 00:00:00",
			"money" : "221312"
		},
		{
			"id" : "4",
			"date" : "2023-07-01 00:00:00",
			"money" : "345443"
		},
		{
			"id" : "5",
			"date" : "2023-07-11 00:00:00",
			"money" : "12464"
		},
		{
			"id" : "6",
			"date" : "2023-07-13 00:00:00",
			"money" : "866464"
		},
		{
			"id" : "7",
			"date" : "2023-07-22 00:00:00",
			"money" : "845463"
		},
		{
			"id" : "8",
			"date" : "2023-05-01 00:00:00",
			"money" : "64632"
		},
		{
			"id" : "9",
			"date" : "2023-05-15 00:00:00",
			"money" : "2343254"
		},
		{
			"id" : "10",
			"date" : "2023-06-11 00:00:00",
			"money" : "456532"
		},
		{
			"id" : "11",
			"date" : "2023-07-22 00:00:00",
			"money" : "53623"
		},
		{
			"id" : "12",
			"date" : "2023-05-12 00:00:00",
			"money" : "124543"
		},
		{
			"id" : "13",
			"date" : "2023-05-19 00:00:00",
			"money" : "743432"
		},
		{
			"id" : "14",
			"date" : "2023-06-18 00:00:00",
			"money" : "43455"
		},
		{
			"id" : "15",
			"date" : "2023-05-08 00:00:00",
			"money" : "34322"
		}
		
	]
};

try {
  fs.writeFileSync('data.json', JSON.stringify(customerInfoJSON, null, 2));
  console.log('Data successfully written to data.json.');
} catch (error) {
  console.error('Error writing data:', error);
}
