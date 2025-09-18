// MetaMorph Chrome Extension Background Service Worker - Password Generator Only

console.log('MetaMorph Password Generator service worker loaded');

// Handle installation and updates
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install") {
    console.log("MetaMorph Password Generator extension installed");

    // Set default settings
    chrome.storage.local.set({
      extensionEnabled: true,
      totalPasswordsGenerated: 0
    });
  } else if (details.reason === "update") {
    console.log("MetaMorph Password Generator extension updated");
  }

  // Create context menu for password generation
  createContextMenu();
});

// Create context menu item
function createContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "generate-password",
      title: "Generate Password",
      contexts: ["all"]
    });
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "generate-password") {
    // Open the password generator popup
    chrome.action.openPopup();
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "incrementUsage") {
    // Track password generation usage
    chrome.storage.local.get(["totalPasswordsGenerated"], function (result) {
      const total = (result.totalPasswordsGenerated || 0) + 1;
      chrome.storage.local.set({ totalPasswordsGenerated: total });
    });
    sendResponse({ success: true });
  }

  if (request.action === "getStats") {
    // Get usage statistics
    chrome.storage.local.get(["totalPasswordsGenerated"], function (result) {
      sendResponse({
        totalPasswordsGenerated: result.totalPasswordsGenerated || 0
      });
    });
    return true; // Will respond asynchronously
  }
});

// No cleanup needed for a simple password generator