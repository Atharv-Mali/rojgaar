
import { useContext } from 'react';
import { JobContext, JobContextType } from '../contexts/JobContext';

export const useJobs = (): JobContextType => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
