import React, { createContext, ReactNode, useCallback } from 'react';
import { Job, Application, Notification } from '../types';
import { initialJobs, initialApplications, initialNotifications } from '../data';
import { useUser } from '../hooks/useUser';
import useLocalStorage from '../hooks/useLocalStorage';

export interface JobContextType {
  jobs: Job[];
  applications: Application[];
  notifications: Notification[];
  postJob: (job: Omit<Job, 'id' | 'providerId' | 'postedOn'>) => void;
  applyForJob: (jobId: string, providerId: string) => boolean;
  getApplicationsForJob: (jobId: string) => Application[];
  getJobsByProvider: (providerId: string) => Job[];
  getNotificationsForUser: (userId: string) => Notification[];
  acceptApplication: (applicationId: string) => void;
  withdrawApplication: (applicationId: string) => void;
  getApplicationsBySeeker: (seekerId: string) => Application[];
}

export const JobContext = createContext<JobContextType | null>(null);

interface JobProviderProps {
  children: ReactNode;
}

export const JobProvider: React.FC<JobProviderProps> = ({ children }) => {
  const { currentUser } = useUser();

  const [jobs, setJobs] = useLocalStorage<Job[]>('jobs', initialJobs);
  const [applications, setApplications] = useLocalStorage<Application[]>('applications', initialApplications);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', initialNotifications);


  const postJob = useCallback((jobData: Omit<Job, 'id' | 'providerId' | 'postedOn'>) => {
    if (!currentUser) return;
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      providerId: currentUser.id,
      postedOn: new Date().toISOString(),
    };
    setJobs(prev => [newJob, ...prev]);
  }, [currentUser, setJobs]);

  const applyForJob = useCallback((jobId: string, providerId: string) => {
    if (!currentUser) return false;
    
    const alreadyApplied = applications.some(app => app.jobId === jobId && app.seekerId === currentUser.id);
    if(alreadyApplied) return false;

    const newApplication: Application = {
      id: `app-${Date.now()}`,
      jobId,
      seekerId: currentUser.id,
      providerId,
      appliedOn: new Date().toISOString(),
      status: 'pending',
    };
    setApplications(prev => [...prev, newApplication]);
    
    const job = jobs.find(j => j.id === jobId);
    if(job) {
        const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            recipientId: providerId,
            text: `${currentUser.username} applied for your job posting: ${job.title}`,
            timestamp: new Date().toISOString(),
        };
        setNotifications(prev => [newNotification, ...prev]);
    }
    return true;
  }, [currentUser, applications, jobs, setApplications, setNotifications]);

  const acceptApplication = useCallback((applicationId: string) => {
    const application = applications.find(app => app.id === applicationId);
    if (!application) return;

    const job = jobs.find(j => j.id === application.jobId);
    if (!job) return;

    const acceptanceNotification: Notification = {
      id: `notif-${Date.now()}`,
      recipientId: application.seekerId,
      text: `Congratulations! Your application for "${job.title}" has been accepted.`,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [acceptanceNotification, ...prev]);

    setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: 'accepted' } : app
    ));
  }, [applications, jobs, setApplications, setNotifications]);

  const withdrawApplication = useCallback((applicationId: string) => {
    const application = applications.find(app => app.id === applicationId);
    if (!application || !currentUser) return;

    const job = jobs.find(j => j.id === application.jobId);
    if (job) {
      const withdrawalNotification: Notification = {
        id: `notif-${Date.now()}`,
        recipientId: job.providerId,
        text: `${currentUser.username} has withdrawn their application for "${job.title}".`,
        timestamp: new Date().toISOString(),
      };
      setNotifications(prev => [withdrawalNotification, ...prev]);
    }

    setApplications(prev => prev.filter(app => app.id !== applicationId));
  }, [currentUser, applications, jobs, setApplications, setNotifications]);

  const getApplicationsForJob = useCallback((jobId: string) => {
    return applications.filter(app => app.jobId === jobId);
  }, [applications]);

  const getApplicationsBySeeker = useCallback((seekerId: string) => {
    return applications.filter(app => app.seekerId === seekerId);
  }, [applications]);

  const getJobsByProvider = useCallback((providerId: string) => {
    return jobs.filter(job => job.providerId === providerId);
  }, [jobs]);

  const getNotificationsForUser = useCallback((userId: string) => {
    return notifications
      .filter(notif => notif.recipientId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [notifications]);

  return (
    <JobContext.Provider value={{ jobs, applications, notifications, postJob, applyForJob, getApplicationsForJob, getJobsByProvider, getNotificationsForUser, acceptApplication, withdrawApplication, getApplicationsBySeeker }}>
      {children}
    </JobContext.Provider>
  );
};