// stage.js
// Get the query string from the URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// Extract the "simulation" parameter
const simulationName = urlParams.get('simulation');
document.title = simulationName;

if (simulationName) {
    // Construct the path to the corresponding .js file
    const scriptPath = `../scripts/${simulationName}.js`;

    // Dynamically create a <script> element to load the .js file
    const script = document.createElement('script');
    script.src = scriptPath;
    script.onload = () => {
        console.log(`../scripts/${simulationName}.js loaded successfully.`);
    };
    script.onerror = () => {
        console.error(`Error loading ../scripts/${simulationName}.js`);
    };

    // Append the script to the document body
    document.body.appendChild(script);
} else {
    console.error("No simulation specified in the URL.");
    document.body.innerHTML = "<p>Error: No simulation specified.</p>";
};