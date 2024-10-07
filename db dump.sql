-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: asset_management
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `approval_history`
--

DROP TABLE IF EXISTS `approval_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approval_history` (
  `transaction_id` int NOT NULL,
  `request_type_id` int DEFAULT NULL,
  `request_status` varchar(45) DEFAULT NULL,
  `approver_id` int NOT NULL,
  `isApproved` tinyint DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  KEY `app_transaction_id_idx` (`transaction_id`),
  KEY `app_approver_id_idx` (`approver_id`),
  KEY `app_req_type_id_idx` (`request_type_id`),
  CONSTRAINT `app_approver_id` FOREIGN KEY (`approver_id`) REFERENCES `approvers_master` (`approver_id`),
  CONSTRAINT `app_req_type_id` FOREIGN KEY (`request_type_id`) REFERENCES `request_type` (`request_type_id`),
  CONSTRAINT `app_transaction_id` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_history`
--

LOCK TABLES `approval_history` WRITE;
/*!40000 ALTER TABLE `approval_history` DISABLE KEYS */;
INSERT INTO `approval_history` VALUES (12,2,NULL,1,NULL,'2024-05-10 14:50:30');
/*!40000 ALTER TABLE `approval_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `approvers_master`
--

DROP TABLE IF EXISTS `approvers_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approvers_master` (
  `approver_id` int NOT NULL,
  `request_type` int NOT NULL,
  PRIMARY KEY (`approver_id`,`request_type`),
  KEY `request_type_id_idx` (`request_type`),
  CONSTRAINT `approver_id` FOREIGN KEY (`approver_id`) REFERENCES `employee_master` (`employee_id`),
  CONSTRAINT `request_type_id` FOREIGN KEY (`request_type`) REFERENCES `request_type` (`request_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approvers_master`
--

LOCK TABLES `approvers_master` WRITE;
/*!40000 ALTER TABLE `approvers_master` DISABLE KEYS */;
INSERT INTO `approvers_master` VALUES (1,2);
/*!40000 ALTER TABLE `approvers_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_category`
--

DROP TABLE IF EXISTS `asset_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_category` (
  `category` varchar(30) NOT NULL,
  PRIMARY KEY (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_category`
--

LOCK TABLES `asset_category` WRITE;
/*!40000 ALTER TABLE `asset_category` DISABLE KEYS */;
INSERT INTO `asset_category` VALUES ('Desktop'),('Laptop');
/*!40000 ALTER TABLE `asset_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_master`
--

DROP TABLE IF EXISTS `asset_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_master` (
  `asset_id` varchar(255) NOT NULL,
  `asset_name` varchar(45) DEFAULT NULL,
  `asset_serial_no` varchar(255) DEFAULT NULL,
  `asset_model` varchar(60) DEFAULT NULL,
  `asset_model_no` varchar(45) DEFAULT NULL,
  `asset_category` varchar(60) NOT NULL,
  `manufacturer` varchar(45) DEFAULT NULL,
  `supplier` varchar(45) DEFAULT NULL,
  `asset_status` varchar(45) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `purchase_cost` decimal(10,0) DEFAULT NULL,
  `order_no` varchar(255) DEFAULT NULL,
  `EOL_date` date DEFAULT NULL,
  `warranty_months` int DEFAULT NULL,
  `stock_loc_id` int DEFAULT NULL,
  `product_key` varchar(255) DEFAULT NULL,
  `total` int DEFAULT NULL,
  `alloted` int DEFAULT NULL,
  PRIMARY KEY (`asset_id`),
  UNIQUE KEY `asset_serial_no_UNIQUE` (`asset_serial_no`),
  KEY `location_id_idx` (`stock_loc_id`),
  CONSTRAINT `stock_loc_id` FOREIGN KEY (`stock_loc_id`) REFERENCES `location` (`location_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_master`
--

LOCK TABLES `asset_master` WRITE;
/*!40000 ALTER TABLE `asset_master` DISABLE KEYS */;
INSERT INTO `asset_master` VALUES ('3ATYPS','ffs','efe44','dfds','4323fsdf3','Laptop','Dell','fasf','Available','2024-05-10',20000,'9044234534-5345','2027-10-10',16,1,'-',0,NULL),('4APAM','sample_asset','e99493fn','Acer Swift 3','38274','Laptop','Acer','sample supp','Available','2024-05-03',20000,'45453454D43354','2027-12-31',24,1,'fh495rnff',0,NULL);
/*!40000 ALTER TABLE `asset_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_status`
--

DROP TABLE IF EXISTS `asset_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_status` (
  `status` varchar(30) NOT NULL,
  PRIMARY KEY (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_status`
--

LOCK TABLES `asset_status` WRITE;
/*!40000 ALTER TABLE `asset_status` DISABLE KEYS */;
INSERT INTO `asset_status` VALUES ('Allotted'),('Available'),('Disposed'),('Not Ready'),('Pending Disposal'),('Requested');
/*!40000 ALTER TABLE `asset_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `department_id` int NOT NULL AUTO_INCREMENT,
  `department_name` varchar(60) NOT NULL,
  PRIMARY KEY (`department_id`,`department_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (1,'IT'),(2,'Digital'),(3,'Finance'),(4,'Sales'),(6,'Finance');
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_master`
--

DROP TABLE IF EXISTS `employee_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_master` (
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(60) DEFAULT NULL,
  `last_name` varchar(60) DEFAULT NULL,
  `phone_no` varchar(15) DEFAULT NULL,
  `email_id` varchar(100) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `location_id` int DEFAULT NULL,
  `Address` varchar(500) DEFAULT NULL,
  `isApprover` tinyint DEFAULT '0',
  PRIMARY KEY (`employee_id`),
  UNIQUE KEY `email_id_UNIQUE` (`email_id`),
  KEY `department_id_idx` (`department_id`),
  KEY `location_id_idx` (`location_id`),
  CONSTRAINT `department_id` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`),
  CONSTRAINT `location_id` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_master`
--

LOCK TABLES `employee_master` WRITE;
/*!40000 ALTER TABLE `employee_master` DISABLE KEYS */;
INSERT INTO `employee_master` VALUES (1,'gfhhgf','hgfhfgh','4235345455','dfdsf@gmail.com','Intern',2,5,'Sector 49, Sohna',1),(2,'Devashri','Nigudkar','2938281933','devashri@gmail.com','Intern',2,1,'Sector 49, Sohna Road',0);
/*!40000 ALTER TABLE `employee_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `location_id` int NOT NULL AUTO_INCREMENT,
  `country` varchar(100) NOT NULL,
  `state` varchar(60) NOT NULL,
  `city` varchar(60) NOT NULL,
  `area` varchar(50) NOT NULL,
  `pincode` char(6) NOT NULL,
  `building` varchar(60) NOT NULL,
  `floor` int NOT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,'India','Haryana','Gurgaon','DLF Phase-2','122002','DLF Building 7A',5),(5,'India','Telangana','Hyderabad','DLF Phase-3','324531','9A',9);
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `request_type`
--

DROP TABLE IF EXISTS `request_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `request_type` (
  `request_type_id` int NOT NULL AUTO_INCREMENT,
  `request_type_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`request_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `request_type`
--

LOCK TABLES `request_type` WRITE;
/*!40000 ALTER TABLE `request_type` DISABLE KEYS */;
INSERT INTO `request_type` VALUES (1,'Requirement'),(2,'Allocation'),(3,'Deallocation'),(4,'Disposal');
/*!40000 ALTER TABLE `request_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_engg`
--

DROP TABLE IF EXISTS `service_engg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_engg` (
  `engg_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `phone_num` varchar(15) DEFAULT NULL,
  `email_id` varchar(55) NOT NULL,
  `role` varchar(45) NOT NULL,
  PRIMARY KEY (`engg_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_engg`
--

LOCK TABLES `service_engg` WRITE;
/*!40000 ALTER TABLE `service_engg` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_engg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `request_type_id` int NOT NULL,
  `asset_id` varchar(255) DEFAULT NULL,
  `employee_id` int DEFAULT NULL,
  `location_id` int DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `location_id_idx` (`location_id`),
  KEY `txn_emp_id_idx` (`employee_id`),
  KEY `txn_request_type_id_idx` (`request_type_id`),
  KEY `txn_asset_id_idx` (`asset_id`),
  CONSTRAINT `txn_asset_id` FOREIGN KEY (`asset_id`) REFERENCES `asset_master` (`asset_id`),
  CONSTRAINT `txn_emp_id` FOREIGN KEY (`employee_id`) REFERENCES `employee_master` (`employee_id`),
  CONSTRAINT `txn_location_id` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`),
  CONSTRAINT `txn_request_type_id` FOREIGN KEY (`request_type_id`) REFERENCES `request_type` (`request_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (12,2,'4APAM',1,5,'-','dfdsf@gmail.com','2024-05-10 14:50:30');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_email` varchar(100) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `role` varchar(8) DEFAULT 'employee',
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `user_email` (`user_email`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`user_email`) REFERENCES `employee_master` (`email_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'dfdsf@gmail.com','$2b$10$i5cX.u1KEjcmcDxoI5D1deTQorv7.P.wrrzVGDIDAsnq1xWRjjRuy','admin','2024-05-07 17:06:52'),(3,'devashri@gmail.com','$2b$10$dc7YeYsz3SCH7huMRVlVOu60sln9lxuoXLYivkOF0lZK67vN.McLC','admin','2024-05-10 14:15:53');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-10 17:39:24
