import React, { useState } from 'react';
import { FaCreditCard } from 'react-icons/fa';

const SWPCalculator = () => {
  const [totalInvestment, setTotalInvestment] = useState(1000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    let balance = totalInvestment;
    let totalWithdrawn = 0;
    
    for (let i = 0; i < months; i++) {
      balance = balance * (1 + monthlyRate) - monthlyWithdrawal;
      totalWithdrawn += monthlyWithdrawal;
      if (balance <= 0) break;
    }
    
    setResult({
      finalBalance: Math.max(0, balance).toFixed(0),
      totalWithdrawn: totalWithdrawn.toFixed(0),
      totalReturns: (Math.max(0, balance) + totalWithdrawn - totalInvestment).toFixed(0)
    });
  };

  return (
    <div className="calculator-form">
      <h2><FaCreditCard /> SWP Calculator</h2>
      <div className="form-group">
        <label>Total Investment (₹)</label>
        <input type="number" value={totalInvestment} onChange={(e) => setTotalInvestment(Number(e.target.value))} />
        <input type="range" min="100000" max="10000000" step="100000" value={totalInvestment} onChange={(e) => setTotalInvestment(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Monthly Withdrawal (₹)</label>
        <input type="number" value={monthlyWithdrawal} onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))} />
        <input type="range" min="1000" max="100000" step="1000" value={monthlyWithdrawal} onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Expected Return (% p.a.)</label>
        <input type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} />
        <input type="range" min="6" max="20" step="0.5" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Time Period (Years)</label>
        <input type="number" value={timePeriod} onChange={(e) => setTimePeriod(Number(e.target.value))} />
        <input type="range" min="1" max="30" value={timePeriod} onChange={(e) => setTimePeriod(Number(e.target.value))} />
      </div>
      <button className="calculate-btn" onClick={calculate}>Calculate</button>
      {result && (
        <div className="result-box">
          <div className="result-item">
            <span>Total Withdrawn</span>
            <strong>₹{Number(result.totalWithdrawn).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Total Returns</span>
            <strong className="positive">₹{Number(result.totalReturns).toLocaleString()}</strong>
          </div>
          <div className="result-item total">
            <span>Final Balance</span>
            <strong>₹{Number(result.finalBalance).toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default SWPCalculator;
