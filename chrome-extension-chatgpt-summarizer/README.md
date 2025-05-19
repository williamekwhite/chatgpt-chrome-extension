# Chrome Extension ChatGPT Summarizer

This Chrome extension allows users to summarize the content of any webpage using ChatGPT. It extracts the page's content and sends it to the ChatGPT API for summarization, providing a concise overview of the information.

## Features

- Extracts text content from the current webpage.
- Sends the extracted content to ChatGPT for summarization.
- Displays the summarized content in a user-friendly popup.

## Project Structure

```
chrome-extension-chatgpt-summarizer
├── src
│   ├── background.js        # Background script for managing events and communication
│   ├── content.js          # Content script for extracting page content
│   ├── popup
│   │   ├── popup.html      # HTML structure for the popup
│   │   ├── popup.js        # JavaScript for handling popup interactions
│   │   └── popup.css       # Styles for the popup
├── manifest.json           # Configuration file for the Chrome extension
└── README.md               # Documentation for the project
```

## Installation

1. Clone the repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click on "Load unpacked" and select the `chrome-extension-chatgpt-summarizer` directory.

## Usage

1. Navigate to any webpage you want to summarize.
2. Click on the extension icon in the Chrome toolbar.
3. The popup will appear, and you can initiate the summarization process.
4. The summarized content will be displayed in the popup.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the extension.

## License

This project is licensed under the MIT License. See the LICENSE file for details.