const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

//connecting to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MONGODB connected'))
  .catch((err) => console.log('MongoDB error:', err));

//test route 
// app.get('/', (req, res) => {
//   res.json({message: 'Coinbase backend is running!'});
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/auth', require('./routes/authRoutes'));
app.use('/crypto', require('./routes/cryptoRoutes'));