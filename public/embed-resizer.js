window.addEventListener('message', function(event) {
    if (event.data.type === 'code-embed-resize' && event.data.payload.id) {
      const iframe = document.querySelector('iframe[data-code-embed-id="' + event.data.payload.id + '"]');
      if (iframe && event.data.payload.height) {
        iframe.style.height = event.data.payload.height + 'px';
      }
    }
});
