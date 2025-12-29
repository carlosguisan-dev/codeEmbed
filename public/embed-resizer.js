
/**
 * CodeEmbed Resizer Script
 * 
 * This script listens for 'message' events from embedded CodeEmbed iframes
 * and automatically resizes the iframe to match its content's height.
 * This prevents double scrollbars and ensures the embed fits perfectly.
 * 
 * To use, simply include this script tag on any page where you have
 * embedded a CodeEmbed snippet.
 */
window.addEventListener('message', function(event) {
  // Ensure the message is from a trusted source if you have multiple iframes
  // For now, we check if the data structure matches our expected payload.
  if (event.data && event.data.type === 'code-embed-resize') {
    var payload = event.data.payload;
    if (payload && payload.id && payload.height) {
      // Find the specific iframe that sent the message using a data attribute
      var iframe = document.querySelector('iframe[data-code-embed-id="' + payload.id + '"]');
      
      if (iframe) {
        iframe.style.height = payload.height + 'px';
      }
    }
  }
});
