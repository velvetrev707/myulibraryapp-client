import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  total_copies: number;
  available_copies: number;
}

const BookListPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'title' | 'author' | 'genre'>('title');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/books/', {
          params: { search: searchTerm }
        });
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [searchTerm]);

  return (
    <div className="container mt-4">
      <h1>Library Books</h1>
      
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder={`Search by ${filter}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="genre">Genre</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row">
        {books.map(book => (
          <div key={book.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text">
                  <strong>Author:</strong> {book.author}<br />
                  <strong>Genre:</strong> {book.genre}<br />
                  <strong>Available:</strong> {book.available_copies}/{book.total_copies}
                </p>
                <Link to={`/books/${book.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookListPage;
