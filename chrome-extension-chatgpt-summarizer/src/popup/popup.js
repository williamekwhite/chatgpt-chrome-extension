const summarizeButton = document.getElementById('summarize-button');

summarizeButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getPageContent' }, (response) => {
            console.log('Response from content script:', response); // Debug log
            if (response && response.content) {
                // Copy the content to the clipboard
                navigator.clipboard.writeText(response.content).then(() => {
                    // Open ChatGPT in a new tab
                    chrome.tabs.create({ url: 'https://chatgpt.com/g/g-p-68007c16262c8191a0b4855857bbadcb/project' });
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            } else {
                alert('No content found to copy.');
            }
        });
    });
});