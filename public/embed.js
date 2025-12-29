
class CodeEmbed extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['snippet-id'];
  }

  async connectedCallback() {
    const snippetId = this.getAttribute('snippet-id');
    if (!snippetId) {
      this.renderError('Snippet ID is missing.');
      return;
    }
    
    try {
      // Use the origin of the script to construct the API URL
      const scriptSrc = document.currentScript.src;
      const origin = new URL(scriptSrc).origin;
      const apiUrl = `${origin}/api/snippets/${snippetId}`;
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch snippet: ${response.statusText}`);
      }
      const snippet = await response.json();
      this.renderSnippet(snippet, origin);
    } catch (error) {
      this.renderError(error.message);
    }
  }

  renderError(message) {
    this.shadowRoot.innerHTML = `<div style="color: red; padding: 1rem; border: 1px solid red; border-radius: 8px;">Error: ${message}</div>`;
  }

  renderSnippet(snippet, origin) {
    const isDark = snippet.theme === 'dark';
    
    // Create a container and inject the iframe into the Shadow DOM
    const iframe = document.createElement('iframe');
    iframe.src = `${origin}/embed/${snippet.id}`;
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.title = snippet.title;
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    iframe.setAttribute('loading', 'lazy');
    iframe.dataset.codeEmbedId = snippet.id; // Add data attribute for resizing script

    this.shadowRoot.appendChild(iframe);
    
    // Communication for resizing
    window.addEventListener('message', (event) => {
        if (event.source !== iframe.contentWindow) {
            return; // Ignore messages from other sources
        }
        
        const { type, height, snippetId: receivedSnippetId } = event.data;

        if (type === 'code-embed-resize' && receivedSnippetId === snippet.id) {
            iframe.style.height = `${height}px`;
        }
    });
  }
}

customElements.define('code-embed', CodeEmbed);
