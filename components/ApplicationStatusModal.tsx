import React from 'react';
import { Job, Application } from '../types';
import { useUser } from '../hooks/useUser';

interface ApplicationStatusModalProps {
  job: Job;
  application: Application;
  onClose: () => void;
  onWithdraw: (applicationId: string) => void;
}

const ApplicationStatusModal: React.FC<ApplicationStatusModalProps> = ({ job, application, onClose, onWithdraw }) => {
  const { getUserById } = useUser();
  const provider = getUserById(job.providerId);

  const getStatusInfo = (status: Application['status']) => {
      switch (status) {
          case 'pending':
              return {
                  title: "Application Pending",
                  description: "The employer has received your application and will review it soon.",
                  color: "yellow"
              };
          case 'accepted':
              return {
                  title: "Application Accepted!",
                  description: "Congratulations! The employer has accepted your application. You can now contact them for the next steps.",
                  color: "green"
              };
          case 'rejected':
              return {
                  title: "Application Not Selected",
                  description: "Thank you for your interest. The employer has decided to move forward with other candidates.",
                  color: "red"
              };
          default:
              return {
                  title: "Status Unknown",
                  description: "",
                  color: "gray"
              };
      }
  };
  
  const statusInfo = getStatusInfo(application.status);

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-brand-text capitalize">{job.title}</h2>
            <p className="text-sm text-gray-500">{job.companyName}</p>
        </div>
        <div className="p-6 space-y-4">
            <h3 className="font-semibold text-lg text-brand-text">Application Status</h3>
            <div className={`p-4 rounded-lg bg-${statusInfo.color}-100 border-l-4 border-${statusInfo.color}-500`}>
                <h4 className={`font-bold text-${statusInfo.color}-800`}>{statusInfo.title}</h4>
                <p className={`text-sm text-${statusInfo.color}-700 mt-1`}>{statusInfo.description}</p>
            </div>
            {application.status === 'accepted' && provider && (
              <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Contact Employer</h4>
                  <div className="flex space-x-2">
                      <a href={`mailto:${provider.email}`} className="flex-1 text-center bg-brand-green text-white px-4 py-2 rounded-md text-sm hover:bg-brand-green-light transition">Email ({provider.email})</a>
                      <a href={`tel:${provider.phone}`} className="flex-1 text-center bg-brand-green-light text-white px-4 py-2 rounded-md text-sm hover:bg-brand-green transition">Call ({provider.phone})</a>
                  </div>
              </div>
            )}
            <div className="text-sm text-gray-600 space-y-1 pt-2">
                <p><strong>Applied on:</strong> {new Date(application.appliedOn).toLocaleString()}</p>
                <p><strong>Job Type:</strong> {job.jobType}</p>
                <p><strong>Location:</strong> {job.location}</p>
            </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
          {application.status === 'pending' && (
             <button 
                onClick={() => onWithdraw(application.id)} 
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Withdraw Application
              </button>
          )}
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatusModal;