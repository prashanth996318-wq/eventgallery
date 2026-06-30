import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { albumService, photoService } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import AlbumCard from '../../components/AlbumCard';
import {
  Search,
  Calendar,
  User,
  ArrowLeft,
  Download,
  Image,
  Tag,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const Gallery = () => {
  const { id } = useParams(); // Selected album ID (optional)
  const navigate = useNavigate();

  // Data lists
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);

  // States
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
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

  // Fetch albums catalog
  const fetchAlbumsCatalog = async () => {
    try {
      setLoading(true);
      const res = await albumService.getAll();
      if (res.success) {
        setAlbums(res.albums);
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve school event albums.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific album details and photos
  const fetchAlbumPhotos = async (albumId) => {
    try {
      setLoading(true);
      const [albumRes, photosRes] = await Promise.all([
        albumService.getById(albumId),
        photoService.getAll({ albumId }), // Secure endpoint filters based on parent role
      ]);

      if (albumRes.success) setSelectedAlbum(albumRes.album);
      if (photosRes.success) setPhotos(photosRes.photos);
    } catch (err) {
      console.error(err);
      setError('Access restricted. Verify authorization to view this event.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAlbumPhotos(id);
    } else {
      setSelectedAlbum(null);
      setPhotos([]);
      fetchAlbumsCatalog();
    }
  }, [id]);

  // Download photo file helper (fetches Blob to trigger actual disk download)
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
      console.error('File blob download failure, opening URL in new window instead:', err);
      window.open(imageUrl, '_blank');
    } finally {
      setDownloadingPhotoId(null);
    }
  };

  // Filter Catalog logic
  const filteredAlbums = albums.filter((album) => {
    const matchesSearch = album.eventName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || album.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Render album list view
  const renderCatalog = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-brand-navy">Preschool Event Gallery</h2>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1">
          Explore approved albums of school activities, cultural festivals, and annual milestones
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* Filters UI */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="p-4 rounded-3xl bg-white border border-gray-200/80 shadow-premium max-w-md relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search event by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2 text-xs font-medium border border-gray-150 rounded-2xl focus:outline-none focus:border-brand-blue"
          />
        </div>

        {/* Categories horizontal pill list */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              selectedCategory === ''
                ? 'bg-brand-navy text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            All Events
          </button>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Albums Grid */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-gray-500 font-semibold">Loading albums directory...</p>
        </div>
      ) : filteredAlbums.length === 0 ? (
        <div className="p-12 text-center text-gray-400 text-xs font-semibold">
          No published albums match your search query or category filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album) => (
            <AlbumCard
              key={album._id}
              album={album}
              userRole="parent"
            />
          ))}
        </div>
      )}
    </div>
  );

  // Render detail photo view
  const renderDetail = () => (
    <div className="space-y-6 animate-fade-in">
      <Link to="/parent/gallery" className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-brand-blue transition">
        <ArrowLeft className="w-4 h-4 mr-1" />
        <span>Back to Albums</span>
      </Link>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {selectedAlbum && (
        <div className="space-y-8">
          {/* Header Card */}
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-premium p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-block px-3 py-1 bg-sky-100 text-brand-blue text-xs font-bold rounded-full border border-sky-200">
                {selectedAlbum.category}
              </span>
              <span className="text-[10px] text-gray-400 font-bold flex items-center">
                <Sparkles className="w-3.5 h-3.5 text-brand-pink fill-brand-pink mr-1" />
                <span>Authorized Media Access</span>
              </span>
            </div>
            <h2 className="text-3xl font-black text-brand-navy">{selectedAlbum.eventName}</h2>
            <p className="text-gray-500 text-xs font-medium leading-relaxed max-w-3xl">{selectedAlbum.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400 pt-2 border-t border-gray-50">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5 text-gray-300" />
                Event Date: {new Date(selectedAlbum.eventDate).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1.5 text-gray-300" />
                Published by: Miss Clara Smith
              </span>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-brand-navy uppercase tracking-wider px-1">Child Tagged Photographs</h3>
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-xs text-gray-500 font-semibold">Loading media gallery...</p>
              </div>
            ) : photos.length === 0 ? (
              <div className="p-12 text-center border rounded-3xl bg-white max-w-lg mx-auto space-y-3">
                <Image className="w-12 h-12 text-gray-300 mx-auto" />
                <h4 className="font-extrabold text-sm text-brand-navy">No Photos Found</h4>
                <p className="text-xs text-gray-400 font-medium">
                  We did not find any photos from this event containing tags for your linked children. General highlights may be published separately.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                  <div key={photo._id} className="relative rounded-3xl overflow-hidden border border-gray-200/80 shadow-premium bg-white group flex flex-col justify-between">
                    {/* Cover image area */}
                    <div className="relative overflow-hidden aspect-[4/3] bg-gray-50">
                      <img
                        src={photo.imageUrl}
                        alt="preschool snapshot"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-101"
                      />
                      {/* Tag Badge indicator */}
                      <span className="absolute bottom-4 left-4 inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-bold text-brand-pink border shadow-sm">
                        <Tag className="w-3 h-3 text-brand-pink" />
                        <span>Tagged Child</span>
                      </span>
                    </div>

                    {/* Bottom action zone */}
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                      <div className="max-w-[120px] overflow-hidden">
                        <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-wide">Visible Kids:</span>
                        <div className="flex gap-1 truncate text-[10px] text-brand-navy font-bold">
                          {photo.taggedStudents?.map((s) => s.name.split(' ')[0]).join(', ')}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {/* Open in tab */}
                        <a
                          href={photo.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 border bg-white border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition shadow-sm"
                          title="Open full image"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        {/* Download button */}
                        <button
                          onClick={() => downloadPhoto(photo.imageUrl, photo._id)}
                          disabled={downloadingPhotoId === photo._id}
                          className="px-3.5 py-2 bg-brand-blue hover:bg-sky-600 text-white rounded-xl font-bold text-xs shadow-md shadow-sky-100 hover:shadow-lg transition-all flex items-center gap-1.5"
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
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      {id ? renderDetail() : renderCatalog()}
    </DashboardLayout>
  );
};

export default Gallery;
