import React, { useState } from 'react';
import { FaBullseye } from 'react-icons/fa';

const NPSCalculator = () => {
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [annuityRate, setAnnuityRate] = useState(6);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const years = retirementAge - currentAge;
    const months = years * 12;
    const monthlyRate = expectedReturn / 12 / 100;
    const maturityAmount = monthlyContribution * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const annuityAmount = maturityAmount * 0.4;
    const lumpsum = maturityAmount * 0.6;
    const monthlyPension = (annuityAmount * annuityRate / 100) / 12;
    
    setResult({
      maturityAmount: maturityAmount.toFixed(0),
      lumpsum: lumpsum.toFixed(0),
      annuityAmount: annuityAmount.toFixed(0),
      monthlyPension: monthlyPension.toFixed(0)
    });
  };

  return (
    <div className="calculator-form">
      <h2><FaBullseye /> NPS Calculator</h2>
      <div className="form-group">
        <label>Monthly Contribution (₹)</label>
        <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} />
        <input type="range" min="500" max="50000" step="500" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Current Age</label>
        <input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} />
        <input type="range" min="18" max="60" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Retirement Age</label>
        <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} />
        <input type="range" min="40" max="70" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Expected Return (% p.a.)</label>
        <input type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} />
        <input type="range" min="6" max="15" step="0.5" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Annuity Rate (% p.a.)</label>
        <input type="number" value={annuityRate} onChange={(e) => setAnnuityRate(Number(e.target.value))} />
        <input type="range" min="4" max="10" step="0.5" value={annuityRate} onChange={(e) => setAnnuityRate(Number(e.target.value))} />
      </div>
      <button className="calculate-btn" onClick={calculate}>Calculate</button>
      {result && (
        <div className="result-box">
          <div className="result-item total">
            <span>Maturity Amount</span>
            <strong>₹{Number(result.maturityAmount).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Lumpsum (60%)</span>
            <strong>₹{Number(result.lumpsum).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Annuity (40%)</span>
            <strong>₹{Number(result.annuityAmount).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Monthly Pension</span>
            <strong className="positive">₹{Number(result.monthlyPension).toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default NPSCalculator;
