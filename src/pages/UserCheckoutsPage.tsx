import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Checkout {
  id: number;
  book: {
    id: number;
    title: string;
    author: string;
  };
  checkout_date: string;
  return_date: string | null;
  is_returned: boolean;
}

const UserCheckoutsPage: React.FC = () => {
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCheckouts();
    }
  }, [user]);

  const fetchCheckouts = async () => {
    try {
      const response = await api.get('/checkouts/');
      setCheckouts(response.data);
    } catch (error) {
      console.error('Error fetching checkouts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>My Checked Out Books</h2>
      {checkouts.length === 0 ? (
        <p>You have no books checked out.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Author</th>
              <th>Checkout Date</th>
              <th>Return Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {checkouts.map(checkout => (
              <tr key={checkout.id}>
                <td>
                  <Link to={`/books/${checkout.book.id}`}>
                    {checkout.book.title}
                  </Link>
                </td>
                <td>{checkout.book.author}</td>
                <td>{new Date(checkout.checkout_date).toLocaleDateString()}</td>
                <td>
                  {checkout.return_date 
                    ? new Date(checkout.return_date).toLocaleDateString() 
                    : 'Not returned'}
                </td>
                <td>
                  {checkout.is_returned ? 'Returned' : 'Checked Out'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserCheckoutsPage;
