import * as cheerio from "cheerio";

export async function scrapeUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Remove script, style, and other non-content elements
    $('script, style, nav, header, footer, iframe, noscript').remove();
    
    // Try to extract main content from common content containers
    let content = '';
    const contentSelectors = [
      'article',
      'main',
      '[role="main"]',
      '.content',
      '.post-content',
      '.entry-content',
      '.article-content',
      '#content',
      '.main-content'
    ];
    
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.text();
        break;
      }
    }
    
    // If no main content found, get body text
    if (!content) {
      content = $('body').text();
    }
    
    // Clean up the text
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();
    
    // Limit content length to prevent overwhelming the AI
    const maxLength = 15000;
    if (content.length > maxLength) {
      content = content.substring(0, maxLength) + '...';
    }
    
    return content;
  } catch (error) {
    console.error(`Error scraping URL ${url}:`, error);
    throw new Error(`Failed to scrape URL: ${error}`);
  }
}

export async function scrapeMultipleUrls(urls: string[]): Promise<string> {
  const results = await Promise.allSettled(
    urls.map(async (url) => {
      const content = await scrapeUrl(url);
      return `\n\n=== Content from ${url} ===\n${content}`;
    })
  );
  
  const successfulResults = results
    .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
    .map(result => result.value);
  
  if (successfulResults.length === 0) {
    throw new Error('Failed to scrape any URLs');
  }
  
  return successfulResults.join('\n\n');
}
