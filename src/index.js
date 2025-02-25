"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
require("dotenv").config();
const app = (0, express_1.default)();
var bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use(cors());
app.use(bodyParser.text({ type: "text/*" }));
// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Firebase TypeScript API is running' });
});
try {
    var serviceAccount = require("../serviceAccountKey.json");
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
    });
}
catch (error) {
    console.error("Error loading service account key:", error);
    process.exit(1); // Exit the application if the service account key is not loaded
}
const adminDb = firebase_admin_1.default.firestore();
// Users routes
app.get('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersSnapshot = yield adminDb.collection('users').limit(10).get();
        const users = usersSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json({ users });
    }
    catch (error) {
        console.error('API error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
app.post('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const docRef = yield adminDb.collection('users').add(newUser);
        res.status(201).json(Object.assign({ id: docRef.id }, newUser));
    }
    catch (error) {
        console.error('API error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Only use listen in development - Vercel will handle this in production
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
// Export for Vercel
exports.default = app;
