// This script listens for messages from embedded CodeEmbed iframes and resizes them to match their content height.
window.addEventListener('message', function (event) {
  // IMPORTANT: Check the origin of the message for security
  // You might want to restrict this to your app's domain in a production environment
  // if (event.origin !== 'https://your-app-domain.com') {
  //   return;
  // }

  const data = event.data;

  // Check if the message is from our CodeEmbed iframe
  if (data && data.type === 'code-embed-resize' && data.snippetId) {
    const iframe = document.getElementById('code-embed-' + data.snippetId);
    
    if (iframe) {
      iframe.style.height = data.height + 'px';
    }
  }
});
