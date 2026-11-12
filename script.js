
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// 1. Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. Questions
const questions = [
    {
        icon: "🫂",
        category: "HUGS & LOVE",
        question: "What kind of hug do you love?",
        options: [
            "Long tight hug 🫂",
            "Surprise hug 🥰",
            "Side hug 💕",
            "Gentle hug 🌸"
        ]
    },
    {
        icon: "😘",
        category: "ROMANTIC MOMENTS",
        question: "Which kiss sounds most romantic?",
        options: [
            "Forehead kiss 💗",
            "Cheek kiss 😘",
            "Hand kiss 🌹",
            "Goodnight kiss 💋"
        ]
    },
    {
        icon: "🌧️",
        category: "DREAM DATE",
        question: "What would be your perfect romantic date?",
        options: [
            "Rainy walk 🌧️",
            "Candlelight dinner 🕯️",
            "Long drive 🌙",
            "Beach sunset 🌊"
        ]
    },
    {
        icon: "🦋",
        category: "BUTTERFLIES",
        question: "If your special person holds your hand?",
        options: [
            "Butterflies! 🦋",
            "I will smile 🥰",
            "I will blush 🙈",
            "Hold it tighter ❤️"
        ]
    },
    {
        icon: "💗",
        category: "LOVE LANGUAGE",
        question: "What matters most in a relationship?",
        options: [
            "Trust 🤝",
            "Loyalty ❤️",
            "Understanding 🫶",
            "Respect 🌸"
        ]
    },
    {
        icon: "🌙",
        category: "LATE NIGHT TALKS",
        question: "How would you spend a romantic night?",
        options: [
            "Long conversations 🌙",
            "Movie together 🎬",
            "Stargazing ✨",
            "Romantic dinner 🕯️"
        ]
    },
    {
        icon: "🏝️",
        category: "DREAM HONEYMOON",
        question: "Where would you love your honeymoon?",
        options: [
            "Maldives 🏝️",
            "Switzerland 🏔️",
            "Paris 🗼",
            "Bali 🌴"
        ]
    },
    {
        icon: "💌",
        category: "SWEET SURPRISE",
        question: "What romantic surprise would you love?",
        options: [
            "Love letter 💌",
            "Flowers 🌹",
            "Personalised gift 🎁",
            "Surprise date ❤️"
        ]
    },
    {
        icon: "🫶",
        category: "COMFORT & TRUST",
        question: "What makes physical closeness special?",
        options: [
            "Comfort ❤️",
            "Mutual consent 🤝",
            "Trust 💗",
            "Emotional connection 🌸"
        ]
    },
    {
        icon: "😘",
        category: "ONE LAST SECRET",
        question: "What would make you happiest?",
        options: [
            "A warm hug 🫂",
            "A sweet kiss 😘",
            "A love letter 💌",
            "A beautiful date ❤️"
        ]
    }
];

// 4. HTML elements
const welcomeScreen = document.getElementById("welcomeScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const personName = document.getElementById("personName");
const consentCheckbox = document.getElementById("consentCheckbox");
const startBtn = document.getElementById("startBtn");

const questionNumber = document.getElementById("questionNumber");
const questionIcon = document.getElementById("questionIcon");
const questionText = document.getElementById("questionText");
const category = document.getElementById("category");

const optionsContainer = document.getElementById("options");
const customAnswer = document.getElementById("customAnswer");
const nextBtn = document.getElementById("nextBtn");
const progress = document.getElementById("progress");

const resultName = document.getElementById("resultName");
const answerSummary = document.getElementById("answerSummary");
const restartBtn = document.getElementById("restartBtn");

const heartsContainer = document.getElementById("hearts");

let currentQuestion = 0;
let selectedAnswer = "";
let userAnswers = [];
let userName = "";

// 5. Screen switching
function showScreen(screen) {
    document.querySelectorAll(".screen").forEach(item => {
        item.classList.remove("active");
    });

    screen.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// 6. Start game
startBtn.addEventListener("click", () => {
    const name = personName.value.trim();

    if (!name) {
        alert("Please enter your name first! ♡");
        personName.focus();
        return;
    }

    if (!consentCheckbox.checked) {
        alert("Please read and accept the data consent first.");
        return;
    }

    userName = name;
    currentQuestion = 0;
    selectedAnswer = "";
    userAnswers = [];

    showScreen(quizScreen);
    loadQuestion();
});

// 7. Load question
function loadQuestion() {
    const q = questions[currentQuestion];

    selectedAnswer = "";
    customAnswer.value = "";

    questionNumber.textContent =
        String(currentQuestion + 1).padStart(2, "0") +
        " / " +
        String(questions.length).padStart(2, "0");

    questionIcon.textContent = q.icon;
    category.textContent = q.category;
    questionText.textContent = q.question;

    progress.style.width =
        ((currentQuestion + 1) / questions.length * 100) + "%";

    optionsContainer.innerHTML = "";

    q.options.forEach(option => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "option-btn";
        button.textContent = option;
        button.setAttribute("aria-pressed", "false");

        button.addEventListener("click", () => {
            optionsContainer.querySelectorAll(".option-btn")
                .forEach(btn => {
                    btn.classList.remove("selected");
                    btn.setAttribute("aria-pressed", "false");
                });

            button.classList.add("selected");
            button.setAttribute("aria-pressed", "true");

            selectedAnswer = option;
            customAnswer.value = "";
        });

        optionsContainer.appendChild(button);
    });

    nextBtn.textContent =
        currentQuestion === questions.length - 1
            ? "See My Surprise ♥"
            : "Next Question →";
}

// 8. Next question
nextBtn.addEventListener("click", () => {
    const typedAnswer = customAnswer.value.trim();
    const finalAnswer = typedAnswer || selectedAnswer;

    if (!finalAnswer) {
        alert("Please select or write an answer! ♡");
        return;
    }

    userAnswers[currentQuestion] = {
        question: questions[currentQuestion].question,
        answer: finalAnswer
    };

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        showResult();
    }
});

// 9. Save data to Firebase
async function saveToFirebase() {
    startBtn.disabled = true;

    try {
        await addDoc(collection(db, "submissions"), {
            name: userName,
            answers: userAnswers,
            consent: true,
            consentVersion: "1.0",
            gameVersion: "1.0",
            createdAt: serverTimestamp()
        });

        return true;

    } catch (error) {
        console.error("Firebase save error:", error);

        alert(
            "Your answers could not be saved. Please check your internet connection and try again."
        );

        return false;

    } finally {
        startBtn.disabled = false;
    }
}

// 10. Show result after successful save
async function showResult() {
    nextBtn.disabled = true;
    nextBtn.textContent = "Saving your answers...";

    const saved = await saveToFirebase();

    nextBtn.disabled = false;

    if (!saved) {
        nextBtn.textContent = "Try Saving Again ♥";
        return;
    }

    nextBtn.textContent = "See My Surprise ♥";

    resultName.textContent = userName + "!";

    answerSummary.innerHTML = "";

    userAnswers.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "answer-item";

        const title = document.createElement("strong");
        title.textContent = (index + 1) + ". " + item.question;

        const answer = document.createElement("span");
        answer.textContent = item.answer;

        div.appendChild(title);
        div.appendChild(answer);

        answerSummary.appendChild(div);
    });

    showScreen(resultScreen);
}

// 11. Restart
restartBtn.addEventListener("click", () => {
    currentQuestion = 0;
    selectedAnswer = "";
    userAnswers = [];
    userName = "";

    personName.value = "";
    consentCheckbox.checked = false;

    progress.style.width = "0%";

    showScreen(welcomeScreen);
});

// 12. Floating hearts
function createHeart() {
    if (!heartsContainer) return;

    const heart = document.createElement("span");

    heart.className = "floating-heart";
    heart.textContent = "♥";

    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = (15 + Math.random() * 20) + "px";
    heart.style.animationDuration = (6 + Math.random() * 6) + "s";

    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 13000);
}

if (heartsContainer) {
    setInterval(createHeart, 900);
}

console.log("Little Things About You is ready! ♡");
