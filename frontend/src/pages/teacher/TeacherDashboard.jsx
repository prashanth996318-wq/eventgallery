import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { albumService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import AlbumCard from '../../components/AlbumCard';
import StatCard from '../../components/StatCard';
import { FileText, Clock, CheckCircle, Image, Plus, HelpCircle, AlertTriangle } from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const res = await albumService.getAll();
      if (res.success) {
        // Teachers see all albums, but we filter or sort them
        setAlbums(res.albums);
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve albums.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleDeleteAlbum = async (id) => {
    if (!window.confirm('Are you sure you want to delete this album and all its photos? This action cannot be undone.')) return;
    try {
      const res = await albumService.delete(id);
      if (res.success) {
        alert('Album deleted successfully.');
        fetchAlbums();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Delete album failed.');
    }
  };

  // Compute teacher statistics based on loaded albums list
  const totalAlbums = albums.length;
  const myAlbums = albums.filter((a) => a.createdBy?._id === user.id);
  const pendingCount = myAlbums.filter((a) => a.approvalStatus === 'pending').length;
  const approvedCount = myAlbums.filter((a) => a.approvalStatus === 'approved').length;
  const rejectedAlbums = myAlbums.filter((a) => a.approvalStatus === 'rejected');

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-brand-navy">Teacher Hub</h2>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1">
              Create student event albums, upload pictures, and manage media publications
            </p>
          </div>
          <Link
            to="/teacher/upload"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-brand-orange hover:bg-orange-600 text-white font-extrabold text-sm shadow-md shadow-orange-100 transition-all hover:translate-y-[-1px]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Album / Upload</span>
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="My Uploaded Albums"
            value={myAlbums.length}
            icon={FileText}
            colorClass="bg-orange-50 text-brand-orange"
            borderClass="border-orange-100"
          />
          <StatCard
            title="Awaiting Approval"
            value={pendingCount}
            icon={Clock}
            colorClass="bg-amber-50 text-amber-500"
            borderClass="border-amber-100"
          />
          <StatCard
            title="Approved & Published"
            value={approvedCount}
            icon={CheckCircle}
            colorClass="bg-emerald-50 text-emerald-500"
            borderClass="border-emerald-100"
          />
        </div>

        {/* Rejected feedback notifications */}
        {rejectedAlbums.length > 0 && (
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 space-y-3">
            <h4 className="text-rose-800 font-extrabold text-sm flex items-center">
              <AlertTriangle className="w-4.5 h-4.5 mr-2 text-rose-600 animate-bounce" />
              <span>Albums Requiring Revisions ({rejectedAlbums.length})</span>
            </h4>
            <ul className="space-y-2 text-xs font-medium text-rose-700 divide-y divide-rose-100/50">
              {rejectedAlbums.map((a) => (
                <li key={a._id} className="pt-2 first:pt-0">
                  <span className="font-bold">{a.eventName}</span> was rejected. <br />
                  <span className="text-[10px] italic text-gray-500">Reason: "{a.rejectionReason || 'No details provided.'}"</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Teacher's albums collection */}
        <div>
          <h3 className="font-bold text-sm text-brand-navy uppercase tracking-wider px-1 mb-5">All Photo Galleries ({albums.length})</h3>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-gray-500 font-semibold">Loading galleries...</p>
            </div>
          ) : albums.length === 0 ? (
            <div className="glass-card rounded-3xl border border-dashed border-gray-300 p-12 text-center max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto text-brand-orange">
                <Image className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-xl text-brand-navy">Create your first Album</h3>
              <p className="text-gray-500 text-xs font-medium leading-relaxed">
                Add an event like sports activities, festival celebrations, and start uploading tagged photographs for parents to view.
              </p>
              <Link
                to="/teacher/upload"
                className="inline-flex px-5 py-2.5 rounded-full bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs"
              >
                Start Uploading
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <AlbumCard
                  key={album._id}
                  album={album}
                  userRole="teacher"
                  onDelete={handleDeleteAlbum}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
