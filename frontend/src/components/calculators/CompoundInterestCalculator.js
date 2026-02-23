import React, { useState } from 'react';
import { FaCoins } from 'react-icons/fa';

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(10);
  const [time, setTime] = useState(5);
  const [frequency, setFrequency] = useState(12);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const amount = principal * Math.pow(1 + rate / (frequency * 100), frequency * time);
    const interest = amount - principal;
    setResult({ amount: amount.toFixed(0), interest: interest.toFixed(0) });
  };

  return (
    <div className="calculator-form">
      <h2><FaCoins /> Compound Interest Calculator</h2>
      <div className="form-group">
        <label>Principal Amount (₹)</label>
        <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
        <input type="range" min="10000" max="10000000" step="10000" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Interest Rate (% p.a.)</label>
        <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        <input type="range" min="1" max="30" step="0.5" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Time Period (Years)</label>
        <input type="number" value={time} onChange={(e) => setTime(Number(e.target.value))} />
        <input type="range" min="1" max="30" value={time} onChange={(e) => setTime(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Compounding Frequency</label>
        <select value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e9ecef'}}>
          <option value="1">Annually</option>
          <option value="2">Semi-Annually</option>
          <option value="4">Quarterly</option>
          <option value="12">Monthly</option>
          <option value="365">Daily</option>
        </select>
      </div>
      <button className="calculate-btn" onClick={calculate}>Calculate</button>
      {result && (
        <div className="result-box">
          <div className="result-item">
            <span>Principal Amount</span>
            <strong>₹{Number(principal).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Total Interest</span>
            <strong className="positive">₹{Number(result.interest).toLocaleString()}</strong>
          </div>
          <div className="result-item total">
            <span>Maturity Amount</span>
            <strong>₹{Number(result.amount).toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompoundInterestCalculator;
