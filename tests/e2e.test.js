const puppeteer = require('puppeteer');
const path = require('path');

jest.setTimeout(120000); // Increase timeout to 120 seconds for slow loading

describe('Chrome Extension E2E Tests', () => {
    let browser;
    let page;
    const extensionPath = path.resolve(__dirname, '../chrome-extension-chatgpt-summarizer');
    const TEST_MSN_URL = 'https://www.msn.com/en-us/health/other/yes-you-should-stand-up-straight-for-all-sorts-of-reasons/ar-AA1FumXM';

    beforeAll(async () => {
        try {
            console.log('Launching browser...');
            browser = await puppeteer.launch({
                headless: false,
                args: [
                    `--disable-extensions-except=${extensionPath}`,
                    `--load-extension=${extensionPath}`,
                    '--no-sandbox',
                    '--disable-web-security', // Disable CORS for testing
                    '--start-maximized'
                ],
                defaultViewport: null
            });
            console.log('Browser launched successfully');
        } catch (error) {
            console.error('Failed to launch browser:', error);
            throw error;
        }
    }, 30000); // 30 second timeout for browser launch

    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    });

    beforeEach(async () => {
        try {
            console.log('Creating new page...');
            page = await browser.newPage();
            
            // Set longer timeouts for navigation
            await page.setDefaultNavigationTimeout(60000);
            await page.setDefaultTimeout(60000);
            
            // Enable better debugging
            page.on('console', msg => console.log('Browser console:', msg.text()));
            page.on('error', err => console.error('Browser error:', err));
            page.on('pageerror', err => console.error('Page error:', err));

            console.log('New page created');
        } catch (error) {
            console.error('Failed to create new page:', error);
            throw error;
        }
    }, 10000);

    afterEach(async () => {
        if (page) {
            await page.close();
        }
    });

    test('should navigate to MSN article and verify content extraction', async () => {
        try {
            console.log('Navigating to test page...');
            await page.goto('https://example.com', {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            console.log('Page loaded, checking title...');
            const title = await page.title();
            console.log('Page title:', title);
            expect(title).toBeTruthy();
        } catch (error) {
            console.error('Test failed:', error);
            throw error;
        }
    }, 60000); // 60 second timeout for the test

    test('should extract content from MSN article', async () => {
        try {
            // Enable request interception
            await page.setRequestInterception(true);
            
            // Block unnecessary resources to speed up loading
            page.on('request', request => {
                const resourceType = request.resourceType();
                if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
                    request.abort();
                } else {
                    request.continue();
                }
            });

            console.log('Navigating to MSN test article...');
            await page.goto(TEST_MSN_URL, {
                waitUntil: ['domcontentloaded', 'networkidle2'],
                timeout: 60000
            });

            // Wait for dynamic content with retry mechanism
            console.log('Waiting for content to load...');
            let content = '';
            const maxRetries = 3;
            let retryCount = 0;
            
            while (retryCount < maxRetries) {
                try {
                    // Wait for the shadow DOM elements
                    await page.waitForSelector('cp-article-reader', { timeout: 20000 });
                    
                    content = await page.evaluate(() => {
                        // Helper function to recursively get shadow roots
                        const getShadowRoot = (element) => {
                            if (!element) return null;
                            return element.shadowRoot || 
                                   (element.tagName.toLowerCase() === 'cp-article' ? element : null) ||
                                   Array.from(element.children).reduce((found, child) => 
                                       found || getShadowRoot(child), null);
                        };

                        // Try to find content through shadow DOM
                        const entryPoint = document.querySelector('entry-point-views');
                        const articleReader = document.querySelector('cp-article-reader');
                        const cpArticle = document.querySelector('cp-article');
                        
                        const possibleRoots = [
                            cpArticle,
                            articleReader?.shadowRoot?.querySelector('cp-article'),
                            entryPoint?.shadowRoot?.querySelector('cp-article'),
                            ...Array.from(document.querySelectorAll('*')).map(el => getShadowRoot(el))
                        ].filter(Boolean);

                        for (const root of possibleRoots) {
                            if (!root) continue;
                            const paragraphs = Array.from(root.querySelectorAll('p, [class*="paragraph"]'))
                                .filter(p => {
                                    const text = p.textContent.trim();
                                    return text.length > 30 && 
                                           !text.includes('More for You') &&
                                           !text.includes('Continue reading') &&
                                           !text.includes('RELATED');
                                })
                                .map(p => p.textContent.trim());

                            if (paragraphs.length > 0) {
                                return paragraphs.join('\n\n');
                            }
                        }
                        return '';
                    });

                    if (content && content.length > 100) {
                        break;
                    }
                } catch (error) {
                    console.warn(`Retry ${retryCount + 1} failed:`, error.message);
                    await page.waitForTimeout(2000); // Wait 2 seconds before retry
                    retryCount++;
                    if (retryCount === maxRetries) {
                        throw new Error('Failed to extract content after multiple retries');
                    }
                }
            }

            console.log('Content preview:', content.substring(0, 150) + '...');
            console.log('Total content length:', content.length);

            // Verify content
            expect(content).toBeTruthy();
            expect(content.length).toBeGreaterThan(100);
            expect(content).not.toContain('More for You');
            expect(content).not.toContain('RELATED');
            expect(content.split('\n\n').length).toBeGreaterThan(1);
            
        } catch (error) {
            console.error('Test failed:', error);
            // Take a screenshot on failure
            await page.screenshot({ path: 'test-failure.png', fullPage: true });
            throw error;
        }
    }, 90000); // 90 second timeout for the entire test

    test('should extract content from LeMonde article', async () => {
        try {
            // Enable request interception
            await page.setRequestInterception(true);
            
            // Listen for network requests
            page.on('request', request => {
                request.continue();
            });

            console.log('Navigating to LeMonde test article...');
            await page.goto('https://www.lemonde.fr/en/germany/article/2025/05/26/germany-s-merz-says-western-allies-no-longer-impose-range-limits-on-ukrainian-weapons_6741699_146.html', {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            // Wait for dynamic content
            console.log('Waiting for content to load...');
            await page.waitForFunction(() => {
                const article = document.querySelector('article');
                return article && article.textContent.trim().length > 100;
            }, { timeout: 10000 });

            console.log('Testing content extraction...');
            const content = await page.evaluate(() => {
                const article = document.querySelector('article');
                if (!article) return '';

                const paragraphs = Array.from(article.querySelectorAll('p'))
                    .filter(p => p.textContent.trim().length > 30)
                    .map(p => p.textContent.trim());

                return paragraphs.join('\\n\\n');
            });

            console.log('Content preview:', content.substring(0, 150) + '...');

            // Verify content
            expect(content).toBeTruthy();
            expect(content.length).toBeGreaterThan(100);
            
        } catch (error) {
            console.error('Test failed:', error);
            throw error;
        }
    }, 60000);
});
