import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { albumService, photoService, studentService } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import { Trash2, Plus, Calendar, User, Eye, ArrowLeft, Image, Tag, Check, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ManageAlbums = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Core Data
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [students, setStudents] = useState([]);

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Quick Upload Form States
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadPreviews, setUploadPreviews] = useState([]);
  const [uploadTags, setUploadTags] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [searchStudent, setSearchStudent] = useState('');

  const fetchAlbumDetails = async () => {
    try {
      setLoading(true);
      const [albumRes, photosRes, studentsRes] = await Promise.all([
        albumService.getById(id),
        photoService.getAll({ albumId: id }),
        studentService.getAll(),
      ]);

      if (albumRes.success) setAlbum(albumRes.album);
      if (photosRes.success) setPhotos(photosRes.photos);
      if (studentsRes.success) setStudents(studentsRes.students);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve album information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbumDetails();
  }, [id]);

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Remove this photo from the album?')) return;
    try {
      const res = await photoService.delete(photoId);
      if (res.success) {
        alert('Photo deleted.');
        fetchAlbumDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete photo.');
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadFiles((prev) => [...prev, ...files]);
    const urls = files.map((f) => URL.createObjectURL(f));
    setUploadPreviews((prev) => [...prev, ...urls]);
  };

  const handleRemoveFile = (index) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleTag = (studentId) => {
    if (uploadTags.includes(studentId)) {
      setUploadTags((prev) => prev.filter((id) => id !== studentId));
    } else {
      setUploadTags((prev) => [...prev, studentId]);
    }
  };

  const handleQuickUpload = async (e) => {
    e.preventDefault();
    if (uploadFiles.length === 0) return;

    setUploading(true);
    try {
      const res = await photoService.upload(id, uploadTags, uploadFiles);
      if (res.success) {
        alert('Photos added successfully.');
        setShowUpload(false);
        setUploadFiles([]);
        setUploadPreviews([]);
        setUploadTags([]);
        fetchAlbumDetails();
      }
    } catch (err) {
      alert('Failed to upload photos.');
    } finally {
      setUploading(false);
    }
  };

  // Filter students
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
    s.admissionNumber.toLowerCase().includes(searchStudent.toLowerCase())
  );

  if (loading && !album) {
    return (
      <DashboardLayout>
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
          <div className="h-44 bg-gray-200 rounded-3xl"></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isOwner = album?.createdBy?._id === user.id || user.role === 'admin';

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Back navigation */}
        <Link to="/teacher" className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-brand-orange transition">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Hub</span>
        </Link>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        {album && (
          <div className="space-y-8">
            {/* Album Jumbotron Header */}
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-premium p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="inline-block px-3 py-1 bg-orange-100 text-brand-orange text-xs font-bold rounded-full border border-orange-200">
                    {album.category}
                  </span>
                  <span className={`inline-block px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full border ${
                    album.approvalStatus === 'approved'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : album.approvalStatus === 'rejected'
                      ? 'bg-rose-100 text-rose-800 border-rose-200'
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    {album.approvalStatus}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-brand-navy">{album.eventName}</h2>
                <p className="text-gray-500 text-xs font-medium leading-relaxed max-w-2xl">{album.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400 pt-2">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5 text-gray-300" />
                    {new Date(album.eventDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1.5 text-gray-300" />
                    Created by: {album.createdBy?.name || 'Staff'}
                  </span>
                </div>
              </div>

              {isOwner && (
                <button
                  onClick={() => setShowUpload(!showUpload)}
                  className="px-5 py-3 rounded-2xl bg-brand-orange hover:bg-orange-600 text-white font-extrabold text-sm shadow-md shadow-orange-100 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photos</span>
                </button>
              )}
            </div>

            {/* Rejection notice details */}
            {album.approvalStatus === 'rejected' && album.rejectionReason && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-xs font-medium text-rose-800 flex items-start gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Album Revision Required</h4>
                  <p className="mt-1 text-rose-700">Audit feedback: "{album.rejectionReason}"</p>
                </div>
              </div>
            )}

            {/* Quick Upload drawer overlay */}
            {showUpload && (
              <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-premium space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-bold text-sm text-brand-navy">Add Photos to Album</h3>
                  <button onClick={() => setShowUpload(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleQuickUpload} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pick files */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-brand-navy">Select Images</label>
                      <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full text-xs" />
                      {uploadPreviews.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto border p-2 rounded-xl">
                          {uploadPreviews.map((p, idx) => (
                            <div key={idx} className="relative aspect-square border rounded-lg overflow-hidden shadow-sm">
                              <img src={p} alt="preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(idx)}
                                className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 text-white rounded-full"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tag students */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-brand-navy">Tag Students</label>
                      <input
                        type="text"
                        placeholder="Search student name..."
                        value={searchStudent}
                        onChange={(e) => setSearchStudent(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border text-xs"
                      />
                      <div className="max-h-36 overflow-y-auto border p-2 rounded-xl space-y-1.5">
                        {filteredStudents.map((s) => {
                          const isTagged = uploadTags.includes(s._id);
                          return (
                            <button
                              type="button"
                              key={s._id}
                              onClick={() => handleToggleTag(s._id)}
                              className={`w-full flex items-center justify-between text-left p-1.5 rounded border text-[11px] font-medium ${
                                isTagged ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-transparent text-gray-600'
                              }`}
                            >
                              <span>{s.name} ({s.class}-{s.section})</span>
                              {isTagged && <Check className="w-3 h-3 text-indigo-700" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowUpload(false)}
                      className="px-4 py-2 border rounded-xl text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading || uploadFiles.length === 0}
                      className="px-4 py-2 bg-brand-orange hover:bg-orange-600 text-white rounded-xl text-xs font-bold"
                    >
                      {uploading ? 'Uploading...' : 'Upload Photos'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Photos Grid Display */}
            <div>
              <h3 className="font-bold text-sm text-brand-navy uppercase tracking-wider px-1 mb-5">Album Photos ({photos.length})</h3>

              {photos.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed rounded-3xl text-gray-400 text-sm max-w-xl mx-auto space-y-4">
                  <Image className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="font-semibold text-brand-navy">No Photos in Album</p>
                  <p className="text-xs">Start by uploading some snapshots from the event.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {photos.map((photo) => (
                    <div key={photo._id} className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-premium bg-white group flex flex-col justify-between">
                      <div className="relative overflow-hidden aspect-[4/3] bg-gray-50">
                        <img
                          src={photo.imageUrl}
                          alt="event photograph"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                        />
                        {/* Hover Overlay for Tag list */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4 flex flex-col justify-end text-white text-[10px]">
                          <p className="font-bold text-brand-yellow flex items-center mb-1">
                            <Tag className="w-3.5 h-3.5 mr-1" />
                            Tagged Students:
                          </p>
                          {photo.taggedStudents && photo.taggedStudents.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                              {photo.taggedStudents.map((s) => (
                                <span key={s._id} className="bg-white/20 px-1.5 py-0.5 rounded text-[8px] truncate max-w-[90px]">
                                  {s.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="italic opacity-80 text-[9px]">General Photo</p>
                          )}
                        </div>
                      </div>

                      {/* Photo Footer actions */}
                      {isOwner && (
                        <div className="p-2 border-t border-gray-100 flex justify-end bg-gray-50/50">
                          <button
                            onClick={() => handleDeletePhoto(photo._id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageAlbums;
