require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes'); 

const app = express();

app.use(cors({
  origin : 'https://employee-management-six-woad.vercel.app',
  credentials: true }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/employees', require('./routes/employeeRoutes'));

app.use(errorHandler); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected (LegacyHR Core)'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
