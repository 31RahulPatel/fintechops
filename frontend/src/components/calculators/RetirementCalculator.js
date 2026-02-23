import React, { useState } from 'react';
import { FaUserTie } from 'react-icons/fa';

const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [inflation, setInflation] = useState(6);
  const [returnRate, setReturnRate] = useState(12);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const yearsToRetirement = retirementAge - currentAge;
    const futureExpense = monthlyExpense * Math.pow(1 + inflation / 100, yearsToRetirement);
    const yearlyExpense = futureExpense * 12;
    const corpusNeeded = (yearlyExpense * 25);
    const monthlySIP = (corpusNeeded * (returnRate / 12 / 100)) / (Math.pow(1 + returnRate / 12 / 100, yearsToRetirement * 12) - 1);
    
    setResult({
      corpusNeeded: corpusNeeded.toFixed(0),
      monthlySIP: monthlySIP.toFixed(0),
      futureExpense: futureExpense.toFixed(0)
    });
  };

  return (
    <div className="calculator-form">
      <h2><FaUserTie /> Retirement Calculator</h2>
      <div className="form-group">
        <label>Current Age</label>
        <input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} />
        <input type="range" min="20" max="60" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Retirement Age</label>
        <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} />
        <input type="range" min="40" max="80" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Current Monthly Expense (₹)</label>
        <input type="number" value={monthlyExpense} onChange={(e) => setMonthlyExpense(Number(e.target.value))} />
        <input type="range" min="10000" max="500000" step="5000" value={monthlyExpense} onChange={(e) => setMonthlyExpense(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Inflation Rate (% p.a.)</label>
        <input type="number" value={inflation} onChange={(e) => setInflation(Number(e.target.value))} />
        <input type="range" min="3" max="12" step="0.5" value={inflation} onChange={(e) => setInflation(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Expected Return (% p.a.)</label>
        <input type="number" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
        <input type="range" min="6" max="20" step="0.5" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
      </div>
      <button className="calculate-btn" onClick={calculate}>Calculate</button>
      {result && (
        <div className="result-box">
          <div className="result-item total">
            <span>Retirement Corpus Needed</span>
            <strong>₹{Number(result.corpusNeeded).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Monthly SIP Required</span>
            <strong className="positive">₹{Number(result.monthlySIP).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Future Monthly Expense</span>
            <strong>₹{Number(result.futureExpense).toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetirementCalculator;
