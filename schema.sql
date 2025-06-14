CREATE DATABASE IF NOT EXISTS eduerp;
USE eduerp;

CREATE TABLE IF NOT EXISTS employees (
  employeeId VARCHAR(10) PRIMARY KEY,
  empName VARCHAR(100) NOT NULL,
  role ENUM('Admin', 'Course Coordinator', 'Visiting Lecturer', 'In-House Lecturer', 'Student Counselor') NOT NULL,
  dateJoined DATETIME NOT NULL DEFAULT NOW(),
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  contactNumber VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS courses (
  courseId VARCHAR(10) PRIMARY KEY,
  courseName VARCHAR(100) NOT NULL,
  category ENUM('TVEC Registered', 'Non-TVEC Registered', 'NVQ Courses', 'Exams') NOT NULL,
  courseFee DECIMAL(10, 2) NOT NULL,
  duration VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS students (
  studentId VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  nic VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  address TEXT NOT NULL,
  whatsappNumber VARCHAR(20) NOT NULL,
  paymentDue DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS batches (
  batchCode VARCHAR(10) PRIMARY KEY,
  branch VARCHAR(50) NOT NULL,
  courseName VARCHAR(100) NOT NULL,
  lecturer VARCHAR(100) NOT NULL,
  coordinator VARCHAR(100) NOT NULL,
  noOfStudents INT NOT NULL DEFAULT 0,
  plannedDate DATE NOT NULL,
  startDate DATE,
  lockedDate DATE,
  status ENUM('Planned', 'Started', 'Locked', 'Completed') NOT NULL DEFAULT 'Planned'
);

CREATE TABLE IF NOT EXISTS registrations (
  registrationId VARCHAR(10) PRIMARY KEY,
  studentId VARCHAR(10) NOT NULL,
  courseId VARCHAR(10) NOT NULL,
  courseName VARCHAR(100) NOT NULL,
  batchCode VARCHAR(10) NOT NULL,
  branch VARCHAR(50) NOT NULL,
  paymentType VARCHAR(20) NOT NULL,
  paymentMethod VARCHAR(20) NOT NULL,
  status ENUM('Paid', 'Waiting', 'Joined') NOT NULL DEFAULT 'Waiting',
  FOREIGN KEY (studentId) REFERENCES students(studentId),
  FOREIGN KEY (courseId) REFERENCES courses(courseId),
  FOREIGN KEY (batchCode) REFERENCES batches(batchCode)
);

CREATE TABLE IF NOT EXISTS payments (
  paymentId VARCHAR(10) PRIMARY KEY,
  studentId VARCHAR(10) NOT NULL,
  studentName VARCHAR(100) NOT NULL,
  batchCode VARCHAR(10) NOT NULL,
  courseName VARCHAR(100) NOT NULL,
  paymentDate DATE NOT NULL,
  paymentAmount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  FOREIGN KEY (studentId) REFERENCES students(studentId),
  FOREIGN KEY (batchCode) REFERENCES batches(batchCode)
); 