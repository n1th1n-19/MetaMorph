// MetaMorph Chrome Extension - Password Generator Only
console.log("MetaMorph Password Generator loaded");

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializePasswordGenerator();
});

// Password Generator functionality
function initializePasswordGenerator() {
  const generateBtn = document.getElementById("pwd-generate");
  const copyBtn = document.getElementById("pwd-copy");
  const refreshBtn = document.getElementById("pwd-refresh");
  const lengthSlider = document.getElementById("pwd-length");
  const lengthValue = document.getElementById("pwd-length-value");
  const resultArea = document.getElementById("pwd-result");

  if (generateBtn) {
    generateBtn.addEventListener("click", generatePassword);
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", copyPassword);
  }

  if (refreshBtn) {
    refreshBtn.addEventListener("click", generatePassword);
  }

  if (lengthSlider && lengthValue) {
    lengthSlider.addEventListener("input", function () {
      lengthValue.textContent = this.value;
    });
  }

  // Add click handlers for checkbox labels
  const checkboxItems = document.querySelectorAll(".checkbox-item");
  checkboxItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      if (e.target.tagName !== "INPUT") {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
        }
      }
    });
  });
}

function generatePassword() {
  const length = parseInt(document.getElementById("pwd-length").value);
  const includeUppercase = document.getElementById("pwd-uppercase").checked;
  const includeLowercase = document.getElementById("pwd-lowercase").checked;
  const includeNumbers = document.getElementById("pwd-numbers").checked;
  const includeSymbols = document.getElementById("pwd-symbols").checked;

  // Validate at least one character type is selected
  if (
    !includeUppercase &&
    !includeLowercase &&
    !includeNumbers &&
    !includeSymbols
  ) {
    showNotification("Please select at least one character type", "warning");
    return;
  }

  // Character sets
  const charSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  };

  // Build character pool
  let charPool = "";
  let requiredChars = [];

  if (includeUppercase) {
    charPool += charSets.uppercase;
    requiredChars.push(getRandomChar(charSets.uppercase));
  }
  if (includeLowercase) {
    charPool += charSets.lowercase;
    requiredChars.push(getRandomChar(charSets.lowercase));
  }
  if (includeNumbers) {
    charPool += charSets.numbers;
    requiredChars.push(getRandomChar(charSets.numbers));
  }
  if (includeSymbols) {
    charPool += charSets.symbols;
    requiredChars.push(getRandomChar(charSets.symbols));
  }

  // Generate password
  let password = "";

  // Add required characters first
  for (const char of requiredChars) {
    password += char;
  }

  // Fill remaining length with random characters
  for (let i = password.length; i < length; i++) {
    password += getRandomChar(charPool);
  }

  // Shuffle password to randomize position of required characters
  password = shuffleString(password);

  // Display password
  displayPassword(password);

  // Calculate and display strength
  const strength = calculatePasswordStrength(password);
  displayPasswordStrength(strength);

  // Enable copy and refresh buttons
  document.getElementById("pwd-copy").disabled = false;
  document.getElementById("pwd-refresh").disabled = false;

  showNotification("Password generated successfully!", "success");
}

function getRandomChar(charSet) {
  return charSet[Math.floor(Math.random() * charSet.length)];
}

function shuffleString(str) {
  const arr = str.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

function displayPassword(password) {
  const resultArea = document.getElementById("pwd-result");
  if (resultArea) {
    resultArea.innerHTML = password;
    resultArea.style.fontFamily = "'Courier New', monospace";
    resultArea.style.color = "white";
  }
}

function calculatePasswordStrength(password) {
  let score = 0;
  const checks = {
    length: password.length >= 12,
    longLength: password.length >= 16,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSymbols: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
    noRepeat: !/(.)\1{2,}/.test(password),
    diverse: new Set(password).size >= password.length * 0.7,
  };

  // Scoring
  if (checks.length) score += 1;
  if (checks.longLength) score += 1;
  if (checks.hasUpper) score += 1;
  if (checks.hasLower) score += 1;
  if (checks.hasNumbers) score += 1;
  if (checks.hasSymbols) score += 1;
  if (checks.noRepeat) score += 1;
  if (checks.diverse) score += 1;

  // Determine strength level
  if (score <= 3) return { level: "weak", text: "Weak" };
  if (score <= 5) return { level: "fair", text: "Fair" };
  if (score <= 6) return { level: "good", text: "Good" };
  return { level: "strong", text: "Strong" };
}

function displayPasswordStrength(strength) {
  const strengthFill = document.getElementById("pwd-strength-fill");
  const strengthText = document.getElementById("pwd-strength-text");

  if (strengthFill) {
    strengthFill.className = `strength-fill ${strength.level}`;
  }

  if (strengthText) {
    strengthText.className = `strength-text ${strength.level}`;
    strengthText.textContent = strength.text;
  }
}

function copyPassword() {
  const resultArea = document.getElementById("pwd-result");
  const password = resultArea.textContent;

  if (!password || password.includes("Click")) {
    showNotification("No password to copy", "warning");
    return;
  }

  navigator.clipboard
    .writeText(password)
    .then(() => {
      showNotification("Password copied to clipboard!", "success");
    })
    .catch((err) => {
      console.error("Copy failed:", err);
      showNotification("Failed to copy password", "error");
    });
}

// Notification system
function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");
  if (!notification) return;

  notification.textContent = message;
  notification.className = `notification ${type}`;

  // Show notification
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3100);
}
