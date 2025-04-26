import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';

function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (!error) setPost(data);
    }

    async function fetchComments() {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (!error) setComments(data);
    }

    fetchPost();
    fetchComments();
  }, [id]);

  async function handleUpvote() {
    const { error } = await supabase
      .from('posts')
      .update({ upvotes: post.upvotes + 1 })
      .eq('id', id);

    if (!error) setPost({ ...post, upvotes: post.upvotes + 1 });
  }

  async function handleCommentSubmit() {
    if (newComment.trim() === '') return;

    const { error } = await supabase.from('comments').insert([
      {
        post_id: id,
        content: newComment
      }
    ]);

    if (!error) {
      setComments([...comments, { content: newComment, created_at: new Date().toISOString() }]);
      setNewComment('');
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', post.id);

    if (error) {
      alert('Failed to delete post.');
    } else {
      alert('Post deleted.');
      navigate('/');
    }
  }

  if (!post) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '28px', color: '#2c3e50' }}>{post.title}</h1>
        <p style={{ fontSize: '16px', color: '#444', marginBottom: '1rem' }}>{post.content}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <span style={{ fontSize: '16px', color: '#2c3e50' }}>
             {post.upvotes} Likes
          </span>
          <button onClick={handleUpvote} style={{
            padding: '6px 12px',
            backgroundColor: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            Like
          </button>
        </div>

        {/* Delete Button */}
        {user && user.id === post.user_id && (
          <button onClick={handleDelete} style={{
            backgroundColor: '#ff4d4f',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            Delete Post
          </button>
        )}
      </div>

      {/* Comments Section */}
      <div>
        <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Comments</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {comments.length === 0 && <p style={{ color: '#777' }}>No comments yet.</p>}
          {comments.map((c, i) => (
            <div key={i} style={{
              backgroundColor: '#f9f9f9',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <p style={{ marginBottom: '0.5rem', color: '#333' }}>{c.content}</p>
              <p style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(c.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Add Comment Form */}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          style={{
            width: '100%',
            height: '80px',
            padding: '0.75rem',
            fontSize: '14px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            marginBottom: '1rem'
          }}
        />

        <button
          onClick={handleCommentSubmit}
          style={{
            padding: '10px 18px',
            backgroundColor: '#2ecc71',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Add Comment
        </button>
      </div>
    </div>
  );
}

export default PostPage;
