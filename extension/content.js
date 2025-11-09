chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContent') {
    try {
      const extractedData = extractPageContent();
      sendResponse({ success: true, data: extractedData });
    } catch (error) {
      console.error('Content extraction error:', error);
      sendResponse({ success: false, error: error.message });
    }
  }
  return true;
});

function extractPageContent() {
  const data = {
    productName: '',
    productDescription: '',
    mainContent: '',
    urls: [],
  };

  data.productName = extractProductName();
  data.productDescription = extractProductDescription();
  data.mainContent = extractMainContent();
  data.urls = extractRelevantUrls();

  return data;
}

function extractProductName() {
  const selectors = [
    'meta[property="og:title"]',
    'meta[name="twitter:title"]',
    'h1',
    'title',
    '[itemProp="name"]',
    '.product-title',
    '.product-name',
    '#product-title',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.getAttribute('content') || element.textContent;
      if (text && text.trim().length > 0 && text.trim().length < 200) {
        return text.trim();
      }
    }
  }

  return document.title || 'Web Content';
}

function extractProductDescription() {
  const selectors = [
    'meta[property="og:description"]',
    'meta[name="description"]',
    'meta[name="twitter:description"]',
    '[itemProp="description"]',
    '.product-description',
    '.product-details',
    '#product-description',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.getAttribute('content') || element.textContent;
      if (text && text.trim().length > 10) {
        return text.trim().slice(0, 1000);
      }
    }
  }

  const firstParagraph = document.querySelector('article p, main p, .content p');
  if (firstParagraph) {
    return firstParagraph.textContent.trim().slice(0, 500);
  }

  return '';
}

function extractMainContent() {
  const contentSelectors = [
    'article',
    'main',
    '[role="main"]',
    '.content',
    '.main-content',
    '#content',
    '.post-content',
    '.entry-content',
  ];

  for (const selector of contentSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const clone = element.cloneNode(true);
      
      const unwantedSelectors = [
        'script',
        'style',
        'nav',
        'header',
        'footer',
        'aside',
        '.advertisement',
        '.ad',
        '.social-share',
        '.comments',
      ];
      
      unwantedSelectors.forEach(sel => {
        clone.querySelectorAll(sel).forEach(el => el.remove());
      });
      
      const text = clone.textContent.trim();
      if (text.length > 100) {
        return text.slice(0, 5000);
      }
    }
  }

  const bodyText = document.body.textContent.trim();
  return bodyText.slice(0, 3000);
}

function extractRelevantUrls() {
  const urls = [];
  const currentUrl = window.location.href;
  
  urls.push(currentUrl);

  const linkSelectors = [
    'link[rel="canonical"]',
    'meta[property="og:url"]',
  ];

  linkSelectors.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      const url = element.getAttribute('href') || element.getAttribute('content');
      if (url && url.startsWith('http') && !urls.includes(url)) {
        urls.push(url);
      }
    }
  });

  const productLinks = document.querySelectorAll('a[href*="buy"], a[href*="product"], a[href*="shop"]');
  productLinks.forEach(link => {
    const href = link.href;
    if (href && href.startsWith('http') && !urls.includes(href) && urls.length < 5) {
      urls.push(href);
    }
  });

  return urls.slice(0, 3);
}
