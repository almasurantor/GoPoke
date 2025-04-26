import { useState } from 'react';

function PostForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ title, content, image_url: imageUrl });
    setTitle('');
    setContent('');
    setImageUrl('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <textarea
          placeholder="Write something about your Pokémon..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>
      <button type="submit" style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#2ecc71',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
        }}>
        Post
    </button>

    </form>
  );
}

export default PostForm;
