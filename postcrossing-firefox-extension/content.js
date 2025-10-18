// This script is injected into every webpage.
// Its job is to find postcard IDs and send them to the popup when requested.

let foundIds = [];

/**
 * Scans the entire page's text content to find strings that match
 * the Postcrossing ID format (e.g., US-123456).
 */
function findPostcardIds() {
    const textContent = document.body.innerText;
    // Regex to find two capital letters, a hyphen, and one or more digits.
    const postcardIdRegex = /[A-Z]{2}-\d+/g;
    const matches = textContent.match(postcardIdRegex);
    
    // Ensure we only store unique IDs, in case they appear multiple times.
    if (matches) {
        foundIds = [...new Set(matches)];
    } else {
        foundIds = [];
    }
}


// Listen for messages from other parts of the extension (like the popup).
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getPostcardIds") {
        // The popup is asking for the IDs, so we find them on the current page
        // and send them back.
        findPostcardIds();
        sendResponse({ ids: foundIds });
    }
});
