import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Button, Modal, Form } from 'react-bootstrap';

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: 'student' | 'librarian';
}

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    user_type: 'student' as 'student' | 'librarian'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await api.post('/users/', formData);
      fetchUsers();
      setShowModal(false);
      setFormData({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        email: '',
        user_type: 'student'
      });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>User Management</h1>
      <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">
        Add New User
      </Button>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.first_name} {user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.user_type}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="user_type"
                value={formData.user_type}
                onChange={(e: any) => setFormData(prev => ({ ...prev, user_type: e.target.value }))}
              >
                <option value="student">Student</option>
                <option value="librarian">Librarian</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
