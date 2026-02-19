const { pool } = require('../config/database');
const formulas = require('../utils/formulas');

const calculatorController = {
  calculate: async (req, res) => {
    try {
      const { type, params } = req.body;
      let result;

      switch (type) {
        case 'sip':
          result = formulas.calculateSIP(params.monthlyInvestment, params.annualRate, params.years);
          break;
        case 'compound':
          result = formulas.calculateCompoundInterest(params.principal, params.rate, params.time, params.frequency);
          break;
        case 'emi':
          result = formulas.calculateEMI(params.principal, params.rate, params.tenure);
          break;
        case 'cagr':
          result = formulas.calculateCAGR(params.initialValue, params.finalValue, params.years);
          break;
        case 'lumpsum':
          result = formulas.calculateLumpsum(params.principal, params.rate, params.years);
          break;
        case 'inflation':
          result = formulas.calculateInflation(params.currentAmount, params.inflationRate, params.years);
          break;
        case 'retirement':
          result = formulas.calculateRetirement(params.currentAge, params.retirementAge, params.monthlyExpense, params.inflationRate, params.returnRate);
          break;
        case 'ppf':
          result = formulas.calculatePPF(params.yearlyInvestment, params.years);
          break;
        case 'nps':
          result = formulas.calculateNPS(params.monthlyInvestment, params.currentAge, params.retirementAge, params.returnRate);
          break;
        case 'swp':
          result = formulas.calculateSWP(params.investment, params.withdrawalAmount, params.years, params.returnRate);
          break;
        case 'goal':
          result = formulas.calculateGoalPlanning(params.goalAmount, params.years, params.returnRate);
          break;
        case 'asset':
          result = formulas.calculateAssetAllocation(params.totalAmount, params.equity, params.debt, params.gold);
          break;
        case 'risk':
          result = formulas.calculateRiskReward(params.entryPrice, params.targetPrice, params.stopLoss);
          break;
        case 'portfolio':
          result = formulas.calculatePortfolioReturn(params.investments);
          break;
        case 'tax':
          result = formulas.calculateTax(params.income, params.regime);
          break;
        default:
          return res.status(400).json({ success: false, message: 'Invalid calculator type' });
      }

      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  saveCalculation: async (req, res) => {
    try {
      const { type, params, result } = req.body;
      const userId = req.user.id;

      const [rows] = await pool.query(
        'INSERT INTO calculation_history (user_id, calculator_type, input_params, result) VALUES (?, ?, ?, ?)',
        [userId, type, JSON.stringify(params), JSON.stringify(result)]
      );

      res.json({ success: true, message: 'Calculation saved', id: rows.insertId });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      const { type } = req.query;

      let query = 'SELECT * FROM calculation_history WHERE user_id = ?';
      const params = [userId];

      if (type) {
        query += ' AND calculator_type = ?';
        params.push(type);
      }

      query += ' ORDER BY created_at DESC LIMIT 50';

      const [rows] = await pool.query(query, params);
      res.json({ success: true, data: rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteHistory: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await pool.query('DELETE FROM calculation_history WHERE id = ? AND user_id = ?', [id, userId]);
      res.json({ success: true, message: 'Calculation deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = calculatorController;
