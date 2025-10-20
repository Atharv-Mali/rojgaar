import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { UserRole } from '../types';

const SignUpPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.Seeker);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Password validation
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!hasLetter || !hasNumber) {
        setError("Password must include at least one letter and one number.");
        return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    
    const success = signup(username, password, role, email);
    if (success) {
      navigate('/');
    } else {
      setError('Username already exists. Please choose another.');
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-brand-text mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white text-black border border-brand-green rounded-md shadow-sm focus:outline-none focus:ring-brand-green-light focus:border-brand-green-light"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white text-black border border-brand-green rounded-md shadow-sm focus:outline-none focus:ring-brand-green-light focus:border-brand-green-light"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white text-black border border-brand-green rounded-md shadow-sm focus:outline-none focus:ring-brand-green-light focus:border-brand-green-light"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white text-black border border-brand-green rounded-md shadow-sm focus:outline-none focus:ring-brand-green-light focus:border-brand-green-light"
              required
            />
          </div>
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700">I am a...</legend>
            <div className="mt-2 flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value={UserRole.Seeker}
                  checked={role === UserRole.Seeker}
                  onChange={() => setRole(UserRole.Seeker)}
                  className="focus:ring-brand-green-light h-4 w-4 text-brand-green border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Job Seeker</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value={UserRole.Provider}
                  checked={role === UserRole.Provider}
                  onChange={() => setRole(UserRole.Provider)}
                  className="focus:ring-brand-green-light h-4 w-4 text-brand-green border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Job Provider</span>
              </label>
            </div>
          </fieldset>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-green hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-light transition"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-green hover:text-brand-green-light">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;