import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await login(form.email, form.password);
      if (res.success) {
        navigate('/profile');
      } else {
        setError(res.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
      <div className="w-full max-w-md bg-secondary-800/50 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-secondary-700/50">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
          <p className="text-secondary-400">Welcome back! Please log in to your account.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-secondary-300 mb-2 font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="input w-full pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <label className="block text-secondary-300 mb-2 font-medium">Password</label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="input w-full"
              required
              disabled={isLoading}
            />
          </div>
          <div aria-live="polite" className="min-h-[1.5em]">
            {error && <div className="text-red-400 text-sm">{error}</div>}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full h-10"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-secondary-400">Don't have an account?</span>
          <Link
            to="/signup"
            className="ml-2 text-primary-400 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
