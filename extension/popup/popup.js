// Production API URL
const DEFAULT_API_URL = 'https://genaimagic.onrender.com';
let API_URL = DEFAULT_API_URL;
let extractedData = null;

async function getApiUrl() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['apiUrl'], (result) => {
      resolve(result.apiUrl || DEFAULT_API_URL);
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  API_URL = await getApiUrl();
  const generateBtn = document.getElementById('generateBtn');
  const statusMessage = document.getElementById('statusMessage');
  const mainForm = document.getElementById('mainForm');
  const loadingState = document.getElementById('loadingState');
  const extractedInfo = document.getElementById('extractedInfo');
  const productNameDisplay = document.getElementById('productNameDisplay');
  const productDescDisplay = document.getElementById('productDescDisplay');

  function showStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = `status ${type}`;
    statusMessage.style.display = 'block';
    setTimeout(() => {
      statusMessage.style.display = 'none';
    }, 5000);
  }

  function showLoading(show) {
    if (show) {
      mainForm.style.display = 'none';
      loadingState.style.display = 'block';
    } else {
      mainForm.style.display = 'block';
      loadingState.style.display = 'none';
    }
  }

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractContent' });
    
    if (response && response.success) {
      extractedData = response.data;
      
      if (extractedData.productName) {
        productNameDisplay.textContent = extractedData.productName;
        productDescDisplay.textContent = extractedData.productDescription 
          ? (extractedData.productDescription.slice(0, 100) + '...') 
          : 'Description extracted from page';
        extractedInfo.style.display = 'block';
      } else {
        showStatus('Could not detect product information. Content will be analyzed anyway.', 'info');
      }
    }
  } catch (error) {
    console.error('Error extracting content:', error);
    showStatus('Using page content for analysis', 'info');
  }

  generateBtn.addEventListener('click', async () => {
    try {
      API_URL = await getApiUrl();
      showLoading(true);
      
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!extractedData) {
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractContent' });
        if (response && response.success) {
          extractedData = response.data;
        } else {
          throw new Error('Failed to extract page content');
        }
      }

      const wordCount = document.getElementById('wordCount').value;
      const tone = document.getElementById('tone').value;
      const targetAudience = document.getElementById('targetAudience').value;

      const requestData = {
        productName: extractedData.productName || 'Web Content',
        productDescription: extractedData.productDescription || extractedData.mainContent || 'Content from webpage',
        affiliateUrls: extractedData.urls && extractedData.urls.length > 0 ? extractedData.urls : [tab.url],
        resourceType: 'text',
        resourceText: extractedData.mainContent || extractedData.productDescription || 'Page content',
        tone,
        targetAudience: targetAudience || undefined,
        wordCount,
      };

      const generateResponse = await fetch(`${API_URL}/api/generate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!generateResponse.ok) {
        const error = await generateResponse.json();
        throw new Error(error.error || 'Failed to generate content');
      }

      const result = await generateResponse.json();

      const sessionResponse = await fetch(`${API_URL}/api/extension-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: requestData.productName,
          plainText: result.plainText,
          html: result.html,
          requestPayload: requestData,
        }),
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create session');
      }

      const session = await sessionResponse.json();

      chrome.tabs.create({
        url: `${API_URL}/extension-output?sessionId=${session.id}`,
      });

      window.close();
    } catch (error) {
      console.error('Error:', error);
      showLoading(false);
      showStatus(error.message || 'Failed to generate content. Please try again.', 'error');
    }
  });
});
