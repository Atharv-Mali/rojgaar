
import React from 'react';
import { Link } from 'react-router-dom';
import { Job, JobType } from '../types';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const badgeColor = job.jobType === JobType.FullTime ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

  return (
    <Link to={`/job/${job.id}`} className="block bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-brand-text capitalize">{job.title}</h3>
          <p className="text-gray-600">{job.companyName}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${badgeColor}`}>{job.jobType}</span>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500 flex items-center justify-between">
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
          {job.location}
        </span>
        <span className="text-xs">
          Posted: {new Date(job.postedOn).toLocaleDateString()}
        </span>
      </div>
    </Link>
  );
};

export default JobCard;
