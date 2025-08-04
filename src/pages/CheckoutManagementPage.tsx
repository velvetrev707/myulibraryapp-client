import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import api from '../api/api';

interface Checkout {
  id: number;
  student: {
    id: number;
    first_name: string;
    last_name: string;
  };
  book: {
    id: number;
    title: string;
  };
  checkout_date: string;
  return_date: string | null;
  is_returned: boolean;
}

const CheckoutManagementPage: React.FC = () => {
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'returned'>('active');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCheckouts();
  }, [filter]);

  const fetchCheckouts = async () => {
    try {
      const params: any = {};
      if (filter === 'active') params.is_returned = false;
      if (filter === 'returned') params.is_returned = true;
      if (searchTerm) params.search = searchTerm;
      
      const response = await api.get('/checkouts/', { params });
      setCheckouts(response.data);
    } catch (error) {
      console.error('Error fetching checkouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (checkoutId: number) => {
    try {
      await api.post(`/checkouts/${checkoutId}/return_book/`);
      fetchCheckouts();
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCheckouts();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Checkout Management</h2>
      
      <div className="d-flex justify-content-between mb-3">
        <div className="btn-group">
          <Button 
            variant={filter === 'all' ? 'primary' : 'outline-primary'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'active' ? 'primary' : 'outline-primary'}
            onClick={() => setFilter('active')}
          >
            Active Checkouts
          </Button>
          <Button 
            variant={filter === 'returned' ? 'primary' : 'outline-primary'}
            onClick={() => setFilter('returned')}
          >
            Returned Books
          </Button>
        </div>
        
        <Form className="d-flex" onSubmit={handleSearchSubmit}>
          <Form.Control
            type="text"
            placeholder="Search by student or book"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline-success" type="submit" className="ms-2">
            Search
          </Button>
        </Form>
      </div>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Student</th>
            <th>Book</th>
            <th>Checkout Date</th>
            <th>Return Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {checkouts.map(checkout => (
            <tr key={checkout.id}>
              <td>{checkout.student.first_name} {checkout.student.last_name}</td>
              <td>{checkout.book.title}</td>
              <td>{new Date(checkout.checkout_date).toLocaleDateString()}</td>
              <td>
                {checkout.return_date 
                  ? new Date(checkout.return_date).toLocaleDateString() 
                  : 'Not returned'}
              </td>
              <td>{checkout.is_returned ? 'Returned' : 'Checked Out'}</td>
              <td>
                {!checkout.is_returned && (
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={() => handleReturn(checkout.id)}
                  >
                    Mark as Returned
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CheckoutManagementPage;
