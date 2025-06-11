document.addEventListener("DOMContentLoaded", function() {
    const filterSelect = document.getElementById("filter");
    const simulationCards = document.querySelectorAll(".simulation-card");

    // Function to filter simulations
    function filterSimulations() {
        const selectedTopic = filterSelect.value;

        simulationCards.forEach(card => {
            // Show all if "all" is selected
            if (selectedTopic === "all") {
                card.style.display = "block";
            } else {
                // Show only matching simulations based on data-topic attribute
                if (card.getAttribute("data-topic") === selectedTopic) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            }
        });
    }

    // Listen for changes in the dropdown and filter accordingly
    filterSelect.addEventListener("change", filterSimulations);
});
