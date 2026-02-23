import React, { useState } from 'react';
import { FaUniversity } from 'react-icons/fa';

const PPFCalculator = () => {
  const [yearlyInvestment, setYearlyInvestment] = useState(150000);
  const [tenure, setTenure] = useState(15);
  const [interestRate, setInterestRate] = useState(7.1);
  const [result, setResult] = useState(null);

  const calculate = () => {
    let maturityAmount = 0;
    for (let i = 1; i <= tenure; i++) {
      maturityAmount = (maturityAmount + yearlyInvestment) * (1 + interestRate / 100);
    }
    const invested = yearlyInvestment * tenure;
    const interest = maturityAmount - invested;
    
    setResult({
      maturityAmount: maturityAmount.toFixed(0),
      invested: invested.toFixed(0),
      interest: interest.toFixed(0)
    });
  };

  return (
    <div className="calculator-form">
      <h2><FaUniversity /> PPF Calculator</h2>
      <div className="form-group">
        <label>Yearly Investment (₹)</label>
        <input type="number" value={yearlyInvestment} onChange={(e) => setYearlyInvestment(Number(e.target.value))} />
        <input type="range" min="500" max="150000" step="500" value={yearlyInvestment} onChange={(e) => setYearlyInvestment(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Time Period (Years)</label>
        <input type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
        <input type="range" min="15" max="50" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Interest Rate (% p.a.)</label>
        <input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
        <input type="range" min="6" max="10" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
      </div>
      <button className="calculate-btn" onClick={calculate}>Calculate</button>
      {result && (
        <div className="result-box">
          <div className="result-item">
            <span>Total Investment</span>
            <strong>₹{Number(result.invested).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Total Interest</span>
            <strong className="positive">₹{Number(result.interest).toLocaleString()}</strong>
          </div>
          <div className="result-item total">
            <span>Maturity Amount</span>
            <strong>₹{Number(result.maturityAmount).toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default PPFCalculator;
