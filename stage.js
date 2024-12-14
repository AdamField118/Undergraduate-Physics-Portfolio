// stage.js
window.addEventListener('load', function() {
    // Function to get query parameters from URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Get the simulation type from URL
    const simulationType = getQueryParam('simulation');

    // Load the appropriate JavaScript file based on simulationType
    if (simulationType) {
        const script = document.createElement('script');
        script.src = `simulations/${simulationType}.js`; // Adjust path if needed
        script.onload = function() {
            console.log(`${simulationType} script loaded.`);
        };
        script.onerror = function() {
            console.error(`Failed to load ${simulationType} script.`);
        };
        document.body.appendChild(script);
    } else {
        console.error('No simulation type specified.');
    }
});
