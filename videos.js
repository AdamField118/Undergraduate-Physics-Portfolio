document.addEventListener("DOMContentLoaded", function() {
    const filterSelect = document.getElementById("filter");
    const videoCards = document.querySelectorAll(".video-card");

    // Function to filter videos
    function filterVideos() {
        const selectedTopic = filterSelect.value;

        videoCards.forEach(card => {
            // Show all if "all" is selected
            if (selectedTopic === "all") {
                card.style.display = "block";
            } else {
                // Show only matching videos based on data-topic attribute
                if (card.getAttribute("data-topic") === selectedTopic) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            }
        });
    }

    // Listen for changes in the dropdown and filter accordingly
    filterSelect.addEventListener("change", filterVideos);
});
