const { JSDOM } = require('jsdom');
const path = require('path');
const fs = require('fs');

const contentScriptPath = path.join(__dirname, '../chrome-extension-chatgpt-summarizer/src/content.js');
const contentScript = require(contentScriptPath);

describe('Content Script', () => {
    let dom;

    beforeEach(() => {
        // Create a fresh DOM for each test
        dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
            url: 'https://example.com',
            runScripts: 'dangerously',
            resources: 'usable'
        });

        // Set up the global document
        global.document = dom.window.document;
        global.window = dom.window;
    });

    describe('extractPageContent', () => {
        it('should extract content from article element in news sites', () => {
            const articleContent = 'This is an article about standing up straight';
            document.body.innerHTML = `<article>${articleContent}</article><div>Some other content</div>`;
            
            const extractedContent = contentScript.extractPageContent();
            expect(extractedContent.trim()).toBe(articleContent);
        });

        it('should extract content from main element when article is not present', () => {
            const mainContent = 'Main content about health and posture';
            document.body.innerHTML = `<main>${mainContent}</main><div>Footer content</div>`;
            
            const extractedContent = contentScript.extractPageContent();
            expect(extractedContent.trim()).toBe(mainContent);
        });

        it('should extract body content when no article or main elements exist', () => {
            const bodyContent = 'Generic page content';
            document.body.innerHTML = `<div>${bodyContent}</div>`;
            
            const extractedContent = contentScript.extractPageContent();
            expect(extractedContent.trim()).toBe(bodyContent);
        });

        it('should handle MSN-like dynamic content', (done) => {
            document.body.innerHTML = '<div id="content-container"></div>';
            
            // Simulate dynamic content loading
            setTimeout(() => {
                const article = document.createElement('article');
                const content = 'Dynamically loaded article content';
                article.textContent = content;
                document.getElementById('content-container').appendChild(article);
                
                const extractedContent = contentScript.extractPageContent();
                expect(extractedContent.trim()).toBe(content);
                done();
            }, 100);
        }, 1000);
    });
});
