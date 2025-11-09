chrome.runtime.onInstalled.addListener(() => {
  console.log('GenAIMagic Extension installed');
});

chrome.action.onClicked.addListener((tab) => {
  chrome.action.openPopup();
});
