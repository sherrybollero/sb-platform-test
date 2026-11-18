export const PracticeWidget = ({ title, blurb, children }) => {
  const dialogRef = useRef(null);
  const sectionRef = useRef(null);

  // On wide screens, move the card into Mintlify's right-hand "On this page" column.
  // Elsewhere (narrow screens, or if the column isn't found) it stays inline in the article.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !window.matchMedia("(min-width: 1280px)").matches) return;
    const home = el.parentNode;
    // Mintlify renders the column after the page loads and can drop foreign nodes when it
    // re-renders, so keep re-attaching the card until it sticks.
    const place = () => {
      const viewport = document.querySelector("#table-of-contents [data-component-part=\"scroll-area-viewport\"]");
      // Pages without headings get an empty column, so fall back to the column itself.
      const host = (viewport && viewport.firstElementChild) || document.getElementById("table-of-contents-layout");
      if (host && el.parentNode !== host) host.appendChild(el);
    };
    const observer = new MutationObserver(place);
    observer.observe(document.body, { childList: true, subtree: true });
    place();
    return () => {
      observer.disconnect();
      // Put the card back so React can unmount it from where it rendered it.
      if (home && el.parentNode !== home) home.appendChild(el);
    };
  }, []);

  return (
    <section ref={sectionRef} className="practice-widget" aria-labelledby="practice-widget-heading">
      <p className="practice-title" id="practice-widget-heading">Practice</p>
      <p className="practice-blurb">{blurb}</p>
      <button type="button" className="practice-open" aria-haspopup="dialog" onClick={() => dialogRef.current && dialogRef.current.showModal()}>
        Open practice window
      </button>
      <dialog
        ref={dialogRef}
        className="practice-dialog"
        aria-label={`Practice: ${title}`}
        onClick={(e) => { if (e.target === dialogRef.current) dialogRef.current.close(); }}
      >
        <button type="button" className="practice-close" aria-label="Close practice window" onClick={() => dialogRef.current.close()}>&times;</button>
        {children}
      </dialog>
    </section>
  );
};
