import React, { useState } from 'react';
import { FaFlagCheckered } from 'react-icons/fa';

const GoalPlanningCalculator = () => {
  const [goalAmount, setGoalAmount] = useState(1000000);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const [timePeriod, setTimePeriod] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const futureValueOfSavings = currentSavings * Math.pow(1 + expectedReturn / 100, timePeriod);
    const remainingAmount = goalAmount - futureValueOfSavings;
    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    const monthlySIP = (remainingAmount * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
    
    setResult({
      monthlySIP: Math.max(0, monthlySIP).toFixed(0),
      futureValueOfSavings: futureValueOfSavings.toFixed(0),
      totalInvestment: (monthlySIP * months + currentSavings).toFixed(0)
    });
  };

  return (
    <div className="calculator-form">
      <h2><FaFlagCheckered /> Goal Planning Calculator</h2>
      <div className="form-group">
        <label>Goal Amount (₹)</label>
        <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(Number(e.target.value))} />
        <input type="range" min="100000" max="10000000" step="100000" value={goalAmount} onChange={(e) => setGoalAmount(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Current Savings (₹)</label>
        <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} />
        <input type="range" min="0" max="5000000" step="10000" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Time to Achieve (Years)</label>
        <input type="number" value={timePeriod} onChange={(e) => setTimePeriod(Number(e.target.value))} />
        <input type="range" min="1" max="30" value={timePeriod} onChange={(e) => setTimePeriod(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Expected Return (% p.a.)</label>
        <input type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} />
        <input type="range" min="6" max="20" step="0.5" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} />
      </div>
      <button className="calculate-btn" onClick={calculate}>Calculate</button>
      {result && (
        <div className="result-box">
          <div className="result-item total">
            <span>Monthly SIP Required</span>
            <strong>₹{Number(result.monthlySIP).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Future Value of Savings</span>
            <strong className="positive">₹{Number(result.futureValueOfSavings).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Total Investment Needed</span>
            <strong>₹{Number(result.totalInvestment).toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalPlanningCalculator;
