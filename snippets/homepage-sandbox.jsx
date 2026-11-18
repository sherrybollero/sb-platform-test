export const HomepageSandbox = () => {
  const sections = [
    { id: 'benchmarking', label: 'Benchmarking status', group: 'homepage' },
    { id: 'resume', label: 'Quick resume', group: 'homepage', locked: true },
    { id: 'positioning', label: 'Workforce positioning', group: 'homepage' },
    { id: 'survey', label: 'Survey utilization', group: 'sidebar' },
    { id: 'reports', label: 'Reports', group: 'sidebar' },
  ];
  const groups = ['homepage', 'sidebar'];
  const byId = Object.fromEntries(sections.map((s) => [s.id, s]));
  const original = {
    order: Object.fromEntries(groups.map((g) => [g, sections.filter((s) => s.group === g).map((s) => s.id)])),
    hidden: [],
  };
  const clone = (l) => ({
    order: Object.fromEntries(groups.map((g) => [g, [...l.order[g]]])),
    hidden: [...l.hidden],
  });
  const isOriginal = (l) => !l.hidden.length && groups.every((g) => l.order[g].join() === original.order[g].join());

  const [saved, setSaved] = useState(() => clone(original));
  const [draft, setDraft] = useState(() => clone(original));
  const [dragging, setDragging] = useState(null);
  const [status, setStatus] = useState('Change the layout, then click Save.');
  const rootRef = useRef(null);

  const move = (group, id, by) => {
    const next = clone(draft);
    const ids = next.order[group];
    const i = ids.indexOf(id);
    const j = i + by;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    setDraft(next);
    setTimeout(() => {
      const h = rootRef.current && rootRef.current.querySelector(`.hs-handle[data-id="${id}"]`);
      if (h) h.focus();
    }, 0);
  };
  const toggle = (id, checked) => {
    const next = clone(draft);
    next.hidden = checked ? next.hidden.filter((h) => h !== id) : [...next.hidden, id];
    setDraft(next);
  };
  const dragOver = (g, id) => {
    if (!dragging || dragging === id || byId[dragging].group !== g) return;
    const next = clone(draft);
    const ids = next.order[g];
    ids.splice(ids.indexOf(id), 0, ids.splice(ids.indexOf(dragging), 1)[0]);
    setDraft(next);
  };
  const save = () => {
    setSaved(clone(draft));
    setStatus(isOriginal(draft) ? 'Saved. Everything is back in its original place.' : 'Saved. Your homepage now shows your changes.');
  };
  const cancel = () => {
    setDraft(clone(saved));
    setStatus('Changes discarded.');
  };
  const cards = (g) =>
    saved.order[g].filter((id) => !saved.hidden.includes(id)).map((id) => <div className="hs-card" key={id}>{byId[id].label}</div>);

  return (
    <div className="hs" ref={rootRef} role="group" aria-labelledby="hs-title">
      <div className="hs-header">
        <strong id="hs-title">Practice Here First</strong>
        <span className="hs-badge">Sample layout</span>
      </div>
      <div className="hs-grid">
        <div className="hs-window" role="group" aria-label="Customize widgets window">
          <div className="hs-window-head">
            <div>
              <div className="hs-window-title">Customize widgets</div>
              <p className="hs-window-sub">Rearrange, show, or hide widgets to create a layout that fits your workflow.</p>
            </div>
            <button type="button" className="hs-x" aria-label="Close and discard changes" onClick={cancel}>&times;</button>
          </div>
          {groups.map((g) => (
            <div key={g}>
              <div className="hs-group-label">{g === 'homepage' ? 'Homepage' : 'Sidebar'}</div>
              <ul className="hs-list">
                {draft.order[g].map((id) => {
                  const s = byId[id];
                  return (
                    <li
                      key={id}
                      className={`hs-item${dragging === id ? ' hs-dragging' : ''}`}
                      draggable
                      onDragStart={(e) => { setDragging(id); e.dataTransfer.setData('text/plain', id); }}
                      onDragEnd={() => setDragging(null)}
                      onDragOver={(e) => { e.preventDefault(); dragOver(g, id); }}
                    >
                      <input
                        type="checkbox"
                        id={`hs-${id}`}
                        checked={!!s.locked || !draft.hidden.includes(id)}
                        disabled={!!s.locked}
                        onChange={(e) => toggle(id, e.target.checked)}
                      />
                      <label htmlFor={`hs-${id}`}>{s.label}</label>
                      <button
                        type="button"
                        className="hs-handle"
                        data-id={id}
                        aria-label={`Drag handle for ${s.label}. Press the up or down arrow key to reorder.`}
                        onKeyDown={(e) => {
                          if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
                          e.preventDefault();
                          move(g, id, e.key === 'ArrowUp' ? -1 : 1);
                        }}
                      >
                        <span></span><span></span><span></span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className="hs-footer">
            <button type="button" className="hs-btn" onClick={cancel}>Cancel</button>
            <button type="button" className="hs-btn hs-btn-primary" onClick={save}>Save</button>
          </div>
        </div>
        <div>
          <div className="hs-h">Your Homepage</div>
          <div className="hs-page">
            <div className="hs-main">{cards('homepage')}</div>
            <div className="hs-side">{cards('sidebar')}</div>
          </div>
        </div>
      </div>
      <p className="hs-status" aria-live="polite">{status}</p>
    </div>
  );
};
