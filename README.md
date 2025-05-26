# ChatGPT Chrome Extension - Article Summarizer

A Chrome extension that extracts article content from various news websites and sends it to ChatGPT for summarization. It provides a concise overview of any webpage's content through a user-friendly popup interface. Built with modern JavaScript and tested with Jest and Puppeteer.

## Features

- Extracts article content from multiple news sources:
  - MSN (with Shadow DOM support)
  - Le Monde
  - Generic article sites
- Handles modern web components and Shadow DOM
- Filters out unwanted content (ads, related articles, etc.)
- Sends content to ChatGPT for summarization
- Robust error handling and retries

## Technical Details

- **Content Extraction**: Uses advanced DOM traversal techniques including Shadow DOM support for modern web components
- **Testing**: 
  - Unit tests with Jest
  - End-to-end tests with Puppeteer
  - Comprehensive test coverage for content extraction
- **Error Handling**: Multiple fallback strategies for content extraction
- **Performance**: Optimized for quick content extraction without impacting page load

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd chatgpt-chrome-extension
```

2. Install dependencies:
```bash
npm install
```

3. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `chrome-extension-chatgpt-summarizer` directory

## Usage

1. Navigate to any webpage you want to summarize.
2. Click on the extension icon in the Chrome toolbar.
3. The popup will appear with the extracted content.
4. Click to initiate the summarization process.
5. View the summarized content in the popup.

## Development

### Project Structure
```
├── chrome-extension-chatgpt-summarizer/
│   ├── manifest.json
│   ├── src/
│   │   ├── content.js
│   │   └── popup/
│   │       ├── popup.html
│   │       ├── popup.css
│   │       └── popup.js
└── tests/
    ├── content.test.js
    ├── e2e.test.js
    └── setup.js
```

### Testing

Run unit tests:
```bash
npm test
```

Run E2E tests:
```bash
npm run test:e2e
```

## Version History

- v1.2.0: Improved MSN article extraction with Shadow DOM support
- v1.1.0: Added Le Monde support and improved error handling
- v1.0.0: Initial release with basic article extraction

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Development Approach

This extension was developed using an AI-assisted coding approach ("vibe coding"), where GitHub Copilot Chat was used as an active development partner. The development process included:

- **Interactive Development**: Each feature was developed through natural language conversations with the AI, which helped:
  - Generate initial code structures
  - Debug complex DOM traversal issues
  - Implement Shadow DOM handling
  - Write and improve tests

- **Iterative Improvement**: The AI assistant helped refine the code through:
  - Real-time code reviews
  - Suggesting optimizations
  - Identifying edge cases
  - Improving error handling

- **Documentation**: This README and inline documentation were collaboratively written with the AI, ensuring comprehensive coverage of features and implementation details.

The "vibe coding" approach proved particularly effective for handling complex web scraping scenarios and modern web component architectures.

## Acknowledgments

- Built with modern JavaScript features
- Uses Jest and Puppeteer for testing
- Handles complex web components and Shadow DOM
- Developed using AI-assisted coding techniques
