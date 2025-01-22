// pages/api/auth/login.js
import axios from 'axios';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'MY_SUPER_SECRET';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    // 1) Fetch users from JSON Server
    const { data: users } = await axios.get('http://localhost:5000/users');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2) Sign the JWT on the server
    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin ?? false },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 3) Return the token to the client
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
