// Function to get URL parameters
function getURLParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// Function to sanitize directory and file names
function sanitizeInput(input) {
    return /^[a-zA-Z0-9_/-]+$/.test(input) ? input : null;
}

// Function to load the YAML file
function loadYAML() {
    // Get the YAML file name and directory from the URL parameters
    let yamlFile = getURLParameter('yaml');
    let dir = getURLParameter('dir');

    // Validate and sanitize inputs
    yamlFile = sanitizeInput(yamlFile) || 'qcm1'; // Default file name if invalid
    dir = sanitizeInput(dir) || 'yaml'; // Default directory if invalid

    // Construct the full file path
    const yamlPath = `${dir}/${yamlFile}.yaml`;

    fetch(yamlPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP Error ' + response.status);
            }
            return response.text();
        })
        .then(yamlText => {
            const data = jsyaml.load(yamlText);
            console.log('YAML Data Loaded: ', data);
            displayQuestions(data);
        })
        .catch(error => {
            console.error('Error loading YAML file:', error);
            document.getElementById('questions-container').innerHTML = '<p class="text-danger">Unable to load the questionnaire. Please check the YAML file name and directory.</p>';
        });
}

// Load the questions when the page is ready
document.addEventListener('DOMContentLoaded', () => {
    loadYAML();

    // Attach 'change' event to each radio button to update the score and colors
    document.addEventListener('change', (event) => {
        if (event.target.type === 'radio') {
            if (allQuestionsAnswered()) {
                updateScore();
            }
        }
    });
});