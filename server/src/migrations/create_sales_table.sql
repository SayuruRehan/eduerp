CREATE TABLE IF NOT EXISTS sales (
  saleId VARCHAR(10) PRIMARY KEY,
  studentName VARCHAR(100) NOT NULL,
  courseId VARCHAR(10) NOT NULL,
  courseName VARCHAR(100) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  paymentMethod VARCHAR(50) NOT NULL,
  paymentStatus VARCHAR(20) NOT NULL,
  saleDate DATETIME NOT NULL,
  notes TEXT,
  FOREIGN KEY (courseId) REFERENCES courses(courseId) ON DELETE CASCADE
); 