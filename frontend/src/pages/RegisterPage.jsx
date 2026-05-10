import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, UserPlus, Sparkles } from 'lucide-react';
import { register, saveSession } from '../services/authService';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await register(form);
      saveSession(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="glass rounded-3xl p-8 shadow-2xl border border-white/10 backdrop-blur-xl"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-glow"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <UserPlus className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Create Account</h1>
            <p className="text-slate-400">Join our enterprise service desk platform</p>
          </motion.div>

          {error && (
            <motion.div
              variants={itemVariants}
              className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <motion.form
            variants={itemVariants}
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <motion.div
                variants={itemVariants}
                whileFocus={{ scale: 1.02 }}
              >
                <label className="block">
                  <span className="text-sm font-medium text-slate-300 mb-2 block">First Name</span>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-12 py-4 text-slate-100 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-purple-400 focus:bg-white/10 focus:shadow-glow"
                      placeholder="Alex"
                      disabled={isLoading}
                    />
                  </div>
                </label>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileFocus={{ scale: 1.02 }}
              >
                <label className="block">
                  <span className="text-sm font-medium text-slate-300 mb-2 block">Last Name</span>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-12 py-4 text-slate-100 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-purple-400 focus:bg-white/10 focus:shadow-glow"
                      placeholder="Johnson"
                      disabled={isLoading}
                    />
                  </div>
                </label>
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              whileFocus={{ scale: 1.02 }}
            >
              <label className="block">
                <span className="text-sm font-medium text-slate-300 mb-2 block">Email Address</span>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-12 py-4 text-slate-100 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-purple-400 focus:bg-white/10 focus:shadow-glow"
                    placeholder="alex@example.com"
                    disabled={isLoading}
                  />
                </div>
              </label>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileFocus={{ scale: 1.02 }}
            >
              <label className="block">
                <span className="text-sm font-medium text-slate-300 mb-2 block">Password</span>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-12 py-4 text-slate-100 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-purple-400 focus:bg-white/10 focus:shadow-glow pr-12"
                    placeholder="Create a strong password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </label>
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-primary text-white font-semibold py-4 px-6 rounded-2xl shadow-glow hover:shadow-glow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="spinner w-5 h-5" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.div
            variants={itemVariants}
            className="mt-8 text-center"
          >
            <p className="text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
