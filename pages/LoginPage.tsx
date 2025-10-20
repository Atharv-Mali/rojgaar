import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-brand-text mb-6">Login</h2>
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
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-green hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-light transition"
            >
              Login
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-brand-green hover:text-brand-green-light">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;