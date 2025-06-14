import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import studentRoutes from './routes/students';
import pool from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('Backend: Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Backend: Error connecting to the database:', err);
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);

app.get('/', (req, res) => {
  res.send('EduERP Backend API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 