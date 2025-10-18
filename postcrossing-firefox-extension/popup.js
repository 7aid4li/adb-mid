const sortButton = document.getElementById('sort-button');
const statusMessage = document.getElementById('status-message');

/**
 * Extracts a Postcrossing ID from a string (e.g., a tab title).
 * @param {string} text - The text to search within.
 * @returns {string|null} The found ID or null.
 */
function findPostcardId(text) {
    if (!text) return null;
    const match = text.match(/[A-Z]{2}-\d+/);
    return match ? match[0] : null;
}

/**
 * Extracts the numerical part of an ID string for sorting.
 * @param {string} id - The full ID string (e.g., "CN-408790").
 * @returns {number} The numerical part of the ID.
 */
function getSortableNumber(id) {
    return parseInt(id.split('-')[1], 10);
}


sortButton.addEventListener('click', async () => {
    statusMessage.textContent = 'Sorting...';

    // 1. Get all tabs in the current window.
    const allTabs = await browser.tabs.query({ currentWindow: true });

    const tabsToSort = [];

    // 2. Find which tabs have a Postcrossing ID in their title.
    for (const tab of allTabs) {
        const postcardId = findPostcardId(tab.title);
        if (postcardId) {
            tabsToSort.push({
                tabId: tab.id,
                sortKey: getSortableNumber(postcardId),
                title: tab.title
            });
        }
    }

    // 3. Sort the identified tabs based on the numerical part of the ID.
    tabsToSort.sort((a, b) => a.sortKey - b.sortKey);

    if (tabsToSort.length === 0) {
        statusMessage.textContent = 'No tabs with Postcrossing IDs found.';
        return;
    }

    // 4. Move the tabs to their new, sorted positions.
    for (let i = 0; i < tabsToSort.length; i++) {
        const tabInfo = tabsToSort[i];
        await browser.tabs.move(tabInfo.tabId, { index: i });
    }

    statusMessage.textContent = `Successfully sorted ${tabsToSort.length} tabs!`;
});

