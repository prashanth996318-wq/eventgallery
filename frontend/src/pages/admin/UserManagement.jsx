import React, { useState, useEffect } from 'react';
import { authService } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import { Search, Trash2, Mail, Users, ShieldAlert, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await authService.getUsers();
      if (res.success) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve user profiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (id === currentUser.id) {
      alert('You cannot delete your own admin account!');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this user? This will also unlink any student connections.')) return;
    try {
      const res = await authService.deleteUser(id);
      if (res.success) {
        alert('User deleted successfully.');
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Delete user failed.');
    }
  };

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === '' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-brand-pink/10 text-brand-pink border-brand-pink/20';
      case 'teacher':
        return 'bg-brand-orange/10 text-brand-orange border-brand-orange/20';
      case 'parent':
        return 'bg-brand-blue/10 text-brand-blue border-brand-blue/20';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-black text-brand-navy">User Management</h2>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1">
            Browse registered teachers, parent profiles, and administrator credentials
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-premium flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-sky-100 text-xs font-medium transition"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-brand-blue text-xs font-semibold text-brand-navy"
            >
              <option value="">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="teacher">Teachers</option>
              <option value="parent">Parents</option>
            </select>
          </div>
        </div>

        {/* Directory table */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-premium overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-gray-500 font-semibold">Retrieving directory list...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-xs font-medium">
              No users registered in this directory.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-brand-navy text-[10px] font-bold tracking-wider uppercase border-b border-gray-100">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">System Role</th>
                    <th className="py-4 px-6">Registration Date</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="text-xs font-medium text-gray-600 hover:bg-gray-50/50 transition">
                      <td className="py-4 px-6 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-700">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-brand-navy">{u.name}</span>
                      </td>
                      <td className="py-4 px-6 flex items-center gap-1.5 pt-4">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{u.email}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-lg border ${getRoleColor(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {u._id === currentUser.id ? (
                          <span className="text-[10px] text-gray-400 font-semibold italic flex items-center justify-end">
                            <ShieldAlert className="w-3.5 h-3.5 mr-1 text-gray-300" />
                            Active Profile
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Remove user account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
