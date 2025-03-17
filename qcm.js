// Function to get URL parameters
function getURLParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
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

// Function that checks if all questions are answered
function allQuestionsAnswered() {
    const questions = document.querySelectorAll('.question');
    let allAnswered = true;

    questions.forEach((question) => {
        const selected = question.querySelector('input[type="radio"]:checked');
        if (!selected) {
            allAnswered = false;
        }
    });

    return allAnswered;
}

// Function that calculates the score and checks if all answers are correct
function updateScore() {
    let score = 0;
    let totalQuestions = 0;
    let correctAnswers = 0; // Variable to count correct answers
    const questions = document.querySelectorAll('.question');

    questions.forEach((question) => {
        totalQuestions++;
        const inputs = question.querySelectorAll('input[type="radio"]');

        // Reset label colors
        inputs.forEach((input) => {
            const label = question.querySelector(`label[for="${input.id}"]`);
            label.classList.remove('text-success', 'text-danger');
        });

        // Check the selected answer
        const selected = question.querySelector('input[type="radio"]:checked');
        if (selected) {
            score += parseInt(selected.value);

            // Apply colors based on answer correctness
            const selectedLabel = question.querySelector(`label[for="${selected.id}"]`);
            if (selected.value == "1") {
                selectedLabel.classList.add('text-success'); // Green for correct answer
                correctAnswers++; // Count correct answers
            } else {
                selectedLabel.classList.add('text-danger'); // Red for wrong answer
            }
        }
    });

    const scoreBox = document.querySelector('.score-box');
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = score;

    // Change the color of the score based on value
    if (score > 0) {
        scoreBox.style.color = 'green';
    } else if (score < 0) {
        scoreBox.style.color = 'red';
    } else {
        scoreBox.style.color = 'black';
    }

    // Check if all answers are correct (trigger the modal if correctAnswers equals totalQuestions)
    console.log(correctAnswers);
    console.log(totalQuestions);
    if (correctAnswers === totalQuestions) {
        triggerConfetti();
        showCongratsModal(); // Show congratulations modal if all answers are correct
    }
}

// Function to trigger confetti explosion
function triggerConfetti() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });
}

// Attach 'change' event to each radio button to check if all questions are answered
document.addEventListener('change', (event) => {
    if (event.target.type === 'radio') {
        if (allQuestionsAnswered()) {
            updateScore();
        }
    }
});

// Function to show the congratulations modal
function showCongratsModal() {
    const modalElement = document.getElementById('confettiModal');
    const modal = new bootstrap.Modal(modalElement);

    // Add an event listener to refresh the page when the modal is closed
    modalElement.addEventListener('hidden.bs.modal', resetPage);

    modal.show();
}

// Function to reset the page
function resetPage() {
    window.location.reload(); // Reload the page to reset everything
}

// Function to load the YAML file
function loadYAML() {

    let yamlFile = getURLParameter('yaml');
    let yamlDir = getURLParameter('dir');

    yamlFile = yamlFile || 'qcm1';
    yamlDir = yamlDir || '';

    const isValidFileName = /^[a-zA-Z0-9_-]+$/.test(yamlFile);
    if (!isValidFileName) {
        console.error('Invalid file name provided.');
        document.getElementById('questions-container').innerHTML = '<p class="text-danger">Invalid file name. Please check the URL.</p>';
        return;
    }

    const isValidDirName = /^[a-zA-Z0-9_-]+$/.test(yamlDir);
    if (!isValidDirName) {
        console.error('Invalid directory name provided.');
        document.getElementById('questions-container').innerHTML = '<p class="text-danger">Invalid directory. Please check the URL.</p>';
        return;
    }

    const yamlPath = yamlDir ? `yaml/${yamlDir}/${yamlFile}.yaml` : `yaml/${yamlFile}.yaml`;

    fetch(yamlPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP Error ' + response.status);
            }
            return response.text();
        })
        .then(yamlText => {
            const data = jsyaml.load(yamlText);
            console.log('YAML Data Loaded: ', data);  // Add this line for debugging
            displayQuestions(data);
        })
        .catch(error => {
            console.error('Error loading YAML file:', error);
            // Display an error message to the user
            document.getElementById('questions-container').innerHTML = '<p class="text-danger">Unable to load the questionnaire. Please check the YAML file name.</p>';
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