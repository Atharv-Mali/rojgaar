import React from 'react';
import { useUser } from '../hooks/useUser';
import { useJobs } from '../hooks/useJobs';
import { Application } from '../types';

interface ApplicantModalProps {
  application: Application;
  onClose: () => void;
}

const ApplicantModal: React.FC<ApplicantModalProps> = ({ application, onClose }) => {
  const { getUserById } = useUser();
  const { acceptApplication } = useJobs();
  const seeker = getUserById(application.seekerId);

  if (!seeker) {
    return null; // or some error/loading state
  }
  
  const handleAccept = () => {
    acceptApplication(application.id);
  }

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {seeker.profilePicture ? (
                    <img src={seeker.profilePicture} alt={seeker.username} className="w-full h-full object-cover" />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                )}
            </div>
            <div>
                <h2 className="text-2xl font-bold text-brand-text">{seeker.username}</h2>
                <p className="text-sm text-gray-500">Applicant Profile</p>
            </div>
        </div>
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <InfoField label="Email" value={seeker.email} />
            <InfoField label="Phone" value={seeker.phone} />
            <InfoField label="Location" value={seeker.location || 'Not provided'} />
            <InfoField label="Description" value={seeker.description || 'No description provided.'} isBlock={true} />
            <InfoField label="Skills" value={(seeker.skills || []).join(', ') || 'No skills listed.'} />
            {application.status === 'accepted' && (
              <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Contact Applicant</h4>
                  <div className="flex space-x-2">
                      <a href={`mailto:${seeker.email}`} className="flex-1 text-center bg-brand-green text-white px-4 py-2 rounded-md text-sm hover:bg-brand-green-light transition">Email</a>
                      <a href={`tel:${seeker.phone}`} className="flex-1 text-center bg-brand-green-light text-white px-4 py-2 rounded-md text-sm hover:bg-brand-green transition">Call</a>
                  </div>
              </div>
            )}
        </div>
        <div className="p-4 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
          {application.status === 'pending' && (
            <button 
                onClick={handleAccept}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-green rounded-md hover:bg-brand-green-light"
            >
                Accept Application
            </button>
          )}
           {application.status === 'accepted' && (
            <button 
                disabled
                className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md cursor-not-allowed"
            >
                Accepted
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoField: React.FC<{label: string, value: string, isBlock?: boolean}> = ({ label, value, isBlock }) => (
    <div>
        <h4 className="text-sm font-semibold text-gray-500 mb-1">{label}</h4>
        <p className={`text-gray-800 ${isBlock ? 'whitespace-pre-wrap' : ''}`}>{value}</p>
    </div>
);


export default ApplicantModal;