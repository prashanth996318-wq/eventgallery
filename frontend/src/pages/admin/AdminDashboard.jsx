import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { albumService } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import {
  FileText,
  Clock,
  CheckCircle,
  Users,
  Image,
  Calendar,
  Eye,
  Check,
  X,
  GraduationCap,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsRes = await albumService.getStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
      }

      const albumsRes = await albumService.getAll({ limit: 5 });
      if (albumsRes.success) {
        setRecentAlbums(albumsRes.albums.slice(0, 5));
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await albumService.approve(id);
      if (res.success) {
        fetchDashboardData();
      }
    } catch (err) {
      alert('Failed to approve album.');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please specify the reason for rejection:');
    if (reason === null) return; // cancelled
    try {
      const res = await albumService.reject(id, reason);
      if (res.success) {
        fetchDashboardData();
      }
    } catch (err) {
      alert('Failed to reject album.');
    }
  };

  if (loading && !stats) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-brand-navy">Administrator Hub</h2>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1">
              Control center for reviewing uploads, managing students, and monitoring users
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-brand-navy rounded-xl text-xs font-bold transition-all border border-indigo-100"
          >
            Refresh Metrics
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        {/* Stats Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Event Albums"
            value={stats?.totalAlbums || 0}
            icon={FileText}
            colorClass="bg-blue-50 text-brand-blue"
            borderClass="border-blue-100"
          />
          <StatCard
            title="Pending Approvals"
            value={stats?.pendingAlbums || 0}
            icon={Clock}
            colorClass="bg-amber-50 text-brand-orange"
            borderClass="border-amber-100"
          />
          <StatCard
            title="Registered Students"
            value={stats?.totalStudents || 0}
            icon={GraduationCap}
            colorClass="bg-indigo-50 text-indigo-600"
            borderClass="border-indigo-100"
          />
          <StatCard
            title="Total Event Photos"
            value={stats?.totalPhotos || 0}
            icon={Image}
            colorClass="bg-rose-50 text-brand-pink"
            borderClass="border-rose-100"
          />
        </div>

        {/* Sub-stats for users */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-gray-100 bg-white flex items-center space-x-4 shadow-sm">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total User Profiles</p>
              <h4 className="text-xl font-bold text-brand-navy">{stats?.totalUsers || 0}</h4>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-gray-100 bg-white flex items-center space-x-4 shadow-sm">
            <div className="p-3 bg-amber-50 text-brand-orange rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Teachers</p>
              <h4 className="text-xl font-bold text-brand-navy">{stats?.totalTeachers || 0}</h4>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-gray-100 bg-white flex items-center space-x-4 shadow-sm">
            <div className="p-3 bg-sky-50 text-brand-blue rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Parents</p>
              <h4 className="text-xl font-bold text-brand-navy">{stats?.totalParents || 0}</h4>
            </div>
          </div>
        </div>

        {/* Recent Albums & Actions */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-premium overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-brand-navy">Recent Event Albums</h3>
              <p className="text-xs text-gray-500 mt-0.5">Summary of the latest event albums added by teachers</p>
            </div>
            <Link
              to="/admin/approvals"
              className="text-xs font-bold text-brand-blue hover:text-sky-600 hover:underline transition"
            >
              View All Approvals
            </Link>
          </div>

          {recentAlbums.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No albums uploaded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-brand-navy text-[10px] font-bold tracking-wider uppercase border-b border-gray-100">
                    <th className="py-4 px-6">Event Name</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Created By</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentAlbums.map((album) => (
                    <tr key={album._id} className="text-xs font-medium text-gray-600 hover:bg-gray-50/50 transition">
                      <td className="py-4 px-6 font-bold text-brand-navy">{album.eventName}</td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg text-[10px]">
                          {album.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 flex items-center gap-1.5 pt-4">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{new Date(album.eventDate).toLocaleDateString()}</span>
                      </td>
                      <td className="py-4 px-6">{album.createdBy?.name || 'Teacher'}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2 py-0.5 font-bold uppercase rounded text-[9px] ${
                            album.approvalStatus === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : album.approvalStatus === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {album.approvalStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center space-x-2">
                          {album.approvalStatus === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleApprove(album._id)}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(album._id)}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-400 italic text-[10px]">Audited</span>
                          )}
                        </div>
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

export default AdminDashboard;
