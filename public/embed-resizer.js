
'use strict';

// Listen for messages from any embedded snippet iframes
window.addEventListener('message', function (event) {
  // We only care about messages of a specific type from our app
  if (typeof event.data !== 'object' || event.data.type !== 'code-embed-resize') {
    return;
  }

  var data = event.data;
  var snippetId = data.snippetId;
  var height = data.height;

  if (!snippetId || !height) {
    return;
  }

  // Find the corresponding iframe using the data-attribute
  var iframe = document.querySelector('iframe[data-code-embed-id="' + snippetId + '"]');

  if (iframe) {
    // Set the height of the iframe, adding a small buffer just in case.
    iframe.style.height = (Number(height) + 16) + 'px';
  }
}, false);
