# GenAIMagic Browser Extension

Transform any webpage into SEO-optimized affiliate content with our AI-powered browser extension.

## Features

- **Auto-Extract Product Information**: Automatically detects product names, descriptions, and URLs from any webpage
- **AI Content Generation**: Uses GenAiMagic trained AI Agent to create compelling affiliate content
- **Customizable Output**: Choose word count (800-2000 words), tone, and target audience
- **Multiple Formats**: Download as .txt, .md, or .html files
- **Seamless Integration**: Works with GenAIMagic.io web app

## Installation

### From GenAIMagic.io Website

1. Visit [GenAIMagic.io](https://genaimagic.io)
2. Click "Download Extension" button
3. Extract the downloaded ZIP file
4. Follow the Chrome or Edge installation steps below

### Chrome

1. Download and extract the extension files
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the extracted `extension` folder
6. The GenAIMagic icon will appear in your toolbar

### Edge

1. Download and extract the extension files
2. Open Edge and navigate to `edge://extensions/`
3. Enable "Developer mode" in the left sidebar
4. Click "Load unpacked"
5. Select the extracted `extension` folder
6. The GenAIMagic icon will appear in your toolbar

## Server Setup (For Self-Hosting)

If you're running your own GenAIMagic.io instance:

### Database Setup
The extension requires the `extension_sessions` table. Run:
```bash
npm run db:push
```

Or manually apply the migration in `migrations/` folder.

### API Configuration
To use your own API endpoint:

1. Right-click the extension icon
2. Select "Inspect"
3. In the console, run:
   ```javascript
   chrome.storage.local.set({ apiUrl: 'https://your-domain.com' });
   ```
4. Reload the extension

**Note**: The default API URL is https://genaimagic.replit.app

## How to Use

1. **Navigate to any webpage** with product or content you want to rewrite
2. **Click the GenAIMagic extension icon** in your browser toolbar
3. **Review extracted information** - The extension will auto-detect product details
4. **Configure your content**:
   - Select word count (800, 1000, 1500, or 2000 words)
   - Choose tone (Professional, Casual, Enthusiastic, or Informative)
   - Optionally specify target audience
5. **Click "Analyze & Generate Content"**
6. **Wait for processing** - The AI will analyze and rewrite the content
7. **View results** - A new tab opens with your generated content
8. **Download** - Save as .txt, .md, or .html file

## Supported Websites

The extension works on **all websites** including:
- E-commerce sites (Amazon, eBay, etc.)
- Product review sites
- Tech blogs
- News articles
- Any webpage with text content

## Privacy & Security

- No data is stored permanently
- Content is processed securely through GenAIMagic.io
- Extension sessions are temporary and auto-expire
- No tracking or analytics

## Support

For issues or questions:
- Visit [GenAIMagic.io](https://genaimagic.io)
- Check our documentation
- Contact support

## Version

**v1.0.0** - Initial Release

## License

© 2025 GenAIMagic.io | Powered by dorlink.me
