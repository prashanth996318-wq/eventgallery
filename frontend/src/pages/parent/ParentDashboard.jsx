import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { albumService, photoService, studentService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import AlbumCard from '../../components/AlbumCard';
import StatCard from '../../components/StatCard';
import { Image, FolderHeart, Award, Eye, Calendar, Sparkles, GraduationCap } from 'lucide-react';

const ParentDashboard = () => {
  const { user } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [myPhotos, setMyPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchParentData = async () => {
    try {
      setLoading(true);
      const [albumsRes, photosRes] = await Promise.all([
        albumService.getAll(),
        photoService.getAll(), // Parent role restricts this automatically in backend to tagged child photos!
      ]);

      if (albumsRes.success) setAlbums(albumsRes.albums.slice(0, 3)); // show top 3 recent approved albums
      if (photosRes.success) setMyPhotos(photosRes.photos);
    } catch (err) {
      console.error(err);
      setError('Could not load portal dashboard. Please verify connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParentData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-brand-navy">Parent Portal</h2>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1">
              View authorized milestone albums and tagged photos representing your children
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        {/* Linked Children Profile Cards */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-brand-navy uppercase tracking-wider px-1">My Registered Children</h3>
          {user?.linkedStudents?.length === 0 ? (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-medium text-brand-orange leading-relaxed">
              <strong>Account link pending:</strong> You haven't linked any child profiles during registration. Please request school administration to link your student admission number: <strong>{user?.email}</strong>.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user?.linkedStudents?.map((student) => (
                <div
                  key={student._id}
                  className="bg-white rounded-3xl border border-gray-200/80 shadow-premium p-6 flex items-center gap-5 hover:scale-[1.01] transition-transform duration-200"
                >
                  <img
                    src={student.studentPhoto || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200'}
                    alt={student.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-brand-blue shadow-md"
                  />
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-brand-navy">{student.name}</h4>
                    <div className="flex items-center space-x-2 text-xs font-semibold">
                      <span className="text-brand-blue">Class: {student.class} ({student.section})</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-400">Admission Code: {student.admissionNumber}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dashboard Stat Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatCard
            title="Total Approved Events"
            value={albums.length}
            icon={Image}
            colorClass="bg-blue-50 text-brand-blue"
            borderClass="border-blue-100"
          />
          <StatCard
            title="My Child's Tagged Photos"
            value={myPhotos.length}
            icon={FolderHeart}
            colorClass="bg-pink-50 text-brand-pink"
            borderClass="border-pink-100"
          />
        </div>

        {/* Recent Albums & Gallery links */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-sm text-brand-navy uppercase tracking-wider">Recently Published Albums</h3>
            <Link
              to="/parent/gallery"
              className="text-xs font-bold text-brand-blue hover:text-sky-600 transition"
            >
              See All Albums
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-gray-500 font-semibold">Retrieving gallery updates...</p>
            </div>
          ) : albums.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 border rounded-2xl text-gray-400 text-xs font-medium">
              No approved school albums published yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <AlbumCard
                  key={album._id}
                  album={album}
                  userRole="parent"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
