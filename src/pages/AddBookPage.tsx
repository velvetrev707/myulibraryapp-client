import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const AddBookPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    total_copies: 1
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await api.post('/books/', formData);
      if (response.status === 201) {
        setSuccess('Book added successfully!');
        setFormData({
          title: '',
          author: '',
          genre: '',
          isbn: '',
          total_copies: 1
        });
        // Optionally redirect after a delay
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (err: any) {
      if (err.response) {
        // Handle specific errors
        const data = err.response.data;
        if (typeof data === 'object') {
          // Convert object errors to string
          const errorMsgs = Object.entries(data).map(
            ([key, value]) => `${key}: ${(value as string[]).join(', ')}`
          );
          setError(errorMsgs.join('; '));
        } else {
          setError(data || 'An error occurred');
        }
      } else {
        setError('Failed to add book. Please try again.');
      }
    }
  };

  return (
    <Container className="mt-4">
      <h1>Add New Book</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title *</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter book title"
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Author *</Form.Label>
          <Form.Control
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            placeholder="Enter author name"
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Genre *</Form.Label>
          <Form.Control
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
            placeholder="Enter genre"
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>ISBN *</Form.Label>
          <Form.Control
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            required
            placeholder="Enter ISBN (10 or 13 digits)"
          />
          <Form.Text className="text-muted">
            Must be 10 or 13 digits
          </Form.Text>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Total Copies *</Form.Label>
          <Form.Control
            type="number"
            name="total_copies"
            value={formData.total_copies}
            onChange={handleChange}
            min="1"
            required
          />
        </Form.Group>
        
        <Button variant="primary" type="submit" className="me-2">
          Add Book
        </Button>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default AddBookPage;
