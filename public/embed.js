
class CodeEmbed extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const snippetId = this.getAttribute('snippet-id');
    if (!snippetId) {
      this.renderError('Snippet ID is missing.');
      return;
    }

    try {
      // Use a relative path to the API endpoint
      const response = await fetch(`/api/snippets/${snippetId}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Snippet not found or access denied.`);
      }
      
      const snippet = await response.json();

      // Check if snippet data is valid
      if (!snippet || !snippet.code) {
        this.renderError('Invalid snippet data received.');
        return;
      }
      
      this.render(snippet);

    } catch (error) {
      console.error('CodeEmbed Error:', error);
      this.renderError(error.message || 'Failed to load snippet.');
    }
  }

  renderError(message) {
    const shadow = this.shadowRoot;
    shadow.innerHTML = `
      <style>
        .error-container {
          padding: 1rem;
          border: 1px solid #dc2626;
          border-radius: 0.5rem;
          background-color: #fef2f2;
          color: #b91c1c;
          font-family: sans-serif;
        }
      </style>
      <div class="error-container">
        <strong>Error:</strong> ${message}
      </div>
    `;
  }

  render(snippet) {
    const shadow = this.shadowRoot;

    // Determine base URL for the 'powered by' link
    const embedUrl = `/embed/${snippet.id}`;

    // Get query parameters from the custom element attributes
    const showTitle = this.getAttribute('show-title') !== 'false';
    const showDescription = this.getAttribute('show-description') !== 'false';

    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .card {
          width: 100%;
          max-width: 100%;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
          border-radius: 0.75rem;
          overflow: hidden;
        }
        .card-header, .card-footer, .card-content {
          padding: 1.5rem;
        }
        .card-header {
          padding-bottom: 0;
        }
        .card-footer {
          padding-top: 0;
          background-color: #f8fafc;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
        .card-content {
          padding-top: ${showTitle || showDescription ? '1.5rem' : '0'};
          padding-bottom: ${showTitle || showDescription ? '1.5rem' : '0'};
          padding: ${(showTitle || showDescription) ? '1.5rem' : '0'};
        }
        .card-title {
          font-size: 1.5rem;
          line-height: 2rem;
          font-weight: 600;
        }
        .card-description {
          margin-top: 0.25rem;
          color: #64748b;
        }
        .powered-by-link {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.75rem;
            color: #64748b;
            text-decoration: none;
        }
        .powered-by-link:hover {
            color: #0f172a;
        }
        .logo {
            width: 100px;
            height: 25px;
            object-fit: contain;
        }
        .dark-theme {
            background-color: #0d1117;
            color: #e5e7eb;
        }
        .dark-theme .card {
            border-color: #374151;
            background-color: #1f2937;
        }
        .dark-theme .card-header {
            color: #f9fafb;
        }
        .dark-theme .card-description {
            color: #9ca3af;
        }
        .dark-theme .card-footer {
            background-color: #111827;
        }
        .dark-theme .powered-by-link {
            color: #9ca3af;
        }
        .dark-theme .powered-by-link:hover {
            color: #f9fafb;
        }

        /* Basic Syntax Highlighting - can be extended */
        pre {
          margin: 0;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          font-family: monospace;
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
        .theme-dark pre {
            background-color: #0d1117;
            color: #e5e7eb;
        }
        .theme-light pre {
            background-color: #f8fafc;
            color: #0f172a;
        }
      </style>
      
      <div class="card ${snippet.theme === 'dark' ? 'dark-theme' : ''}">
        ${(showTitle || showDescription) ? `
        <div class="card-header">
          ${showTitle ? `<div class="card-title">${snippet.title}</div>` : ''}
          ${showDescription ? `<div class="card-description">${snippet.description || ''}</div>` : ''}
        </div>
        ` : ''}
        
        <div class="card-content">
            <div class="theme-${snippet.theme}">
                <pre><code>${snippet.code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
            </div>
        </div>
        
        <div class="card-footer">
            <a href="${embedUrl}" target="_blank" rel="noopener noreferrer" class="powered-by-link">
                <span>Powered by</span>
                 <img src="/logo.svg" alt="CodeEmbed Logo" class="logo" />
            </a>
        </div>
      </div>
    `;
  }
}

// Define the custom element if it's not already defined
if (!customElements.get('code-embed')) {
  customElements.define('code-embed', CodeEmbed);
}
