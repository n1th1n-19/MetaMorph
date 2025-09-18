// MetaMorph Chrome Extension Content Script
(function () {
  "use strict";

  // Configuration
  const METAMORPH_URL = "https://metamorph01.vercel.app";

  // Create floating MetaMorph button
  function createFloatingButton() {
    // Check if button already exists
    if (document.getElementById("metamorph-floating-btn")) {
      return;
    }

    const button = document.createElement("div");
    button.id = "metamorph-floating-btn";
    button.innerHTML = `
      <div class="metamorph-btn-icon">✨</div>
      <div class="metamorph-btn-tooltip">MetaMorph Tools</div>
    `;

    // Add styles
    const styles = `
      #metamorph-floating-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 56px;
        height: 56px;
        background: linear-gradient(135deg, #00a8e8 0%, #0078d4 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 168, 232, 0.3);
        transition: all 0.3s ease;
        user-select: none;
      }

      #metamorph-floating-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 168, 232, 0.4);
      }

      #metamorph-floating-btn .metamorph-btn-icon {
        font-size: 24px;
        color: white;
      }

      #metamorph-floating-btn .metamorph-btn-tooltip {
        position: absolute;
        bottom: 100%;
        right: 0;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        margin-bottom: 8px;
      }

      #metamorph-floating-btn:hover .metamorph-btn-tooltip {
        opacity: 1;
      }

      #metamorph-floating-btn .metamorph-btn-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        right: 16px;
        border: 4px solid transparent;
        border-top-color: rgba(0, 0, 0, 0.8);
      }

      @keyframes metamorph-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }

      #metamorph-floating-btn.pulse {
        animation: metamorph-pulse 2s infinite;
      }
    `;

    // Add styles to page
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Add click handler
    button.addEventListener("click", function () {
      showQuickMenu();
    });

    // Add to page
    document.body.appendChild(button);

    // Add pulse animation on first load
    setTimeout(() => {
      button.classList.add("pulse");
      setTimeout(() => {
        button.classList.remove("pulse");
      }, 6000);
    }, 1000);
  }

  // Create quick access menu
  function showQuickMenu() {
    // Remove existing menu
    const existingMenu = document.getElementById("metamorph-quick-menu");
    if (existingMenu) {
      existingMenu.remove();
      return;
    }

    const menu = document.createElement("div");
    menu.id = "metamorph-quick-menu";
    menu.innerHTML = `
      <div class="metamorph-menu-header">
        <div class="metamorph-menu-logo">✨</div>
        <div class="metamorph-menu-title">MetaMorph Tools</div>
        <div class="metamorph-menu-close">&times;</div>
      </div>
      <div class="metamorph-menu-content">
        <div class="metamorph-tool-grid">
          <div class="metamorph-tool" data-path="/to-speech">
            <div class="tool-icon">🔊</div>
            <div class="tool-name">Text to Speech</div>
          </div>
          <div class="metamorph-tool" data-path="/speech-to-text">
            <div class="tool-icon">🎤</div>
            <div class="tool-name">Speech to Text</div>
          </div>
          <div class="metamorph-tool" data-path="/qr-code">
            <div class="tool-icon">📱</div>
            <div class="tool-name">QR Generator</div>
          </div>
          <div class="metamorph-tool" data-path="/ocr-extractor">
            <div class="tool-icon">📝</div>
            <div class="tool-name">OCR Extractor</div>
          </div>
          <div class="metamorph-tool" data-path="/url-shortener">
            <div class="tool-icon">🔗</div>
            <div class="tool-name">URL Shortener</div>
          </div>
          <div class="metamorph-tool" data-path="/password-generator">
            <div class="tool-icon">🔐</div>
            <div class="tool-name">Password Gen</div>
          </div>
        </div>
        <div class="metamorph-menu-footer">
          <button class="metamorph-visit-btn">Visit MetaMorph</button>
        </div>
      </div>
    `;

    // Add menu styles
    const menuStyles = `
      #metamorph-quick-menu {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 280px;
        background: rgba(12, 12, 12, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        z-index: 10001;
        animation: metamorph-slide-up 0.3s ease;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      @keyframes metamorph-slide-up {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .metamorph-menu-header {
        display: flex;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .metamorph-menu-logo {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #00a8e8 0%, #0078d4 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        font-size: 16px;
      }

      .metamorph-menu-title {
        flex: 1;
        color: white;
        font-weight: 600;
        font-size: 14px;
      }

      .metamorph-menu-close {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.7);
        border-radius: 4px;
        transition: all 0.3s ease;
      }

      .metamorph-menu-close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }

      .metamorph-menu-content {
        padding: 16px;
      }

      .metamorph-tool-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 16px;
      }

      .metamorph-tool {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 8px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
      }

      .metamorph-tool:hover {
        background: rgba(0, 168, 232, 0.1);
        border-color: rgba(0, 168, 232, 0.3);
        transform: translateY(-2px);
      }

      .metamorph-tool .tool-icon {
        font-size: 20px;
        margin-bottom: 6px;
      }

      .metamorph-tool .tool-name {
        color: white;
        font-size: 11px;
        font-weight: 500;
        line-height: 1.2;
      }

      .metamorph-menu-footer {
        text-align: center;
      }

      .metamorph-visit-btn {
        background: linear-gradient(135deg, #00a8e8 0%, #0078d4 100%);
        color: white;
        border: none;
        padding: 8px 20px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .metamorph-visit-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 168, 232, 0.3);
      }
    `;

    const menuStyleSheet = document.createElement("style");
    menuStyleSheet.textContent = menuStyles;
    document.head.appendChild(menuStyleSheet);

    // Add event listeners
    menu
      .querySelector(".metamorph-menu-close")
      .addEventListener("click", function () {
        menu.remove();
        menuStyleSheet.remove();
      });

    menu
      .querySelector(".metamorph-visit-btn")
      .addEventListener("click", function () {
        window.open(METAMORPH_URL, "_blank");
        menu.remove();
        menuStyleSheet.remove();
      });

    // Add click handlers for tools
    menu.querySelectorAll(".metamorph-tool").forEach((tool) => {
      tool.addEventListener("click", function () {
        const path = this.getAttribute("data-path");
        if (path) {
          window.open(METAMORPH_URL + path, "_blank");
          menu.remove();
          menuStyleSheet.remove();
        }
      });
    });

    // Close menu when clicking outside
    setTimeout(() => {
      document.addEventListener("click", function closeMenu(e) {
        if (
          !menu.contains(e.target) &&
          !document.getElementById("metamorph-floating-btn").contains(e.target)
        ) {
          menu.remove();
          menuStyleSheet.remove();
          document.removeEventListener("click", closeMenu);
        }
      });
    }, 100);

    document.body.appendChild(menu);
  }

  // Add context menu for selected text
  function addContextMenuSupport() {
    let selectedText = "";

    document.addEventListener("mouseup", function () {
      const selection = window.getSelection();
      selectedText = selection.toString().trim();
    });

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
        if (request.action === "getSelectedText") {
          sendResponse({ text: selectedText });
        } else if (request.action === "openTool") {
          window.open(METAMORPH_URL + request.path, "_blank");
        }
      }
    );
  }

  // Detect if user is already on MetaMorph website
  function isMetaMorphSite() {
    return window.location.hostname === "metamorph01.vercel.app";
  }

  // Initialize extension
  function init() {
    // Don't show floating button on MetaMorph's own site
    if (!isMetaMorphSite()) {
      // Wait for page to load
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", createFloatingButton);
      } else {
        createFloatingButton();
      }
    }

    // Always add context menu support
    addContextMenuSupport();
  }

  // Start the extension
  init();
})();
