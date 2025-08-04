import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import BookListPage from './pages/BookListPage';
import BookDetailPage from './pages/BookDetailPage';
import UserCheckoutsPage from './pages/UserCheckoutsPage';
import CheckoutManagementPage from './pages/CheckoutManagementPage';
import UserManagementPage from './pages/UserManagementPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Public routes */}
          <Route element={<ProtectedRoute allowedRoles={['student', 'librarian']} />}>
            <Route path="/" element={<BookListPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
          </Route>
          
          {/* Student-only routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/checkouts" element={<UserCheckoutsPage />} />
          </Route>
          
          {/* Librarian-only routes */}
          <Route element={<ProtectedRoute allowedRoles={['librarian']} />}>
            <Route path="/users" element={<UserManagementPage />} />
            <Route path="/checkouts" element={<CheckoutManagementPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

