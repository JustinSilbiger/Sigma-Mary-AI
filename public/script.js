const textArea = document.getElementById("text_to_summarize");
const submitButton = document.getElementById("submit-button");
const summarizedTextArea = document.getElementById("summary");

// Add modal elements
const modal = document.getElementById("summary-modal");
const closeButton = document.getElementById("close-modal");

// Add copy button element
const copyButton = document.getElementById("copy-text");

submitButton.disabled = true;

textArea.addEventListener("input", verifyTextLength);
submitButton.addEventListener("click", submitData);

// Add modal event listeners
closeButton.addEventListener("click", closeModal);

// Add copy functionality
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(summarizedTextArea.value);
    copyButton.classList.add("success");
    setTimeout(() => {
      copyButton.classList.remove("success");
    }, 1000);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
});

function verifyTextLength(e) {
  const textarea = e.target;
  const charCount = textarea.value.trim().length;

  // Enable button only when text length requirements are met
  submitButton.disabled = !(charCount >= 200 && charCount <= 100000);
}

function submitData(e) {
  // Disable the button and show loading state
  submitButton.disabled = true;
  submitButton.classList.add("submit-button--loading");

  // Clear the output textarea while loading
  summarizedTextArea.value = "Summarizing...";

  const text_to_summarize = textArea.value;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    text_to_summarize: text_to_summarize,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("/api/summarize", requestOptions)
    .then((response) => response.text())
    .then((summary) => {
      summarizedTextArea.value = summary;
      showModal();
    })
    .catch((error) => {
      console.log(error.message);
      summarizedTextArea.value = "An error occurred. Please try again.";
      showModal();
    });
}

function closeModal() {
  modal.classList.remove("show");
  document.body.style.overflow = "auto";

  // Reset input state when modal is closed
  textArea.value = "";
  submitButton.disabled = true;

  // Add a small delay before resetting the transform
  setTimeout(() => {
    if (!modal.classList.contains("show")) {
      modal.style.display = "none";
    }
  }, 300);
}

function showModal() {
  // Reset display property before adding show class
  modal.style.display = "flex";

  // Use requestAnimationFrame to ensure display change is processed
  requestAnimationFrame(() => {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  });

  // Reset copy button state
  copyButton.classList.remove("success");

  // Enable submit button for next submission
  submitButton.classList.remove("submit-button--loading");
  submitButton.disabled = false;
}

// Close modal when clicking outside
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Close modal on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("show")) {
    closeModal();
  }
});

// Add particle effect
function createParticles() {
  const particlesContainer = document.querySelector(".particles");
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";

    // Random size between 2-4px
    const size = Math.random() * 2 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Random starting position
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;

    // Random animation duration
    particle.style.animationDuration = `${Math.random() * 10 + 10}s`;

    particlesContainer.appendChild(particle);
  }
}

// Call when page loads
createParticles();
