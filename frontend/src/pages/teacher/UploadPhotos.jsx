import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { albumService, studentService, photoService } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import {
  UploadCloud,
  Plus,
  FolderPlus,
  Search,
  Check,
  X,
  Sparkles,
  GraduationCap,
  ChevronRight,
  FolderOpen,
} from 'lucide-react';

const UploadPhotos = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Data lists
  const [albums, setAlbums] = useState([]);
  const [students, setStudents] = useState([]);

  // Selections
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [taggedStudents, setTaggedStudents] = useState([]);

  // Search & Filter for students tag list
  const [searchStudent, setSearchStudent] = useState('');
  const [classFilter, setClassFilter] = useState('');

  // Creation State toggles
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDate, setNewAlbumDate] = useState('');
  const [newAlbumCategory, setNewAlbumCategory] = useState('Annual Day');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');

  // Process states
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  // Fetch albums and students list
  const fetchData = async () => {
    try {
      setLoading(true);
      const [albumsRes, studentsRes] = await Promise.all([
        albumService.getAll(),
        studentService.getAll(),
      ]);

      if (albumsRes.success) setAlbums(albumsRes.albums);
      if (studentsRes.success) setStudents(studentsRes.students);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve albums or student directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle files selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Append to existing files selection
    setSelectedFiles((prev) => [...prev, ...files]);

    // Create preview URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...urls]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Toggle student tagging
  const handleToggleTag = (studentId) => {
    if (taggedStudents.includes(studentId)) {
      setTaggedStudents((prev) => prev.filter((id) => id !== studentId));
    } else {
      setTaggedStudents((prev) => [...prev, studentId]);
    }
  };

  // Create new album inside upload workflow
  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbumName || !newAlbumCategory) {
      alert('Event Name and Category are required.');
      return;
    }
    try {
      setLoading(true);
      const res = await albumService.create({
        eventName: newAlbumName,
        eventDate: newAlbumDate,
        category: newAlbumCategory,
        description: newAlbumDesc,
      });

      if (res.success) {
        alert('Album created successfully! You can now upload photos to it.');
        // Refresh albums list
        const refreshed = await albumService.getAll();
        if (refreshed.success) {
          setAlbums(refreshed.albums);
        }
        setSelectedAlbumId(res.album._id);
        setIsCreatingAlbum(false);
        // Clear inputs
        setNewAlbumName('');
        setNewAlbumDate('');
        setNewAlbumDesc('');
      }
    } catch (err) {
      alert('Failed to create album. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Submit files upload
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAlbumId) {
      setError('Please select an event album first.');
      return;
    }
    if (selectedFiles.length === 0) {
      setError('Please select at least one photograph to upload.');
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    setError('');

    try {
      const res = await photoService.upload(
        selectedAlbumId,
        taggedStudents,
        selectedFiles,
        (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentage);
        }
      );

      if (res.success) {
        alert('Photos uploaded successfully! Re-routing to Dashboard.');
        navigate('/teacher');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Photo upload process failed.');
      setLoading(false);
    }
  };

  // Filter students display based on search inputs
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
                          s.admissionNumber.toLowerCase().includes(searchStudent.toLowerCase());
    const matchesClass = classFilter === '' || s.class === classFilter;
    return matchesSearch && matchesClass;
  });

  const uniqueClasses = [...new Set(students.map((s) => s.class))].filter(Boolean);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-black text-brand-navy">Upload Event Photos</h2>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1">
            Build event libraries, upload bulk event snapshots, and tag students
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* STEP 1: Album Select & Create Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-premium p-6 space-y-4">
              <h3 className="font-extrabold text-base text-brand-navy flex items-center">
                <FolderOpen className="w-5 h-5 mr-2 text-indigo-500" />
                <span>1. Select Event Album</span>
              </h3>

              {!isCreatingAlbum ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">Choose Album *</label>
                    <select
                      value={selectedAlbumId}
                      onChange={(e) => setSelectedAlbumId(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-brand-orange text-xs font-semibold text-brand-navy"
                    >
                      <option value="">-- Choose Existing Album --</option>
                      {albums.map((album) => (
                        <option key={album._id} value={album._id}>
                          {album.eventName} ({album.category})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-bold uppercase">or</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCreatingAlbum(true)}
                    className="w-full py-3 rounded-2xl border border-dashed border-brand-orange hover:bg-orange-50/50 text-brand-orange font-extrabold text-xs flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Brand New Album</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateAlbum} className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-navy">Event Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Sports Day Extravaganza 2026"
                      value={newAlbumName}
                      onChange={(e) => setNewAlbumName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-brand-orange"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-navy">Category *</label>
                      <select
                        value={newAlbumCategory}
                        onChange={(e) => setNewAlbumCategory(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-brand-orange"
                      >
                        <option value="Annual Day">Annual Day</option>
                        <option value="Sports Day">Sports Day</option>
                        <option value="Festival Celebrations">Festival Celebrations</option>
                        <option value="Art Day">Art Day</option>
                        <option value="Classroom Activities">Classroom Activities</option>
                        <option value="Cultural Programs">Cultural Programs</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-navy">Event Date</label>
                      <input
                        type="date"
                        value={newAlbumDate}
                        onChange={(e) => setNewAlbumDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-navy">Description</label>
                    <textarea
                      placeholder="Summary details for parents..."
                      value={newAlbumDesc}
                      onChange={(e) => setNewAlbumDesc(e.target.value)}
                      rows="2"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none"
                    ></textarea>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingAlbum(false)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2.5 rounded-xl bg-brand-orange hover:bg-orange-600 text-white font-extrabold text-xs"
                    >
                      Create Album
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* STEP 2 & 3: File Upload and Tagging Panel */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleUploadSubmit} className="space-y-6">
              {/* Image Picker */}
              <div className="bg-white rounded-3xl border border-gray-200/80 shadow-premium p-6 space-y-4">
                <h3 className="font-extrabold text-base text-brand-navy flex items-center">
                  <UploadCloud className="w-5 h-5 mr-2 text-indigo-500" />
                  <span>2. Upload Event Snapshots</span>
                </h3>

                {/* Upload drag zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 hover:border-brand-blue/50 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-sky-50/10"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs font-extrabold text-brand-navy">Drag & Drop or Browse images</p>
                  <p className="text-[10px] text-gray-400 mt-1">Supports PNG, JPG, JPEG, WEBP. Max size 5MB/image.</p>
                </div>

                {/* File Previews */}
                {previewUrls.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-gray-500">Selected Photos ({selectedFiles.length})</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1 border rounded-xl">
                      {previewUrls.map((url, idx) => (
                        <div key={idx} className="relative aspect-square border rounded-xl overflow-hidden shadow-sm group">
                          <img src={url} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="absolute top-1 right-1 p-1 bg-black/60 text-white hover:bg-rose-600 rounded-full transition"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Student Tagging list */}
              <div className="bg-white rounded-3xl border border-gray-200/80 shadow-premium p-6 space-y-4">
                <h3 className="font-extrabold text-base text-brand-navy flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-indigo-500" />
                  <span>3. Tag Students (Milestone Linkage)</span>
                </h3>
                <p className="text-[10px] text-gray-400 leading-normal">
                  * Note: All photos uploaded in this batch will be tagged with the selected students. Choose children who are visible in these pictures.
                </p>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search student..."
                      value={searchStudent}
                      onChange={(e) => setSearchStudent(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-blue text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <select
                      value={classFilter}
                      onChange={(e) => setClassFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none text-xs font-semibold text-brand-navy"
                    >
                      <option value="">All Classes</option>
                      {uniqueClasses.map((c, i) => (
                        <option key={i} value={c}>Class {c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Checkbox multiselect grid */}
                <div className="max-h-56 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 p-1">
                  {filteredStudents.length === 0 ? (
                    <span className="col-span-2 text-center text-gray-400 italic text-[11px] py-4">No students matching criteria</span>
                  ) : (
                    filteredStudents.map((s) => {
                      const isTagged = taggedStudents.includes(s._id);
                      return (
                        <button
                          type="button"
                          key={s._id}
                          onClick={() => handleToggleTag(s._id)}
                          className={`flex items-center justify-between p-3 border rounded-xl transition text-left ${
                            isTagged
                              ? 'border-brand-blue bg-sky-50/20 text-brand-blue font-bold shadow-sm'
                              : 'border-gray-200 text-brand-charcoal hover:bg-gray-50'
                          }`}
                        >
                          <div className="overflow-hidden">
                            <h4 className="text-xs truncate">{s.name}</h4>
                            <span className="text-[10px] opacity-60">
                              {s.class}-{s.section} | {s.admissionNumber}
                            </span>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                            isTagged ? 'bg-brand-blue border-brand-blue text-white' : 'border-gray-300'
                          }`}>
                            {isTagged && <Check className="w-2.5 h-2.5" />}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Upload trigger panel */}
              <div className="bg-white rounded-3xl border border-gray-200/80 shadow-premium p-6 space-y-4">
                {loading && uploadProgress > 0 && (
                  <div className="space-y-1.5 animate-pulse">
                    <div className="flex items-center justify-between text-xs font-bold text-brand-blue">
                      <span>Uploading to portal...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-150 h-3 rounded-full overflow-hidden">
                      <div className="bg-brand-blue h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || selectedFiles.length === 0 || !selectedAlbumId}
                  className={`w-full py-4 rounded-2xl bg-brand-navy hover:bg-indigo-900 text-white font-extrabold text-sm shadow-md flex items-center justify-center space-x-2 transition ${
                    loading || selectedFiles.length === 0 || !selectedAlbumId ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading && uploadProgress === 0 ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-white" />
                      <span>Submit Batch for Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadPhotos;
