// kad primi poruku odnosno enabluje plugin da se moze koristiti
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.todo == 'showPageAction') {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.pageAction.show(tabs[0].id);
      // chrome.pageAction.setPopup(tabs[0].id);
    });
  }
});
