import express from 'express';
import  'dotenv/config';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

app.use("/api/inngest", serve({ client: inngest, functions }));
// Sample route
app.get('/', (req, res) => {
  res.send('Server is Live!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});