import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, Check, X, Trash2, FolderOpen } from 'lucide-react';

const categoryCovers = {
  'Annual Day': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600',
  'Sports Day': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600',
  'Festival Celebrations': 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600',
  'Art Day': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600',
  'Classroom Activities': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600',
  'Cultural Programs': 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=600',
};

const AlbumCard = ({ album, userRole, onApprove, onReject, onDelete }) => {
  const formattedDate = new Date(album.eventDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const coverUrl = categoryCovers[album.category] || 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=600';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'pending':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const getLinkPath = () => {
    if (userRole === 'parent') {
      return `/parent/gallery/${album._id}`;
    } else if (userRole === 'teacher') {
      return `/teacher/albums/${album._id}`;
    }
    return `/admin/approvals`; // Admin handles it in approval list
  };

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-premium transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] flex flex-col h-full">
      {/* Cover Image container */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={coverUrl}
          alt={album.eventName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category Tag overlay */}
        <span className="absolute top-4 left-4 inline-block text-xs font-bold tracking-wider px-3 py-1.5 rounded-full bg-white/95 text-brand-navy shadow-sm backdrop-blur-sm border border-white/40">
          {album.category}
        </span>

        {/* Status Tag (Admin & Teacher see this) */}
        {userRole !== 'parent' && (
          <span className={`absolute top-4 right-4 inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border shadow-sm ${getStatusBadge(album.approvalStatus)}`}>
            {album.approvalStatus}
          </span>
        )}
      </div>

      {/* Album content body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-lg font-bold text-brand-navy group-hover:text-brand-blue transition-colors duration-200 line-clamp-1">
            {album.eventName}
          </h4>
          <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">
            {album.description || 'No description provided.'}
          </p>

          {/* Album meta info */}
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5 mr-2 text-indigo-400" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <User className="w-3.5 h-3.5 mr-2 text-indigo-400" />
              <span>By {album.createdBy?.name || 'Staff'}</span>
            </div>
          </div>
        </div>

        {/* Action button triggers based on role */}
        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          {userRole === 'parent' && (
            <Link
              to={getLinkPath()}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-sky-600 text-white font-semibold text-xs shadow-md shadow-sky-100 hover:shadow-lg transition-all duration-200"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Browse Photos</span>
            </Link>
          )}

          {userRole === 'teacher' && (
            <div className="flex items-center justify-between w-full">
              <Link
                to={getLinkPath()}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-brand-navy font-semibold text-xs hover:bg-gray-50 transition-colors duration-150"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </Link>
              <button
                onClick={() => onDelete(album._id)}
                className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-xs transition-colors duration-150"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}

          {userRole === 'admin' && (
            <div className="flex items-center w-full gap-2">
              {album.approvalStatus === 'pending' && (
                <>
                  <button
                    onClick={() => onApprove(album._id)}
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 px-2.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-all duration-150"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => onReject(album._id)}
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 px-2.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-all duration-150"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </>
              )}
              {album.approvalStatus !== 'pending' && (
                <button
                  onClick={() => onDelete(album._id)}
                  className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-xs transition-colors duration-150"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Album</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;
