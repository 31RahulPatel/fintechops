// SIP Calculator
const calculateSIP = (monthlyInvestment, annualRate, years) => {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  const futureValue = monthlyInvestment * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
  const invested = monthlyInvestment * months;
  const returns = futureValue - invested;
  return { futureValue: Math.round(futureValue), invested: Math.round(invested), returns: Math.round(returns) };
};

// Compound Interest
const calculateCompoundInterest = (principal, rate, time, frequency = 1) => {
  const amount = principal * Math.pow(1 + rate / (100 * frequency), frequency * time);
  const interest = amount - principal;
  return { amount: Math.round(amount), interest: Math.round(interest), principal };
};

// EMI Calculator
const calculateEMI = (principal, rate, tenure) => {
  const monthlyRate = rate / 12 / 100;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
  const totalAmount = emi * tenure;
  const interest = totalAmount - principal;
  return { emi: Math.round(emi), totalAmount: Math.round(totalAmount), interest: Math.round(interest) };
};

// CAGR Calculator
const calculateCAGR = (initialValue, finalValue, years) => {
  const cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
  return { cagr: cagr.toFixed(2), absoluteReturn: ((finalValue - initialValue) / initialValue * 100).toFixed(2) };
};

// Lumpsum Investment
const calculateLumpsum = (principal, rate, years) => {
  const futureValue = principal * Math.pow(1 + rate / 100, years);
  const returns = futureValue - principal;
  return { futureValue: Math.round(futureValue), invested: principal, returns: Math.round(returns) };
};

// Inflation Calculator
const calculateInflation = (currentAmount, inflationRate, years) => {
  const futureValue = currentAmount * Math.pow(1 + inflationRate / 100, years);
  return { futureValue: Math.round(futureValue), inflationImpact: Math.round(futureValue - currentAmount) };
};

// Retirement Calculator
const calculateRetirement = (currentAge, retirementAge, monthlyExpense, inflationRate, returnRate) => {
  const yearsToRetirement = retirementAge - currentAge;
  const retirementYears = 25;
  const futureExpense = monthlyExpense * Math.pow(1 + inflationRate / 100, yearsToRetirement);
  const corpusRequired = (futureExpense * 12 * retirementYears) / (returnRate / 100);
  return { corpusRequired: Math.round(corpusRequired), futureMonthlyExpense: Math.round(futureExpense) };
};

// PPF Calculator
const calculatePPF = (yearlyInvestment, years) => {
  const rate = 7.1;
  let maturityAmount = 0;
  for (let i = 1; i <= years; i++) {
    maturityAmount = (maturityAmount + yearlyInvestment) * (1 + rate / 100);
  }
  const invested = yearlyInvestment * years;
  const interest = maturityAmount - invested;
  return { maturityAmount: Math.round(maturityAmount), invested, interest: Math.round(interest) };
};

// NPS Calculator
const calculateNPS = (monthlyInvestment, currentAge, retirementAge, returnRate) => {
  const years = retirementAge - currentAge;
  const months = years * 12;
  const monthlyRate = returnRate / 12 / 100;
  const maturityAmount = monthlyInvestment * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
  const invested = monthlyInvestment * months;
  const annuity = maturityAmount * 0.4;
  const lumpsum = maturityAmount * 0.6;
  return { maturityAmount: Math.round(maturityAmount), invested, annuity: Math.round(annuity), lumpsum: Math.round(lumpsum) };
};

// SWP Calculator
const calculateSWP = (investment, withdrawalAmount, years, returnRate) => {
  const months = years * 12;
  const monthlyRate = returnRate / 12 / 100;
  let balance = investment;
  for (let i = 0; i < months; i++) {
    balance = balance * (1 + monthlyRate) - withdrawalAmount;
    if (balance < 0) break;
  }
  const totalWithdrawn = withdrawalAmount * months;
  return { finalBalance: Math.round(Math.max(0, balance)), totalWithdrawn, remainingMonths: balance > 0 ? months : Math.floor(investment / withdrawalAmount) };
};

// Goal Planning
const calculateGoalPlanning = (goalAmount, years, returnRate) => {
  const monthlyRate = returnRate / 12 / 100;
  const months = years * 12;
  const monthlyInvestment = goalAmount * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
  return { monthlyInvestment: Math.round(monthlyInvestment), totalInvested: Math.round(monthlyInvestment * months) };
};

// Asset Allocation
const calculateAssetAllocation = (totalAmount, equity, debt, gold) => {
  return {
    equity: Math.round(totalAmount * equity / 100),
    debt: Math.round(totalAmount * debt / 100),
    gold: Math.round(totalAmount * gold / 100)
  };
};

// Risk-Reward Ratio
const calculateRiskReward = (entryPrice, targetPrice, stopLoss) => {
  const reward = targetPrice - entryPrice;
  const risk = entryPrice - stopLoss;
  const ratio = reward / risk;
  return { ratio: ratio.toFixed(2), reward, risk };
};

// Portfolio Return
const calculatePortfolioReturn = (investments) => {
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrent = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const returns = totalCurrent - totalInvested;
  const returnPercent = (returns / totalInvested) * 100;
  return { totalInvested, totalCurrent, returns, returnPercent: returnPercent.toFixed(2) };
};

// Tax Calculator
const calculateTax = (income, regime = 'old') => {
  let tax = 0;
  if (regime === 'old') {
    if (income <= 250000) tax = 0;
    else if (income <= 500000) tax = (income - 250000) * 0.05;
    else if (income <= 1000000) tax = 12500 + (income - 500000) * 0.2;
    else tax = 112500 + (income - 1000000) * 0.3;
  } else {
    if (income <= 300000) tax = 0;
    else if (income <= 600000) tax = (income - 300000) * 0.05;
    else if (income <= 900000) tax = 15000 + (income - 600000) * 0.1;
    else if (income <= 1200000) tax = 45000 + (income - 900000) * 0.15;
    else if (income <= 1500000) tax = 90000 + (income - 1200000) * 0.2;
    else tax = 150000 + (income - 1500000) * 0.3;
  }
  return { tax: Math.round(tax), netIncome: Math.round(income - tax) };
};

module.exports = {
  calculateSIP,
  calculateCompoundInterest,
  calculateEMI,
  calculateCAGR,
  calculateLumpsum,
  calculateInflation,
  calculateRetirement,
  calculatePPF,
  calculateNPS,
  calculateSWP,
  calculateGoalPlanning,
  calculateAssetAllocation,
  calculateRiskReward,
  calculatePortfolioReturn,
  calculateTax
};
