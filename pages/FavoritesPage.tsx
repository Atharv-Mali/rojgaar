
import React, { useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { useJobs } from '../hooks/useJobs';
import JobCard from '../components/JobCard';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

const FavoritesPage: React.FC = () => {
  const { currentUser } = useUser();
  const { jobs } = useJobs();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.Seeker) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== UserRole.Seeker) {
    return null;
  }

  const favoriteJobs = jobs.filter(job => currentUser.favoriteJobs?.includes(job.id));

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-brand-text mb-2 text-center">My Favorite Jobs</h1>
        <p className="text-gray-600 text-center">Here are the jobs you've saved for later.</p>
      </div>
      
      {favoriteJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">You have not saved any jobs yet.</p>
            <Link to="/" className="text-brand-green hover:underline mt-2 inline-block">Explore jobs</Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
