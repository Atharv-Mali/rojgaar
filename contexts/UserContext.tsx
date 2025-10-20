import React, { createContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { initialUsers } from '../data';
import useLocalStorage from '../hooks/useLocalStorage';

export interface UserContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  signup: (username: string, password: string, role: UserRole, email: string) => boolean;
  updateProfile: (updatedUser: User) => void;
  getUserById: (id: string) => User | undefined;
  addFavoriteJob: (jobId: string) => void;
  removeFavoriteJob: (jobId: string) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = useLocalStorage<User[]>('users', initialUsers);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);


  const login = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const signup = (username: string, password: string, role: UserRole, email: string): boolean => {
    if (users.some(u => u.username === username)) {
      return false; // Username already exists
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      password,
      role,
      email,
      phone: '123-456-7890',
      profilePicture: undefined,
      location: '',
      ...(role === UserRole.Seeker && { description: '', skills: [], favoriteJobs: [] }),
      ...(role === UserRole.Provider && { company: '' }),
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };
  
  const updateProfile = (updatedUser: User) => {
    setUsers(prevUsers => prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user));
    if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
  };

  const getUserById = (id: string) => {
      return users.find(u => u.id === id);
  }

  const addFavoriteJob = (jobId: string) => {
    if (!currentUser || currentUser.role !== UserRole.Seeker) return;
    const updatedUser: User = {
      ...currentUser,
      favoriteJobs: [...(currentUser.favoriteJobs || []), jobId],
    };
    updateProfile(updatedUser);
  };

  const removeFavoriteJob = (jobId: string) => {
    if (!currentUser || currentUser.role !== UserRole.Seeker) return;
    const updatedUser: User = {
      ...currentUser,
      favoriteJobs: (currentUser.favoriteJobs || []).filter(id => id !== jobId),
    };
    updateProfile(updatedUser);
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout, signup, updateProfile, getUserById, addFavoriteJob, removeFavoriteJob }}>
      {children}
    </UserContext.Provider>
  );
};