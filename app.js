const MAIN_CLASSES = [
  "Nomen",
  "Adjektiv",
  "Verb",
  "Pronomen",
  "Präposition",
  "Konjunktion",
];
const PRONOUN_TYPES = [
  "Personal",
  "Possessiv",
  "Reflexiv",
  "Demonstrativ",
  "Indefinit",
];

const SERIES = [
  {
    id: 1,
    tasks: [
      {
        sentence: "Der Bär schläft unter dem Tisch.",
        target: "Bär",
        answer: { main: "Nomen", pronounType: null },
        hint: "Achte auf ein Wort, das ein Lebewesen oder Ding bezeichnet.",
      },
      {
        sentence: "Die grüne Tasche liegt im Flur.",
        target: "grüne",
        answer: { main: "Adjektiv", pronounType: null },
        hint: "Dieses Wort beschreibt eine Eigenschaft.",
      },
      {
        sentence: "Mia übt heute einen langen Vortrag.",
        target: "übt",
        answer: { main: "Verb", pronounType: null },
        hint: "Frage nach der Tätigkeit: Was tut Mia?",
      },
      {
        sentence: "Wir gehen morgen früh zum Markt.",
        target: "Wir",
        answer: { main: "Pronomen", pronounType: "Personal" },
        hint: "Das Wort ersetzt Namen und zeigt, wer etwas tut.",
      },
      {
        sentence: "Der Schlüssel liegt zwischen den Büchern.",
        target: "zwischen",
        answer: { main: "Präposition", pronounType: null },
        hint: "Dieses Wort zeigt ein Verhältnis zwischen Wörtern im Satz.",
      },
    ],
  },
  {
    id: 2,
    tasks: [
      {
        sentence: "Obwohl es stürmte, blieb die Bühne geöffnet.",
        target: "Obwohl",
        answer: { main: "Konjunktion", pronounType: null },
        hint: "Dieses Wort verbindet Satzteile oder ganze Sätze.",
      },
      {
        sentence: "Jemand öffnete während der Führung plötzlich die Tür.",
        target: "Jemand",
        answer: { main: "Pronomen", pronounType: "Indefinit" },
        hint: "Das Wort meint eine unbestimmte Personengruppe.",
      },
      {
        sentence: "Lina erinnert sich vor dem Auftritt an die Übungen.",
        target: "sich",
        answer: { main: "Pronomen", pronounType: "Reflexiv" },
        hint: "Das Pronomen bezieht sich auf das Subjekt zurück.",
      },
      {
        sentence: "Sein älterer Bruder stellt sein Fahrrad in die Garage.",
        target: "Sein",
        answer: { main: "Pronomen", pronounType: "Possessiv" },
        hint: "Dieses Pronomen zeigt Besitz oder Zugehörigkeit.",
      },
      {
        sentence:
          "Nachdem der Regen nachließ, sammelten die Kinder dieses nasse Laub in Körben.",
        target: "dieses",
        answer: { main: "Pronomen", pronounType: "Demonstrativ" },
        hint: "Das Pronomen zeigt auf etwas Bestimmtes hin.",
      },
    ],
  },
];

const progressState = {
  currentSeriesIndex: 0,
  currentTaskIndex: 0,
  attempts: 0,
  solvedPerSeries: [0, 0],
};

const sentenceEl = document.getElementById("sentence");
const feedbackEl = document.getElementById("feedback");
const formEl = document.getElementById("answer-form");
const mainOptionsEl = document.getElementById("main-options");
const pronounOptionsEl = document.getElementById("pronoun-options");
const titleEl = document.getElementById("exercise-title");
const nextBtn = document.getElementById("next-btn");

const progressSeries1El = document.getElementById("progress-series-1");
const progressSeries2El = document.getElementById("progress-series-2");
const series2BadgeEl = document.getElementById("series-2-badge");

function createRadioGroup(container, name, values) {
  container.innerHTML = "";
  values.forEach((value, index) => {
    const id = `${name}-${index}`;
    const label = document.createElement("label");
    label.setAttribute("for", id);

    const input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.id = id;
    input.value = value;

    label.appendChild(input);
    label.append(` ${value}`);
    container.appendChild(label);
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightTarget(sentence, target) {
  const regex = new RegExp(
    `(^|[^\\p{L}])(${escapeRegExp(target)})(?=[^\\p{L}]|$)`,
    "u"
  );
  return sentence.replace(regex, `$1<span class="target">$2</span>`);
}

function currentSeries() {
  return SERIES[progressState.currentSeriesIndex];
}

function currentTask() {
  return currentSeries().tasks[progressState.currentTaskIndex];
}

function updateProgressUI() {
  progressSeries1El.textContent = `${progressState.solvedPerSeries[0]} / 5 geloest`;
  progressSeries2El.textContent = `${progressState.solvedPerSeries[1]} / 5 geloest`;

  if (progressState.solvedPerSeries[0] === 5) {
    series2BadgeEl.classList.remove("locked");
    series2BadgeEl.textContent =
      progressState.currentSeriesIndex === 1 ? "Aktiv" : "Freigeschaltet";
  }
}

function resetSelections() {
  const checked = formEl.querySelectorAll('input[type="radio"]:checked');
  checked.forEach((item) => {
    item.checked = false;
  });
}

function renderTask() {
  const task = currentTask();
  const seriesNo = currentSeries().id;
  const taskNo = progressState.currentTaskIndex + 1;
  titleEl.textContent = `Serie ${seriesNo} - Aufgabe ${taskNo} von 5`;

  sentenceEl.innerHTML = highlightTarget(task.sentence, task.target);
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  nextBtn.classList.add("hidden");
  formEl.querySelector("button[type='submit']").disabled = false;
  progressState.attempts = 0;
  resetSelections();
  updateProgressUI();
}

function readSelected(name) {
  const checked = formEl.querySelector(`input[name='${name}']:checked`);
  return checked ? checked.value : null;
}

function isCorrect(task, selectedMain, selectedPronounType) {
  if (selectedMain !== task.answer.main) {
    return false;
  }

  if (selectedMain === "Pronomen") {
    return selectedPronounType === task.answer.pronounType;
  }

  return true;
}

function setFeedback(text, kind) {
  feedbackEl.textContent = text;
  feedbackEl.className = `feedback ${kind}`;
}

function moveToNextTask() {
  const seriesIndex = progressState.currentSeriesIndex;

  if (progressState.currentTaskIndex < 4) {
    progressState.currentTaskIndex += 1;
    renderTask();
    return;
  }

  if (seriesIndex === 0) {
    progressState.currentSeriesIndex = 1;
    progressState.currentTaskIndex = 0;
    setFeedback(
      "Serie 1 abgeschlossen. Serie 2 ist jetzt freigeschaltet.",
      "ok"
    );
    setTimeout(() => {
      renderTask();
    }, 900);
    return;
  }

  sentenceEl.innerHTML =
    "Alle Serien abgeschlossen. Sehr gut - du hast alle Aufgaben geloest.";
  titleEl.textContent = "Fertig";
  formEl.classList.add("hidden");
  nextBtn.classList.add("hidden");
  setFeedback("Training beendet.", "ok");
}

function handleCorrect() {
  progressState.solvedPerSeries[progressState.currentSeriesIndex] += 1;
  updateProgressUI();
  setFeedback("Richtig. Weiter zur naechsten Aufgabe.", "ok");

  formEl.querySelector("button[type='submit']").disabled = true;
  setTimeout(() => {
    moveToNextTask();
  }, 700);
}

function handleIncorrect(task) {
  if (progressState.attempts === 1) {
    setFeedback("Falsch. Versuche es noch einmal.", "error");
    return;
  }

  if (progressState.attempts === 2) {
    setFeedback(`Hinweis: ${task.hint}`, "warn");
    return;
  }

  const modelAnswer =
    task.answer.main === "Pronomen"
      ? `${task.answer.main} (${task.answer.pronounType})`
      : task.answer.main;

  setFeedback(`Modellantwort: ${modelAnswer}`, "warn");
  formEl.querySelector("button[type='submit']").disabled = true;
  nextBtn.classList.remove("hidden");
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const task = currentTask();
  const selectedMain = readSelected("mainClass");
  const selectedPronounType = readSelected("pronounType");

  if (!selectedMain) {
    setFeedback("Waehle zuerst eine Hauptwortart.", "error");
    return;
  }

  if (selectedMain === "Pronomen" && !selectedPronounType) {
    setFeedback("Waehle zusaetzlich die Pronomenform.", "error");
    return;
  }

  progressState.attempts += 1;

  if (isCorrect(task, selectedMain, selectedPronounType)) {
    handleCorrect();
  } else {
    handleIncorrect(task);
  }
});

nextBtn.addEventListener("click", () => {
  moveToNextTask();
});

createRadioGroup(mainOptionsEl, "mainClass", MAIN_CLASSES);
createRadioGroup(pronounOptionsEl, "pronounType", PRONOUN_TYPES);
renderTask();
