
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { JobProvider } from './contexts/JobContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import PostJobPage from './pages/PostJobPage';
import ProfilePage from './pages/ProfilePage';
import ApplicationsListPage from './pages/ApplicationsListPage';
import JobApplicantsPage from './pages/JobApplicantsPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import FavoritesPage from './pages/FavoritesPage';

function App() {
  return (
    <UserProvider>
      <JobProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/jobs/:jobType" element={<JobsPage />} />
              <Route path="/job/:jobId" element={<JobDetailPage />} />
              <Route path="/post-job" element={<PostJobPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/applications" element={<ApplicationsListPage />} />
              <Route path="/applications/:jobId" element={<JobApplicantsPage />} />
              <Route path="/my-applications" element={<MyApplicationsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </Layout>
        </HashRouter>
      </JobProvider>
    </UserProvider>
  );
}

export default App;
