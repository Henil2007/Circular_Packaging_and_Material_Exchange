import React, { useState } from 'react';

interface AuthProps {
  onSuccess: () => void;
}

export default function Auth({ onSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-emerald-700 mb-8">
          Circular Exchange
        </h2>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {isLogin ? 'Log in to your account' : 'Create an account'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company / User Name</label>
                <input type="text" required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="Eco Corp" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="contact@ecocorp.com" />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input type="tel" required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="+1 (555) 000-0000" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isLogin ? 'Password' : 'Create Strong Password'}
            </label>
            <input type="password" required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition duration-300">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-emerald-600 font-semibold hover:underline">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}