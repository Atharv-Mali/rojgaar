import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { useJobs } from '../hooks/useJobs';
import { User, UserRole } from '../types';
import { Link, useNavigate } from 'react-router-dom';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const ProfilePage: React.FC = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }
  
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl space-y-10">
      {currentUser.role === UserRole.Provider ? <ProviderProfile user={currentUser} /> : <SeekerProfile user={currentUser} />}
    </div>
  );
};

const SeekerProfile: React.FC<{ user: User }> = ({ user }) => {
    const { updateProfile } = useUser();
    const { applications } = useJobs();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user);

    useEffect(() => {
      // If not editing, ensure the form data is in sync with the user prop
      if (!isEditing) {
        setFormData(user);
      }
    }, [user, isEditing]);

    const completedJobsCount = applications.filter(app => app.seekerId === user.id && app.status === 'accepted').length;

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setFormData(prev => ({...prev, profilePicture: base64}));
        }
    };

    const handleSave = () => {
        const skillsArray = typeof formData.skills === 'string' ? (formData.skills as string).split(',').map(s => s.trim()) : formData.skills;
        updateProfile({ ...formData, skills: skillsArray });
        setIsEditing(false);
    }
    
    const displayPicture = isEditing ? formData.profilePicture : user.profilePicture;

    return (
        <div>
            <div className="flex flex-col items-center border-b pb-8">
                <div className="relative w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
                    {displayPicture ? (
                        <img src={displayPicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    )}
                     {isEditing && (
                        <label htmlFor="profile-upload" className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Change
                            <input id="profile-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    )}
                </div>
                <h1 className="text-3xl font-bold text-brand-text">{user.username}</h1>
                <p className="text-gray-500 capitalize">{user.role} Account</p>
            </div>
            <div className="pt-8">
            {isEditing ? (
                 <div className="space-y-4">
                    <ProfileField label="Name" value={formData.username} onChange={(val) => setFormData({...formData, username: val})} />
                    <ProfileField label="Email" value={formData.email} onChange={(val) => setFormData({...formData, email: val})} />
                    <ProfileField label="Phone No" value={formData.phone} onChange={(val) => setFormData({...formData, phone: val})} />
                    <ProfileField label="Location" value={formData.location || ''} onChange={(val) => setFormData({...formData, location: val})} />
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Description</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="mt-1 w-full p-2 bg-white text-black border border-brand-green rounded-md h-24 focus:outline-none focus:ring-brand-green-light focus:border-brand-green-light"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-500">Skills (comma-separated)</label>
                        <input type="text" value={(formData.skills || []).join(', ')} onChange={(e) => setFormData({...formData, skills: e.target.value as any})} className="mt-1 w-full p-2 bg-white text-black border border-brand-green rounded-md focus:outline-none focus:ring-brand-green-light focus:border-brand-green-light"/>
                    </div>
                    <button onClick={handleSave} className="bg-brand-green text-white px-6 py-2 rounded-md hover:bg-brand-green-light">Save Profile</button>
                    <button onClick={() => { setIsEditing(false); setFormData(user); }} className="ml-4 text-gray-600">Cancel</button>
                </div>
            ) : (
                <div className="space-y-4">
                    <DisplayField label="Email" value={user.email} />
                    <DisplayField label="Phone No" value={user.phone} />
                    <DisplayField label="Location" value={user.location || 'Not provided'} />
                    <DisplayField label="Jobs Completed" value={completedJobsCount.toString()} />
                    <DisplayField label="Description" value={user.description || 'Not provided'} area={true}/>
                    <DisplayField label="Skills" value={(user.skills || []).join(', ') || 'None listed'} />
                    <button onClick={() => setIsEditing(true)} className="bg-brand-green text-white px-6 py-2 rounded-md hover:bg-brand-green-light">Edit Profile</button>
                </div>
            )}
            </div>
        </div>
    )
}

const ProviderProfile: React.FC<{ user: User }> = ({ user }) => {
    const { getNotificationsForUser, getJobsByProvider, getApplicationsForJob } = useJobs();
    const { getUserById, updateProfile } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user);

    useEffect(() => {
      // If not editing, ensure the form data is in sync with the user prop
      if (!isEditing) {
        setFormData(user);
      }
    }, [user, isEditing]);

    const notifications = getNotificationsForUser(user.id);
    const myJobs = getJobsByProvider(user.id);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setFormData(prev => ({...prev, profilePicture: base64}));
        }
    };

    const handleSave = () => {
        updateProfile(formData);
        setIsEditing(false);
    }

    const displayPicture = isEditing ? formData.profilePicture : user.profilePicture;

    return (
        <div className="space-y-8">
             <div className="flex flex-col items-center border-b pb-8">
                 <div className="relative w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
                    {displayPicture ? (
                        <img src={displayPicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    )}
                     {isEditing && (
                        <label htmlFor="profile-upload" className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Change
                            <input id="profile-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    )}
                </div>
                <h1 className="text-3xl font-bold text-brand-text">{user.username}</h1>
                <p className="text-gray-500 capitalize">{user.role} Account</p>
            </div>
            {isEditing ? (
                 <div className="space-y-4">
                    <ProfileField label="Contact Name" value={formData.username} onChange={(val) => setFormData({...formData, username: val})} />
                    <ProfileField label="Company / Business" value={formData.company || ''} onChange={(val) => setFormData({...formData, company: val})} />
                    <ProfileField label="Email" value={formData.email} onChange={(val) => setFormData({...formData, email: val})} />
                    <ProfileField label="Phone No" value={formData.phone} onChange={(val) => setFormData({...formData, phone: val})} />
                    <ProfileField label="Location" value={formData.location || ''} onChange={(val) => setFormData({...formData, location: val})} />
                    <button onClick={handleSave} className="bg-brand-green text-white px-6 py-2 rounded-md hover:bg-brand-green-light">Save Profile</button>
                    <button onClick={() => { setIsEditing(false); setFormData(user); }} className="ml-4 text-gray-600">Cancel</button>
                </div>
            ) : (
                <div className="space-y-4">
                    <DisplayField label="Company / Business" value={user.company || 'Not provided'} />
                    <DisplayField label="Email" value={user.email} />
                    <DisplayField label="Phone No" value={user.phone} />
                    <DisplayField label="Location" value={user.location || 'Not provided'} />
                    <button onClick={() => setIsEditing(true)} className="bg-brand-green text-white px-6 py-2 rounded-md hover:bg-brand-green-light">Edit Profile</button>
                </div>
            )}
            
            <div className="border-t pt-8">
                <h2 className="text-2xl font-semibold text-brand-text mb-4">Notifications</h2>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                    {notifications.length > 0 ? notifications.map(n => (
                        <div key={n.id} className="bg-gray-100 p-3 rounded-md">
                            <p className="text-sm text-gray-800">{n.text}</p>
                            <p className="text-xs text-gray-500">{new Date(n.timestamp).toLocaleString()}</p>
                        </div>
                    )) : <p className="text-gray-500">No new notifications.</p>}
                </div>
            </div>

            <div className="border-t pt-8">
                <h2 className="text-2xl font-semibold text-brand-text mb-4">My Job Postings & Applicants</h2>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {myJobs.length > 0 ? myJobs.map(job => {
                        const applicants = getApplicationsForJob(job.id);
                        return (
                             <div key={job.id} className="bg-gray-100 p-4 rounded-md">
                                <h3 className="font-bold capitalize text-brand-text">{job.title}</h3>
                                <p className="text-sm text-gray-600">{job.companyName}</p>
                                <Link to={`/applications/${job.id}`} className="mt-2 font-semibold text-sm text-brand-green hover:underline">View Applicants ({applicants.length})</Link>
                            </div>
                        )
                    }) : <p className="text-gray-500">You have not posted any jobs yet. <Link to="/post-job" className="text-brand-green underline">Post one now!</Link></p>}
                </div>
            </div>
        </div>
    )
}

const DisplayField: React.FC<{label: string, value: string, area?: boolean}> = ({label, value, area}) => (
    <div>
        <label className="block text-sm font-medium text-gray-500">{label}</label>
        {area ? <div className="mt-1 w-full bg-gray-100 p-2 rounded-md h-24 whitespace-pre-wrap">{value}</div> : <div className="mt-1 w-full bg-gray-100 p-2 rounded-md">{value}</div>}
    </div>
);

const ProfileField: React.FC<{label: string, value: string, onChange: (val: string) => void}> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500">{label}</label>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full p-2 bg-white text-black border border-brand-green rounded-md focus:outline-none focus:ring-brand-green-light focus:border-brand-green-light"/>
    </div>
);


export default ProfilePage;