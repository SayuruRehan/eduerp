CREATE TABLE IF NOT EXISTS courses (
  courseId VARCHAR(10) PRIMARY KEY,
  courseName VARCHAR(100) NOT NULL,
  category ENUM('TVEC Registered', 'Non-TVEC Registered', 'NVQ Courses', 'Exams') NOT NULL,
  courseFee DECIMAL(10,2) NOT NULL,
  duration VARCHAR(50) NOT NULL
); 