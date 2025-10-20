
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import { useUser } from '../hooks/useUser';
import { JobType, UserRole } from '../types';

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { jobs, applyForJob } = useJobs();
  const { currentUser, addFavoriteJob, removeFavoriteJob } = useUser();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const job = jobs.find(j => j.id === jobId);

  if (!job) {
    return <div className="text-center py-10">Job not found.</div>;
  }

  const isFavorite = currentUser?.favoriteJobs?.includes(job.id);

  const handleFavoriteClick = () => {
      if (!currentUser) return;
      if (isFavorite) {
          removeFavoriteJob(job.id);
      } else {
          addFavoriteJob(job.id);
      }
  };

  const handleApply = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role !== UserRole.Seeker) {
      setMessage('Only Job Seekers can apply for jobs.');
      return;
    }
    const success = applyForJob(job.id, job.providerId);
    if (success) {
      setMessage('Application submitted successfully!');
    } else {
        setMessage('You have already applied for this job.');
    }
  };

  const badgeColor = job.jobType === JobType.FullTime ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-text capitalize">{job.title}</h1>
            <p className="text-lg text-gray-700">{job.companyName}</p>
          </div>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${badgeColor}`}>{job.jobType}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-6 border-b pb-4">
            <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                {job.location}
            </span>
            <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                Posted on {new Date(job.postedOn).toLocaleDateString()}
            </span>
        </div>
        
        <div className="space-y-4">
            <div>
                <h2 className="text-xl font-semibold text-brand-text mb-2">Job Description</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
            </div>
            <div>
                <h2 className="text-xl font-semibold text-brand-text mb-2">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                        <span key={index} className="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
                    ))}
                </div>
            </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-brand-text mb-4">About the Employer</h2>
            <div className="space-y-2">
                <div>
                    <p className="text-sm font-medium text-gray-500">Company</p>
                    <p className="font-semibold text-gray-800">{job.companyName}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-gray-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {job.location}
                    </p>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md space-y-3">
            <button
              onClick={handleApply}
              disabled={!!message}
              className="w-full bg-brand-green text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-green-light transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Apply Now
            </button>
            {message && <p className="text-center text-sm text-green-700 font-semibold">{message}</p>}
             {currentUser?.role === UserRole.Seeker && (
                <button 
                    onClick={handleFavoriteClick} 
                    className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-300 flex items-center justify-center space-x-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span>{isFavorite ? 'Saved to Favorites' : 'Save for Later'}</span>
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
