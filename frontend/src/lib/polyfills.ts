// Polyfills for browser environment
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.global = window;
  // @ts-ignore
  window.process = window.process || { env: {} };
  // @ts-ignore
  window.Buffer = window.Buffer || require('buffer').Buffer;
}

export {};
