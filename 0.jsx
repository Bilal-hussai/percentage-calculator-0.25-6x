import React, { useState, useEffect } from 'react';

// Modern, simple 0.25% calculator (single-file React component)
// Tailwind CSS assumed to be available in the project

export default function QuarterPercentCalculator() {
  const [amountInput, setAmountInput] = useState('71708'); // example prefilled
  const [amount, setAmount] = useState(71708);
  const [percentValue, setPercentValue] = useState(0);
  const [resultValue, setResultValue] = useState(0);
  const [rounding, setRounding] = useState('2'); // options: 'full', '2', 'int'
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // parse input safely (allow commas)
    const parsed = Number(String(amountInput).replace(/,/g, ''));
    const safe = Number.isFinite(parsed) ? parsed : 0;
    setAmount(safe);
  }, [amountInput]);

  useEffect(() => {
    // compute 0.25% = 0.0025 * amount
    const rawPercent = amount * 0.0025;
    const rawResult = amount - rawPercent;
    setPercentValue(rawPercent);
    setResultValue(rawResult);
  }, [amount]);

  function formatNumber(n) {
    if (!Number.isFinite(n)) return '0';
    if (rounding === 'full') return String(n);
    if (rounding === 'int') return String(Math.round(n));
    // default 2 decimals
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function handleCopy() {
    const text = `Amount: ${formatNumber(amount)}\n0.25%: ${formatNumber(percentValue)}\nAfter subtracting 0.25%: ${formatNumber(resultValue)}`;
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => {
      setCopied(false);
    });
  }

  function handleQuickExample() {
    setAmountInput('71708');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3EDF2] p-6">
      <div className="max-w-xl w-full bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">0.25% Calculator</h1>
          <button
            onClick={handleQuickExample}
            className="text-sm px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-50"
            aria-label="Load example"
          >
            Load example
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">Type any amount and this tool will compute <strong>0.25%</strong> (0.0025 × amount) and subtract it from the original amount. Results shown with selectable rounding.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <label className="flex flex-col">
            <span className="text-xs text-gray-700 mb-1">Amount</span>
            <input
              inputMode="decimal"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-200 text-black text-lg outline-none focus:ring-2 focus:ring-offset-1"
              placeholder="Enter amount (e.g. 71708)"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-xs text-gray-700 mb-1">Rounding</span>
            <select value={rounding} onChange={(e) => setRounding(e.target.value)} className="px-4 py-3 rounded-lg border border-gray-200 text-black outline-none">
              <option value="2">2 decimal places (recommended)</option>
              <option value="full">Full precision</option>
              <option value="int">Nearest integer</option>
            </select>
          </label>
        </div>

        <div className="rounded-lg border border-gray-100 p-4 bg-white">
          <div className="grid grid-cols-3 gap-3 text-sm text-gray-700">
            <div className="col-span-2">Original amount</div>
            <div className="text-right font-medium">{formatNumber(amount)}</div>

            <div className="col-span-2">0.25% of amount (0.0025 × amount)</div>
            <div className="text-right font-medium">{formatNumber(percentValue)}</div>

            <div className="col-span-2">After subtracting 0.25%</div>
            <div className="text-right font-semibold text-lg">{formatNumber(resultValue)}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={handleCopy}
            className="flex-1 px-4 py-3 rounded-xl font-medium shadow-sm text-black text-base"
            style={{
              backgroundColor: '#fe6100',
              boxShadow: '0 6px 20px rgba(254,97,0,0.28)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 28px rgba(229,88,0,0.32)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 6px 20px rgba(254,97,0,0.28)'}
          >
            {copied ? 'Copied ✓' : 'Copy results'}
          </button>

          <a
            onClick={() => { /* no-op safe link: could be extended to download CSV */ }}
            className="px-4 py-3 rounded-xl font-medium border border-gray-200 text-sm text-black cursor-pointer"
            role="button"
            title="Reset"
            onKeyDown={() => {}}
            onClickCapture={() => { setAmountInput('0'); setRounding('2'); }}
          >
            Reset
          </a>
        </div>

        <div className="mt-4 text-xs text-gray-500">Precision note: computation uses exact JS floating point. Use <strong>Full precision</strong> if you want the raw value, or select rounding for display-friendly numbers.</div>

        <div className="mt-4 border-t pt-4 text-sm text-gray-600">
          <strong>Example (prefilled):</strong> 71708 → 0.25% = { (71708 * 0.0025).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } → after subtract = { ((71708) - (71708 * 0.0025)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
        </div>
      </div>
    </div>
  );
}
