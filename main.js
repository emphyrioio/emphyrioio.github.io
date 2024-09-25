// Loading link list
document.addEventListener("DOMContentLoaded", function () {

    // QCMs
    const qcm_data = [
        {
            id: "1",
            title: "La Préhistoire"
        },
        {
            id: "2",
            title: "L'Histoire"
        },
        {
            id: "3",
            title: "Les formes géométriques"
        },
        {
            id: "4",
            title: "La géométrie"
        },
        {
            id: "5",
            title: "Les animaux vivipares et ovipares I"
        },
        {
            id: "6",
            title: "Les animaux vivipares et ovipares II"
        },
        {
            id: "7",
            title: "Les animaux vivipares et ovipares III"
        }
    ];

    const template = document.querySelector('#qcm-question-template');
    const qcmQuestionsDiv = document.getElementById('qcm-questions');

    qcm_data.forEach(function (qcm) {
        const QCMDiv = document.createElement('div');
        QCMDiv.classList.add('qcm-item');
        const clone = template.content.cloneNode(true);
        QCMDiv.appendChild(clone);
        const link = QCMDiv.querySelector('a.qcm-link');
        const button = QCMDiv.querySelector('button.qcm-link');
        console.dir(QCMDiv.innerHTML);

        if (link) {
            link.setAttribute('href', 'qcm.html?yaml=qcm' + qcm.id);
        }

        if (button) {
            button.textContent = 'CQM ' + qcm.id + ' : ' + qcm.title;
        }

        qcmQuestionsDiv.appendChild(QCMDiv);
    });
});