import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import { useUser } from '../hooks/useUser';
import { JobType, UserRole } from '../types';

const PostJobPage: React.FC = () => {
  const { postJob } = useJobs();
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [jobType, setJobType] = useState<JobType>(JobType.FullTime);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.Provider) {
        navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !companyName || !location || !description || !skills) {
      setError('All fields are required.');
      return;
    }
    
    postJob({
      title,
      companyName,
      location,
      description,
      skills: skills.split(',').map(s => s.trim()),
      jobType,
    });

    navigate('/profile');
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-brand-text mb-6">Post a New Job</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <InputField label="Job Title" value={title} onChange={setTitle} />
          <InputField label="Company Name" value={companyName} onChange={setCompanyName} />
          <InputField label="Location" value={location} onChange={setLocation} />
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white text-black border border-brand-green rounded-md shadow-sm focus:outline-none focus:ring-brand-green-light focus:border-brand-green-light h-32"
              required
            />
          </div>

          <InputField label="Skills (comma-separated)" value={skills} onChange={setSkills} />

          <fieldset>
            <legend className="block text-sm font-medium text-gray-700">Job Type</legend>
            <div className="mt-2 flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="jobType"
                  value={JobType.FullTime}
                  checked={jobType === JobType.FullTime}
                  onChange={() => setJobType(JobType.FullTime)}
                  className="focus:ring-brand-green-light h-4 w-4 text-brand-green border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Full-Time</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="jobType"
                  value={JobType.PartTime}
                  checked={jobType === JobType.PartTime}
                  onChange={() => setJobType(JobType.PartTime)}
                  className="focus:ring-brand-green-light h-4 w-4 text-brand-green border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Part-Time</span>
              </label>
            </div>
          </fieldset>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-green hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-light transition"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField: React.FC<{label: string, value: string, onChange: (val: string) => void}> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full px-3 py-2 bg-white text-black border border-brand-green rounded-md shadow-sm focus:outline-none focus:ring-brand-green-light focus:border-brand-green-light"
        required
        />
    </div>
);

export default PostJobPage;