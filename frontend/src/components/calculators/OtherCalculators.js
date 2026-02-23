import React, { useState } from 'react';

export const AssetAllocationCalculator = () => {
  const [age, setAge] = useState(30);
  const [riskTolerance, setRiskTolerance] = useState('moderate');
  const [totalInvestment, setTotalInvestment] = useState(1000000);
  const [result, setResult] = useState(null);

  const calculate = () => {
    let equity, debt, gold;
    if (riskTolerance === 'aggressive') {
      equity = 100 - age;
      debt = age * 0.7;
      gold = age * 0.3;
    } else if (riskTolerance === 'moderate') {
      equity = 100 - age - 10;
      debt = age + 5;
      gold = 5;
    } else {
      equity = 100 - age - 20;
      debt = age + 15;
      gold = 5;
    }
    
    setResult({
      equity: ((equity / 100) * totalInvestment).toFixed(0),
      debt: ((debt / 100) * totalInvestment).toFixed(0),
      gold: ((gold / 100) * totalInvestment).toFixed(0),
      equityPct: equity.toFixed(1),
      debtPct: debt.toFixed(1),
      goldPct: gold.toFixed(1)
    });
  };

  return (
    <div className="calculator-form">
      <h2>📦 Asset Allocation Calculator</h2>
      <div className="form-group">
        <label>Your Age</label>
        <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
        <input type="range" min="18" max="80" value={age} onChange={(e) => setAge(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Risk Tolerance</label>
        <select value={riskTolerance} onChange={(e) => setRiskTolerance(e.target.value)} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e9ecef'}}>
          <option value="conservative">Conservative</option>
          <option value="moderate">Moderate</option>
          <option value="aggressive">Aggressive</option>
        </select>
      </div>
      <div className="form-group">
        <label>Total Investment (₹)</label>
        <input type="number" value={totalInvestment} onChange={(e) => setTotalInvestment(Number(e.target.value))} />
        <input type="range" min="100000" max="10000000" step="100000" value={totalInvestment} onChange={(e) => setTotalInvestment(Number(e.target.value))} />
      </div>
      <button className="calculate-btn" onClick={calculate}>Calculate</button>
      {result && (
        <div className="result-box">
          <div className="result-item">
            <span>Equity ({result.equityPct}%)</span>
            <strong>₹{Number(result.equity).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Debt ({result.debtPct}%)</span>
            <strong>₹{Number(result.debt).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Gold ({result.goldPct}%)</span>
            <strong>₹{Number(result.gold).toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export const RiskRewardCalculator = () => {
  const [entryPrice, setEntryPrice] = useState(100);
  const [targetPrice, setTargetPrice] = useState(120);
  const [stopLoss, setStopLoss] = useState(95);
  const [quantity, setQuantity] = useState(100);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const risk = (entryPrice - stopLoss) * quantity;
    const reward = (targetPrice - entryPrice) * quantity;
    const ratio = reward / risk;
    
    setResult({
      risk: risk.toFixed(0),
      reward: reward.toFixed(0),
      ratio: ratio.toFixed(2),
      investment: (entryPrice * quantity).toFixed(0)
    });
  };

  return (
    <div className="calculator-form">
      <h2>⚖️ Risk-Reward Ratio Calculator</h2>
      <div className="form-group">
        <label>Entry Price (₹)</label>
        <input type="number" value={entryPrice} onChange={(e) => setEntryPrice(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Target Price (₹)</label>
        <input type="number" value={targetPrice} onChange={(e) => setTargetPrice(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Stop Loss (₹)</label>
        <input type="number" value={stopLoss} onChange={(e) => setStopLoss(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Quantity</label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        <input type="range" min="1" max="1000" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
      </div>
      <button className="calculate-btn" onClick={calculate}>Calculate</button>
      {result && (
        <div className="result-box">
          <div className="result-item total">
            <span>Risk-Reward Ratio</span>
            <strong>{result.ratio}:1</strong>
          </div>
          <div className="result-item">
            <span>Potential Risk</span>
            <strong className="negative">₹{Number(result.risk).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Potential Reward</span>
            <strong className="positive">₹{Number(result.reward).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Total Investment</span>
            <strong>₹{Number(result.investment).toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export const PortfolioReturnCalculator = () => {
  const [initialValue, setInitialValue] = useState(1000000);
  const [currentValue, setCurrentValue] = useState(1200000);
  const [dividends, setDividends] = useState(50000);
  const [years, setYears] = useState(3);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const totalReturn = ((currentValue + dividends - initialValue) / initialValue) * 100;
    const annualizedReturn = (Math.pow((currentValue + dividends) / initialValue, 1 / years) - 1) * 100;
    const absoluteGain = currentValue + dividends - initialValue;
    
    setResult({
      totalReturn: totalReturn.toFixed(2),
      annualizedReturn: annualizedReturn.toFixed(2),
      absoluteGain: absoluteGain.toFixed(0)
    });
  };

  return (
    <div className="calculator-form">
      <h2>📁 Portfolio Return Calculator</h2>
      <div className="form-group">
        <label>Initial Portfolio Value (₹)</label>
        <input type="number" value={initialValue} onChange={(e) => setInitialValue(Number(e.target.value))} />
        <input type="range" min="100000" max="10000000" step="100000" value={initialValue} onChange={(e) => setInitialValue(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Current Portfolio Value (₹)</label>
        <input type="number" value={currentValue} onChange={(e) => setCurrentValue(Number(e.target.value))} />
        <input type="range" min="100000" max="10000000" step="100000" value={currentValue} onChange={(e) => setCurrentValue(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Dividends Received (₹)</label>
        <input type="number" value={dividends} onChange={(e) => setDividends(Number(e.target.value))} />
        <input type="range" min="0" max="500000" step="5000" value={dividends} onChange={(e) => setDividends(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Holding Period (Years)</label>
        <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
        <input type="range" min="1" max="20" value={years} onChange={(e) => setYears(Number(e.target.value))} />
      </div>
      <button className="calculate-btn" onClick={calculate}>Calculate</button>
      {result && (
        <div className="result-box">
          <div className="result-item total">
            <span>Annualized Return</span>
            <strong className="positive">{result.annualizedReturn}%</strong>
          </div>
          <div className="result-item">
            <span>Total Return</span>
            <strong>{result.totalReturn}%</strong>
          </div>
          <div className="result-item">
            <span>Absolute Gain</span>
            <strong className="positive">₹{Number(result.absoluteGain).toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export const TaxCalculator = () => {
  const [income, setIncome] = useState(1000000);
  const [deductions, setDeductions] = useState(150000);
  const [regime, setRegime] = useState('old');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const taxableIncome = regime === 'old' ? income - deductions : income;
    let tax = 0;
    
    if (regime === 'old') {
      if (taxableIncome > 1000000) tax = 112500 + (taxableIncome - 1000000) * 0.3;
      else if (taxableIncome > 500000) tax = 12500 + (taxableIncome - 500000) * 0.2;
      else if (taxableIncome > 250000) tax = (taxableIncome - 250000) * 0.05;
    } else {
      if (taxableIncome > 1500000) tax = 187500 + (taxableIncome - 1500000) * 0.3;
      else if (taxableIncome > 1200000) tax = 120000 + (taxableIncome - 1200000) * 0.25;
      else if (taxableIncome > 900000) tax = 60000 + (taxableIncome - 900000) * 0.2;
      else if (taxableIncome > 600000) tax = 30000 + (taxableIncome - 600000) * 0.1;
      else if (taxableIncome > 300000) tax = (taxableIncome - 300000) * 0.05;
    }
    
    const cess = tax * 0.04;
    const totalTax = tax + cess;
    
    setResult({
      taxableIncome: taxableIncome.toFixed(0),
      tax: tax.toFixed(0),
      cess: cess.toFixed(0),
      totalTax: totalTax.toFixed(0),
      netIncome: (income - totalTax).toFixed(0)
    });
  };

  return (
    <div className="calculator-form">
      <h2>🧾 Income Tax Calculator</h2>
      <div className="form-group">
        <label>Annual Income (₹)</label>
        <input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} />
        <input type="range" min="100000" max="10000000" step="100000" value={income} onChange={(e) => setIncome(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Tax Regime</label>
        <select value={regime} onChange={(e) => setRegime(e.target.value)} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e9ecef'}}>
          <option value="old">Old Regime (with deductions)</option>
          <option value="new">New Regime (no deductions)</option>
        </select>
      </div>
      {regime === 'old' && (
        <div className="form-group">
          <label>Deductions (₹)</label>
          <input type="number" value={deductions} onChange={(e) => setDeductions(Number(e.target.value))} />
          <input type="range" min="0" max="500000" step="10000" value={deductions} onChange={(e) => setDeductions(Number(e.target.value))} />
        </div>
      )}
      <button className="calculate-btn" onClick={calculate}>Calculate</button>
      {result && (
        <div className="result-box">
          <div className="result-item">
            <span>Taxable Income</span>
            <strong>₹{Number(result.taxableIncome).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Income Tax</span>
            <strong className="negative">₹{Number(result.tax).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Cess (4%)</span>
            <strong className="negative">₹{Number(result.cess).toLocaleString()}</strong>
          </div>
          <div className="result-item total">
            <span>Total Tax</span>
            <strong className="negative">₹{Number(result.totalTax).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Net Income</span>
            <strong className="positive">₹{Number(result.netIncome).toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  );
};
