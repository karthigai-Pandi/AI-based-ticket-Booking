import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function DashboardCard({ title, value, delta, icon, badge }) {
  const isPositive = delta?.includes('+') || (!delta?.includes('-') && delta !== '0%');

  return (
    <motion.div
      className="glass rounded-3xl p-6 shadow-card border border-white/10 backdrop-blur-xl hover:shadow-glow transition-all duration-300 cursor-pointer group"
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <motion.p
            className="text-sm uppercase tracking-[0.18em] text-slate-400 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.p>
          <motion.p
            className="mt-3 text-3xl font-bold gradient-text"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            {value}
          </motion.p>
        </div>
        <motion.div
          className="rounded-2xl bg-gradient-primary p-3 text-white shadow-glow group-hover:shadow-glow-lg transition-all duration-300"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-2xl">{icon}</span>
        </motion.div>
      </div>

      <motion.div
        className="mt-4 flex items-center justify-between text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.span
          className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-medium backdrop-blur-sm"
          whileHover={{ scale: 1.05 }}
        >
          {badge}
        </motion.span>
        <motion.div
          className={`flex items-center gap-1 font-semibold px-2 py-1 rounded-full ${
            isPositive ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{delta}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
