import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/store';
import { loadUser } from './redux/slices/authSlice';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BlogList from './pages/BlogList';
import BlogForm from './pages/BlogForm';
import BlogDetail from './pages/BlogDetail';
import PDFSummarizer from './pages/PDFSummarizer';
import GoogleScraper from './pages/GoogleScraper';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function AppContent() {
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route 
            path="/blogs/create" 
            element={
              <ProtectedRoute>
                <BlogForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/blogs/:id/edit" 
            element={
              <ProtectedRoute>
                <BlogForm />
              </ProtectedRoute>
            } 
          />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route 
            path="/pdf-summarizer" 
            element={
              <ProtectedRoute>
                <PDFSummarizer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/google-scraper" 
            element={
              <ProtectedRoute>
                <GoogleScraper />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
