import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase/client';

function PostCard({ post }) {
  const [likes, setLikes] = useState(post.upvotes || 0);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    async function fetchComments() {
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);

      if (!error && count !== null) {
        setCommentCount(count);
      }
    }

    fetchComments();
  }, [post.id]);

  async function handleLike() {
    const { error } = await supabase
      .from('posts')
      .update({ upvotes: likes + 1 })
      .eq('id', post.id);

    if (!error) setLikes(likes + 1);
  }

  const previewLimit = 140;
  const previewText = post.content?.length > previewLimit
    ? post.content.slice(0, previewLimit) + '...'
    : post.content;

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      padding: '1.25rem 1.5rem',
      marginBottom: '1.5rem',
      borderRadius: '12px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
    }}>
      {/* Header Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingTop: '4px',
        marginBottom: '0.75rem'
      }}>
        <div>
          <h2 style={{ color: '#2c3e50', textTransform: 'capitalize', fontSize: '20px', margin: 0 }}>
            {post.title}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '4px', marginBottom: '4px' }}>
            Posted {timeAgo(post.created_at)}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <button
            onClick={handleLike}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#2c3e50',
              fontWeight: '500'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2c3e50" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                       2 6.5 3.5 5 5.5 5c1.54 0 3.04.99 3.57 
                       2.36h1.87C13.46 5.99 14.96 5 16.5 
                       5 18.5 5 20 6.5 20 8.5c0 3.78-3.4 
                       6.86-8.55 11.54L12 21.35z"/>
            </svg>
            {likes} Likes
          </button>

          <Link
            to={`/post/${post.id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '14px',
              color: '#2c3e50',
              fontWeight: '500',
              textDecoration: 'none'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2c3e50" viewBox="0 0 24 24">
              <path d="M21 6h-2v9H5v2c0 .55.45 1 1 1h13l4 4V7c0-.55-.45-1-1-1zM17 4H3c-.55 
                0-1 .45-1 1v12l4-4h11c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1z"/>
            </svg>
            {commentCount} Comments
          </Link>
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <p style={{ color: '#444', marginBottom: '0.75rem', fontSize: '0.95rem', marginTop: '4px' }}>
          {previewText}
        </p>
      )}

      {/* View Post */}
      <Link to={`/post/${post.id}`} style={{ color: '#3498db', fontWeight: 'bold', fontSize: '0.95rem' }}>
        View Post →
      </Link>
    </div>
  );
}

function timeAgo(date) {
  const now = new Date();
  const postDate = new Date(date);
  const diffMs = now - postDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  return `${diffDays} days ago`;
}

export default PostCard;
