import { useEffect, useMemo, useState } from 'react';
import { getCurrentUser } from '../services/authService';
import { createTicket, deleteTicket, getTickets, updateTicket } from '../services/ticketService';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';

const priorities = ['Low', 'Medium', 'High', 'Critical'];
const statuses = ['Open', 'Assigned', 'In Progress', 'Escalated', 'Resolved', 'Closed'];

export default function TicketsPage() {
  const user = useMemo(() => getCurrentUser(), []);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', category: '', priority: 'Medium', description: '' });

  const canDelete = useMemo(() => ['Admin', 'Manager'].includes(user?.roleName), [user]);
  const canAssign = useMemo(() => ['Admin', 'Manager'].includes(user?.roleName), [user]);
  const canUpdateStatus = useMemo(
    () => ['Admin', 'Manager', 'Engineer'].includes(user?.roleName),
    [user]
  );

  useEffect(() => {
    async function fetchTickets() {
      setLoading(true);
      setError('');
      try {
        const filters = user?.roleName === 'User' ? { createdBy: user.id } : {};
        const data = await getTickets(filters);
        setTickets(data);
      } catch (err) {
        setError('Unable to load tickets');
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, [user]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const newTicket = await createTicket({
        title: form.title,
        category: form.category,
        priority: form.priority,
        description: form.description,
      });
      setTickets((prev) => [newTicket, ...prev]);
      setForm({ title: '', category: '', priority: 'Medium', description: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    }
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm('Delete this ticket?')) return;
    try {
      await deleteTicket(ticketId);
      setTickets((prev) => prev.filter((item) => item.id !== ticketId));
    } catch (err) {
      setError('Unable to delete ticket');
    }
  };

  const handleStatusChange = async (ticket, status) => {
    try {
      const updated = await updateTicket(ticket.id, { status });
      setTickets((prev) => prev.map((item) => (item.id === ticket.id ? updated : item)));
    } catch (err) {
      setError('Unable to update ticket status');
    }
  };

  return (
    <div className="min-h-screen bg-surface text-slate-100">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)]">
        <Sidebar />
        <main className="flex flex-col gap-6 p-6 xl:p-8">
          <div className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-surface2 p-6 shadow-[0_30px_90px_-70px_rgba(0,0,0,0.75)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-white">Ticket Management</h1>
                <p className="mt-2 text-sm text-slate-400">Create, update, and track support tickets with role-aware controls.</p>
              </div>
              <div className="rounded-3xl bg-slate-900 px-4 py-3 text-sm text-slate-200">Role: {user?.roleName || 'Guest'}</div>
            </div>

            <form className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-950/50 p-5" onSubmit={handleSubmit}>
              {error && <div className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>}
              <div className="grid gap-4 lg:grid-cols-3">
                <label className="block">
                  <span className="text-sm text-slate-300">Title</span>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-accent"
                    placeholder="Example: AHU not cooling"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-300">Category</span>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-accent"
                    placeholder="HVAC"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-300">Priority</span>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-accent"
                  >
                    {priorities.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="text-sm text-slate-300">Description</span>
                <textarea
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-accent"
                  placeholder="Describe the issue in detail"
                />
              </label>
              <button className="w-full rounded-3xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent/90">
                Create ticket
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-surface2 p-6 shadow-[0_30px_90px_-70px_rgba(0,0,0,0.75)]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Active tickets</h2>
                <p className="mt-1 text-sm text-slate-400">Latest tickets and status controls for your team.</p>
              </div>
              <span className="rounded-2xl bg-slate-900 px-4 py-2 text-sm text-slate-200">{tickets.length} tickets</span>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-800">
              <table className="min-w-full divide-y divide-slate-800 bg-slate-950/70 text-left text-sm text-slate-200">
                <thead className="bg-slate-900/90 text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Key</th>
                    <th className="px-5 py-4">Title</th>
                    <th className="px-5 py-4">Priority</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Created by</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-5 py-10 text-center text-slate-400">Loading tickets...</td>
                    </tr>
                  ) : tickets.length ? (
                    tickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-slate-900/80">
                        <td className="px-5 py-4 font-semibold text-white">{ticket.ticket_key}</td>
                        <td className="px-5 py-4 text-slate-300">{ticket.title}</td>
                        <td className="px-5 py-4 text-slate-300">{ticket.priority}</td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={ticket.status} />
                            {canUpdateStatus && (
                              <select
                                value={ticket.status}
                                onChange={(event) => handleStatusChange(ticket, event.target.value)}
                                className="rounded-full border border-slate-800 bg-slate-950/70 px-3 py-1 text-xs text-slate-200 outline-none"
                              >
                                {statuses.map((statusOption) => (
                                  <option key={statusOption} value={statusOption}>{statusOption}</option>
                                ))}
                              </select>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-300">{ticket.creator_first_name} {ticket.creator_last_name}</td>
                        <td className="px-5 py-4 space-x-2">
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(ticket.id)}
                              className="rounded-2xl bg-danger/10 px-4 py-2 text-sm text-danger transition hover:bg-danger/20"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-5 py-10 text-center text-slate-400">No tickets found. Create one to get started.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
