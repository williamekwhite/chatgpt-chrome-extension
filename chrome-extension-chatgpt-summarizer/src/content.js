const extractPageContent = () => {
    const bodyText = document.body.innerText;
    return bodyText;
};

const sendContentToBackground = (content) => {
    chrome.runtime.sendMessage({ action: "summarize", content: content }, (response) => {
        if (response && response.summary) {
            console.log("Summary received:", response.summary);
        } else {
            console.error("No summary received.");
        }
    });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received in content script:', request); // Debug log
    if (request.action === "getPageContent") {
        const pageContent = document.body.innerText; // Extracts all visible text from the page
        console.log('Extracted page content:', pageContent); // Debug log
        sendResponse({ content: pageContent });
    }
});


const pageContent = extractPageContent();
sendContentToBackground(pageContent);