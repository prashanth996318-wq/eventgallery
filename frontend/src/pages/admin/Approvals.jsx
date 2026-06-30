import React, { useState, useEffect } from 'react';
import { albumService, photoService } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import { Check, X, Calendar, User, Info, FolderOpen, Image } from 'lucide-react';

const Approvals = () => {
  const [pendingAlbums, setPendingAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const fetchPendingAlbums = async () => {
    try {
      setLoading(true);
      const res = await albumService.getAll({ approvalStatus: 'pending' });
      if (res.success) {
        setPendingAlbums(res.albums);
        if (res.albums.length > 0) {
          handleSelectAlbum(res.albums[0]);
        } else {
          setSelectedAlbum(null);
          setSelectedPhotos([]);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch pending albums.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAlbum = async (album) => {
    setSelectedAlbum(album);
    setPhotosLoading(true);
    setFeedback('');
    try {
      const res = await photoService.getAll({ albumId: album._id });
      if (res.success) {
        setSelectedPhotos(res.photos);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPhotosLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAlbums();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await albumService.approve(id);
      if (res.success) {
        alert('Album approved successfully.');
        fetchPendingAlbums();
      }
    } catch (err) {
      alert('Approval failed.');
    }
  };

  const handleReject = async (id) => {
    if (!feedback) {
      alert('Please write a feedback or reason for rejecting this album.');
      return;
    }
    try {
      const res = await albumService.reject(id, feedback);
      if (res.success) {
        alert('Album rejected.');
        fetchPendingAlbums();
      }
    } catch (err) {
      alert('Rejection failed.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-black text-brand-navy">Pending Approvals</h2>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1">
            Review event albums uploaded by teachers and approve/reject them for parent view
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white h-96 rounded-2xl animate-pulse"></div>
            <div className="lg:col-span-2 bg-white h-96 rounded-2xl animate-pulse"></div>
          </div>
        ) : pendingAlbums.length === 0 ? (
          <div className="glass-card rounded-3xl border border-dashed border-gray-300 p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-500">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-xl text-brand-navy">All Caught Up!</h3>
            <p className="text-gray-500 text-xs font-medium leading-relaxed">
              There are currently no event photo albums awaiting approval. When teachers submit new albums, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar list of pending albums */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="font-bold text-sm text-brand-navy uppercase tracking-wider px-1">Submitted Albums ({pendingAlbums.length})</h3>
              <div className="space-y-3">
                {pendingAlbums.map((album) => (
                  <button
                    key={album._id}
                    onClick={() => handleSelectAlbum(album)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all ${
                      selectedAlbum?._id === album._id
                        ? 'bg-brand-navy border-brand-navy text-white shadow-md'
                        : 'bg-white border-gray-200 hover:bg-gray-50 text-brand-charcoal'
                    }`}
                  >
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-brand-yellow text-brand-navy rounded-full mb-2">
                      {album.category}
                    </span>
                    <h4 className="font-bold text-sm line-clamp-1">{album.eventName}</h4>
                    <div className="flex items-center text-[10px] opacity-70 mt-3 space-x-3">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(album.eventDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {album.createdBy?.name?.split(' ')[0]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Album detail & Photos review panel */}
            <div className="lg:col-span-2">
              {selectedAlbum && (
                <div className="bg-white rounded-3xl border border-gray-200/80 shadow-premium overflow-hidden p-6 sm:p-8 space-y-6">
                  {/* Album Info */}
                  <div className="border-b border-gray-100 pb-5 space-y-2">
                    <span className="inline-block text-xs font-bold text-brand-orange">{selectedAlbum.category}</span>
                    <h3 className="text-2xl font-extrabold text-brand-navy">{selectedAlbum.eventName}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed font-medium">
                      {selectedAlbum.description || 'No description provided.'}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-400 pt-2">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-300" />
                        Event Date: {new Date(selectedAlbum.eventDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1 text-gray-300" />
                        Uploaded by: {selectedAlbum.createdBy?.name} ({selectedAlbum.createdBy?.email})
                      </span>
                    </div>
                  </div>

                  {/* Photos list */}
                  <div>
                    <h4 className="font-bold text-sm text-brand-navy mb-4 flex items-center">
                      <Image className="w-4 h-4 mr-2 text-indigo-500" />
                      <span>Uploaded Photos ({selectedPhotos.length})</span>
                    </h4>

                    {photosLoading ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="aspect-video bg-gray-200 rounded-xl animate-pulse"></div>
                        ))}
                      </div>
                    ) : selectedPhotos.length === 0 ? (
                      <div className="p-8 border border-dashed rounded-2xl text-center text-gray-400 text-xs font-medium">
                        This album contains no photos. Awaiting teacher upload.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {selectedPhotos.map((photo) => (
                          <div key={photo._id} className="relative rounded-xl overflow-hidden border border-gray-100 group shadow-sm bg-gray-50">
                            <img
                              src={photo.imageUrl}
                              alt="event snapshot"
                              className="w-full aspect-[4/3] object-cover"
                            />
                            {/* Hover student tags overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 flex flex-col justify-end text-white text-[10px]">
                              <p className="font-bold text-brand-yellow mb-1">Tagged Students:</p>
                              {photo.taggedStudents && photo.taggedStudents.length > 0 ? (
                                <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                                  {photo.taggedStudents.map((s) => (
                                    <span key={s._id} className="bg-white/20 px-1.5 py-0.5 rounded text-[8px] truncate max-w-[80px]">
                                      {s.name}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="italic opacity-80">No students tagged</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Approval Actions Panel */}
                  <div className="border-t border-gray-100 pt-6 space-y-4 bg-gray-50/50 p-5 rounded-2xl border">
                    <h4 className="font-bold text-sm text-brand-navy flex items-center">
                      <Info className="w-4 h-4 mr-2 text-brand-orange" />
                      <span>Review Action</span>
                    </h4>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500">Rejection Feedback / Notes (Required if Rejecting)</label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="e.g. Please tag student Kabir Malhotra in the second photo, or re-upload blur images."
                        rows="3"
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-brand-blue"
                      ></textarea>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => handleApprove(selectedAlbum._id)}
                        className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md shadow-emerald-100 transition flex items-center justify-center space-x-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve and Publish</span>
                      </button>
                      <button
                        onClick={() => handleReject(selectedAlbum._id)}
                        className="flex-1 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-md shadow-rose-100 transition flex items-center justify-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject Submission</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Approvals;
