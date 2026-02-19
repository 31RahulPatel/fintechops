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
            {/* Add other calculators */}
            <p className="coming-soon">Calculator interface coming in next step...</p>
          </div>
        </div>
      )}
    </div>
  );
};

const SIPCalculator = () => <div>SIP Calculator Component</div>;
const EMICalculator = () => <div>EMI Calculator Component</div>;
const CAGRCalculator = () => <div>CAGR Calculator Component</div>;

export default Calculators;
