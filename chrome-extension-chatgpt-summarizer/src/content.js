const extractPageContent = () => {
    try {
        // Try to get content from article element first (common in news sites)
        const article = document.querySelector('article');
        if (article && article.textContent.trim()) {
            return article.textContent;
        }

        // Try to get main content
        const main = document.querySelector('main');
        if (main && main.textContent.trim()) {
            return main.textContent;
        }

        // Fallback to body content
        const bodyContent = document.body.textContent || document.body.innerText;
        return bodyContent ? bodyContent.trim() : '';
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