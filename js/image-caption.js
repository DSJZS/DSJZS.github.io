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

  function linkToOriginalImage(image) {
    if (image.closest('a')) return;

    var source = image.getAttribute('src');
    if (!source) return;

    var link = document.createElement('a');
    link.setAttribute('href', source);
    image.parentNode.insertBefore(link, image);
    link.appendChild(image);
  }

  function showImageCaptions() {
    document.querySelectorAll('.image-caption').forEach(function (caption) {
      var paragraph = caption.closest('p');
      if (!paragraph || !caption.textContent.trim()) return;
      if (!hasOnlyImageAndCaption(paragraph, caption)) return;

      var images = paragraph.querySelectorAll('img.markdown-image');
      if (images.length !== 1) return;

      caption.hidden = false;
      paragraph.classList.add('has-image-caption');
      linkToOriginalImage(images[0]);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showImageCaptions);
  } else {
    showImageCaptions();
  }
})();
