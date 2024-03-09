-- MySQL dump 10.13  Distrib 5.7.39, for Win64 (x86_64)
--
-- Host: localhost    Database: nodejs_crud
-- ------------------------------------------------------
-- Server version	5.7.39-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `board`
--

DROP TABLE IF EXISTS `board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `board` (
  `board_no` int(50) NOT NULL AUTO_INCREMENT COMMENT '번호',
  `board_title` varchar(100) DEFAULT NULL COMMENT '제목',
  `board_user` varchar(100) DEFAULT NULL COMMENT '사용자',
  `board_date` date DEFAULT NULL COMMENT '작성일',
  `board_contents` varchar(5000) DEFAULT NULL COMMENT '내용',
  PRIMARY KEY (`board_no`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `board`
--

LOCK TABLES `board` WRITE;
/*!40000 ALTER TABLE `board` DISABLE KEYS */;
INSERT INTO `board` VALUES (1,'첫번째 공지사항입니다.','관리자','2024-01-01','홈페이지를 개설하였습니다.'),(2,'테스트 페이지입니다.','홍길동','2024-02-01','동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려 강산 대한사람 대한으로 길이 보전하세 남산 위에 저 소나무 철갑을 두른듯 바람서리 불변함은 우리 기상일세 무궁화 삼천리 화려 강산 대한사람 대한으로 길이 보전하세 가을 하늘 공활한데 높고 구름 없이 밝은 달은 우리 가슴 일편단심일세 무궁화 삼천리 화려 강산 대한사람 대한으로 길이 보전하세 이 기상과 이 마음으로 충성을 다하여 괴로우나 즐거우나 나라사랑하세 무궁화 삼천리 화려 강산 대한사람 대한으로 길이 보전하세'),(3,'카카오톡 알림톡 실시','관리자','2024-03-01','아래 링크를 클릭하시면 카카오톡에서 알림톡을 받아보실 수 있습니다.'),(4,'홈페이지에서 수정 테스트','aaa','2024-02-28','수정합니다2'),(5,'글쓰기 테스트2','bbb','2024-02-28','냉무2'),(6,'글쓰기2','aaa','2024-02-28','냉무22');
/*!40000 ALTER TABLE `board` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendar`
--

DROP TABLE IF EXISTS `calendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `calendar` (
  `No` int(11) NOT NULL AUTO_INCREMENT,
  `check_date` date DEFAULT NULL,
  `is_check` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`No`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8 COMMENT='달력';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendar`
--

LOCK TABLES `calendar` WRITE;
/*!40000 ALTER TABLE `calendar` DISABLE KEYS */;
INSERT INTO `calendar` VALUES (10,'2024-02-28','true'),(12,'2024-02-21','true'),(13,'2024-02-23','true'),(16,'2024-02-20','true'),(17,'2024-02-19','true'),(20,'2024-02-25','true'),(21,'2024-02-26','true'),(22,'2024-02-22','true'),(30,'2024-03-01','true'),(31,'2024-03-02','true'),(34,'2024-03-04','true'),(35,'2024-03-05','false'),(36,'2024-03-03','false');
/*!40000 ALTER TABLE `calendar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customerinfo`
--

DROP TABLE IF EXISTS `customerinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customerinfo` (
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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customerinfo`
--

LOCK TABLES `customerinfo` WRITE;
/*!40000 ALTER TABLE `customerinfo` DISABLE KEYS */;
INSERT INTO `customerinfo` VALUES (20,'100-10-10000','테스트 회사','홍대표','2001-01-01','10000-100000','서울광역시 중구 세종대로','경남 창원시 성산구 중앙대로','제조업','물품제조','a@a.net','010-1111-2222','김담당','매달 15일 물품결제일'),(21,'200-20-20000','샘플회사','김사장2','2010-11-01','20000-200000','제주광역시 제주시 광양9길','제주광역시 제주시 광양9길','서비스업','관광','bbb@gmail.com','010-2222-3333','최대리','1'),(22,'300-30-30000','무역회사','박회장','1999-05-01','30000-300000','대구광역시 중구 공평로','대구광역시 중구 공평로','도매업','판매','c1@c.net','010-3333-4444','박사원',''),(23,'123-12-12345','삼성전자','이재용','2024-01-31','012345-678900','서울시 강남구 삼성동','서울시 강남구 삼성동','제조업','삼성전자','sam@g.com','010-1111-1111','김대리','');
/*!40000 ALTER TABLE `customerinfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ledger`
--

DROP TABLE IF EXISTS `ledger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ledger` (
  `id` int(11) DEFAULT NULL,
  `date` varchar(50) DEFAULT NULL,
  `money` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ledger`
--

LOCK TABLES `ledger` WRITE;
/*!40000 ALTER TABLE `ledger` DISABLE KEYS */;
INSERT INTO `ledger` VALUES (1,'2023-06-01 00:00:00',12827),(2,'2023-06-15 00:00:00',2345532),(3,'2023-06-26 00:00:00',221312),(4,'2023-07-01 00:00:00',345443),(5,'2023-07-11 00:00:00',12464),(6,'2023-07-13 00:00:00',866464),(7,'2023-07-22 00:00:00',845463),(8,'2023-05-01 00:00:00',64632),(9,'2023-05-15 00:00:00',2343254),(10,'2023-06-11 00:00:00',456532),(11,'2023-07-22 00:00:00',53623),(12,'2023-05-12 00:00:00',124543),(13,'2023-05-19 00:00:00',743432),(14,'2023-06-18 00:00:00',43455),(15,'2023-05-08 00:00:00',34322);
/*!40000 ALTER TABLE `ledger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES (1,'abc','1234','홍길동','1990-01-01','12345','경상남도 창원시 의창구','010-1111-2222','hong@a.net'),(2,'zxy','1234','유관순','1980-01-01','12345','유관순','010-3333-4444','yu@a.net'),(3,'a1','$2b$10$.unmMFImzoe1g/zLMhQO1uL5TF3FyPFy5N7dfCPNj8lwBWo.CDuLu','박사원','2023-08-01','51573','경남 창원시 성산구 완암로 50 1층','010-1111-2222','abc@naver.com'),(4,'aaa','$2b$10$G4FCDqt6UNqDdiOKOeTWn.MU1r5o.BX5zHRNZDM4mVQS5ufC9u3tW','홍길동','2023-08-01','51570','경남 창원시 성산구 완암로 50 1층','010-1111-2222','aaa@gmail.com'),(5,'bbb','$2b$10$jdUYKZie3ZjVF24XDhbpeO5lh8FpW1HSZekTvIVZSLIP5lFnr9FNO','이순신','2023-06-28','51629','경남 창원시 진해구 진해대로 1101 진해구청','011-1110-2220','jinhae@daum.net'),(6,'ccc','$2b$10$aO.hfh0hwn9xvIqbPhtkFOOvlBkWPxRBCqjolDUxdjvKLJ72Olb.y','유관순','2023-10-06','51435','경남 창원시 성산구 중앙대로 151 창원시청','010-1111-2222','abc@gmail.com');
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'nodejs_crud'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-09 11:34:27
