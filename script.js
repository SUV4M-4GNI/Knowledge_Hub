// Knowledge Hub AI uses only local JavaScript so the demo works offline.
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const notesTopic = document.querySelector("#notesTopic");
const notesOutput = document.querySelector("#notesOutput");
const quizTopic = document.querySelector("#quizTopic");
const quizOutput = document.querySelector("#quizOutput");
const scoreText = document.querySelector("#scoreText");
const scoreHint = document.querySelector("#scoreHint");
const progressFill = document.querySelector("#progressFill");
const chatWindow = document.querySelector("#chatWindow");
const doubtInput = document.querySelector("#doubtInput");
const formStatus = document.querySelector("#formStatus");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("nav-open", isOpen);
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  });
});

function cleanTopic(value, fallback) {
  const topic = value.trim().replace(/\s+/g, " ");
  return topic || fallback;
}

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

function topicKeywords(topic) {
  return topic
    .split(" ")
    .filter((word) => word.length > 2)
    .slice(0, 4);
}

document.querySelector("#generateNotes").addEventListener("click", () => {
  const rawTopic = cleanTopic(notesTopic.value, "Quality Education");
  const topic = escapeHTML(rawTopic);
  const keywords = topicKeywords(rawTopic).map(escapeHTML);
  const focusWords = keywords.length ? keywords.join(", ") : "basic ideas";

  notesOutput.innerHTML = `
    <article class="notes-result">
      <div class="notes-block">
        <h3>Summary</h3>
        <p><strong>${topic}</strong> is an important study topic. It can be understood by learning the meaning, main facts, examples, and real-life use. A good learner connects the topic with daily life and asks questions when something is unclear.</p>
      </div>
      <div class="notes-block">
        <h3>Key Points</h3>
        <ul>
          <li>Start with the definition of ${topic} in simple words.</li>
          <li>Identify important terms: ${focusWords}.</li>
          <li>Write two examples from school, home, nature, or society.</li>
          <li>Use diagrams, flowcharts, or tables when the topic has steps.</li>
          <li>Revise by explaining the topic to a friend in one minute.</li>
        </ul>
      </div>
      <div class="notes-block">
        <h3>Quick Revision Tips</h3>
        <ul>
          <li>Read the summary once, then close the book and recall three facts.</li>
          <li>Make flashcards for formulas, dates, definitions, or vocabulary.</li>
          <li>Practice one question today and another tomorrow for better memory.</li>
        </ul>
      </div>
    </article>
  `;
});

const quizTemplates = [
  {
    stem: "What is the best first step when studying {topic}?",
    options: ["Memorize random lines", "Understand the basic meaning", "Skip examples", "Avoid revision"],
    answer: "Understand the basic meaning",
    explanation: "Learning becomes easier when the main idea is clear first."
  },
  {
    stem: "Which activity helps you remember {topic} for longer?",
    options: ["Cramming once", "Spaced revision", "Never writing notes", "Studying only before exams"],
    answer: "Spaced revision",
    explanation: "Short revision sessions repeated over time improve memory."
  },
  {
    stem: "Why are examples useful in {topic}?",
    options: ["They make ideas practical", "They make learning slower only", "They replace understanding", "They are never needed"],
    answer: "They make ideas practical",
    explanation: "Examples connect classroom learning to real-life situations."
  },
  {
    stem: "What should a student do after getting confused about {topic}?",
    options: ["Stop studying", "Ask a doubt and break it into steps", "Copy without thinking", "Ignore the topic"],
    answer: "Ask a doubt and break it into steps",
    explanation: "Breaking a doubt into smaller parts makes it easier to solve."
  },
  {
    stem: "Which method is most useful for revising {topic} quickly?",
    options: ["A short summary and key points", "Only decoration", "Deleting all notes", "Reading unrelated topics"],
    answer: "A short summary and key points",
    explanation: "Focused summaries help during quick revision before tests."
  }
];

document.querySelector("#generateQuiz").addEventListener("click", () => {
  const topic = escapeHTML(cleanTopic(quizTopic.value, "Quality Education"));
  const questions = quizTemplates.map((question, index) => ({ ...question, number: index + 1 }));

  quizOutput.innerHTML = questions.map((question) => `
    <article class="quiz-question">
      <h3>Q${question.number}. ${question.stem.replace("{topic}", topic)}</h3>
      <div class="option-list">
        ${question.options.map((option, optionIndex) => `<div class="option">${String.fromCharCode(65 + optionIndex)}. ${option}</div>`).join("")}
      </div>
      <p class="answer">Correct answer: ${question.answer}</p>
      <p class="explanation">${question.explanation}</p>
    </article>
  `).join("");

  scoreText.textContent = "5 questions generated";
  scoreHint.textContent = "Use the answers and explanations to self-check.";
  progressFill.style.width = "100%";
});

function createMessage(type, text) {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.innerHTML = `<strong>${type === "user" ? "You" : "Knowledge Bot"}</strong><p>${escapeHTML(text)}</p>`;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function ruleBasedReply(doubt) {
  const lower = doubt.toLowerCase();

  if (lower.includes("math") || lower.includes("formula") || lower.includes("fraction")) {
    return "For math doubts, write the given values first, choose the correct formula, solve one step at a time, and check the final unit or sign.";
  }

  if (lower.includes("science") || lower.includes("photosynthesis") || lower.includes("energy")) {
    return "For science, start with the definition, identify the process or cause, then connect it to a real example. A small diagram can make the answer stronger.";
  }

  if (lower.includes("english") || lower.includes("grammar") || lower.includes("essay")) {
    return "For English, find the main idea first. Use clear sentences, examples, and a final line that connects back to the question.";
  }

  if (lower.includes("history") || lower.includes("date") || lower.includes("civics")) {
    return "For social studies, remember the event, people involved, reason, result, and impact. A timeline is a powerful revision tool.";
  }

  return "Good doubt. Try this method: define the topic, list what you already know, identify the confusing word or step, then solve it with one simple example. This demo assistant uses local rule-based responses.";
}

document.querySelector("#doubtForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const doubt = cleanTopic(doubtInput.value, "");

  if (!doubt) {
    createMessage("bot", "Please type a doubt first so I can help.");
    return;
  }

  createMessage("user", doubt);
  doubtInput.value = "";

  setTimeout(() => {
    createMessage("bot", ruleBasedReply(doubt));
  }, 350);
});

document.querySelector("#contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "Thank you! Demo message submitted successfully.";
  event.currentTarget.reset();
});
