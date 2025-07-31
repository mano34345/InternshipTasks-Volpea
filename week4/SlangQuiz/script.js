const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const startPage = document.getElementById("start-page");
const quizPage = document.getElementById("quiz-page");
const resultPage = document.getElementById("result-page");

const questionText = document.getElementById("question");
const optionsBox = document.getElementById("options");
const finalScore = document.getElementById("final-score");
const percentBox = document.getElementById("percentage");
const finalTime = document.getElementById("final-time");
const scoreBox = document.getElementById("score-box");
const timeDisplay = document.getElementById("time");

let questions = [
  {
    question: "What does 'cap' mean in Gen-Z slang?",
    options: ["Lie", "Truth", "Hat", "Joke"],
    answer: 0
  },
  {
    question: "‘Slay’ is mostly used to describe:",
    options: ["Killing someone", "Looking amazing", "Working hard", "Wearing armor"],
    answer: 1
  },
  {
    question: "‘No cap’ means:",
    options: ["No lie", "No hat", "No money", "No joke"],
    answer: 0
  },
  {
    question: "‘Bet’ can mean:",
    options: ["Challenge declined", "Okay / sure", "I disagree", "Maybe"],
    answer: 1
  },
  {
    question: "‘Flex’ means:",
    options: ["Bend something", "Show off", "Stretch", "Relax"],
    answer: 1
  }
];

questions = questions.sort(() => 0.5 - Math.random());

let currentQuestion = 0;
let score = 0;
let totalTime = 60;
let timeLeft = totalTime;
let timer;

startBtn.onclick = () => {
  startPage.classList.add("hide");
  quizPage.classList.remove("hide");
  startQuiz();
};

restartBtn.onclick = () => window.location.reload();

function startQuiz() {
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) endQuiz();
  }, 1000);

  loadQuestion();
}

function loadQuestion() {
  nextBtn.classList.add("hide");
  const q = questions[currentQuestion];
  questionText.textContent = q.question;
  optionsBox.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => selectOption(i, q.answer);
    optionsBox.appendChild(btn);
  });
}

function selectOption(selectedIndex, correctIndex) {
  const btns = optionsBox.querySelectorAll("button");
  btns.forEach((btn, i) => {
    btn.classList.add("selected");
    if (i === correctIndex) btn.classList.add("correct");
    else if (i === selectedIndex && selectedIndex !== correctIndex) btn.classList.add("wrong");
  });

  if (selectedIndex === correctIndex) score++;
  scoreBox.textContent = `🔥 Score: ${score}`;
  nextBtn.classList.remove("hide");
}

nextBtn.onclick = () => {
  currentQuestion++;
  if (currentQuestion < questions.length) loadQuestion();
  else endQuiz();
};

function endQuiz() {
  clearInterval(timer);
  quizPage.classList.add("hide");
  resultPage.classList.remove("hide");

  finalScore.textContent = `✅ Correct Answers: ${score} / ${questions.length}`;
  percentBox.textContent = `📊 Percentage: ${(score / questions.length * 100).toFixed(0)}%`;
  finalTime.textContent = `⏱️ Time Taken: ${totalTime - timeLeft} seconds`;
}
