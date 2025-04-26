import { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Profile() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalComments, setTotalComments] = useState(0);

  useEffect(() => {
    async function fetchUserPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPosts(data);
        const likeSum = data.reduce((sum, p) => sum + (p.upvotes || 0), 0);
        setTotalLikes(likeSum);
      }
    }

    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  useEffect(() => {
    async function fetchUserComments() {
      if (posts.length === 0) return;

      const { data, error } = await supabase
        .from('comments')
        .select('id')
        .in('post_id', posts.map((p) => p.id));

      if (!error && data) {
        setTotalComments(data.length);
      }
    }

    fetchUserComments();
  }, [posts]);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{
        backgroundColor: 'var(--color-hover)',
        padding: '2rem',
        borderRadius: '12px',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#addcff',
          borderRadius: '50%',
          margin: '0 auto 1rem auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          fontWeight: 'bold',
          color: 'white'
        }}>
          {user.email[0].toUpperCase()}
        </div>
        <h2 style={{ marginBottom: '0.25rem' }}>
          {user.user_metadata?.username || user.email.split('@')[0]}
        </h2>
        <p style={{ color: '#555' }}>Pokémon Trainer</p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          marginTop: '1.5rem'
        }}>
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{posts.length}</p>
            <p>Posts</p>
          </div>
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{totalLikes}</p>
            <p>Likes</p>
          </div>
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{totalComments}</p>
            <p>Comments</p>
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Your Posts</h3>

      {posts.map(post => (
        <Link
          to={`/post/${post.id}`}
          key={post.id}
          style={{
            display: 'block',
            backgroundColor: 'white',
            border: '1px solid var(--color-hover)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'box-shadow 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{post.title}</p>
              <p style={{ fontSize: '0.85rem', color: '#888' }}>{formatDate(post.created_at)}</p>
            </div>
            <div style={{ fontSize: '0.85rem', alignSelf: 'center', color: '#444' }}>
              {post.upvotes} Likes
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export default Profile;
