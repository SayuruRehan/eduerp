CREATE DATABASE IF NOT EXISTS eduerp;
USE eduerp;

CREATE TABLE IF NOT EXISTS employees (
    employeeId VARCHAR(10) PRIMARY KEY,
    empName VARCHAR(100) NOT NULL,
    role ENUM('Admin', 'Course Coordinator', 'Visiting Lecturer', 'In-House Lecturer', 'Student Counselor') NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    contactNumber VARCHAR(20) NOT NULL,
    dateJoined TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 