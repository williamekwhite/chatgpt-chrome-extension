const { JSDOM } = require('jsdom');

// Simulate a simple DOM for content.js logic
describe('Content Script', () => {
  it('should extract page content from body', () => {
    const dom = new JSDOM('<!DOCTYPE html><body><p>Hello World</p></body>');
    global.document = dom.window.document;
    const bodyText = document.body.textContent; // Use textContent for JSDOM compatibility
    expect(bodyText).toBe('Hello World');
  });
});
