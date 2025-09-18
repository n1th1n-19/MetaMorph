// MetaMorph Chrome Extension Background Service Worker

const METAMORPH_URL = "https://metamorph01.vercel.app";

// Handle installation and updates
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install") {
    // First time install
    console.log("MetaMorph extension installed");

    // Set default settings
    chrome.storage.local.set({
      showFloatingButton: true,
      recentTools: [],
      extensionEnabled: true,
    });

    // Open welcome page
    chrome.tabs.create({ url: METAMORPH_URL });
  } else if (details.reason === "update") {
    // Extension updated
    console.log("MetaMorph extension updated");
  }

  // Create context menus
  createContextMenus();
});

// Create context menu items
function createContextMenus() {
  // Remove existing menus first
  chrome.contextMenus.removeAll(() => {
    // Main MetaMorph menu
    chrome.contextMenus.create({
      id: "metamorph-main",
      title: "MetaMorph Tools",
      contexts: ["all"],
    });

    // Text-related tools (shown when text is selected)
    chrome.contextMenus.create({
      id: "text-to-speech",
      parentId: "metamorph-main",
      title: "Convert to Speech",
      contexts: ["selection"],
    });

    chrome.contextMenus.create({
      id: "qr-from-text",
      parentId: "metamorph-main",
      title: "Generate QR Code",
      contexts: ["selection"],
    });

    // Image-related tools
    chrome.contextMenus.create({
      id: "ocr-extract",
      parentId: "metamorph-main",
      title: "Extract Text (OCR)",
      contexts: ["image"],
    });

    chrome.contextMenus.create({
      id: "image-convert",
      parentId: "metamorph-main",
      title: "Convert Image Format",
      contexts: ["image"],
    });

    // Link-related tools
    chrome.contextMenus.create({
      id: "shorten-url",
      parentId: "metamorph-main",
      title: "Shorten URL",
      contexts: ["link"],
    });

    chrome.contextMenus.create({
      id: "qr-from-link",
      parentId: "metamorph-main",
      title: "QR Code from Link",
      contexts: ["link"],
    });

    // General tools separator
    chrome.contextMenus.create({
      id: "separator1",
      parentId: "metamorph-main",
      type: "separator",
      contexts: ["all"],
    });

    // General tools
    chrome.contextMenus.create({
      id: "password-generator",
      parentId: "metamorph-main",
      title: "Password Generator",
      contexts: ["all"],
    });

    chrome.contextMenus.create({
      id: "json-formatter",
      parentId: "metamorph-main",
      title: "JSON Formatter",
      contexts: ["all"],
    });

    // Separator and main app link
    chrome.contextMenus.create({
      id: "separator2",
      parentId: "metamorph-main",
      type: "separator",
      contexts: ["all"],
    });

    chrome.contextMenus.create({
      id: "open-app",
      parentId: "metamorph-main",
      title: "Open MetaMorph App",
      contexts: ["all"],
    });
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  let targetUrl = "";
  let openInCurrentTab = false;

  switch (info.menuItemId) {
    case "text-to-speech":
      targetUrl = `${METAMORPH_URL}/to-speech`;
      break;
    case "qr-from-text":
    case "qr-from-link":
      targetUrl = `${METAMORPH_URL}/qr-code`;
      break;
    case "ocr-extract":
      targetUrl = `${METAMORPH_URL}/ocr-extractor`;
      break;
    case "image-convert":
      targetUrl = `${METAMORPH_URL}/image-converter`;
      break;
    case "shorten-url":
      targetUrl = `${METAMORPH_URL}/url-shortener`;
      break;
    case "password-generator":
      targetUrl = `${METAMORPH_URL}/password-generator`;
      break;
    case "json-formatter":
      targetUrl = `${METAMORPH_URL}/json-formatter`;
      break;
    case "open-app":
      targetUrl = METAMORPH_URL;
      break;
  }

  if (targetUrl) {
    // Store context data for the tool if applicable
    const contextData = {
      selectedText: info.selectionText || "",
      linkUrl: info.linkUrl || "",
      srcUrl: info.srcUrl || "",
      pageUrl: info.pageUrl || "",
    };

    chrome.storage.local.set({ lastContextData: contextData });

    // Open the tool
    chrome.tabs.create({ url: targetUrl });
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getSelectedText") {
    // Forward to content script
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, request, sendResponse);
      }
    });
    return true; // Will respond asynchronously
  }

  if (request.action === "openTool") {
    const toolUrl = METAMORPH_URL + request.path;
    chrome.tabs.create({ url: toolUrl });
    sendResponse({ success: true });
  }

  if (request.action === "getStats") {
    // Get usage statistics
    chrome.storage.local.get(["recentTools", "totalUses"], function (result) {
      sendResponse({
        recentTools: result.recentTools || [],
        totalUses: result.totalUses || 0,
      });
    });
    return true;
  }

  if (request.action === "incrementUsage") {
    // Track tool usage
    chrome.storage.local.get(["totalUses"], function (result) {
      const totalUses = (result.totalUses || 0) + 1;
      chrome.storage.local.set({ totalUses: totalUses });
    });
  }
});

// Handle browser action click (fallback if popup fails)
chrome.action.onClicked.addListener(function (tab) {
  chrome.tabs.create({ url: METAMORPH_URL });
});

// Monitor tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url) {
    // Skip MetaMorph's own domain
    if (!tab.url.includes("metamorph01.vercel.app")) {
      // Check if content script is already injected
      chrome.tabs.sendMessage(tabId, { action: "ping" }, function (response) {
        if (chrome.runtime.lastError) {
          // Content script not found, inject it
          chrome.scripting
            .executeScript({
              target: { tabId: tabId },
              files: ["content.js"],
            })
            .catch((err) => {
              // Ignore errors for special pages like chrome:// or extension pages
              console.log("Could not inject content script:", err.message);
            });
        }
      });
    }
  }
});

// Handle alarm for periodic cleanup
chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "cleanup") {
    // Clean up old data
    chrome.storage.local.get(["recentTools"], function (result) {
      if (result.recentTools && result.recentTools.length > 10) {
        const cleanedTools = result.recentTools.slice(0, 10);
        chrome.storage.local.set({ recentTools: cleanedTools });
      }
    });
  }
});

// Set up periodic cleanup alarm
chrome.alarms.create("cleanup", { delayInMinutes: 60, periodInMinutes: 60 });

// Handle extension startup
chrome.runtime.onStartup.addListener(function () {
  console.log("MetaMorph extension started");
});

// Export functions for testing (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createContextMenus,
  };
}
