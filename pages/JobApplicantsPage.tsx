import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import { useUser } from '../hooks/useUser';
import { Application, User, UserRole } from '../types';
import ApplicantModal from '../components/ApplicantModal';

const JobApplicantsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { jobs, getApplicationsForJob, applications: allApplications } = useJobs();
  const { getUserById, currentUser } = useUser();
  const navigate = useNavigate();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const job = useMemo(() => jobs.find(j => j.id === jobId), [jobs, jobId]);
  const applications = useMemo(() => jobId ? getApplicationsForJob(jobId) : [], [jobId, getApplicationsForJob]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.Provider || (job && job.providerId !== currentUser.id)) {
      navigate('/login');
    }
  }, [currentUser, navigate, job]);

  useEffect(() => {
    // If an application is selected (i.e., the modal is open)
    if (selectedApplication) {
        // Find the latest version of that application from the global state
        const updatedApplication = allApplications.find(app => app.id === selectedApplication.id);
        // If the application is found and its status has changed, update our local state
        // to trigger a re-render of the modal with the new data.
        if (updatedApplication && updatedApplication.status !== selectedApplication.status) {
            setSelectedApplication(updatedApplication);
        }
    }
  }, [allApplications, selectedApplication]); // This effect runs whenever the global applications list changes

  if (!job) {
    return <div className="text-center py-10">Job not found.</div>;
  }

  const handleViewProfile = (app: Application) => {
    setSelectedApplication(app);
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
  };
  
  const getStatusBadge = (status: Application['status']) => {
      switch (status) {
          case 'accepted': return 'bg-green-100 text-green-800';
          case 'rejected': return 'bg-red-100 text-red-800';
          default: return 'bg-yellow-100 text-yellow-800';
      }
  }

  return (
    <div className="space-y-6">
       <Link to="/applications" className="text-brand-green hover:underline text-sm">&larr; Back to all job postings</Link>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-brand-text capitalize">{job.title}</h1>
        <p className="text-md text-gray-600">Applicants for this position</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
            {applications.length > 0 ? applications.map(app => {
                const seeker = getUserById(app.seekerId);
                return (
                    <div key={app.id} className="p-4 flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-brand-text">{seeker?.username || 'Unknown User'}</p>
                            <p className="text-sm text-gray-500">Applied on: {new Date(app.appliedOn).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(app.status)}`}>
                                {app.status}
                            </span>
                            <button 
                                onClick={() => handleViewProfile(app)}
                                className="bg-brand-green text-white px-4 py-2 rounded-md text-sm hover:bg-brand-green-light transition"
                            >
                                View Profile
                            </button>
                        </div>
                    </div>
                )
            }) : <p className="p-6 text-gray-500">No applicants for this job yet.</p>}
        </div>
      </div>
      
      {selectedApplication && (
        <ApplicantModal 
          application={selectedApplication} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default JobApplicantsPage;