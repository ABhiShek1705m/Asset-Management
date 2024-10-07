CREATE DATABASE  IF NOT EXISTS `asset_management` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `asset_management`;
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
  `asset_category` varchar(60) DEFAULT NULL,
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
  CONSTRAINT `stock_loc_id` FOREIGN KEY (`stock_loc_id`) REFERENCES `location` (`location_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `asset_status` FOREIGN KEY(`asset_status`) REFERENCES `asset_status`(`status`)  ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `asset_category` FOREIGN KEY(`asset_category`) REFERENCES `asset_category`(`category`)  ON DELETE SET NULL ON UPDATE CASCADE
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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-10 17:37:23
