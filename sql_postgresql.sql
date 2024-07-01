CREATE TABLE board (
  board_no SERIAL PRIMARY KEY,
  board_title VARCHAR(100) DEFAULT NULL,
  board_user VARCHAR(100) DEFAULT NULL,
  board_date DATE DEFAULT NULL,
  board_contents VARCHAR(5000) DEFAULT NULL
);

COMMENT ON COLUMN board.board_no IS '번호';
COMMENT ON COLUMN board.board_title IS '제목';
COMMENT ON COLUMN board.board_user IS '사용자';
COMMENT ON COLUMN board.board_date IS '작성일';
COMMENT ON COLUMN board.board_contents IS '내용';

INSERT INTO board (board_no, board_title, board_user, board_date, board_contents) VALUES 
(1, '첫번째 공지사항입니다.', '관리자', '2024-01-01', '홈페이지를 개설하였습니다..'),
(2, '테스트 페이지입니다.', '홍길동', '2024-02-01', '동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려 강산 대한사람 대한으로 길이 보전하세 남산 위에 저 소나무 철갑을 두른듯 바람서리 불변함은 우리 기상일세 무궁화 삼천리 화려 강산 대한사람 대한으로 길이 보전하세 가을 하늘 공활한데 높고 구름 없이 밝은 달은 우리 가슴 일편단심일세 무궁화 삼천리 화려 강산 대한사람 대한으로 길이 보전하세 이 기상과 이 마음으로 충성을 다하여 괴로우나 즐거우나 나라사랑하세 무궁화 삼천리 화려 강산 대한사람 대한으로 길이 보전하세'),
(3, '카카오톡 알림톡 실시', '관리자', '2024-03-01', '아래 링크를 클릭하시면 카카오톡에서 알림톡을 받아보실 수 있습니다.'),
(4, '홈페이지에서 수정 테스트', 'aaa', '2024-02-28', '수정합니다2'),
(5, '글쓰기 테스트2', 'bbb', '2024-02-28', '냉무2'),
(6, '글쓰기2', 'aaa', '2024-02-28', '냉무22');

CREATE TABLE calendar (
  no SERIAL PRIMARY KEY,
  check_date DATE DEFAULT NULL,
  is_check VARCHAR(100) DEFAULT NULL
);

COMMENT ON TABLE calendar IS '달력';

INSERT INTO calendar (no, check_date, is_check) VALUES 
(10, '2024-02-28', 'true'),
(12, '2024-02-21', 'true'),
(13, '2024-02-23', 'true'),
(16, '2024-02-20', 'true'),
(17, '2024-02-19', 'true'),
(20, '2024-02-25', 'true'),
(21, '2024-02-26', 'true'),
(22, '2024-02-22', 'true'),
(30, '2024-03-01', 'true'),
(31, '2024-03-02', 'true'),
(34, '2024-03-04', 'true'),
(35, '2024-03-05', 'false'),
(36, '2024-03-03', 'false');

CREATE TABLE customerinfo (
  No SERIAL PRIMARY KEY,
  registrationNum VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  representative VARCHAR(100) NOT NULL,
  date DATE DEFAULT NULL,
  corporateRegistrationNum VARCHAR(100) DEFAULT NULL,
  location VARCHAR(100) DEFAULT NULL,
  locationOfHeadOffice VARCHAR(100) DEFAULT NULL,
  typeOfBusiness VARCHAR(100) DEFAULT NULL,
  item VARCHAR(100) DEFAULT NULL,
  email VARCHAR(100) DEFAULT NULL,
  callNum VARCHAR(100) DEFAULT NULL,
  personInCharge VARCHAR(100) DEFAULT NULL,
  memo VARCHAR(100) DEFAULT NULL
);

COMMENT ON TABLE customerinfo IS '고객 정보';
COMMENT ON COLUMN customerinfo.no IS '일련번호';
COMMENT ON COLUMN customerinfo.registrationNum IS '사업자등록번호';
COMMENT ON COLUMN customerinfo.name IS '법인명(단체명)';
COMMENT ON COLUMN customerinfo.representative IS '대표자';
COMMENT ON COLUMN customerinfo.date IS '개업연월일';
COMMENT ON COLUMN customerinfo.corporateRegistrationNum IS '법인등록번호';
COMMENT ON COLUMN customerinfo.location IS '사업장소재지';
COMMENT ON COLUMN customerinfo.locationOfHeadOffice IS '본점소재지';
COMMENT ON COLUMN customerinfo.typeOfBusiness IS '업태';
COMMENT ON COLUMN customerinfo.item IS '종목';
COMMENT ON COLUMN customerinfo.email IS '전자우편';
COMMENT ON COLUMN customerinfo.callNum IS '연락처';
COMMENT ON COLUMN customerinfo.personInCharge IS '담당자';
COMMENT ON COLUMN customerinfo.memo IS '메모';

INSERT INTO customerinfo (no, registrationNum, name, representative, date, corporateRegistrationNum, location, locationOfHeadOffice, typeOfBusiness, item, email, callNum, personInCharge, memo) VALUES 
(20, '100-10-10000', '테스트 회사', '홍대표', '2001-01-01', '10000-100000', '서울광역시 중구 세종대로', '경남 창원시 성산구 중앙대로', '제조업', '물품제조', 'a@a.net', '010-1111-2222', '김담당', '매달 15일 물품결제일'),
(21, '200-20-20000', '샘플회사', '김사장2', '2010-11-01', '20000-200000', '제주광역시 제주시 광양9길', '제주광역시 제주시 광양9길', '서비스업', '관광', 'bbb@gmail.com', '010-2222-3333', '최대리', '1'),
(22, '300-30-30000', '무역회사', '박회장', '1999-05-01', '30000-300000', '대구광역시 중구 공평로', '대구광역시 중구 공평로', '도매업', '판매', 'c1@c.net', '010-3333-4444', '박사원', ''),
(23, '123-12-12345', '삼성전자', '이재용', '2024-01-31', '012345-678900', '서울시 강남구 삼성동', '서울시 강남구 삼성동', '제조업', '삼성전자', 'sam@g.com', '010-1111-1111', '김대리', '');

CREATE TABLE ledger (
  id INTEGER DEFAULT NULL,
  date DATE DEFAULT CURRENT_DATE,
  money INTEGER DEFAULT NULL
);

INSERT INTO ledger (id, date, money) VALUES 
(1, '2024-01-01 00:00:00', 12827),
(2, '2024-01-15 00:00:00', 2345532),
(3, '2024-02-26 00:00:00', 221312),
(4, '2024-03-01 00:00:00', 345443),
(5, '2024-03-11 00:00:00', 12464),
(6, '2024-03-13 00:00:00', 866464),
(7, '2024-02-22 00:00:00', 845463),
(8, '2024-02-01 00:00:00', 64632),
(9, '2024-03-15 00:00:00', 2343254),
(10, '2024-01-11 00:00:00', 456532),
(11, '2024-01-22 00:00:00', 53623),
(12, '2024-02-12 00:00:00', 124543),
(13, '2024-03-19 00:00:00', 743432),
(14, '2024-03-18 00:00:00', 43455),
(15, '2024-02-08 00:00:00', 34322);

CREATE TABLE members (
  No SERIAL PRIMARY KEY,
  userID VARCHAR(100) DEFAULT NULL,
  password VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  birth DATE DEFAULT NULL,
  zipcode VARCHAR(100) DEFAULT NULL,
  address VARCHAR(100) DEFAULT NULL,
  number VARCHAR(100) DEFAULT NULL,
  email VARCHAR(100) DEFAULT NULL
);

INSERT INTO members (No, userID, password, name, birth, zipcode, address, number, email) VALUES 
(1, 'abc', '1234', '홍길동', '1990-01-01', '12345', '경상남도 창원시 의창구', '010-1111-2222', 'hong@a.net'),
(2, 'zxy', '1234', '유관순', '1980-01-01', '12345', '유관순', '010-3333-4444', 'yu@a.net'),
(3, 'a1', '$2b$10$.unmMFImzoe1g/zLMhQO1uL5TF3FyPFy5N7dfCPNj8lwBWo.CDuLu', '박사원', '2023-08-01', '51573', '경남 창원시 성산구 완암로 50 1층', '010-1111-2222', 'abc@naver.com'),
(5, 'bbb', '$2b$10$jdUYKZie3ZjVF24XDhbpeO5lh8FpW1HSZekTvIVZSLIP5lFnr9FNO', '이순신', '2023-06-28', '51629', '경남 창원시 진해구 진해대로 1101 진해구청', '011-1110-2220', 'jinhae@daum.net'),
(6, 'ccc', '$2b$10$aO.hfh0hwn9xvIqbPhtkFOOvlBkWPxRBCqjolDUxdjvKLJ72Olb.y', '유관순', '2023-10-06', '51435', '경남 창원시 성산구 중앙대로 151 창원시청', '010-1111-2222', 'abc@gmail.com');

