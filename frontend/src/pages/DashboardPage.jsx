import { useMemo } from 'react';
import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import DashboardCard from '../components/DashboardCard';
import { getCurrentUser } from '../services/authService';

const summary = [
  { title: 'Total tickets', value: 2480, delta: '+7.4%', icon: '🎫', badge: 'Live' },
  { title: 'Open tickets', value: 582, delta: '-3.2%', icon: '🟢', badge: 'Pending' },
  { title: 'SLA breaches', value: 38, delta: '+12%', icon: '⚠️', badge: 'Critical' },
  { title: 'Engineers online', value: 14, delta: '+18%', icon: '👷', badge: 'Available' },
];

const trendData = [
  { name: 'Mon', tickets: 20 },
  { name: 'Tue', tickets: 34 },
  { name: 'Wed', tickets: 29 },
  { name: 'Thu', tickets: 41 },
  { name: 'Fri', tickets: 38 },
  { name: 'Sat', tickets: 27 },
  { name: 'Sun', tickets: 22 },
];

const departmentData = [
  { name: 'HVAC', issues: 45, color: '#667eea' },
  { name: 'Electrical', issues: 31, color: '#764ba2' },
  { name: 'IT', issues: 27, color: '#f093fb' },
  { name: 'Security', issues: 19, color: '#4facfe' },
];

const priorityData = [
  { name: 'High', value: 25, color: '#ff5f7a' },
  { name: 'Medium', value: 45, color: '#ffb547' },
  { name: 'Low', value: 30, color: '#32d484' },
];

export default function DashboardPage() {
  const user = useMemo(() => getCurrentUser(), []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-slate-100">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)]">
        <Sidebar />
        <main className="flex flex-col gap-6 p-6 xl:p-8">
          <Topbar title={`Hello, ${user?.firstName || 'Agent'}`} />

          <motion.section
            className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {summary.map((card, index) => (
              <motion.div
                key={card.title}
                variants={cardVariants}
                custom={index}
              >
                <DashboardCard {...card} />
              </motion.div>
            ))}
          </motion.section>

          <motion.section
            className="grid gap-6 xl:grid-cols-[1.4fr_1fr]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Trend Chart */}
            <motion.div
              className="glass rounded-3xl p-6 shadow-card border border-white/10 backdrop-blur-xl"
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold gradient-text">Ticket Trends</h3>
                  <p className="text-sm text-slate-400">Weekly ticket volume</p>
                </div>
                <motion.div
                  className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  📊
                </motion.div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tick={{ fill: '#94a3b8' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tick={{ fill: '#94a3b8' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(20px)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tickets"
                    stroke="url(#gradientLine)"
                    strokeWidth={3}
                    dot={{ fill: '#667eea', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#667eea', strokeWidth: 2 }}
                  />
                  <defs>
                    <linearGradient id="gradientLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Department Breakdown */}
            <motion.div
              className="glass rounded-3xl p-6 shadow-card border border-white/10 backdrop-blur-xl"
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold gradient-text">Department Issues</h3>
                  <p className="text-sm text-slate-400">By category</p>
                </div>
                <motion.div
                  className="w-12 h-12 bg-gradient-secondary rounded-2xl flex items-center justify-center shadow-glow"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  🏢
                </motion.div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="issues"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(20px)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {departmentData.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      />
                      <span className="text-slate-300">{dept.name}</span>
                    </div>
                    <span className="font-semibold text-white">{dept.issues}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.section>

          {/* Priority Distribution */}
          <motion.section
            className="glass rounded-3xl p-6 shadow-card border border-white/10 backdrop-blur-xl"
            variants={cardVariants}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold gradient-text">Priority Distribution</h3>
                <p className="text-sm text-slate-400">Ticket priority breakdown</p>
              </div>
              <motion.div
                className="w-12 h-12 bg-gradient-accent rounded-2xl flex items-center justify-center shadow-glow"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                🎯
              </motion.div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tick={{ fill: '#94a3b8' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tick={{ fill: '#94a3b8' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(20px)'
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="space-y-4">
                {priorityData.map((priority, index) => (
                  <motion.div
                    key={priority.name}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: priority.color }}
                      />
                      <span className="font-medium text-white">{priority.name} Priority</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{priority.value}%</div>
                      <div className="text-sm text-slate-400">
                        {Math.round((priority.value / 100) * 2480)} tickets
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  );
}
