function Comment({ comment }) {
    return (
      <div style={{
        border: '1px solid #ddd',
        padding: '0.5rem',
        marginTop: '0.5rem',
        borderRadius: '5px',
        backgroundColor: '#fff'
      }}>
        <p>{comment.content}</p>
        <small>{new Date(comment.created_at).toLocaleString()}</small>
      </div>
    );
  }
  
  export default Comment;
  