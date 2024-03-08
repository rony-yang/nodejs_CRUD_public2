// 기존 로컬 DB 연결
const mysql2 = require("mysql2/promise");
const _pool = mysql2.createPool({
	host: "localhost",
	user: "root",
	password: "1234",
	port: 3306,
	dateStrings: "date",
	connectionLimit: 100,
	enableKeepAlive: true
});

module.exports = {
	pool: _pool
};



