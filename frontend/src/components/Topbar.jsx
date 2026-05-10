import { motion } from 'framer-motion';
import { Bell, User, Search, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Topbar({ title }) {
  const [notifications] = useState(3); // Mock notification count

  return (
    <motion.header
      className="glass rounded-3xl px-6 py-4 shadow-card border border-white/10 backdrop-blur-xl"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between gap-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400 font-medium">Welcome back</p>
          <h2 className="mt-1 text-2xl font-bold gradient-text">{title}</h2>
        </motion.div>

        <motion.div
          className="flex items-center gap-3"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Search */}
          <motion.div
            className="relative hidden md:block"
            whileHover={{ scale: 1.05 }}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              className="w-64 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-10 py-2 text-sm text-slate-100 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-purple-400 focus:bg-white/10 focus:shadow-glow"
            />
          </motion.div>

          {/* Notifications */}
          <motion.button
            className="relative rounded-2xl bg-white/5 backdrop-blur-sm p-3 text-slate-300 transition-all duration-300 hover:bg-white/10 hover:shadow-glow border border-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <motion.span
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {notifications}
              </motion.span>
            )}
          </motion.button>

          {/* Settings */}
          <motion.button
            className="rounded-2xl bg-white/5 backdrop-blur-sm p-3 text-slate-300 transition-all duration-300 hover:bg-white/10 hover:shadow-glow border border-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-5 h-5" />
          </motion.button>

          {/* User Profile */}
          <motion.div
            className="flex items-center gap-3 rounded-2xl bg-gradient-primary px-4 py-2 text-white shadow-glow cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span className="font-medium hidden sm:block">Admin</span>
          </motion.div>

          {/* Logout */}
          <motion.button
            className="rounded-2xl bg-red-500/10 backdrop-blur-sm p-3 text-red-400 transition-all duration-300 hover:bg-red-500/20 hover:shadow-glow border border-red-500/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </motion.header>
  );
}
