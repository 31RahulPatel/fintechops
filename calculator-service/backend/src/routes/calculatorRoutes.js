const express = require('express');
const router = express.Router();
const calculatorController = require('../controllers/calculatorController');
const authMiddleware = require('../middleware/auth');

router.post('/calculate', calculatorController.calculate);
router.post('/save', authMiddleware, calculatorController.saveCalculation);
router.get('/history', authMiddleware, calculatorController.getHistory);
router.delete('/history/:id', authMiddleware, calculatorController.deleteHistory);

module.exports = router;
