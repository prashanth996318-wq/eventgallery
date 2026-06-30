import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User as UserIcon, Award, Sparkles, GraduationCap } from 'lucide-react';

const Login = () => {
  const { login, register, isAuthenticated, user, error: authError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Switch between login and register state
  const [isRegister, setIsRegister] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('parent'); // default: parent
  const [admissionNumber, setAdmissionNumber] = useState('');

  // UI States
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Read URL query param to open register by default
  useEffect(() => {
    if (searchParams.get('register') === 'true') {
      setIsRegister(true);
    } else {
      setIsRegister(false);
    }
  }, [searchParams]);

  // Route authenticated user
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'teacher') navigate('/teacher');
      else navigate('/parent');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMsg('');
    setLoading(true);

    if (!email || !password || (isRegister && !name)) {
      setLocalError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      if (isRegister) {
        // Validation for parent admission number
        if (role === 'parent' && !admissionNumber) {
          setLocalError('Admission Number is required for Parent registration to link your child.');
          setLoading(false);
          return;
        }

        await register({
          name,
          email,
          password,
          role,
          admissionNumber: role === 'parent' ? admissionNumber : undefined,
        });
        setSuccessMsg('Registration successful! Launching dashboard...');
      } else {
        await login(email, password);
        setSuccessMsg('Login successful! Welcome back.');
      }
    } catch (err) {
      // AuthContext handles error state, we grab it from there or from caught promise
      setLocalError(err.message || 'Authentication failed. Please verify entries.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-lightBg px-4 py-12 relative overflow-hidden">
      {/* Visual highlights */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-brand-yellow/10 blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-brand-blue/5 blur-3xl"></div>

      <div className="w-full max-w-lg glass-card rounded-3xl border border-white/60 shadow-premium p-8 sm:p-10 relative z-10 animate-fade-in">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-yellow text-brand-navy font-black text-2xl shadow-md border-2 border-white mb-2">
            FC
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-navy">
            {isRegister ? 'Join Intellitots Gallery' : 'Welcome Back'}
          </h2>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
            {isRegister ? 'Create a secure school photo portal account' : 'Access your child\'s school moments'}
          </p>
        </div>

        {/* Form Submission status feedbacks */}
        {(localError || authError) && (
          <div className="p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium">
            {localError || authError}
          </div>
        )}
        {successMsg && (
          <div className="p-4 mb-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium animate-pulse">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-navy">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. Rohan Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-sky-100 text-sm font-medium transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-navy">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="email"
                placeholder="e.g. parent@firstcry.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-sky-100 text-sm font-medium transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-navy">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="password"
                placeholder="Enter password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-sky-100 text-sm font-medium transition-all"
                required
              />
            </div>
          </div>

          {/* Registration Role Selection and Admission number link mapping */}
          {isRegister && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-navy">Choose Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('parent')}
                    className={`py-3 rounded-2xl text-xs font-bold border transition-all ${
                      role === 'parent'
                        ? 'border-brand-blue bg-sky-50/50 text-brand-blue shadow-sm'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Parent
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`py-3 rounded-2xl text-xs font-bold border transition-all ${
                      role === 'teacher'
                        ? 'border-brand-orange bg-orange-50/50 text-brand-orange shadow-sm'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Teacher
                  </button>
                </div>
              </div>

              {role === 'parent' && (
                <div className="space-y-1.5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-brand-navy flex items-center">
                      <GraduationCap className="w-3.5 h-3.5 mr-1 text-brand-blue" />
                      <span>Child's Admission Number</span>
                    </label>
                    <span className="text-[10px] text-gray-400 font-semibold">(e.g. FC1001)</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter student admission number"
                    value={admissionNumber}
                    onChange={(e) => setAdmissionNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-sky-100 text-sm font-medium transition-all"
                  />
                  <p className="text-[10px] text-gray-400 leading-normal">
                    * This maps your account to your child's profile automatically. Contact admin if you do not have an admission code.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2 ${
              isRegister
                ? 'bg-brand-orange hover:bg-orange-600 shadow-orange-100'
                : 'bg-brand-blue hover:bg-sky-600 shadow-sky-100'
            } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-white" />
                <span>{isRegister ? 'Register Account' : 'Sign In To Gallery'}</span>
              </>
            )}
          </button>
        </form>

        {/* Navigation toggles between Login and Register */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setLocalError('');
            }}
            className="text-xs font-bold text-brand-navy hover:text-brand-blue transition-colors duration-150"
          >
            {isRegister ? 'Already have an account? Sign In' : 'New to Intellitots? Register here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
