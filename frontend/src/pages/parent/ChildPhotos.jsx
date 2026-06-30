import React, { useState, useEffect } from 'react';
import { photoService } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import { Download, Tag, Calendar, Heart, Image as ImageIcon, ExternalLink, Sparkles } from 'lucide-react';

const ChildPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [downloadingPhotoId, setDownloadingPhotoId] = useState(null);
  const [error, setError] = useState('');

  const categories = [
    'Annual Day',
    'Sports Day',
    'Festival Celebrations',
    'Art Day',
    'Classroom Activities',
    'Cultural Programs',
  ];

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const res = await photoService.getAll(); // Restricts to parent child photos in backend automatically
      if (res.success) {
        setPhotos(res.photos);
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve child photographs feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const downloadPhoto = async (imageUrl, photoId) => {
    setDownloadingPhotoId(photoId);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `FirstCry_Moments_${photoId || 'Milestone'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      window.open(imageUrl, '_blank');
    } finally {
      setDownloadingPhotoId(null);
    }
  };

  // Filter photos
  const filteredPhotos = photos.filter((p) => {
    return categoryFilter === '' || p.albumId?.category === categoryFilter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-brand-navy">My Child's Photo Feed</h2>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1">
              Unified chronological stream of all event photographs where your child is tagged
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-premium flex flex-col sm:flex-row gap-4 items-center justify-between">
          <span className="text-xs font-bold text-brand-navy flex items-center">
            <Heart className="w-4 h-4 mr-2 text-brand-pink fill-brand-pink" />
            <span>Memories Captured ({filteredPhotos.length})</span>
          </span>
          <div className="w-full sm:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-brand-blue text-xs font-semibold text-brand-navy"
            >
              <option value="">All Categories</option>
              {categories.map((c, idx) => (
                <option key={idx} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Photos Grid */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-500 font-semibold">Generating your child's timeline feed...</p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="glass-card rounded-3xl border border-dashed border-gray-300 p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto text-brand-pink">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-xl text-brand-navy">No Memories Tagged Yet</h3>
            <p className="text-gray-500 text-xs font-medium leading-relaxed">
              We did not find any approved event photographs tagged with your child's profile. Once teachers add new photographs and tag your children, they will appear immediately.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo._id}
                className="bg-white rounded-3xl border border-gray-200/80 shadow-premium overflow-hidden flex flex-col justify-between group hover:shadow-xl transition duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                  <img
                    src={photo.imageUrl}
                    alt="child moment"
                    className="w-full h-full object-cover transition duration-300"
                  />
                  {/* Category Pill Tag Overlay */}
                  <span className="absolute top-4 left-4 inline-block text-[10px] font-extrabold tracking-wide px-2.5 py-1 bg-brand-navy text-white rounded-full shadow-sm">
                    {photo.albumId?.category}
                  </span>
                </div>

                {/* Info and download actions footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-3">
                  <div>
                    <h4 className="font-bold text-brand-navy text-sm line-clamp-1">{photo.albumId?.eventName}</h4>
                    <div className="flex items-center text-[10px] text-gray-400 font-medium mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{photo.albumId?.eventDate ? new Date(photo.albumId.eventDate).toLocaleDateString() : 'Recent'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-gray-200/50 pt-3">
                    <div className="flex items-center space-x-1.5">
                      <Tag className="w-3.5 h-3.5 text-brand-pink fill-brand-pink" />
                      <span className="text-[10px] font-bold text-brand-pink">
                        {photo.taggedStudents?.map((s) => s.name.split(' ')[0]).join(', ')}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={photo.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 border bg-white border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition shadow-sm"
                        title="Open image"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => downloadPhoto(photo.imageUrl, photo._id)}
                        disabled={downloadingPhotoId === photo._id}
                        className="px-3.5 py-2 bg-brand-pink hover:bg-rose-600 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-100 hover:shadow-lg transition-all flex items-center gap-1.5"
                      >
                        {downloadingPhotoId === photo._id ? (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ChildPhotos;
