const extractPageContent = () => {
    try {
        const hostname = window.location.hostname;

        // Special handling for MSN articles
        if (hostname.includes('msn.com')) {
            // Helper function to recursively get shadow roots
            const getShadowRoot = (element) => {
                if (!element) return null;
                return element.shadowRoot || 
                       (element.tagName.toLowerCase() === 'cp-article' ? element : null) ||
                       Array.from(element.children).reduce((found, child) => 
                           found || getShadowRoot(child), null);
            };

            // Try to find the cp-article element through shadow DOM
            const entryPoint = document.querySelector('entry-point-views');
            const articleReader = document.querySelector('cp-article-reader');
            const cpArticle = document.querySelector('cp-article');
            
            // Try different paths to get to the content
            const possibleRoots = [
                cpArticle,
                articleReader?.shadowRoot?.querySelector('cp-article'),
                entryPoint?.shadowRoot?.querySelector('cp-article'),
                ...Array.from(document.querySelectorAll('*')).map(el => getShadowRoot(el))
            ].filter(Boolean);

            for (const root of possibleRoots) {
                if (!root) continue;

                // Look for text content in shadow DOM
                const paragraphs = Array.from(root.querySelectorAll('p, [class*="paragraph"]'))
                    .filter(p => {
                        const text = p.textContent.trim();
                        return text.length > 30 && 
                               !text.includes('More for You') &&
                               !text.includes('Continue reading') &&
                               !text.includes('RELATED') &&
                               !text.includes('READ MORE') &&
                               !text.match(/^(Share|Comment)$/i);
                    })
                    .map(p => p.textContent.trim());

                if (paragraphs.length > 0) {
                    return paragraphs.join('\n\n');
                }
            }

            // Fallback: try to find any meaningful paragraphs on the page
            const allParagraphs = Array.from(document.querySelectorAll('p'))
                .filter(p => {
                    const text = p.textContent.trim();
                    return text.length > 30 && 
                           !text.includes('More for You') &&
                           !text.includes('Continue reading') &&
                           !text.includes('RELATED') &&
                           !text.includes('READ MORE') &&
                           !text.match(/^(Share|Comment)$/i);
                })
                .map(p => p.textContent.trim());

            if (allParagraphs.length > 0) {
                return allParagraphs.join('\n\n');
            }
        }

        // Special handling for LeMonde articles
        if (hostname.includes('lemonde.fr')) {
            const article = document.querySelector('article');
            if (article) {
                const paragraphs = Array.from(article.querySelectorAll('p'))
                    .filter(p => {
                        const text = p.textContent.trim();
                        // Filter out short paragraphs and unwanted content
                        return text.length > 30 &&
                               !text.includes('Newsletter') &&
                               !text.includes('Subscribe') &&
                               !text.includes('Read more');
                    })
                    .map(p => p.textContent.trim());

                if (paragraphs.length > 0) {
                    return paragraphs.join('\n\n');
                }
            }
        }

        // Regular content extraction for other sites
        const article = document.querySelector('article');
        if (article && article.textContent.trim()) {
            return article.textContent;
        }

        const main = document.querySelector('main');
        if (main && main.textContent.trim()) {
            return main.textContent;
        }

        const bodyContent = Array.from(document.body.children)
            .filter(el => {
                const tag = el.tagName.toLowerCase();
                const role = el.getAttribute('role');
                return !['nav', 'header', 'footer'].includes(tag) &&
                       !['navigation', 'banner', 'contentinfo'].includes(role);
            })
            .map(el => el.textContent)
            .join('\n\n')
            .trim();

        return bodyContent || document.body.textContent.trim();
    } catch (error) {
        console.error('Error extracting page content:', error);
        return '';
    }
};

const sendContentToBackground = (content) => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage({ action: "summarize", content: content }, (response) => {
            if (response && response.summary) {
                console.log("Summary received:", response.summary);
            } else {
                console.error("No summary received.");
            }
        });
    }
};

// Only add chrome runtime listeners if we're in the browser environment
if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log('Message received in content script:', request);
        if (request.action === "getPageContent") {
            setTimeout(() => {
                const pageContent = extractPageContent();
                console.log('Extracted page content:', pageContent);
                sendResponse({ content: pageContent });
            }, 500);
            return true; // Required for async response
        }
    });

    // Wait for page to be fully loaded before extracting content
    if (document.readyState === 'complete') {
        const pageContent = extractPageContent();
        sendContentToBackground(pageContent);
    } else {
        window.addEventListener('load', () => {
            const pageContent = extractPageContent();
            sendContentToBackground(pageContent);
        });
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        extractPageContent,
        sendContentToBackground
    };
}