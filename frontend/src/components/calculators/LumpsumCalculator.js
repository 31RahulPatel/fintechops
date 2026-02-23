import React, { useState } from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';

const LumpsumCalculator = () => {
  const [investment, setInvestment] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const futureValue = investment * Math.pow(1 + rate / 100, years);
    const returns = futureValue - investment;
    setResult({ futureValue: futureValue.toFixed(0), returns: returns.toFixed(0) });
  };

  return (
    <div className="calculator-form">
      <h2><FaMoneyBillWave /> Lumpsum Investment Calculator</h2>
      <div className="form-group">
        <label>Investment Amount (₹)</label>
        <input type="number" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} />
        <input type="range" min="10000" max="10000000" step="10000" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Expected Return (% p.a.)</label>
        <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        <input type="range" min="1" max="30" step="0.5" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Time Period (Years)</label>
        <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
        <input type="range" min="1" max="40" value={years} onChange={(e) => setYears(Number(e.target.value))} />
      </div>
      <button className="calculate-btn" onClick={calculate}>Calculate</button>
      {result && (
        <div className="result-box">
          <div className="result-item">
            <span>Invested Amount</span>
            <strong>₹{Number(investment).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Estimated Returns</span>
            <strong className="positive">₹{Number(result.returns).toLocaleString()}</strong>
          </div>
          <div className="result-item total">
            <span>Total Value</span>
            <strong>₹{Number(result.futureValue).toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default LumpsumCalculator;
