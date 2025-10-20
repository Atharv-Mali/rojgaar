
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import { JobType } from '../types';
import JobCard from '../components/JobCard';

const JobsPage: React.FC = () => {
  const { jobType } = useParams<{ jobType: string }>();
  const { jobs } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');

  const pageTitle = jobType === JobType.FullTime ? 'Full-Time Jobs' : 'Part-Time Jobs';

  const filteredJobsByType = jobs.filter(job => job.jobType === jobType);

  const filteredJobs = filteredJobsByType.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-brand-text mb-2 text-center">{pageTitle}</h1>
        <p className="text-gray-600 text-center">Browse our available {jobType} positions.</p>
        <div className="mt-6 max-w-xl mx-auto">
          <input 
            type="text"
            placeholder="Search by title, company, or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-white text-black border border-brand-green rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green-light"
          />
        </div>
      </div>
      
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">No jobs found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
