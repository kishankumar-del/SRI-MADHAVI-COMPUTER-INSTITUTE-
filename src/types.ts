export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  image: string;
  syllabus: string;
  learningOutcomes: string;
  prerequisites: string;
}

export interface Application {
  applicationId: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: string;
  mobile: string;
  altMobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  qualification: string;
  collegeName: string;
  percentage: string;
  course: string;
  studentPhoto: string;
  idProof: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface Certificate {
  certificateId: string;
  rollNumber: string;
  studentName: string;
  course: string;
  dob: string;
  completionDate: string;
  certificateFile?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'Unread' | 'Resolved';
  createdAt: string;
}

export interface DashboardStats {
  totalCourses: number;
  totalApplications: number;
  totalCertificates: number;
  totalInquiries: number;
  recentActivities: {
    type: string;
    title: string;
    time: string;
    status: string;
  }[];
}
