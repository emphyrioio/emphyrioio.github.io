// Function to get URL parameters
function getURLParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// Function to sanitize directory and file names
function sanitizeInput(input) {
    return /^[a-zA-Z0-9_/-]+$/.test(input) ? input : null;
}

// Function to shuffle an array (Fisher-Yates Shuffle Algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to display questions and answers in random order
function displayQuestions(data) {
    const container = document.getElementById('questions-container');
    container.innerHTML = ""; // Clear previous content

    // Shuffle the questions
    const shuffledQuestions = shuffleArray(data);

    shuffledQuestions.forEach((item, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question', 'mb-3');

        const questionTitle = document.createElement('h5');
        questionTitle.textContent = `${index + 1}. ${item.quest} 🐰`;

        if (item.img) {
            const questionImg = document.createElement('img');
            questionImg.src = item.img;
            questionImg.alt = "Illustration de la question";
            questionImg.style.maxWidth = "100px";
            questionImg.classList.add('img-fluid', 'mt-2');
            questionTitle.appendChild(questionImg);
        }

        questionDiv.appendChild(questionTitle);

        // Shuffle the responses for each question
        const shuffledResponses = shuffleArray(item.responses);

        shuffledResponses.forEach((response, i) => {
            const formCheckDiv = document.createElement('div');
            formCheckDiv.classList.add('form-check');

            const input = document.createElement('input');
            input.classList.add('form-check-input');
            input.type = 'radio';
            input.name = `q${index + 1}`;
            input.value = response.val ? "1" : "-1";
            input.id = `q${index + 1}a${i}`;

            const label = document.createElement('label');
            label.classList.add('form-check-label');
            label.textContent = response.resp;
            label.setAttribute('for', `q${index + 1}a${i}`);

            formCheckDiv.appendChild(input);
            formCheckDiv.appendChild(label);
            questionDiv.appendChild(formCheckDiv);
        });

        container.appendChild(questionDiv);
    });
}

// Function to load the YAML file
function loadYAML() {
    // Get the YAML file name and directory from the URL parameters
    let yamlFile = getURLParameter('yaml');
    let dir = getURLParameter('dir');

    // Validate and sanitize inputs
    yamlFile = sanitizeInput(yamlFile) || 'qcm1'; // Default file name if invalid
    dir = sanitizeInput(dir) || ''; // Default directory if invalid

    // Construct the full file path, ensuring it is inside the yaml/ directory
    const yamlPath = dir ? `yaml/${dir}/${yamlFile}.yaml` : `yaml/${yamlFile}.yaml`;

    console.log("Trying to fetch YAML file from:", yamlPath);

    fetch(yamlPath)
        .then(response => {
            console.log("Fetching:", yamlPath);
            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}: ${yamlPath}`);
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
            document.getElementById('questions-container').innerHTML = `
                <p class="text-danger">Unable to load the questionnaire.<br>
                <strong>Check the file path:</strong> ${yamlPath}</p>
            `;
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