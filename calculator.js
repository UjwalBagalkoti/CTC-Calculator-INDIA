'use strict';

/* ── State ── */
let regime  = 'old';
let epfPct  = 12;
let gratPct = 4.81;
let invOpen = false;

/* ── Helpers ── */
function fmt(n) {
  return '₹' + Math.round(n || 0).toLocaleString('en-IN');
}

function parseCTC() {
  const raw = document.getElementById('ctcInput').value.replace(/[^0-9]/g, '');
  return parseFloat(raw) || 0;
}

/* ── Regime toggle ── */
function setRegime(r) {
  regime = r;
  document.getElementById('btnOld').classList.toggle('active', r === 'old');
  document.getElementById('btnNew').classList.toggle('active', r === 'new');
  calculate();
}

/* ── Slider handlers ── */
function updateEPF(v) {
  epfPct = parseFloat(v);
  document.getElementById('epfPct').textContent = v + '%';
  calculate();
}

function updateGrat(v) {
  gratPct = parseFloat(v);
  document.getElementById('gratPct').textContent = parseFloat(v).toFixed(2) + '%';
  calculate();
}

/* ── Investment panel toggle ── */
function toggleInv() {
  invOpen = !invOpen;
  document.getElementById('invPanel').style.display = invOpen ? 'flex' : 'none';
  document.getElementById('invBtn').innerHTML = invOpen
    ? '<i class="ti ti-x"></i> Close'
    : '<i class="ti ti-pencil"></i> Edit 80C / 80D';
}

/* ── Tax computation: Old Regime ── */
function taxOld(income) {
  let tax = 0;
  if (income > 1000000) tax += (income - 1000000) * 0.30;
  if (income > 500000)  tax += (Math.min(income, 1000000) - 500000) * 0.20;
  if (income > 250000)  tax += (Math.min(income, 500000)  - 250000) * 0.05;
  if (income <= 500000) tax = 0; // Section 87A rebate
  return tax * 1.04;             // 4% Health & Education Cess
}

/* ── Tax computation: New Regime (FY 2024-25) ── */
function taxNew(income) {
  const slabs = [
    [300000,  0.00],
    [700000,  0.05],
    [1000000, 0.10],
    [1200000, 0.15],
    [1500000, 0.20],
    [Infinity,0.30]
  ];
  let tax = 0, prev = 0;
  for (const [limit, rate] of slabs) {
    if (income <= prev) break;
    tax += (Math.min(income, limit) - prev) * rate;
    prev = limit;
  }
  if (income <= 700000) tax = 0; // Section 87A rebate
  return tax * 1.04;             // 4% Health & Education Cess
}

/* ── Render tax slab table ── */
function renderSlabs(taxableIncome) {
  const isOld = regime === 'old';
  document.getElementById('slabTitle').textContent =
    isOld ? 'Tax Slabs — Old Regime' : 'Tax Slabs — New Regime 2024';

  const slabs = isOld
    ? [
        ['Up to ₹2.5L', 'NIL',  0,       250000  ],
        ['₹2.5L – ₹5L', '5%',  250000,  500000  ],
        ['₹5L – ₹10L', '20%',  500000,  1000000 ],
        ['Above ₹10L',  '30%',  1000000, Infinity],
      ]
    : [
        ['Up to ₹3L',    'NIL', 0,       300000  ],
        ['₹3L – ₹7L',   '5%',  300000,  700000  ],
        ['₹7L – ₹10L',  '10%', 700000,  1000000 ],
        ['₹10L – ₹12L', '15%', 1000000, 1200000 ],
        ['₹12L – ₹15L', '20%', 1200000, 1500000 ],
        ['Above ₹15L',  '30%', 1500000, Infinity],
      ];

  document.getElementById('slabRows').innerHTML = slabs.map(([range, rate, lo, hi]) => {
    const active = taxableIncome > lo && taxableIncome <= hi;
    return `<div class="slab-row">
      <span class="slab-range">${range}</span>
      <span class="slab-rate ${active ? 'slab-active' : ''}">${rate}</span>
    </div>`;
  }).join('');
}

/* ── Main calculation engine ── */
function calculate() {
  const ctc = parseCTC();
  if (!ctc) return;

  /* --- CTC decomposition --- */
  const empEPF   = ctc * (epfPct / 100);   // employee EPF contribution
  const emprEPF  = ctc * 0.12;              // employer EPF (always 12%)
  const gratuity = ctc * (gratPct / 100);   // gratuity deducted from CTC
  const profTax  = document.getElementById('profTaxCb').checked ? 2400 : 0; // ₹200×12

  // Gross salary = CTC minus employer-side components
  const grossSalary = ctc - emprEPF - gratuity;

  /* --- Deductions --- */
  const stdDed = regime === 'new' ? 75000 : 50000;

  // Old regime section-wise deductions (ignored under new regime)
  const sec80c = regime === 'old'
    ? Math.min(parseFloat(document.getElementById('sec80c').value)  || 0, 150000) : 0;
  const sec80d = regime === 'old'
    ? Math.min(parseFloat(document.getElementById('sec80d').value)  || 0, 100000) : 0;
  const hra    = regime === 'old'
    ? (parseFloat(document.getElementById('secHRA').value)          || 0) : 0;
  const nps    = regime === 'old'
    ? Math.min(parseFloat(document.getElementById('sec80ccd').value)|| 0,  50000) : 0;

  /* --- Taxable income --- */
  const taxableIncome = Math.max(
    0,
    grossSalary - empEPF - stdDed - sec80c - sec80d - hra - nps - profTax
  );

  /* --- Income tax + cess --- */
  const incomeTax = regime === 'old' ? taxOld(taxableIncome) : taxNew(taxableIncome);

  /* --- Take-home --- */
  const annualInHand  = Math.max(0, ctc - empEPF - emprEPF - gratuity - profTax - incomeTax);
  const monthlyInHand = annualInHand / 12;
  const effectiveRate = (incomeTax / ctc) * 100;
  const totalDeducted = ctc - annualInHand;

  /* --- Update DOM: results --- */
  document.getElementById('monthlyTakeHome').textContent = fmt(monthlyInHand);
  document.getElementById('annualInHand').textContent    = fmt(annualInHand);
  document.getElementById('grossSalary').textContent     = fmt(grossSalary);
  document.getElementById('taxLiability').textContent    = fmt(incomeTax);
  document.getElementById('effectiveTax').textContent    = effectiveRate.toFixed(1) + '%';
  document.getElementById('invTotal').textContent        = fmt(sec80c + sec80d + hra + nps);

  /* --- Update DOM: breakdown --- */
  document.getElementById('bEmpEPF').textContent   = fmt(empEPF);
  document.getElementById('bEmprEPF').textContent  = fmt(emprEPF);
  document.getElementById('bGrat').textContent     = fmt(gratuity);
  document.getElementById('bProfTax').textContent  = fmt(profTax);
  document.getElementById('bStd').textContent      = fmt(stdDed);
  document.getElementById('bTax').textContent      = fmt(incomeTax);
  document.getElementById('bTotal').textContent    = fmt(totalDeducted);

  /* --- Distribution bar --- */
  const other = gratuity + profTax;
  const total = annualInHand + incomeTax + empEPF + emprEPF + other || 1;
  const s = 100 / total;
  document.getElementById('barInHand').style.flex = (annualInHand     * s).toFixed(1);
  document.getElementById('barTax').style.flex    = (incomeTax        * s).toFixed(1);
  document.getElementById('barEPF').style.flex    = ((empEPF+emprEPF) * s).toFixed(1);
  document.getElementById('barOther').style.flex  = (other            * s).toFixed(1);

  /* --- Regime comparison (for optimizer hint) --- */
  const oldTax = taxOld(Math.max(
    0, grossSalary - empEPF - 50000 - sec80c - sec80d - hra - nps - profTax
  ));
  const newTax = taxNew(Math.max(
    0, grossSalary - empEPF - 75000 - profTax
  ));
  const better = newTax < oldTax ? 'New' : 'Old';
  const saving = Math.abs(Math.round(oldTax - newTax));

  document.getElementById('regimeHint').innerHTML = regime === better
    ? `<i class="ti ti-check"></i> Optimal regime selected`
    : `<i class="ti ti-alert-triangle"></i> Switch to ${better} Regime — save ${fmt(saving / 12)}/mo`;

  document.getElementById('hintText').innerHTML = newTax < oldTax
    ? `Switching to the <strong style="color:#b9eeab">New Regime</strong> could save approximately
       <span class="tip-amount">${fmt(saving)}</span> annually. Consider whether maximising 80C
       declarations outweighs the simplicity benefit of the New Regime.`
    : `The <strong style="color:#b9eeab">Old Regime</strong> saves you approximately
       <span class="tip-amount">${fmt(saving)}</span> annually given your current declarations.
       Maximise 80C (₹1.5L) and consider NPS 80CCD(1B) up to ₹50,000 for further savings.`;

  renderSlabs(taxableIncome);
}

/* ── CTC input: format as Indian number on each keystroke ── */
document.getElementById('ctcInput').addEventListener('input', function () {
  const num = parseInt(this.value.replace(/[^0-9]/g, ''), 10) || 0;
  this.value = num.toLocaleString('en-IN');
  calculate();
});

document.getElementById('ctcInput').addEventListener('keydown', function (e) {
  const allowed = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
  if (allowed.includes(e.key)) return;
  if (!/[0-9]/.test(e.key)) e.preventDefault();
});

calculate();