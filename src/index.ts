import express, {Request, Response} from "express";
import admin from "firebase-admin"

require("dotenv").config();

const app = express();
var bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.text({ type: "text/*" }));


try {
  var serviceAccount = require("../serviceAccountKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error("Error loading service account key:", error);
  process.exit(1); // Exit the application if the service account key is not loaded
}

const adminDb = admin.firestore();
// Routes
app.get('/',  (req:Request, res:Response) => {
  res.json({ message: 'Firebase TypeScript API is running' });
});
// Users routes
app.get('/api/users',  async (req:Request, res:Response) => {
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



app.post('/api/users',  async(req:Request, res:Response) => {
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