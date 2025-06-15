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

export enum Branch {
  MORATUWA = 'Moratuwa',
  BAMBALAPITIYA = 'Bambalapitiya',
  GALLE = 'Galle',
  ONLINE = 'Online'
}

export enum CertificateStatus {
  ISSUED = 'Issued',
  PENDING = 'Pending',
  REJECTED = 'Rejected'
}

export interface Course {
  courseId: string;
  courseName: string;
  category: string;
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
  branch: Branch;
  courseName: string;
  lecturer: string;
  coordinator: string;
  noOfStudents: number;
  plannedDate: Date;
  startDate?: Date;
  lockedDate?: Date;
  status: BatchStatus;
}

export interface Registration {
  registrationId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  batchCode: string;
  branch: Branch;
  paymentType: string;
  paymentMethod: string;
  status: RegistrationStatus;
  studentCounselor: string;
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

export interface Sale {
  saleId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  saleDate: Date;
  notes?: string;
}

export interface Certificate {
  certificateId: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  batchCode: string;
  issueDate: Date;
  certificateNumber: string;
  status: CertificateStatus;
  remarks?: string;
} 