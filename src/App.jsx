import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';
import { supabase } from './supabase/client';
import ProtectedRoute from './components/ProtectedRoute';
import { useState } from 'react';

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  const hideNav = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div>
      {!hideNav && (
        <nav style={{
          padding: '1rem',
          backgroundColor: '#3498db',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          {/* Logo + Title */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img
              src="/logo.png"
              alt="GoPoke Logo"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                marginRight: '0.75rem'
              }}
            />
            <span style={{ color: 'white', fontWeight: '900', fontSize: '22px', letterSpacing: '0.5px' }}>
              GoPoke
            </span>
          </Link>
          {/* Right Side: Profile Dropdown or Auth Links */}
          <div style={{ position: 'relative' }}>
            {user ? (
              <div style={{ color: 'white', cursor: 'pointer' }} onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user.email.split('@')[0]} 
                {dropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '2rem',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    minWidth: '150px'
                  }}>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setDropdownOpen(false);
                      }}
                      style={dropdownItemStyle}
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      style={dropdownItemStyle}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" style={{ color: 'white', marginRight: '1rem' }}>Login</Link>
                <Link to="/signup" style={{ color: 'white' }}>Sign Up</Link>
              </>
            )}
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/post/:id" element={<ProtectedRoute><PostPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

const dropdownItemStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#333'
};

export default App;
