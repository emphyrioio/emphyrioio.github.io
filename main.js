// Loading link list
document.addEventListener("DOMContentLoaded", function () {

    // QCMs

    const qcm_anglais = [
        {
            id: "1",
            title: "Anglais : jours de la semaine"
        }
    ];

    const qcm_prehistoire = [
        {
            id: "1",
            title: "La Préhistoire I"
        },
        {
            id: "2",
            title: "La Préhistoire II"
        }
    ];

    const qcm_contenance = [
        {
            id: "1",
            title: "Unité de mesure de la contenance"
        },
        {
            id: "2",
            title: "Instrument de mesure de la contenance"
        },
        {
            id: "3",
            title: "Multiples du Litre"
        },
        {
            id: "4",
            title: "Sous-multiples du Litre"
        }
    ];

    const qcm_dir = "anglais";
    const qcm_data = qcm_anglais;

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
            link.setAttribute('href', 'qcm.html?yaml=qcm' + qcm.id + '&dir=' + qcm_dir);
        }

        if (button) {
            button.textContent = 'CQM ' + qcm.id + ' : ' + qcm.title;
        }

        qcmQuestionsDiv.appendChild(QCMDiv);
    });
});