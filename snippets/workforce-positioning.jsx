export const WorkforcePositioning = () => {
  const percentiles = [10, 25, 50, 60, 75, 90];
  // Each value is % of the target market reference point (MRP) when the target is P50.
  const families = [
    { name: 'Accounting', base: 112, mid: 104, cash: 118 },
    { name: 'Finance', base: 108, mid: 99, cash: 111 },
    { name: 'Software/Digital Sales', base: 94, mid: 91, cash: 103 },
    { name: 'Project Management', base: 81, mid: 78, cash: 84 },
  ];
  // How much the market reference point rises or falls with the target percentile, relative to P50.
  const factors = { 10: 0.78, 25: 0.89, 50: 1, 60: 1.06, 75: 1.16, 90: 1.3 };
  const metrics = [
    { key: 'base', label: 'Base salary' },
    { key: 'mid', label: 'Midpoint' },
    { key: 'cash', label: 'Total cash' },
  ];
  // The chart shows 60% to 140% of the target MRP, with 100% at the center.
  const MIN = 60;
  const MAX = 140;
  const pct = (n) => `${n.toFixed(1)}%`;

  const [target, setTarget] = useState(50);
  const [tip, setTip] = useState(null);
  const factor = factors[target] || 1;
  const value = (f, k) => f[k] / factor;
  const avg = (k) => families.reduce((t, f) => t + value(f, k), 0) / families.length;
  const showTip = (e, family, m) => {
    const chart = e.currentTarget.closest('.wp-chart').getBoundingClientRect();
    const d = e.currentTarget.getBoundingClientRect();
    setTip({
      left: d.left - chart.left + d.width / 2,
      top: d.top - chart.top - 8,
      family: family.name,
      text: `${m.label}: ${pct(value(family, m.key))}`,
    });
  };
  const info = (cls) => <span className={`wp-i ${cls || ''}`} aria-hidden="true">i</span>;

  return (
    <div className="wp" role="group" aria-labelledby="wp-title">
      <div className="wp-header">
        <strong id="wp-title">Try It: Change the Target</strong>
        <span className="wp-badge">Sample data</span>
      </div>
      <div className="wp-ui">
        <div className="wp-ui-head">
          <div className="wp-ui-title">Workforce positioning</div>
          <div className="wp-controls">
            <label className="wp-target" htmlFor="wp-target-select">Target</label>
            <select id="wp-target-select" value={target} onChange={(e) => { setTarget(Number(e.target.value)); setTip(null); }}>
              {percentiles.map((p) => <option key={p} value={p}>{`P${p}`}</option>)}
            </select>
          </div>
        </div>
        <div className="wp-card">
          <div className="wp-left">
            <div className="wp-left-title">Position to market {info()}</div>
            <div className="wp-left-sub">Avg, employee pay vs target MRP</div>
            {metrics.map((m) => (
              <div key={m.key} className={`wp-tile wp-${m.key}`}>
                <div className="wp-tile-label">{m.label} {info('wp-i-light')}</div>
                <div className="wp-tile-value">{pct(avg(m.key))}</div>
              </div>
            ))}
          </div>
          <div className="wp-divider" aria-hidden="true"></div>
          <div className="wp-right">
            <div className="wp-axis" aria-hidden="true">
              <span>Under target {info()}</span>
              <span>At target {info()}</span>
              <span>Over target {info()}</span>
            </div>
            <div className="wp-chart" role="group" aria-label="Position to market by job family">
              {families.map((f) => (
                <div className="wp-row" key={f.name}>
                  <div className="wp-row-name">{f.name}</div>
                  <div className="wp-lane">
                    <div className="wp-bar"></div>
                    {metrics.map((m) => {
                      const v = value(f, m.key);
                      return (
                        <span
                          key={m.key}
                          className={`wp-dot wp-dot-${m.key}`}
                          tabIndex={0}
                          style={{ left: `${((Math.min(MAX, Math.max(MIN, v)) - MIN) / (MAX - MIN)) * 100}%` }}
                          aria-label={`${f.name}, ${m.label}: ${pct(v)} of target`}
                          onMouseEnter={(e) => showTip(e, f, m)}
                          onFocus={(e) => showTip(e, f, m)}
                          onMouseLeave={() => setTip(null)}
                          onBlur={() => setTip(null)}
                        ></span>
                      );
                    })}
                  </div>
                </div>
              ))}
              {tip && (
                <div className="wp-tip" role="tooltip" style={{ left: tip.left, top: tip.top, transform: 'translate(-50%, -100%)' }}>
                  <strong>{tip.family}</strong><br />{tip.text}
                </div>
              )}
            </div>
            <div className="wp-axis-caption">% Difference From target MRP</div>
          </div>
        </div>
      </div>
      <p className="wp-summary" aria-live="polite">{`Target set to P${target}. Every tile and dot recalculated. Hover or focus a dot for details.`}</p>
    </div>
  );
};
