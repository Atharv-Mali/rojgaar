
import React, { useEffect } from 'react';
import { useJobs } from '../hooks/useJobs';
import { useUser } from '../hooks/useUser';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

const ApplicationsListPage: React.FC = () => {
  const { currentUser } = useUser();
  const { getJobsByProvider, getApplicationsForJob } = useJobs();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.Provider) {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  if (!currentUser) {
    return null;
  }

  const myJobs = getJobsByProvider(currentUser.id);

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-brand-text mb-2 text-center">Manage Applications</h1>
        <p className="text-gray-600 text-center">Review applicants for your job postings.</p>
      </div>

      {myJobs.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          {myJobs.map(job => {
            const applicantCount = getApplicationsForJob(job.id).length;
            return (
              <Link 
                key={job.id} 
                to={`/applications/${job.id}`}
                className="block p-4 border rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-brand-text capitalize">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.companyName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-brand-green">{applicantCount}</span>
                    <p className="text-sm text-gray-500">Applicant(s)</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">You have not posted any jobs yet.</p>
          <Link to="/post-job" className="text-brand-green hover:underline mt-2 inline-block">Post your first job</Link>
        </div>
      )}
    </div>
  );
};

export default ApplicationsListPage;