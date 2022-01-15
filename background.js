// Listener para escuchar cambios en la URL actual

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        chrome.tabs.sendMessage(tabId, {
            message: 'urlChanged',
            url: changeInfo.url
        });
    }
});