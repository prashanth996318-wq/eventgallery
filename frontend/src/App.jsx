import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Approvals from './pages/admin/Approvals';
import StudentManagement from './pages/admin/StudentManagement';
import UserManagement from './pages/admin/UserManagement';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import UploadPhotos from './pages/teacher/UploadPhotos';
import ManageAlbums from './pages/teacher/ManageAlbums';

// Parent Pages
import ParentDashboard from './pages/parent/ParentDashboard';
import Gallery from './pages/parent/Gallery';
import ChildPhotos from './pages/parent/ChildPhotos';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Dashboard Protected Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/approvals"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <Approvals />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <StudentManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <UserManagement />
              </PrivateRoute>
            }
          />

          {/* Teacher Hub Protected Routes */}
          <Route
            path="/teacher"
            element={
              <PrivateRoute allowedRoles={['teacher', 'admin']}>
                <TeacherDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher/upload"
            element={
              <PrivateRoute allowedRoles={['teacher', 'admin']}>
                <UploadPhotos />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher/albums/:id"
            element={
              <PrivateRoute allowedRoles={['teacher', 'admin']}>
                <ManageAlbums />
              </PrivateRoute>
            }
          />

          {/* Parent Portal Protected Routes */}
          <Route
            path="/parent"
            element={
              <PrivateRoute allowedRoles={['parent']}>
                <ParentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/parent/gallery"
            element={
              <PrivateRoute allowedRoles={['parent']}>
                <Gallery />
              </PrivateRoute>
            }
          />
          <Route
            path="/parent/gallery/:id"
            element={
              <PrivateRoute allowedRoles={['parent']}>
                <Gallery />
              </PrivateRoute>
            }
          />
          <Route
            path="/parent/child-photos"
            element={
              <PrivateRoute allowedRoles={['parent']}>
                <ChildPhotos />
              </PrivateRoute>
            }
          />

          {/* Redirect undefined routes to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
