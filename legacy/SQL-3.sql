-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: school
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answer` (
  `id_answer` int NOT NULL AUTO_INCREMENT,
  `statement_anwser` varchar(200) NOT NULL,
  `is_correct` tinyint(1) NOT NULL,
  `id_question` int NOT NULL,
  PRIMARY KEY (`id_answer`),
  KEY `id_question` (`id_question`),
  CONSTRAINT `answer_ibfk_1` FOREIGN KEY (`id_question`) REFERENCES `question` (`id_question`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer`
--

LOCK TABLES `answer` WRITE;
/*!40000 ALTER TABLE `answer` DISABLE KEYS */;
/*!40000 ALTER TABLE `answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `badges`
--

DROP TABLE IF EXISTS `badges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `badges` (
  `id_badges` int NOT NULL AUTO_INCREMENT,
  `name_badges` varchar(20) NOT NULL,
  `descripition_badges` varchar(100) NOT NULL,
  PRIMARY KEY (`id_badges`),
  UNIQUE KEY `name_reward` (`name_badges`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `badges`
--

LOCK TABLES `badges` WRITE;
/*!40000 ALTER TABLE `badges` DISABLE KEYS */;
/*!40000 ALTER TABLE `badges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classroom`
--

DROP TABLE IF EXISTS `classroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classroom` (
  `id_classroom` int NOT NULL AUTO_INCREMENT,
  `name_classroom` varchar(100) NOT NULL,
  `schedule_classroom` enum('Matutino','Vespertino','Noturno','Integral') DEFAULT NULL,
  `code_classroom` int DEFAULT NULL,
  PRIMARY KEY (`id_classroom`),
  UNIQUE KEY `token_classroom` (`code_classroom`),
  UNIQUE KEY `code_classroom` (`code_classroom`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classroom`
--

LOCK TABLES `classroom` WRITE;
/*!40000 ALTER TABLE `classroom` DISABLE KEYS */;
/*!40000 ALTER TABLE `classroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `id_course` int NOT NULL AUTO_INCREMENT,
  `course_name` varchar(20) NOT NULL,
  `college_name` varchar(120) NOT NULL,
  `attainment_name` enum('Tecnólogo','Licenciatura','Bacharelado','Especialização','Mestrado','Doutorado') DEFAULT NULL,
  PRIMARY KEY (`id_course`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `educational_background`
--

DROP TABLE IF EXISTS `educational_background`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `educational_background` (
  `id_course` int NOT NULL,
  `date_graduation` date NOT NULL,
  `id_user` int NOT NULL,
  PRIMARY KEY (`id_course`),
  KEY `fk_teacher_course` (`id_user`),
  CONSTRAINT `educational_background_ibfk_1` FOREIGN KEY (`id_course`) REFERENCES `course` (`id_course`),
  CONSTRAINT `fk_teacher_course` FOREIGN KEY (`id_user`) REFERENCES `teacher` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `educational_background`
--

LOCK TABLES `educational_background` WRITE;
/*!40000 ALTER TABLE `educational_background` DISABLE KEYS */;
/*!40000 ALTER TABLE `educational_background` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game`
--

DROP TABLE IF EXISTS `game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game` (
  `id_game` int NOT NULL AUTO_INCREMENT,
  `name_game` varchar(30) NOT NULL,
  PRIMARY KEY (`id_game`),
  UNIQUE KEY `name_game` (`name_game`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game`
--

LOCK TABLES `game` WRITE;
/*!40000 ALTER TABLE `game` DISABLE KEYS */;
/*!40000 ALTER TABLE `game` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gender`
--

DROP TABLE IF EXISTS `gender`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gender` (
  `id_gender` int NOT NULL AUTO_INCREMENT,
  `name_gender` varchar(30) NOT NULL,
  `pronouns_gender` varchar(10) NOT NULL,
  PRIMARY KEY (`id_gender`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gender`
--

LOCK TABLES `gender` WRITE;
/*!40000 ALTER TABLE `gender` DISABLE KEYS */;
/*!40000 ALTER TABLE `gender` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grade`
--

DROP TABLE IF EXISTS `grade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grade` (
  `id_user` int NOT NULL,
  `id_quiz` int NOT NULL,
  `score` int DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_user`,`id_quiz`),
  KEY `id_quiz` (`id_quiz`),
  CONSTRAINT `grade_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `student` (`id_user`),
  CONSTRAINT `grade_ibfk_2` FOREIGN KEY (`id_quiz`) REFERENCES `quiz` (`id_quiz`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grade`
--

LOCK TABLES `grade` WRITE;
/*!40000 ALTER TABLE `grade` DISABLE KEYS */;
/*!40000 ALTER TABLE `grade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_badges`
--

DROP TABLE IF EXISTS `inventory_badges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_badges` (
  `id_reward` int NOT NULL,
  `date_reward` date NOT NULL,
  `id_user` int NOT NULL,
  PRIMARY KEY (`id_reward`),
  KEY `fk_student_inventory` (`id_user`),
  CONSTRAINT `fk_student_inventory` FOREIGN KEY (`id_user`) REFERENCES `student` (`id_user`),
  CONSTRAINT `inventory_badges_ibfk_1` FOREIGN KEY (`id_reward`) REFERENCES `badges` (`id_badges`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_badges`
--

LOCK TABLES `inventory_badges` WRITE;
/*!40000 ALTER TABLE `inventory_badges` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_badges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pending_task`
--

DROP TABLE IF EXISTS `pending_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pending_task` (
  `id_task` int NOT NULL,
  `dealivery_day_task` datetime NOT NULL,
  `status_task` enum('Em andamento','Finalizada','Entregue') NOT NULL,
  `id_user` int NOT NULL,
  PRIMARY KEY (`id_task`),
  KEY `fk_student_task` (`id_user`),
  CONSTRAINT `fk_student_task` FOREIGN KEY (`id_user`) REFERENCES `student` (`id_user`),
  CONSTRAINT `pending_task_ibfk_1` FOREIGN KEY (`id_task`) REFERENCES `task` (`id_task`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pending_task`
--

LOCK TABLES `pending_task` WRITE;
/*!40000 ALTER TABLE `pending_task` DISABLE KEYS */;
/*!40000 ALTER TABLE `pending_task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `id_question` int NOT NULL AUTO_INCREMENT,
  `statement_question` varchar(200) NOT NULL,
  `id_quiz` int NOT NULL,
  PRIMARY KEY (`id_question`),
  KEY `id_quiz` (`id_quiz`),
  CONSTRAINT `question_ibfk_1` FOREIGN KEY (`id_quiz`) REFERENCES `quiz` (`id_quiz`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz`
--

DROP TABLE IF EXISTS `quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz` (
  `id_quiz` int NOT NULL AUTO_INCREMENT,
  `name_quiz` varchar(100) NOT NULL,
  `subject_quiz` varchar(25) DEFAULT NULL,
  `difficult_quiz` enum('Fácil','Médio','Difícil') NOT NULL,
  `id_classroom` int DEFAULT NULL,
  PRIMARY KEY (`id_quiz`),
  KEY `id_classroom` (`id_classroom`),
  CONSTRAINT `quiz_ibfk_1` FOREIGN KEY (`id_classroom`) REFERENCES `classroom` (`id_classroom`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz`
--

LOCK TABLES `quiz` WRITE;
/*!40000 ALTER TABLE `quiz` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule_classroom`
--

DROP TABLE IF EXISTS `schedule_classroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule_classroom` (
  `id_classroom` int NOT NULL,
  `subject_schedule_classroom` varchar(15) DEFAULT NULL,
  `id_user` int NOT NULL,
  PRIMARY KEY (`id_classroom`),
  KEY `fk_professor_turma` (`id_user`),
  CONSTRAINT `fk_professor_turma` FOREIGN KEY (`id_user`) REFERENCES `teacher` (`id_user`),
  CONSTRAINT `schedule_classroom_ibfk_2` FOREIGN KEY (`id_classroom`) REFERENCES `classroom` (`id_classroom`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule_classroom`
--

LOCK TABLES `schedule_classroom` WRITE;
/*!40000 ALTER TABLE `schedule_classroom` DISABLE KEYS */;
/*!40000 ALTER TABLE `schedule_classroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `score`
--

DROP TABLE IF EXISTS `score`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `score` (
  `id_score` int NOT NULL AUTO_INCREMENT,
  `id_game` int NOT NULL,
  `amount_score` int DEFAULT NULL,
  `time_score` time DEFAULT NULL,
  `id_user` int NOT NULL,
  PRIMARY KEY (`id_score`),
  KEY `id_game` (`id_game`),
  KEY `fk_student_game` (`id_user`),
  CONSTRAINT `fk_student_game` FOREIGN KEY (`id_user`) REFERENCES `student` (`id_user`),
  CONSTRAINT `score_ibfk_1` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `score`
--

LOCK TABLES `score` WRITE;
/*!40000 ALTER TABLE `score` DISABLE KEYS */;
/*!40000 ALTER TABLE `score` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `id_user` int NOT NULL,
  `code_classroom` int NOT NULL,
  PRIMARY KEY (`id_user`),
  KEY `fk_student_classroom_code` (`code_classroom`),
  CONSTRAINT `fk_student_classroom_code` FOREIGN KEY (`code_classroom`) REFERENCES `classroom` (`code_classroom`),
  CONSTRAINT `fk_student_user` FOREIGN KEY (`id_user`) REFERENCES `user_plataform` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task` (
  `id_task` int NOT NULL AUTO_INCREMENT,
  `id_classroom` int NOT NULL,
  `title_task` int NOT NULL,
  `description_task` int NOT NULL,
  `deadline_task` datetime DEFAULT NULL,
  `id_user` int NOT NULL,
  PRIMARY KEY (`id_task`,`id_classroom`),
  KEY `id_classroom` (`id_classroom`),
  KEY `fk_task_teacher` (`id_user`),
  CONSTRAINT `fk_task_teacher` FOREIGN KEY (`id_user`) REFERENCES `teacher` (`id_user`),
  CONSTRAINT `task_ibfk_2` FOREIGN KEY (`id_classroom`) REFERENCES `classroom` (`id_classroom`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher` (
  `id_user` int NOT NULL,
  PRIMARY KEY (`id_user`),
  CONSTRAINT `fk_teacher_user` FOREIGN KEY (`id_user`) REFERENCES `user_plataform` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_plataform`
--

DROP TABLE IF EXISTS `user_plataform`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_plataform` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `name_user` varchar(120) NOT NULL,
  `birth_user` date NOT NULL,
  `registration_user` varchar(20) DEFAULT NULL,
  `main_email` varchar(120) NOT NULL,
  `personal_email` varchar(120) DEFAULT NULL,
  `password_user` varchar(20) NOT NULL,
  `id_gender` int DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `main_email` (`main_email`),
  UNIQUE KEY `personal_email` (`personal_email`),
  KEY `id_gender` (`id_gender`),
  CONSTRAINT `user_plataform_ibfk_1` FOREIGN KEY (`id_gender`) REFERENCES `gender` (`id_gender`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_plataform`
--

LOCK TABLES `user_plataform` WRITE;
/*!40000 ALTER TABLE `user_plataform` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_plataform` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-31 17:29:57
