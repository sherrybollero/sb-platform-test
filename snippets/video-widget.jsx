export const VideoWidget = ({ src, title }) => {
  const dialogRef = useRef(null);
  const playerRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
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

  const expand = () => {
    // Pause the sidebar player so two videos don't play at once.
    if (playerRef.current && playerRef.current.contentWindow) {
      playerRef.current.contentWindow.postMessage(JSON.stringify({ method: 'pause' }), '*');
    }
    setExpanded(true);
    if (dialogRef.current) dialogRef.current.showModal();
  };

  return (
    <section ref={sectionRef} className="video-widget" aria-labelledby="video-widget-heading">
      <div className="video-header">
        <p className="video-title" id="video-widget-heading">Watch</p>
        <button type="button" className="video-expand" aria-haspopup="dialog" onClick={expand}>Expand</button>
      </div>
      <div className="video-frame">
        <iframe ref={playerRef} src={src} title={`Video: ${title}`} allow="fullscreen; picture-in-picture" allowFullScreen loading="lazy" />
      </div>
      <dialog
        ref={dialogRef}
        className="video-dialog"
        aria-label={`Video: ${title}`}
        onClick={(e) => { if (e.target === dialogRef.current) dialogRef.current.close(); }}
        onClose={() => setExpanded(false)}
      >
        <button type="button" className="video-close" aria-label="Close video" onClick={() => dialogRef.current.close()}>&times;</button>
        <div className="video-dialog-frame">
          {/* Mounted only while open, so closing the dialog stops playback. */}
          {expanded && <iframe src={src} title={`Video: ${title}`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />}
        </div>
      </dialog>
    </section>
  );
};
