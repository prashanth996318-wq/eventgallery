import React, { useState, useEffect } from 'react';
import { studentService, authService } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import { Search, Plus, Edit2, Trash2, GraduationCap, X, User } from 'lucide-react';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [error, setError] = useState('');

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null); // null means Creating, otherwise Editing

  // Form Fields
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [parentId, setParentId] = useState('');
  const [studentPhoto, setStudentPhoto] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await studentService.getAll();
      if (res.success) {
        setStudents(res.students);
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve students.');
    } finally {
      setLoading(false);
    }
  };

  const fetchParents = async () => {
    try {
      const res = await authService.getUsers();
      if (res.success) {
        const parentUsers = res.users.filter((u) => u.role === 'parent');
        setParents(parentUsers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchParents();
  }, []);

  const handleOpenCreateModal = () => {
    setEditStudent(null);
    setName('');
    setClassName('');
    setSection('');
    setAdmissionNumber('');
    setParentId('');
    setStudentPhoto('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setEditStudent(student);
    setName(student.name);
    setClassName(student.class);
    setSection(student.section);
    setAdmissionNumber(student.admissionNumber);
    setParentId(student.parentId?._id || student.parentId || '');
    setStudentPhoto(student.studentPhoto || '');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student record?')) return;
    try {
      const res = await studentService.delete(id);
      if (res.success) {
        fetchStudents();
      }
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !className || !section || !admissionNumber) {
      alert('Please fill in all required fields.');
      return;
    }

    const payload = {
      name,
      class: className,
      section,
      admissionNumber,
      parentId: parentId || null,
      studentPhoto: studentPhoto || '',
    };

    try {
      if (editStudent) {
        // Edit Mode
        const res = await studentService.update(editStudent._id, payload);
        if (res.success) {
          alert('Student updated successfully.');
          setModalOpen(false);
          fetchStudents();
        }
      } else {
        // Create Mode
        const res = await studentService.create(payload);
        if (res.success) {
          alert('Student added successfully.');
          setModalOpen(false);
          fetchStudents();
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save student.');
    }
  };

  // Filter students based on search query & class filter
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === '' || student.class === classFilter;
    return matchesSearch && matchesClass;
  });

  // Extract unique classes for filters
  const uniqueClasses = [...new Set(students.map((s) => s.class))].filter(Boolean);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-brand-navy">Student Directory</h2>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1">
              Add, update, and manage student accounts and link parent connections
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-brand-blue hover:bg-sky-600 text-white font-extrabold text-sm shadow-md shadow-sky-100 transition-all hover:translate-y-[-1px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        {/* Filters Panel */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-premium flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name or admission number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-sky-100 text-xs font-medium transition"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-brand-blue text-xs font-semibold text-brand-navy"
            >
              <option value="">All Classes</option>
              {uniqueClasses.map((cls, idx) => (
                <option key={idx} value={cls}>
                  Class {cls}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Directory List Table */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-premium overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-gray-500 font-semibold">Loading student records...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-xs font-medium">
              No students found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-brand-navy text-[10px] font-bold tracking-wider uppercase border-b border-gray-100">
                    <th className="py-4 px-6">Profile</th>
                    <th className="py-4 px-6">Admission No</th>
                    <th className="py-4 px-6">Class / Sec</th>
                    <th className="py-4 px-6">Linked Parent</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student) => (
                    <tr key={student._id} className="text-xs font-medium text-gray-600 hover:bg-gray-50/50 transition">
                      <td className="py-4 px-6 flex items-center space-x-3">
                        <img
                          src={student.studentPhoto || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100'}
                          alt={student.name}
                          className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm"
                        />
                        <span className="font-bold text-brand-navy">{student.name}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono text-gray-500 font-semibold">{student.admissionNumber}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-indigo-600">
                          {student.class} - {student.section}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {student.parentId ? (
                          <div className="flex flex-col">
                            <span className="font-bold text-brand-navy">{student.parentId.name}</span>
                            <span className="text-[10px] text-gray-400">{student.parentId.email}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-[10px]">Unlinked</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(student)}
                            className="p-1.5 text-brand-blue hover:bg-sky-50 rounded-lg transition"
                            title="Edit student"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student._id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* CREATE & EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative z-10 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-extrabold text-xl text-brand-navy mb-6 flex items-center">
              <GraduationCap className="w-6 h-6 mr-2 text-brand-blue" />
              <span>{editStudent ? 'Edit Student Details' : 'Add New Student'}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-navy">Student Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Aanya Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-sky-100 text-xs font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-navy">Class *</label>
                  <input
                    type="text"
                    placeholder="e.g. Nursery"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-blue text-xs font-semibold"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-navy">Section *</label>
                  <input
                    type="text"
                    placeholder="e.g. A"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-blue text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-navy">Admission Number *</label>
                <input
                  type="text"
                  placeholder="e.g. FC1001"
                  value={admissionNumber}
                  onChange={(e) => setAdmissionNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-blue text-xs font-semibold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-navy flex items-center">
                  <User className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  <span>Link Parent Account (Optional)</span>
                </label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-blue text-xs font-semibold text-brand-navy"
                >
                  <option value="">-- Select Parent User --</option>
                  {parents.map((parent) => (
                    <option key={parent._id} value={parent._id}>
                      {parent.name} ({parent.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-navy">Student Photo URL (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. https://example.com/photo.jpg"
                  value={studentPhoto}
                  onChange={(e) => setStudentPhoto(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-blue text-xs font-semibold"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-brand-navy font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-brand-blue hover:bg-sky-600 text-white font-extrabold text-xs transition"
                >
                  {editStudent ? 'Update Details' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentManagement;
