import PostForm from '../components/PostForm';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';

function CreatePost() {
  const { user } = useAuth();

  async function handleCreatePost({ title, content, image_url }) {
    const { error } = await supabase.from('posts').insert([
      {
        title,
        content,
        image_url,
        upvotes: 0,
        user_id: user.id // 👈 this is crucial
      }
    ]);

    if (error) {
      alert('Failed to create post.');
    } else {
      alert('Post created!');
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Create a New Pokémon Post</h1>
      <PostForm onSubmit={handleCreatePost} />
    </div>
  );
}

export default CreatePost;
