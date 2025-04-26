import { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [sortOption]);

  async function fetchPosts() {
    const orderBy = sortOption === 'upvotes' ? 'upvotes' : 'created_at';
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order(orderBy, { ascending: false });

    if (error) console.error('Error fetching posts:', error);
    else setPosts(data);
  }

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div style={{
        backgroundColor: '#e3f2fd',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>Welcome to GoPoke!</h2>
        <p style={{ color: '#555' }}>
          Share your favorite Pokémon finds, trades, and battles with fellow trainers.
        </p>
      </div>

      {/* Search + Sort + Post Button */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Search Pokémon posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            flex: '1'
          }}
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        >
          <option value="newest">Newest</option>
          <option value="upvotes">Most Liked</option>
        </select>
        <button
          onClick={() => navigate('/create')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Post Pokémon
        </button>
      </div>

      {/* Post Feed */}
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#777',
          backgroundColor: '#f9f9f9',
          borderRadius: '10px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ marginBottom: '0.5rem' }}>No posts yet</h3>
          <p>Be the first to catch and share a Pokémon!</p>
        </div>
      )}
    </div>
  );
}

export default Home;
