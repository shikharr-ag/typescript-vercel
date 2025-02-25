import express from 'express';
import { adminDb } from './config/firebase';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/',  (req, res) => {
  res.json({ message: 'Firebase TypeScript API is running' });
});

// Users routes
app.get('/api/users',  async (req, res) => {
  try {
    const usersSnapshot =  await adminDb.collection('users').limit(10).get();
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
     res.status(200).json({ users });
  } catch (error) {
    console.error('API error:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/api/users',  async(req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
     res.status(400).json({ error: 'Name and email are required' });
    }
  
    
    const newUser = {
      name,
      email,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await adminDb.collection('users').add(newUser);
    
     res.status(201).json({
      id: docRef.id,
      ...newUser
    });
  } catch (error) {
    console.error('API error:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
  
});

// Only use listen in development - Vercel will handle this in production
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Export for Vercel
export default app;