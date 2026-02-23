import React, { useState } from 'react';
import './Calculators.css';

const calculatorsList = [
  { id: 'sip', name: 'SIP Calculator', icon: '📈', description: 'Calculate returns on systematic investment' },
  { id: 'compound', name: 'Compound Interest', icon: '💰', description: 'Calculate compound interest returns' },
  { id: 'emi', name: 'EMI Calculator', icon: '🏠', description: 'Calculate loan EMI payments' },
  { id: 'cagr', name: 'CAGR Calculator', icon: '📊', description: 'Calculate compound annual growth rate' },
  { id: 'lumpsum', name: 'Lumpsum Investment', icon: '💵', description: 'Calculate one-time investment returns' },
  { id: 'inflation', name: 'Inflation Calculator', icon: '📉', description: 'Calculate inflation impact' },
  { id: 'retirement', name: 'Retirement Calculator', icon: '👴', description: 'Plan your retirement corpus' },
  { id: 'ppf', name: 'PPF Calculator', icon: '🏦', description: 'Calculate PPF maturity amount' },
  { id: 'nps', name: 'NPS Calculator', icon: '🎯', description: 'Calculate NPS pension returns' },
  { id: 'swp', name: 'SWP Calculator', icon: '💳', description: 'Systematic withdrawal planning' },
  { id: 'goal', name: 'Goal Planning', icon: '🎪', description: 'Plan for financial goals' },
  { id: 'asset', name: 'Asset Allocation', icon: '📦', description: 'Allocate assets optimally' },
  { id: 'risk', name: 'Risk-Reward Ratio', icon: '⚖️', description: 'Calculate trading risk-reward' },
  { id: 'portfolio', name: 'Portfolio Return', icon: '📁', description: 'Calculate portfolio returns' },
  { id: 'tax', name: 'Tax Calculator', icon: '🧾', description: 'Calculate income tax' }
];

const Calculators = () => {
  const [selectedCalculator, setSelectedCalculator] = useState(null);

  return (
    <div className="calculators-page">
      <div className="calculators-header">
        <h1>Financial Calculators</h1>
        <p>Choose from 15 powerful calculators to plan your finances</p>
      </div>

      {!selectedCalculator ? (
        <div className="calculators-grid">
          {calculatorsList.map(calc => (
            <div key={calc.id} className="calculator-card" onClick={() => setSelectedCalculator(calc.id)}>
              <div className="calc-icon">{calc.icon}</div>
              <h3>{calc.name}</h3>
              <p>{calc.description}</p>
              <button className="calc-btn">Calculate →</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="calculator-view">
          <button className="back-btn" onClick={() => setSelectedCalculator(null)}>← Back to Calculators</button>
          <div className="calculator-content">
            {selectedCalculator === 'sip' && <SIPCalculator />}
            {selectedCalculator === 'emi' && <EMICalculator />}
            {selectedCalculator === 'cagr' && <CAGRCalculator />}
            {!['sip', 'emi', 'cagr'].includes(selectedCalculator) && (
              <p className="coming-soon">Calculator interface coming soon...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);

  const calculateSIP = () => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    const futureValue = monthlyInvestment * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const invested = monthlyInvestment * months;
    const returns = futureValue - invested;
    
    setResult({
      futureValue: futureValue.toFixed(0),
      invested: invested.toFixed(0),
      returns: returns.toFixed(0)
    });
    setSaved(false);
  };

  const saveCalculation = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/calculators/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'sip',
          params: { monthlyInvestment, expectedReturn, timePeriod },
          result
        })
      });
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving calculation:', error);
    }
  };

  return (
    <div className="calculator-form">
      <h2>📈 SIP Calculator</h2>
      <div className="form-group">
        <label>Monthly Investment (₹)</label>
        <input type="number" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(Number(e.target.value))} />
        <input type="range" min="500" max="100000" step="500" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Expected Return Rate (% p.a.)</label>
        <input type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} />
        <input type="range" min="1" max="30" step="0.5" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Time Period (Years)</label>
        <input type="number" value={timePeriod} onChange={(e) => setTimePeriod(Number(e.target.value))} />
        <input type="range" min="1" max="40" value={timePeriod} onChange={(e) => setTimePeriod(Number(e.target.value))} />
      </div>
      <button className="calculate-btn" onClick={calculateSIP}>Calculate</button>
      {result && (
        <>
          <div className="result-box">
            <div className="result-item">
              <span>Invested Amount</span>
              <strong>₹{Number(result.invested).toLocaleString()}</strong>
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
        </>
      )}
    </div>
  );
};

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [result, setResult] = useState(null);

  const calculateEMI = () => {
    const monthlyRate = interestRate / 12 / 100;
    const months = tenure * 12;
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - loanAmount;
    
    setResult({
      emi: emi.toFixed(0),
      totalAmount: totalAmount.toFixed(0),
      totalInterest: totalInterest.toFixed(0)
    });
  };

  return (
    <div className="calculator-form">
      <h2>🏠 EMI Calculator</h2>
      <div className="form-group">
        <label>Loan Amount (₹)</label>
        <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} />
        <input type="range" min="100000" max="10000000" step="100000" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Interest Rate (% p.a.)</label>
        <input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
        <input type="range" min="5" max="20" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Loan Tenure (Years)</label>
        <input type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
        <input type="range" min="1" max="30" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
      </div>
      <button className="calculate-btn" onClick={calculateEMI}>Calculate</button>
      {result && (
        <div className="result-box">
          <div className="result-item total">
            <span>Monthly EMI</span>
            <strong>₹{Number(result.emi).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Principal Amount</span>
            <strong>₹{Number(loanAmount).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Total Interest</span>
            <strong className="negative">₹{Number(result.totalInterest).toLocaleString()}</strong>
          </div>
          <div className="result-item">
            <span>Total Amount</span>
            <strong>₹{Number(result.totalAmount).toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

const CAGRCalculator = () => {
  const [initialValue, setInitialValue] = useState(100000);
  const [finalValue, setFinalValue] = useState(200000);
  const [duration, setDuration] = useState(5);
  const [result, setResult] = useState(null);

  const calculateCAGR = () => {
    const cagr = (Math.pow(finalValue / initialValue, 1 / duration) - 1) * 100;
    const absoluteReturn = ((finalValue - initialValue) / initialValue) * 100;
    
    setResult({
      cagr: cagr.toFixed(2),
      absoluteReturn: absoluteReturn.toFixed(2),
      totalGain: (finalValue - initialValue).toFixed(0)
    });
  };

  return (
    <div className="calculator-form">
      <h2>📊 CAGR Calculator</h2>
      <div className="form-group">
        <label>Initial Investment (₹)</label>
        <input type="number" value={initialValue} onChange={(e) => setInitialValue(Number(e.target.value))} />
        <input type="range" min="10000" max="10000000" step="10000" value={initialValue} onChange={(e) => setInitialValue(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Final Value (₹)</label>
        <input type="number" value={finalValue} onChange={(e) => setFinalValue(Number(e.target.value))} />
        <input type="range" min="10000" max="10000000" step="10000" value={finalValue} onChange={(e) => setFinalValue(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Duration (Years)</label>
        <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
        <input type="range" min="1" max="30" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
      </div>
      <button className="calculate-btn" onClick={calculateCAGR}>Calculate</button>
      {result && (
        <div className="result-box">
          <div className="result-item total">
            <span>CAGR</span>
            <strong className="positive">{result.cagr}%</strong>
          </div>
          <div className="result-item">
            <span>Absolute Return</span>
            <strong>{result.absoluteReturn}%</strong>
          </div>
          <div className="result-item">
            <span>Total Gain</span>
            <strong className="positive">₹{Number(result.totalGain).toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculators;
