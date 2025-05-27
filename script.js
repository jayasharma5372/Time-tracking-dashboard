document.addEventListener('DOMContentLoaded', () => {
    const timeframeButtons = document.querySelectorAll('.timeframe-btn');
    const activityGrid = document.querySelector('.activity-grid');
    let currentData = [];
    let activeTimeframe = 'weekly'; // Default

    // Function to get the "previous" text based on timeframe
    function getPreviousText(timeframe) {
        switch (timeframe) {
            case 'daily': return 'Yesterday';
            case 'weekly': return 'Last Week';
            case 'monthly': return 'Last Month';
            default: return 'Previous';
        }
    }

    // Function to render activity cards
    function renderActivityCards(timeframe) {
        activityGrid.innerHTML = ''; // Clear existing cards

        currentData.forEach(activity => {
            const timeframeData = activity.timeframes[timeframe];
            if (!timeframeData) {
                console.warn(`No data for timeframe "${timeframe}" in activity "${activity.title}"`);
                return;
            }

            const card = document.createElement('div');
            card.classList.add('activity-card');
            card.setAttribute('data-activity', activity.title); // For CSS specific background/icon

            card.innerHTML = `
                <div class="activity-content">
                    <div class="activity-header">
                        <h2 class="activity-title">${activity.title}</h2>
                        <button class="activity-menu-btn" aria-label="Menu for ${activity.title}"></button>
                    </div>
                    <div class="activity-stats">
                        <p class="activity-hours">${timeframeData.current}hrs</p>
                        <p class="activity-previous">${getPreviousText(timeframe)} - ${timeframeData.previous}hrs</p>
                    </div>
                </div>
            `;
            activityGrid.appendChild(card);
        });
    }

    // Fetch data from JSON file
    async function fetchData() {
        try {
            const response = await fetch('data.json'); // Assuming data.json is in the same directory
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            currentData = await response.json();
            renderActivityCards(activeTimeframe); // Initial render with default timeframe
        } catch (error) {
            console.error("Could not fetch activity data:", error);
            activityGrid.innerHTML = `<p style="color: var(--light-red-study);">Error loading data. Please try again later.</p>`;
        }
    }

    // Event listeners for timeframe buttons
    timeframeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            timeframeButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');
            // Get the new timeframe
            activeTimeframe = button.dataset.timeframe;
            // Re-render cards with the new timeframe
            renderActivityCards(activeTimeframe);
        });
    });

    // Initial data fetch and render
    fetchData();
});