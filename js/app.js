import {
  christmasMoviesQuestions,
  ghibliQuestions, horrorMoviesQuestions, nouvelleVagueQuestionsV2,
  starWarsNiveauExtremeQuestions
} from './questions.js';

const quizDataToStore = {
  "Star wars NIVEAU EXTREME 🌌": starWarsNiveauExtremeQuestions,
  "Horreur 😱": horrorMoviesQuestions,
  "Bientôt les vacances ! 🎄": christmasMoviesQuestions,
  "Nouvelle vague v2 🥖": nouvelleVagueQuestionsV2,
  "Ghibli niveau assez facile normalement 🗾": ghibliQuestions
};

if (!localStorage.getItem('quizData')) {
  localStorage.setItem('quizData', JSON.stringify(quizDataToStore));
}

// At the top, after other localStorage reads:
const quizVisibility = JSON.parse(localStorage.getItem('quizVisibility') || '{}');

const quizChecked = JSON.parse(localStorage.getItem('quizChecked') || '{}');
const quizData = JSON.parse(localStorage.getItem('quizData') || '{}');
const container = document.getElementById('quiz-container');
container.innerHTML = '';

Object.entries(quizData).forEach(([theme, questions]) => {
  if (!quizChecked[theme] || quizChecked[theme].length !== questions.length) {
    quizChecked[theme] = Array(questions.length).fill(false);
  }

  // Theme title, counter, and reset button
  const themeTitle = document.createElement('h2');
  themeTitle.textContent = theme + '';
  themeTitle.style.cursor = 'pointer';
  const counter = document.createElement('span');
  counter.style.fontSize = '1rem';
  counter.style.fontWeight = 'normal';
  counter.style.paddingLeft = '0.3rem';
  const checkedCount = quizChecked[theme].filter(Boolean).length;
  counter.textContent = `(${checkedCount}/${questions.length})`;
  themeTitle.appendChild(counter);

  // Reset button
  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset';
  resetBtn.style.marginLeft = '1em';
  themeTitle.appendChild(resetBtn);

  container.appendChild(themeTitle);

  // Questions wrapper for toggling
  const questionsWrapper = document.createElement('div');
  questionsWrapper.className = 'questions-wrapper';

  // ... inside Object.entries(quizData).forEach ...
  let visible = quizVisibility[theme] !== undefined ? quizVisibility[theme] : false;
  questionsWrapper.style.display = visible ? '' : 'none';

  const checkboxes = [];

  questions.forEach((item, idx) => {
    const section = document.createElement('section');
    section.className = 'quiz-question-card';

    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'flex-start';
    wrapper.style.cursor = 'pointer';

    const topRow = document.createElement('div');
    topRow.style.display = 'flex';
    topRow.style.alignItems = 'center';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `quiz-check-${theme}-${idx}`;
    checkbox.checked = !!quizChecked[theme][idx];
    checkboxes.push(checkbox);

    const question = document.createElement('span');
    question.textContent = `Q : ${item.question}`;
    question.style.marginLeft = '0.5em';
    question.style.marginRight = '1em';

    const answer = document.createElement('span');
    answer.textContent = `R : ${item.answer}`;
    answer.style.marginLeft = '2.1em'; // align with question text
    answer.style.marginTop = '0.3em';
    answer.style.display = 'block';

    // Set initial line-through if checked
    const underline = checkbox.checked ? 'line-through' : 'none';
    question.style.textDecoration = underline;
    answer.style.textDecoration = underline;

    checkbox.addEventListener('change', () => {
      const underline = checkbox.checked ? 'line-through' : 'none';
      question.style.textDecoration = underline;
      answer.style.textDecoration = underline;
      quizChecked[theme][idx] = checkbox.checked;
      localStorage.setItem('quizChecked', JSON.stringify(quizChecked));
      const checkedCount = checkboxes.filter(cb => cb.checked).length;
      counter.textContent = `(${checkedCount}/${questions.length})`;
    });

    // Toggle checkbox when clicking the wrapper (except when clicking the checkbox itself)
    wrapper.addEventListener('click', (e) => {
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      }
    });

    topRow.appendChild(checkbox);
    topRow.appendChild(question);
    wrapper.appendChild(topRow);
    wrapper.appendChild(answer);
    section.appendChild(wrapper);
    questionsWrapper.appendChild(section);
  });

  container.appendChild(questionsWrapper);

  // Reset button logic
  resetBtn.addEventListener('click', () => {
    checkboxes.forEach((cb, idx) => {
      cb.checked = false;
      quizChecked[theme][idx] = false;
      cb.dispatchEvent(new Event('change'));
    });
    localStorage.setItem('quizChecked', JSON.stringify(quizChecked));
    counter.textContent = `(0/${questions.length})`;
  });

  // Toggle questions visibility on theme title click
  themeTitle.addEventListener('click', (e) => {
    if (e.target === resetBtn) return;
    visible = !visible;
    questionsWrapper.style.display = visible ? '' : 'none';
    quizVisibility[theme] = visible;
    localStorage.setItem('quizVisibility', JSON.stringify(quizVisibility));
  });
});

localStorage.setItem('quizChecked', JSON.stringify(quizChecked));
