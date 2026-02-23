import React, { useState } from 'react';
import { FaChartPie } from 'react-icons/fa';

const InflationCalculator = () => {
  const [currentCost, setCurrentCost] = useState(100000);
  const [inflationRate, setInflationRate] = useState(6);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const futureCost = currentCost * Math.pow(1 + inflationRate / 100, years);
    const increase = futureCost - currentCost;
    setResult({ futureCost: futureCost.toFixed(0), increase: increase.toFixed(0) });
  };

  return (
    <div className="calculator-form">
      <h2><FaChartPie /> Inflation Calculator</h2>
      <div className="form-group">
        <label>Current Cost (₹)</label>
        <input type="number" value={currentCost} onChange={(e) => setCurrentCost(Number(e.target.value))} />
        <input type="range" min="1000" max="10000000" step="1000" value={currentCost} onChange={(e) => setCurrentCost(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Inflation Rate (% p.a.)</label>
        <input type="number" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} />
        <input type="range" min="1" max="15" step="0.5" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Time Period (Years)</label>
        <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
        <input type="range" min="1" max="50" value={years} onChange={(e) => setYears(Number(e.target.value))} />
      </div>
      <button className="calculate-btn" onClick={calculate}>Calculate</button>
      {result && (
        <div className="result-box">
          <div className="result-item">
            <span>Current Cost</span>
            <strong>₹{Number(currentCost).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Cost Increase</span>
            <strong className="negative">₹{Number(result.increase).toLocaleString()}</strong>
          </div>
          <div className="result-item total">
            <span>Future Cost</span>
            <strong>₹{Number(result.futureCost).toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default InflationCalculator;
