
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      <div 
        className="relative bg-cover bg-center rounded-lg shadow-xl overflow-hidden" 
        style={{ backgroundImage: "url('https://picsum.photos/1200/400?grayscale&blur=2')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative container mx-auto px-6 py-24 text-center text-white">
          <h1 className="text-5xl font-extrabold mb-4">Find Your Niche in Agriculture</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Cultivating careers in rural communities. Explore diverse opportunities from farm management to agritech and find a job that grows with you.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link to="/jobs/full-time" className="block bg-brand-green p-8 rounded-lg shadow-lg hover:bg-brand-green-light transition duration-300 text-white">
          <h2 className="text-3xl font-bold mb-2">Full-Time Jobs</h2>
          <p className="text-stone-200">Discover stable, long-term career opportunities in the heart of agriculture.</p>
        </Link>
        <Link to="/jobs/part-time" className="block bg-brand-green p-8 rounded-lg shadow-lg hover:bg-brand-green-light transition duration-300 text-white">
          <h2 className="text-3xl font-bold mb-2">Part-Time Jobs</h2>
          <p className="text-stone-200">Find flexible, seasonal, or supplementary roles that fit your schedule.</p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
