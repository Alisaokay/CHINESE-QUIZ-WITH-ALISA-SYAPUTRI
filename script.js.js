// Bank Soalan Kuiz Mandarin - Inggeris
const quizData = [
  {
    hanzi: "你好",
    pinyin: "Nǐ hǎo",
    english: "Hello",
    category: "Perbualan",
    options: ["Hello", "Goodbye", "Thank you", "Sorry"]
  },
  {
    hanzi: "谢谢",
    pinyin: "Xièxie",
    english: "Thank you",
    category: "Perbualan",
    options: ["You're welcome", "Thank you", "Please", "Excuse me"]
  },
  {
    hanzi: "再见",
    pinyin: "Zàijiàn",
    english: "Goodbye",
    category: "Perbualan",
    options: ["See you tomorrow", "Good night", "Goodbye", "Hello"]
  },
  {
    hanzi: "猫",
    pinyin: "Māo",
    english: "Cat",
    category: "Haiwan",
    options: ["Dog", "Cat", "Bird", "Fish"]
  },
  {
    hanzi: "狗",
    pinyin: "Gǒu",
    english: "Dog",
    category: "Haiwan",
    options: ["Cat", "Rabbit", "Dog", "Tiger"]
  },
  {
    hanzi: "水",
    pinyin: "Shuǐ",
    english: "Water",
    category: "Makanan & Minuman",
    options: ["Tea", "Water", "Milk", "Juice"]
  },
  {
    hanzi: "苹果",
    pinyin: "Píngguǒ",
    english: "Apple",
    category: "Makanan & Minuman",
    options: ["Banana", "Orange", "Apple", "Grape"]
  },
  {
    hanzi: "朋友",
    pinyin: "Péngyǒu",
    english: "Friend",
    category: "Hubungan",
    options: ["Teacher", "Student", "Friend", "Family"]
  },
  {
    hanzi: "老师",
    pinyin: "Lǎoshī",
    english: "Teacher",
    category: "Pekerjaan",
    options: ["Doctor", "Teacher", "Student", "Police"]
  },
  {
    hanzi: "开心",
    pinyin: "Kāixīn",
    english: "Happy",
    category: "Emosi",
    options: ["Sad", "Angry", "Tired", "Happy"]
  }
];

// Pembolehubah Keadaan (State)
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let streak = 0;
let maxStreak = 0;
let correctCount = 0;
let wrongCount = 0;
let timer = null;
let timeLeft = 10;
const QUESTION_TIME = 10; // Masa per soalan (saat)

// Elemen DOM
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const audioBtn = document.getElementById('audio-btn');

const questionNumberEl = document.getElementById('question-number');
const progressBar = document.getElementById('progress-bar');
const timerBar = document.getElementById('timer-bar');
const streakCountEl = document.getElementById('streak-count');

const categoryTag = document.getElementById('category-tag');
const hanziText = document.getElementById('hanzi-text');
const pinyinText = document.getElementById('pinyin-text');
const optionsGrid = document.getElementById('options-grid');
const currentScoreEl = document.getElementById('current-score');

const finalScoreEl = document.getElementById('final-score');
const correctCountEl = document.getElementById('correct-count');
const wrongCountEl = document.getElementById('wrong-count');
const maxStreakEl = document.getElementById('max-streak');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');

// Event Listeners
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', goToNextQuestion);
restartBtn.addEventListener('click', startQuiz);
audioBtn.addEventListener('click', speakMandarin);

// Fungsi Rawak (Shuffle Array)
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

// Mula Kuiz
function startQuiz() {
  currentQuestions = shuffle(quizData);
  currentIndex = 0;
  score = 0;
  streak = 0;
  maxStreak = 0;
  correctCount = 0;
  wrongCount = 0;

  startScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');

  loadQuestion();
}

// Muat Soalan
function loadQuestion() {
  resetState();
  const q = currentQuestions[currentIndex];

  // Kemaskini UI
  questionNumberEl.textContent = `Soalan ${currentIndex + 1}/${currentQuestions.length}`;
  progressBar.style.width = `${((currentIndex) / currentQuestions.length) * 100}%`;
  streakCountEl.textContent = streak;
  currentScoreEl.textContent = score;

  categoryTag.textContent = q.category;
  hanziText.textContent = q.hanzi;
  pinyinText.textContent = q.pinyin;

  // Sediakan pilihan jawapan (ditaram)
  const shuffledOptions = shuffle(q.options);
  optionsGrid.innerHTML = '';

  shuffledOptions.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span><i class="fa-regular fa-circle"></i>`;
    btn.addEventListener('click', () => selectOption(btn, opt, q.english));
    optionsGrid.appendChild(btn);
  });

  // Sebutkan karakter Mandarin secara automatik
  speakMandarin();

  // Mula Timer
  startTimer();
}

// Reset Keadaan Soalan
function resetState() {
  clearInterval(timer);
  timerBar.style.width = '100%';
  nextBtn.classList.add('hidden');
}

// Mula Pemasa
function startTimer() {
  timeLeft = QUESTION_TIME;
  const interval = 100; // Kemaskini setiap 100ms
  const totalTicks = (QUESTION_TIME * 1000) / interval;
  let currentTick = totalTicks;

  timer = setInterval(() => {
    currentTick--;
    const percentage = (currentTick / totalTicks) * 100;
    timerBar.style.width = `${Math.max(0, percentage)}%`;

    if (currentTick <= 0) {
      clearInterval(timer);
      handleTimeOut();
    }
  }, interval);
}

// Masa Tamat
function handleTimeOut() {
  wrongCount++;
  streak = 0;
  streakCountEl.textContent = streak;

  const currentQ = currentQuestions[currentIndex];
  const allBtns = optionsGrid.querySelectorAll('.option-btn');

  allBtns.forEach(btn => {
    btn.disabled = true;
    if (btn.querySelector('span').textContent === currentQ.english) {
      btn.classList.add('correct');
      btn.querySelector('i').className = 'fa-solid fa-circle-check';
    }
  });

  nextBtn.classList.remove('hidden');
}

// Pilih Jawapan
function selectOption(selectedBtn, selectedText, correctText) {
  clearInterval(timer);

  const allBtns = optionsGrid.querySelectorAll('.option-btn');
  allBtns.forEach(btn => btn.disabled = true);

  if (selectedText === correctText) {
    // Jawapan Betul
    selectedBtn.classList.add('correct');
    selectedBtn.querySelector('i').className = 'fa-solid fa-circle-check';

    correctCount++;
    streak++;
    if (streak > maxStreak) maxStreak = streak;

    // Tambah Skor (Bonus Combo)
    const basePoints = 100;
    const bonusPoints = (streak - 1) * 20;
    score += basePoints + bonusPoints;
    currentScoreEl.textContent = score;

  } else {
    // Jawapan Salah
    selectedBtn.classList.add('wrong');
    selectedBtn.querySelector('i').className = 'fa-solid fa-circle-xmark';

    wrongCount++;
    streak = 0;

    // Tunjukkan jawapan yang betul
    allBtns.forEach(btn => {
      if (btn.querySelector('span').textContent === correctText) {
        btn.classList.add('correct');
        btn.querySelector('i').className = 'fa-solid fa-circle-check';
      }
    });
  }

  streakCountEl.textContent = streak;
  nextBtn.classList.remove('hidden');
}

// Soalan Seterusnya / Tamat Kuiz
function goToNextQuestion() {
  currentIndex++;
  if (currentIndex < currentQuestions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

// Papar Keputusan
function showResults() {
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  finalScoreEl.textContent = score;
  correctCountEl.textContent = correctCount;
  wrongCountEl.textContent = wrongCount;
  maxStreakEl.textContent = `${maxStreak}x`;

  // Mesej dinamik mengikut skor
  const percentage = (correctCount / currentQuestions.length) * 100;

  if (percentage === 100) {
    resultTitle.textContent = "Sempurna! 🎉";
    resultMessage.textContent = "Luar biasa! Anda menguasai kesemua kosa kata ini!";
  } else if (percentage >= 70) {
    resultTitle.textContent = "Tahniah! 🌟";
    resultMessage.textContent = "Keputusan yang sangat baik! Teruskan usaha anda.";
  } else if (percentage >= 40) {
    resultTitle.textContent = "Boleh Tahan! 👍";
    resultMessage.textContent = "Cuba lagi untuk meningkatkan markah anda!";
  } else {
    resultTitle.textContent = "Jangan Putus Asa! 💪";
    resultMessage.textContent = "Latihan menjadikan kita makin mantap. Cuba sekali lagi!";
  }
}

// Sebutan Suara (Text-to-Speech API)
function speakMandarin() {
  if ('speechSynthesis' in window) {
    // Hentikan sebutan sedia ada jika ada
    window.speechSynthesis.cancel();

    const text = hanziText.textContent;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN'; // Bahasa Mandarin
    utterance.rate = 0.8;    // Kelajuan sebutan sederhana

    window.speechSynthesis.speak(utterance);
  }
}