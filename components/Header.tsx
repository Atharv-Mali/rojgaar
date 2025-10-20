
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { UserRole } from '../types';

const Header: React.FC = () => {
  const { currentUser, logout } = useUser();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? 'text-white bg-brand-green-light'
        : 'text-stone-200 hover:bg-brand-green-light hover:text-white'
    }`;

  return (
    <header className="bg-brand-green shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          Raah-e-Rojgaar
        </Link>
        <div className="flex items-center space-x-4">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/jobs/full-time" className={navLinkClass}>
            Full-Time
          </NavLink>
          <NavLink to="/jobs/part-time" className={navLinkClass}>
            Part-Time
          </NavLink>
          {currentUser?.role === UserRole.Provider && (
            <>
              <NavLink to="/post-job" className={navLinkClass}>
                Post a Job
              </NavLink>
              <NavLink to="/applications" className={navLinkClass}>
                Manage Applications
              </NavLink>
            </>
          )}
          {currentUser?.role === UserRole.Seeker && (
             <>
                <NavLink to="/my-applications" className={navLinkClass}>
                    My Applications
                </NavLink>
                <NavLink to="/favorites" className={navLinkClass}>
                    Favorites
                </NavLink>
             </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <div className="flex items-center space-x-2 text-white">
                <span className="text-sm">Hi, {currentUser.username}</span>
                <span className="text-gray-400">|</span>
                 <Link to="/profile" className="text-sm hover:underline">Profile</Link>
                 <span className="text-gray-400">|</span>
                <button
                  onClick={logout}
                  className="bg-brand-green-light text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-opacity-80 transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-stone-200 hover:text-white text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-brand-green-light text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-opacity-80 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;