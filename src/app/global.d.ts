
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'code-embed': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                'snippet-id': string;
            };
        }
    }
}

// This empty export is needed to treat this file as a module
export {};
