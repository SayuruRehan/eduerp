export enum CourseCategory {
  TVEC_REGISTERED = 'TVEC Registered',
  NON_TVEC_REGISTERED = 'Non-TVEC Registered',
  NVQ_COURSES = 'NVQ Courses',
  EXAMS = 'Exams'
}

export enum EmployeeRole {
  ADMIN = 'Admin',
  COURSE_COORDINATOR = 'Course Coordinator',
  VISITING_LECTURER = 'Visiting Lecturer',
  IN_HOUSE_LECTURER = 'In-House Lecturer',
  STUDENT_COUNSELOR = 'Student Counselor'
}

export enum BatchStatus {
  PLANNED = 'Planned',
  STARTED = 'Started',
  LOCKED = 'Locked',
  COMPLETED = 'Completed'
}

export enum RegistrationStatus {
  PAID = 'Paid',
  WAITING = 'Waiting',
  JOINED = 'Joined'
}

export interface Course {
  courseId: string;
  courseName: string;
  category: CourseCategory;
  courseFee: number;
  duration: string;
}

export interface Student {
  studentId: string;
  name: string;
  nic: string;
  email: string;
  address: string;
  whatsappNumber: string;
  paymentDue: number;
  status: string;
}

export interface Employee {
  employeeId: string;
  empName: string;
  role: EmployeeRole;
  dateJoined: Date;
  email: string;
  password: string;
  contactNumber: string;
}

export interface Batch {
  batchCode: string;
  branch: string;
  courseName: string;
  lecturer: string;
  coordinator: string;
  noOfStudents: number;
  plannedDate: Date;
  startDate: Date;
  lockedDate: Date;
  status: BatchStatus;
}

export interface Registration {
  registrationId: string;
  studentId: string;
  courseId: string;
  courseName: string;
  batchCode: string;
  branch: string;
  paymentType: string;
  paymentMethod: string;
  status: RegistrationStatus;
}

export interface Payment {
  paymentId: string;
  studentId: string;
  studentName: string;
  batchCode: string;
  courseName: string;
  paymentDate: Date;
  paymentAmount: number;
  status: string;
} 