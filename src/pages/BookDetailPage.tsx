import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  total_copies: number;
  available_copies: number;
}

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/books/${id}/`);
        setBook(response.data);
      } catch (err) {
        setError('Book not found');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleCheckout = async () => {
    try {
      await api.post(`/books/${id}/checkout/`);
      alert('Book checked out successfully!');
      navigate('/checkouts');
    } catch (err) {
      setError('Failed to checkout book');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <h1>{book.title}</h1>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Genre:</strong> {book.genre}</p>
          <p><strong>ISBN:</strong> {book.isbn}</p>
          <p><strong>Availability:</strong> {book.available_copies} of {book.total_copies} available</p>
          
          {user?.user_type === 'student' && book.available_copies > 0 && (
            <button 
              className="btn btn-success"
              onClick={handleCheckout}
            >
              Checkout Book
            </button>
          )}

          {book.available_copies === 0 && (
            <div className="alert alert-warning mt-3">
              No copies available for checkout
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
