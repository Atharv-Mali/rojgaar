
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import { useUser } from '../hooks/useUser';
import { Job, Application, UserRole } from '../types';
import ApplicationStatusModal from '../components/ApplicationStatusModal';

const MyApplicationsPage: React.FC = () => {
    const { currentUser } = useUser();
    const { getApplicationsBySeeker, jobs, withdrawApplication } = useJobs();
    const navigate = useNavigate();
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    useEffect(() => {
        if (!currentUser || currentUser.role !== UserRole.Seeker) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    const myApplications = useMemo(() => {
        if (!currentUser) return [];
        return getApplicationsBySeeker(currentUser.id)
    }, [getApplicationsBySeeker, currentUser]);

    if (!currentUser || currentUser.role !== UserRole.Seeker) {
        return null;
    }

    const handleViewStatus = (jobId: string) => {
        const job = jobs.find(j => j.id === jobId);
        if (job) {
            setSelectedJob(job);
        }
    };

    const handleModalWithdraw = (applicationId: string) => {
        if (window.confirm('Are you sure you want to withdraw this application?')) {
            withdrawApplication(applicationId);
            setSelectedJob(null); // Close modal after withdrawal
        }
    }

    const getApplicationForJob = (jobId: string): Application | undefined => {
        return myApplications.find(app => app.jobId === jobId);
    }

    const getStatusBadge = (status: Application['status']) => {
        switch (status) {
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-brand-text text-center">My Applications</h1>
                <p className="text-md text-gray-600 text-center">Track the status of your job applications.</p>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="divide-y divide-gray-200">
                    {myApplications.length > 0 ? myApplications.map(app => {
                        const job = jobs.find(j => j.id === app.jobId);
                        if (!job) return null;
                        return (
                            <div key={app.id} className="p-4 flex flex-col md:flex-row justify-between md:items-center">
                                <div className="mb-4 md:mb-0">
                                    <h3 className="font-semibold text-brand-text capitalize">{job.title}</h3>
                                    <p className="text-sm text-gray-600">{job.companyName}</p>
                                    <p className="text-xs text-gray-500 mt-1">Applied on: {new Date(app.appliedOn).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(app.status)}`}>
                                        {app.status}
                                    </span>
                                    <button
                                        onClick={() => handleViewStatus(job.id)}
                                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-300 transition"
                                    >
                                        View Status
                                    </button>
                                </div>
                            </div>
                        )
                    }) : <p className="p-6 text-gray-500">You haven't applied for any jobs yet.</p>}
                </div>
            </div>
            {selectedJob && getApplicationForJob(selectedJob.id) && (
                <ApplicationStatusModal
                    job={selectedJob}
                    application={getApplicationForJob(selectedJob.id)!}
                    onClose={() => setSelectedJob(null)}
                    onWithdraw={handleModalWithdraw}
                />
            )}
        </div>
    );
};

export default MyApplicationsPage;
