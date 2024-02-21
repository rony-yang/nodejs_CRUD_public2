CREATE DATABASE `nodejs_CRUD` /*!40100 DEFAULT CHARACTER SET utf8 */;

-- nodejs_CRUD.customerInfo definition
CREATE TABLE `customerInfo` (
  `No` int(11) NOT NULL AUTO_INCREMENT COMMENT '일련번호',
  `registrationNum` varchar(100) NOT NULL COMMENT '사업자등록번호',
  `name` varchar(100) NOT NULL COMMENT '법인명(단체명)',
  `representative` varchar(100) NOT NULL COMMENT '대표자',
  `date` date DEFAULT NULL COMMENT '개업연월일',
  `corporateRegistrationNum` varchar(100) DEFAULT NULL COMMENT '법인등록번호',
  `location` varchar(100) DEFAULT NULL COMMENT '사업장소재지',
  `locationOfHeadOffice` varchar(100) DEFAULT NULL COMMENT '본점소재지',
  `typeOfBusiness` varchar(100) DEFAULT NULL COMMENT '업태',
  `item` varchar(100) DEFAULT NULL COMMENT '종목',
  `email` varchar(100) DEFAULT NULL COMMENT '전자우편',
  `callNum` varchar(100) DEFAULT NULL COMMENT '연락처',
  `personInCharge` varchar(100) DEFAULT NULL COMMENT '담당자',
  `memo` varchar(100) DEFAULT NULL COMMENT '메모',
  PRIMARY KEY (`No`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO customerInfo (registrationNum, name, representative, date, corporateRegistrationNum, location, locationOfHeadOffice, typeOfBusiness, item, email, callNum, personInCharge, memo) VALUES
('100-10-10000', '테스트 회사', '홍대표', '2001-01-01', '10000-100000', '서울광역시 중구 세종대로', '경남 창원시 성산구 중앙대로', '제조업', '물품제조', 'a@a.net', '010-1111-2222', '김담당', '매달 15일 물품결제일'),
('200-20-20000', '샘플회사', '김사장', '2010-11-01', '20000-200000', '제주광역시 제주시 광양9길', '제주광역시 제주시 광양9길', '서비스업', '관광', 'bbb@gmail.com', '010-2222-3333', '최대리', '1'),
('300-30-30000', '무역회사', '박회장', '1999-05-01', '30000-300000', '대구광역시 중구 공평로', '대구광역시 중구 공평로', '도매업', '판매', 'c1@c.net', '010-3333-4444', '박사원', '');


-- nodejs_CRUD.ledger definition
CREATE TABLE `ledger` (
  `id` int(11) DEFAULT NULL,
  `date` varchar(50) DEFAULT NULL,
  `money` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO ledger (id, date, money) VALUES
('1', '2023-06-01 00:00:00', 12827),
('2', '2023-06-15 00:00:00', 2345532),
('3', '2023-06-26 00:00:00', 221312),
('4', '2023-07-01 00:00:00', 345443),
('5', '2023-07-11 00:00:00', 12464),
('6', '2023-07-13 00:00:00', 866464),
('7', '2023-07-22 00:00:00', 845463),
('8', '2023-05-01 00:00:00', 64632),
('9', '2023-05-15 00:00:00', 2343254),
('10', '2023-06-11 00:00:00', 456532),
('11', '2023-07-22 00:00:00', 53623),
('12', '2023-05-12 00:00:00', 124543),
('13', '2023-05-19 00:00:00', 743432),
('14', '2023-06-18 00:00:00', 43455),
('15', '2023-05-08 00:00:00', 34322);


-- nodejs_CRUD.members definition
CREATE TABLE `members` (
  `No` int(11) NOT NULL AUTO_INCREMENT,
  `userID` varchar(100) DEFAULT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `birth` date DEFAULT NULL,
  `zipcode` varchar(100) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `number` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`No`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO members (No, userID, password, name, birth, zipcode, address, number, email) VALUES
('1', 'abc', '1234', '홍길동', '1990-01-01', '12345', '경상남도 창원시 의창구', '010-1111-2222', 'hong@a.net'),
('2', 'zxy', '1234', '유관순', '1980-01-01', '12345', '유관순', '010-3333-4444', 'yu@a.net'),
(3, 'a1', '$2b$10$.unmMFImzoe1g/zLMhQO1uL5TF3FyPFy5N7dfCPNj8lwBWo.CDuLu', '박사원', '2023-08-01', '51573', '경남 창원시 성산구 완암로 50 1층', '010-1111-2222', 'abc@naver.com'),
(4, 'aaa', '$2b$10$G4FCDqt6UNqDdiOKOeTWn.MU1r5o.BX5zHRNZDM4mVQS5ufC9u3tW', '홍길동', '2023-08-01', '51570', '경남 창원시 성산구 완암로 50 1층', '010-1111-2222', 'aaa@gmail.com');


-- nodejs_CRUD.board definition
CREATE TABLE `board` (
  `board_no` int(50) NOT NULL AUTO_INCREMENT COMMENT '번호',
  `board_title` varchar(100) DEFAULT NULL COMMENT '제목',
  `board_user` varchar(100) DEFAULT NULL COMMENT '사용자',
  `board_date` date DEFAULT NULL COMMENT '작성일',
  PRIMARY KEY (`board_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO board (board_no, board_title, board_user, board_date) VALUES
('1', '첫번째 공지사항입니다.', '관리자', '2024-01-01 00:00:00'),
('2', '테스트 페이지입니다.', '홍길동', '2024-02-01 00:00:00'),
('3', '카카오톡 알림톡 실시', '관리자', '2024-03-01 00:00:00');