(function () {
  function isWhitespace(node) {
    return node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '';
  }

  function isCaptionableElement(node, caption) {
    if (node.nodeType !== Node.ELEMENT_NODE) return false;
    if (node === caption) return true;
    if (node.matches('img.markdown-image, br')) return true;

    if (node.matches('a')) {
      return Array.from(node.childNodes).every(function (child) {
        return isWhitespace(child) || isCaptionableElement(child, caption);
      });
    }

    return false;
  }

  function hasOnlyImageAndCaption(paragraph, caption) {
    return Array.from(paragraph.childNodes).every(function (node) {
      return isWhitespace(node) || isCaptionableElement(node, caption);
    });
  }

  function showImageCaptions() {
    document.querySelectorAll('.image-caption').forEach(function (caption) {
      var paragraph = caption.closest('p');
      if (!paragraph || !caption.textContent.trim()) return;
      if (!hasOnlyImageAndCaption(paragraph, caption)) return;

      caption.hidden = false;
      paragraph.classList.add('has-image-caption');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showImageCaptions);
  } else {
    showImageCaptions();
  }
})();
