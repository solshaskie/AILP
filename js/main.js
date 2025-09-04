document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const navigation = document.getElementById('navigation');
    const narratorToggle = document.getElementById('narrator-toggle');

    let narratorEnabled = false;
    const synth = window.speechSynthesis;

    narratorToggle.addEventListener('click', () => {
        narratorEnabled = !narratorEnabled;
        if (narratorEnabled) {
            speakLesson();
        } else {
            synth.cancel();
        }
    });

    const lessons = [
        { title: 'Step 1: Fundamentals', path: 'lessons/01_fundamentals.json' },
        { title: 'Step 2: Tools of the Trade', path: 'lessons/02_tools.json' },
        { title: 'Step 3: Practical Projects', path: 'lessons/03_projects.json' },
        { title: 'Step 4: AI App Development', path: 'lessons/04_app_development.json' },
        { title: 'Step 5: Stay Current', path: 'lessons/05_stay_current.json' }
    ];

    // Generate navigation links
    const navList = document.createElement('ul');
    lessons.forEach((lesson, index) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = lesson.title;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active class from all links
            document.querySelectorAll('nav#navigation a').forEach(a => a.classList.remove('active'));
            // Add active class to the clicked link
            link.classList.add('active');
            loadLesson(lesson.path);
        });
        listItem.appendChild(link);
        navList.appendChild(listItem);
    });
    navigation.appendChild(navList);

    // Function to load and render lesson content
    function loadLesson(path) {
        fetch(path)
            .then(response => response.json())
            .then(data => {
                renderLesson(data);
            })
            .catch(error => {
                console.error('Error loading lesson:', error);
                content.innerHTML = '<p>Error loading lesson content.</p>';
            });
    }

    // Function to render the lesson content
    function renderLesson(data) {
        content.innerHTML = ''; // Clear existing content
        synth.cancel(); // Stop any previous speech
        data.content.forEach(item => {
            const element = document.createElement(item.type);
            if (item.text) {
                element.innerHTML = item.text;
            }
            if (item.src) {
                element.src = item.src;
            }
            if (item.alt) {
                element.alt = item.alt;
            }

            if (item.type === 'quiz') {
                renderQuiz(item, content);
            } else {
                content.appendChild(element);
            }
        });
    }

    function renderQuiz(quizData, container) {
        const quizContainer = document.createElement('div');
        quizContainer.className = 'quiz-container';

        const question = document.createElement('p');
        question.textContent = quizData.question;
        quizContainer.appendChild(question);

        const optionsList = document.createElement('ul');
        quizData.options.forEach(optionText => {
            const optionItem = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = optionText;
            button.addEventListener('click', () => {
                if (optionText === quizData.answer) {
                    alert('Correct!');
                } else {
                    alert('Incorrect. Try again!');
                }
            });
            optionItem.appendChild(button);
            optionsList.appendChild(optionItem);
        });
        quizContainer.appendChild(optionsList);
        container.appendChild(quizContainer);
    }

    function speakLesson() {
        if (!narratorEnabled) return;

        const elementsToRead = content.querySelectorAll('h1, h2, h3, p');
        elementsToRead.forEach(element => {
            const utterance = new SpeechSynthesisUtterance(element.textContent);
            synth.speak(utterance);
        });
    }

    // Load the first lesson by default
    if (lessons.length > 0) {
        loadLesson(lessons[0].path);
        navigation.querySelector('a').classList.add('active');
    }
});
