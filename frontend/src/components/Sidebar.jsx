import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Ticket,
  HardDrive,
  BarChart3,
  Users,
  Sparkles,
  Activity
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Tickets', to: '/tickets', icon: Ticket },
  { label: 'Assets', to: '/assets', icon: HardDrive },
  { label: 'Analytics', to: '/analytics', icon: BarChart3 },
  { label: 'Teams', to: '/teams', icon: Users },
];

export default function Sidebar() {
  const sidebarVariants = {
    hidden: { x: -280 },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <motion.aside
      className="hidden xl:flex xl:w-72 xl:flex-col xl:bg-surface xl:px-6 xl:py-8 xl:border-r xl:border-white/10 backdrop-blur-xl"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="mb-10"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">AI Service Desk</h1>
            <p className="text-sm text-slate-400">Enterprise platform</p>
          </div>
        </div>
      </motion.div>

      <motion.nav
        className="space-y-2"
        variants={itemVariants}
      >
        {navItems.map((item, index) => (
          <motion.div
            key={item.to}
            variants={itemVariants}
            custom={index}
          >
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-primary text-white shadow-glow'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white hover:shadow-card backdrop-blur-sm'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-400'}`} />
                  </motion.div>
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </motion.nav>

      <motion.div
        className="mt-auto glass rounded-3xl p-6 text-sm border border-white/10 backdrop-blur-xl"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Activity className="w-5 h-5 text-purple-400" />
          <p className="font-semibold text-white">Agent Productivity</p>
        </div>
        <p className="text-xs leading-5 text-slate-400">
          Track SLA compliance, workload balance, and issue velocity in real-time.
        </p>
        <motion.div
          className="mt-4 w-full bg-white/10 rounded-full h-2 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "85%" }}
            transition={{ delay: 0.7, duration: 1.5, ease: "easeOut" }}
          />
        </motion.div>
        <p className="text-xs text-slate-400 mt-2">85% Efficiency</p>
      </motion.div>
    </motion.aside>
  );
}
