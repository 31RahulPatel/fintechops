const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDatabase } = require('./config/database');
const calculatorRoutes = require('./routes/calculatorRoutes');

const app = express();
const PORT = process.env.PORT || 6000;

app.use(cors());
app.use(express.json());

app.use('/api/calculators', calculatorRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'calculator-service' });
});

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Calculator service running on port ${PORT}`);
  });
});
