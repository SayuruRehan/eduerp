CREATE TABLE IF NOT EXISTS certificates (
  certificateId VARCHAR(10) PRIMARY KEY,
  studentId VARCHAR(10) NOT NULL,
  studentName VARCHAR(100) NOT NULL,
  courseId VARCHAR(10) NOT NULL,
  courseName VARCHAR(100) NOT NULL,
  batchCode VARCHAR(10) NOT NULL,
  issueDate DATE NOT NULL,
  certificateNumber VARCHAR(50) NOT NULL,
  status ENUM('Issued', 'Pending', 'Rejected') NOT NULL DEFAULT 'Pending',
  remarks TEXT,
  FOREIGN KEY (studentId) REFERENCES students(studentId),
  FOREIGN KEY (courseId) REFERENCES courses(courseId),
  FOREIGN KEY (batchCode) REFERENCES batches(batchCode)
); 