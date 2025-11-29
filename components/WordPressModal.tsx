import React, { useState } from 'react';
import { X, Globe, User, Key } from 'lucide-react';
import { Button } from './Button';
import { WordPressConfig } from '../types';

interface WordPressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (config: WordPressConfig) => void;
  isLoading: boolean;
}

export const WordPressModal: React.FC<WordPressModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [appPassword, setAppPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ url, username, appPassword });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fadeIn">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">פרסום לוורדפרס</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">כתובת האתר (URL)</label>
            <div className="relative">
              <Globe className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://mysite.com"
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">שם משתמש</label>
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700 block flex justify-between">
              <span>סיסמת אפליקציה (Application Password)</span>
              <a href="https://wordpress.org/documentation/article/application-passwords/" target="_blank" rel="noreferrer" className="text-primary-600 hover:underline text-xs">איך משיגים?</a>
             </label>
            <div className="relative">
              <Key className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
              <input
                type="password"
                required
                value={appPassword}
                onChange={(e) => setAppPassword(e.target.value)}
                placeholder="xxxx xxxx xxxx xxxx"
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-left"
                dir="ltr"
              />
            </div>
            <p className="text-xs text-gray-500">
              השתמש בסיסמת אפליקציה ולא בסיסמה הרגילה שלך מטעמי אבטחה.
            </p>
          </div>

          <div className="pt-4 flex space-x-3 space-x-reverse">
            <Button 
              type="submit" 
              isLoading={isLoading}
              className="flex-1"
            >
              פרסם כעת
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose}
            >
              ביטול
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};