import { useState } from 'react';
import { supabase } from '../supabase/client';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (user) return <Navigate to="/" />;

  async function handleLogin(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg('Invalid login credentials');
    } else {
      navigate('/');
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '10px', width: '100%', maxWidth: '400px', boxShadow: '0 0 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        
      <div style={{ marginBottom: '1.5rem' }}>
        <img
            src="/logo.png"
            alt="GoPoke Logo"
            style={{
            width: '80px',
            height: '80px',
            objectFit: 'cover',
            borderRadius: '50%',
            marginBottom: '1rem',
            
            }}
        />
        <h1 style={{ margin: '0.5rem 0', fontSize: '28px', color: '#2c3e50' }}>GoPoke</h1>
        <p style={{ color: '#555', fontSize: '14px' }}>Share your Pokémon finds with fellow trainers</p>
    </div>


        <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Sign in to GoPoke</h2>

        {errorMsg && (
          <div style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '5px',
            marginBottom: '1rem'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem', borderRadius: '5px' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem', borderRadius: '5px' }}
          />
          <button type="submit" style={{
            padding: '0.5rem 1rem',
            width: '100%',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}>
            Sign In
          </button>
        </form>

        <p style={{ marginTop: '1rem' }}>
          Don’t have an account? <Link to="/signup" style={{ color: '#3498db' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
