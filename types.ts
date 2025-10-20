
export enum UserRole {
  Seeker = 'seeker',
  Provider = 'provider',
}

export enum JobType {
  FullTime = 'full-time',
  PartTime = 'part-time',
}

export interface User {
  id: string;
  username: string;
  password?: string; // Should not be stored long term, but needed for mock auth
  role: UserRole;
  email: string;
  phone: string;
  profilePicture?: string; // base64 string
  location?: string;
  // Seeker specific
  description?: string;
  skills?: string[];
  favoriteJobs?: string[];
  // Provider specific
  company?: string;
}

export interface Job {
  id: string;
  providerId: string;
  title: string;
  companyName: string;
  location: string;
  description: string;
  skills: string[];
  jobType: JobType;
  postedOn: string;
}

export interface Application {
  id: string;
  jobId: string;
  seekerId: string;
  providerId: string;
  appliedOn: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Notification {
  id: string;
  recipientId: string;
  text: string;
  timestamp: string;
}
