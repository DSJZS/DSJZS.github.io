// APlayer intercepts hash links but looks up percent-encoded IDs literally.
// Let the browser handle links to headings with non-ASCII IDs instead.
document.addEventListener("click", event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || !/%[0-9a-f]{2}/i.test(link.hash)) return;

  try {
    if (document.getElementById(decodeURIComponent(link.hash.slice(1)))) {
      event.stopPropagation();
    }
  } catch (_) {
    // Leave malformed fragments to the normal click handlers.
  }
}, true);
