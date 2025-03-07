import React, { useEffect, useState } from "react";
import { IComment } from "../model/IComment";
import "./Comments.css"; // Stil dosyasını unutma!

const Comments: React.FC = () => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch("http://localhost:9090/v1/dev/comment/list");
      if (!response.ok) {
        throw new Error("Yorumlar yüklenirken hata oluştu");
      }
      const responseData = await response.json(); 
      setComments(responseData.data);
    } catch (err) {
      setError("Yorumlar yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );

  if (error)
    return <div className="error-message">Hata: {error}</div>;

  return (
    <div className="comments-wrapper">
      <h2 className="title">Kullanıcı Yorumları</h2>
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <img 
                src={comment.userImageUrl || "https://via.placeholder.com/50"} 
                alt="User" 
                className="user-image" 
              />
              <div className="comment-content">
                <p className="comment-text">{comment.comment}</p>
                <p className="rating">⭐ {comment.rating}</p>
                <p className="date">📅 {new Date(comment.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-comments">Henüz yorum bulunmuyor.</div>
        )}
      </div>
      <button onClick={fetchComments} className="refresh-button">Yorumları Yenile</button>
    </div>
  );
};

export default Comments;
