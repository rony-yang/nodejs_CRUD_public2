/*

main_json   : views/data.json DB를 사용한 페이지
main_local  : local의 mysql DB를 사용한 페이지
main_render : render 사이트의 postgreSQL DB를 사용한 페이지

password_local  : local의 mysql DB에 연결하는 접속 비밀번호
password_render : render 사이트의 postgreSQL DB에 연결하는 접속 비밀번호




접속할 때 package.json에서 아래 내용 변경하기!!
"start": "node main_render.js",
"dev": "nodemon main_render.js",


*/