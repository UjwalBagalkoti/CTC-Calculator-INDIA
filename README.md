# TechLedger — India CTC Take-Home Salary Calculator

> Precision Fintech | FY 2024-25

TechLedger is an India CTC Salary Calculator for FY 2024-25 that instantly computes your real monthly take-home from gross CTC. It factors in EPF, gratuity, professional tax, and income tax across Old & New regimes with 80C/80D/HRA/NPS deductions, and recommends the regime that saves you the most.

---

## 🔗 Live Demo

> https://ctc-calculator-india.vercel.app

---

## 📸 Preview

![TechLedger Screenshot](screen.png)

---

## ✨ Features

- 🔄 **Old & New Regime** — accurate tax slabs with 87A rebate and 4% cess
- ⚡ **Live recalculation** — every input updates results instantly
- 💡 **Regime optimizer** — tells you which regime saves more and by how much
- 📊 **Salary distribution bar** — visual split of In-Hand / Tax / EPF / Other
- 🧾 **Deductions panel** — configurable 80C, 80D, HRA, NPS inputs
- 🎯 **Active slab highlight** — shows which tax slab your income falls into
- 🖨️ **Print support** — browser print produces a clean tax report
- 📱 **Responsive** — works on mobile and desktop

---

## 🧮 What Gets Calculated

| Component | Details |
|---|---|
| Employee EPF | Configurable 0–12% of CTC |
| Employer EPF | Fixed 12% of CTC |
| Gratuity | Configurable % of CTC (default 4.81% per Gratuity Act) |
| Professional Tax | ₹200/month — Karnataka standard |
| Standard Deduction | ₹50,000 (Old) / ₹75,000 (New) |
| 80C | ELSS / PPF / LIC — up to ₹1,50,000 |
| 80D | Health Insurance — up to ₹1,00,000 |
| HRA | House Rent Allowance exemption |
| NPS 80CCD(1B) | Additional NPS — up to ₹50,000 |
| Income Tax + Cess | As per chosen regime + 4% cess |

---

## 🏦 Tax Slabs

### Old Regime
| Income Range | Rate |
|---|---|
| Up to ₹2,50,000 | NIL |
| ₹2,50,001 – ₹5,00,000 | 5% |
| ₹5,00,001 – ₹10,00,000 | 20% |
| Above ₹10,00,000 | 30% |
> 87A Rebate: Full tax waived if taxable income ≤ ₹5,00,000

### New Regime (FY 2024-25)
| Income Range | Rate |
|---|---|
| Up to ₹3,00,000 | NIL |
| ₹3,00,001 – ₹7,00,000 | 5% |
| ₹7,00,001 – ₹10,00,000 | 10% |
| ₹10,00,001 – ₹12,00,000 | 15% |
| ₹12,00,001 – ₹15,00,000 | 20% |
| Above ₹15,00,000 | 30% |
> 87A Rebate: Full tax waived if taxable income ≤ ₹7,00,000

> **Both regimes include 4% Health & Education Cess on tax.**

---

## 🗂️ Project Structure

```
stitch_india_take_home_calculator/
├── index.html       # App structure and markup
├── style.css        # All styles — layout, components, responsive
├── calculator.js    # Full tax engine and DOM logic
├── screen.png       # UI preview
└── README.md        # This file
```

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/techledger-ctc-calculator.git

# Navigate into the folder
cd techledger-ctc-calculator

# Open in browser
open index.html
```

No dependencies. No build tools. No npm install. Just open and use.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (Grid, Flexbox) |
| Logic | Vanilla JavaScript (ES6+) |
| Fonts | Inter + JetBrains Mono (Google Fonts) |
| Icons | Tabler Icons CDN |

---

## 📋 Example Breakdown (₹25,00,000 CTC — Old Regime)

| Component | Amount |
|---|---|
| CTC | ₹25,00,000 |
| − Employer EPF | ₹3,00,000 |
| − Gratuity | ₹1,20,250 |
| **Gross Salary** | **₹20,79,750** |
| − Employee EPF | ₹3,00,000 |
| − Standard Deduction | ₹50,000 |
| − 80C | ₹1,50,000 |
| − Professional Tax | ₹2,400 |
| **Taxable Income** | **≈ ₹15,77,350** |
| − Income Tax + Cess | ≈ ₹3,20,000 |
| **Annual In-Hand** | **≈ ₹19,49,400** |
| **Monthly In-Hand** | **≈ ₹1,62,450** |

---

## 👨‍💻 Developer

**Ujwal Anil Bagalkoti**
📧 uabagalkoti@gmail.com

---

## 🦸 Built for Digital Heroes

[![Built for Digital Heroes](https://img.shields.io/badge/Built%20for-Digital%20Heroes-3b6934?style=for-the-badge)](https://digitalheroesco.com)

---

## 📄 License

MIT License — free to use, modify, and distribute.
"# CTC-Calculator-INDIA" 
"# CTC-Calculator-INDIA" 
