import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  validatePassword,
  validateStudentId,
  validateStudentEmail,
  validateName,
  validateSignupForm,
  validateLoginForm
} from '../src/services/validationService';
import { supabase, isSupabaseConfigured } from '../src/services/supabaseClient';

interface AuthPageProps {
  type: 'login' | 'signup';
  onNavigate: (page: any) => void;
  onLogin?: (user: any) => void;
  onComplete?: (user: any) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ type, onNavigate, onLogin, onComplete }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    studentEmail: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    let error = '';
    if (type === 'signup') {
      switch (name) {
        case 'firstName':
        case 'lastName':
          const nameValidation = validateName(value, name === 'firstName' ? 'First Name' : 'Last Name');
          error = nameValidation.error || '';
          break;
        case 'studentId':
          const idValidation = validateStudentId(value);
          error = idValidation.error || '';
          break;
        case 'studentEmail':
          const emailValidation = validateStudentEmail(value);
          error = emailValidation.error || '';
          break;
        case 'password':
          const pwdValidation = validatePassword(value);
          error = pwdValidation.isValid ? '' : pwdValidation.errors[0] || '';
          break;
        case 'confirmPassword':
          error = value && value !== formData.password ? 'Passwords do not match' : '';
          break;
      }
    } else {
      if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !/^\d{10}[a-zA-Z]{0,2}$/.test(value)) {
        error = 'Enter a valid email address or student ID';
      }
    }

    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let validationResult;
    if (type === 'signup') {
      validationResult = validateSignupForm({
        firstName: formData.firstName,
        lastName: formData.lastName,
        studentId: formData.studentId,
        studentEmail: formData.studentEmail,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
    } else {
      validationResult = validateLoginForm({
        email: formData.email,
        password: formData.password
      });
    }

    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }

    setLoading(true);

    try {
      if (type === 'signup') {
        const sId = formData.studentId.toUpperCase();
        const sEmail = formData.studentEmail.toLowerCase();
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        const userProfile = {
          student_id: sId,
          name: fullName,
          email: sEmail,
          password: formData.password,
          likes: 0,
          major: 'Foundation FCI',
          dominant_subject: 'General'
        };

        let supabaseSuccess = false;

        if (isSupabaseConfigured && supabase) {
          try {
            // Check if student ID already exists in profiles
            const { data: existingProfiles } = await supabase
              .from('studybuddy_profiles')
              .select('student_id')
              .eq('student_id', sId);

            if (existingProfiles && existingProfiles.length > 0) {
              setErrors({ studentId: 'Student ID already registered in Database.' });
              setLoading(false);
              return;
            }

            const { error: insertError } = await supabase
              .from('studybuddy_profiles')
              .insert([userProfile]);

            if (insertError) {
              console.warn("Supabase insertion error, using local fallback:", insertError.message);
            } else {
              supabaseSuccess = true;
            }
          } catch (dbErr: any) {
            console.warn("Supabase error during signup, using local fallback:", dbErr);
          }
        }

        // Always save to localStorage as local account list to guarantee offline-readiness
        const localUsers = JSON.parse(localStorage.getItem('studybuddy_local_users') || '[]');
        const isDuplicateLocal = localUsers.some((u: any) => u.studentId === sId || u.email === sEmail);
        if (!isDuplicateLocal) {
          localUsers.push({
            name: fullName,
            studentId: sId,
            email: sEmail,
            password: formData.password,
            likes: 0,
            major: 'Foundation FCI'
          });
          localStorage.setItem('studybuddy_local_users', JSON.stringify(localUsers));
        }

        const activeUser = {
          name: fullName,
          studentId: sId,
          email: sEmail,
          likes: 0,
          major: 'Foundation FCI'
        };
        localStorage.setItem('studybuddy_active_user', JSON.stringify(activeUser));

        setTimeout(() => {
          setLoading(false);
          if (onComplete) onComplete(activeUser);
        }, 1200);

      } else {
        // Handle Login
        const lookup = formData.email.trim();
        const pwd = formData.password;
        let authenticatedUser = null;

        if (isSupabaseConfigured && supabase) {
          try {
            const isEmail = lookup.includes('@');
            let query = supabase.from('studybuddy_profiles').select('*');
            if (isEmail) {
              query = query.eq('email', lookup.toLowerCase());
            } else {
              query = query.eq('student_id', lookup.toUpperCase());
            }

            const { data, error } = await query;
            if (data && data.length > 0) {
              const dbUser = data[0];
              // Validate password
              if (dbUser.password === pwd) {
                authenticatedUser = {
                  name: dbUser.name,
                  studentId: dbUser.student_id,
                  email: dbUser.email || `${dbUser.student_id.toLowerCase()}@student.mmu.edu.my`,
                  likes: dbUser.likes || 0,
                  major: dbUser.major || 'Foundation FCI'
                };
              } else {
                setErrors({ password: 'Password correct validation failed. Try again.' });
                setLoading(false);
                return;
              }
            }
          } catch (err) {
            console.warn("Supabase validation exception, trying local fallback:", err);
          }
        }

        // Try local storage fallback if not validated by database
        if (!authenticatedUser) {
          const localUsers = JSON.parse(localStorage.getItem('studybuddy_local_users') || '[]');
          const localMatch = localUsers.find((u: any) => 
            u.studentId.toLowerCase() === lookup.toLowerCase() || u.email.toLowerCase() === lookup.toLowerCase()
          );

          if (localMatch) {
            if (localMatch.password === pwd) {
              authenticatedUser = {
                name: localMatch.name,
                studentId: localMatch.studentId,
                email: localMatch.email,
                likes: localMatch.likes || 0,
                major: localMatch.major || 'Foundation FCI'
              };
            } else {
              setErrors({ password: 'Incorrect password. Please try again.' });
              setLoading(false);
              return;
            }
          }
        }

        if (authenticatedUser) {
          localStorage.setItem('studybuddy_active_user', JSON.stringify(authenticatedUser));
          setTimeout(() => {
            setLoading(false);
            if (onLogin) onLogin(authenticatedUser);
          }, 1200);
        } else {
          setErrors({ email: 'No account found matching credentials. Please sign up first.' });
          setLoading(false);
        }
      }
    } catch (e: any) {
      console.error("Auth submit exception:", e);
      setErrors({ email: 'Authentication error. Please try again later.' });
      setLoading(false);
    }
  };

  const zenChimeVibration = {
    tap: {
      scale: 0.98,
      x: [0, -1, 1, -1, 0],
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow w-full flex items-center justify-center px-4 pt-32 pb-24 min-h-screen"
    >
      <motion.div 
        initial={{ y: 30, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[1000px] h-[640px] spatial-glass rounded-[32px] flex overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
      >
        {/* Top-Left Highlighting */}
        <div className="absolute inset-0 rounded-[inherit] border-t border-l border-white/30 pointer-events-none z-30" />

        {/* LEFT: FORM AREA */}
         <div className="w-full md:w-1/2 h-full bg-white/5 backdrop-blur-3xl p-12 flex flex-col relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <img src="/images/mmu-logo.svg" alt="MMU Logo" className="h-8 w-auto" />
            <span className="font-bold tracking-tight text-[20px]">StudyBuddy</span>
          </div>

          <div className="flex-grow flex flex-col justify-center max-w-[320px] mx-auto w-full overflow-y-auto custom-scrollbar overflow-x-hidden pr-2 py-4">
            <h1 className="text-[32px] font-bold tracking-tight mb-4">
              {type === 'login' ? 'Login' : 'Create Account'}
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {type === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 group/input">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1 group-focus-within/input:text-apple-blue transition-colors">First Name</label>
                    <input 
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Name"
                      required
                      className={`w-full h-10 bg-transparent border-b text-white text-[15px] outline-none transition-all px-1 placeholder:opacity-10 ${
                        errors.firstName ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-apple-blue'
                      }`}
                    />
                    {errors.firstName && <p className="text-[10px] text-red-400 mt-1">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-1 group/input">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1 group-focus-within/input:text-apple-blue transition-colors">Last Name</label>
                    <input 
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Name"
                      required
                      className={`w-full h-10 bg-transparent border-b text-white text-[15px] outline-none transition-all px-1 placeholder:opacity-10 ${
                        errors.lastName ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-apple-blue'
                      }`}
                    />
                    {errors.lastName && <p className="text-[10px] text-red-400 mt-1">{errors.lastName}</p>}
                  </div>
                </div>
              )}

              <div className="space-y-1 group/input">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1 group-focus-within/input:text-apple-blue transition-colors">Student ID</label>
                <input 
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  placeholder="252FC251LC"
                  required
                  className={`w-full h-10 bg-transparent border-b text-white text-[15px] outline-none transition-all px-1 placeholder:opacity-10 ${
                    errors.studentId ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-apple-blue'
                  }`}
                />
                {errors.studentId && <p className="text-[10px] text-red-400 mt-1">{errors.studentId}</p>}
              </div>

              <div className="space-y-1 group/input">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1 group-focus-within/input:text-apple-blue transition-colors">
                  {type === 'login' ? 'Email' : 'Student Email'}
                </label>
                <input 
                  type="email"
                  name={type === 'login' ? 'email' : 'studentEmail'}
                  value={type === 'login' ? formData.email : formData.studentEmail}
                  onChange={handleInputChange}
                  placeholder={type === 'login' ? 'Enter your email' : 'student@mmu.edu.my'}
                  required
                  className={`w-full h-10 bg-transparent border-b text-white text-[15px] outline-none transition-all px-1 placeholder:opacity-10 ${
                    (type === 'login' ? errors.email : errors.studentEmail) ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-apple-blue'
                  }`}
                />
                {type === 'login' && errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email}</p>}
                {type === 'signup' && errors.studentEmail && <p className="text-[10px] text-red-400 mt-1">{errors.studentEmail}</p>}
              </div>

              <div className="space-y-1 group/input">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1 group-focus-within/input:text-apple-blue transition-colors">Password</label>
                  {type === 'login' && (
                    <span className="text-[11px] text-apple-blue font-bold tracking-tight cursor-pointer hover:underline">Forgot?</span>
                  )}
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    className={`w-full h-10 bg-transparent border-b text-white text-[15px] outline-none transition-all px-1 placeholder:opacity-10 ${
                      errors.password ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-apple-blue'
                    }`}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-red-400 mt-1">{errors.password}</p>}
              </div>

              {type === 'signup' && (
                <div className="space-y-1 group/input">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1 group-focus-within/input:text-apple-blue transition-colors">Confirm Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                      className={`w-full h-10 bg-transparent border-b text-white text-[15px] outline-none transition-all px-1 placeholder:opacity-10 ${
                        errors.confirmPassword ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-apple-blue'
                      }`}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-[10px] text-red-400 mt-1">{errors.confirmPassword}</p>}
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <button 
                  type="button"
                  onClick={() => onNavigate(type === 'login' ? 'signup' : 'login')}
                  className="text-[13px] font-bold opacity-40 hover:opacity-100 transition-opacity"
                >
                  {type === 'login' ? "Don't have an account? Sign up" : "Have an account? Login"}
                </button>
                <motion.button 
                  type="submit"
                  disabled={loading}
                  whileTap="tap"
                  variants={zenChimeVibration}
                  className="apple-button-primary !h-[44px] !px-8 !rounded-xl !bg-apple-blue shadow-[0_10px_25px_rgba(0,122,255,0.3)]"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>{type === 'login' ? 'Login' : 'Join'}</span>
                  )}
                </motion.button>
              </div>
            </form>
          </div>

           <div className="mt-8 text-[11px] font-bold text-white/20 uppercase tracking-[0.2em]">
            MMU Academic FCI Discussion Platform
          </div>
        </div>

        {/* RIGHT: IMAGE AREA */}
        <div 
          className="hidden md:block w-1/2 h-full relative overflow-hidden bg-black"
          style={{
            backgroundImage: 'url(/images/mmu-campus.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* PLACEHOLDER FOR YOUR PHOTO */}
          <div className="absolute inset-0 bg-gradient-to-tr from-apple-blue/20 to-apple-purple/20 opacity-40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
            {/* Visual elements simulating your provided photo components */}
            <div className="relative w-full aspect-square max-w-[340px]">
              <div className="absolute top-0 right-0 w-48 h-48 bg-apple-blue/20 blur-[60px] rounded-full animate-pulse" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-apple-purple/20 blur-[40px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass-card !p-8 !rounded-[24px] max-w-full shadow-2xl relative z-10 border-white/20 backdrop-blur-2xl">
                  <p className="text-[17px] font-medium leading-relaxed italic opacity-80">
                    "The first academic tool that's actually enjoyable to use. Beautiful, fast, effortless."
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 border border-white/20" />
                    <div className="text-left">
                      <div className="text-[14px] font-bold">Chai Yi Hao </div>
                      <div className="text-[11px] opacity-40 font-bold uppercase tracking-wider">Foundation FCI</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Close button visualization */}
          <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all">
             <ArrowLeft className="w-4 h-4 text-white rotate-180" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
