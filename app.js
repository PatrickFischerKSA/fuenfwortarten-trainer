const MAIN_CLASSES = ["Nomen", "Adjektiv", "Verb", "Pronomen"];
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
        sentence: "Der Hund schlaeft unter dem Tisch.",
        target: "Hund",
        answer: { main: "Nomen", pronounType: null },
        hint: "Achte auf ein Wort, das ein Lebewesen oder Ding bezeichnet.",
      },
      {
        sentence: "Die rote Tasche liegt im Flur.",
        target: "rote",
        answer: { main: "Adjektiv", pronounType: null },
        hint: "Dieses Wort beschreibt eine Eigenschaft.",
      },
      {
        sentence: "Mia schreibt heute einen langen Brief.",
        target: "schreibt",
        answer: { main: "Verb", pronounType: null },
        hint: "Frage nach der Taetigkeit: Was tut Mia?",
      },
      {
        sentence: "Wir gehen morgen frueh zum Markt.",
        target: "Wir",
        answer: { main: "Pronomen", pronounType: "Personal" },
        hint: "Das Wort ersetzt Namen und zeigt, wer etwas tut.",
      },
      {
        sentence: "Dieses Buch gehoert niemandem, aber ich nehme es mit.",
        target: "Dieses",
        answer: { main: "Pronomen", pronounType: "Demonstrativ" },
        hint: "Das Pronomen zeigt auf etwas Bestimmtes hin.",
      },
    ],
  },
  {
    id: 2,
    tasks: [
      {
        sentence: "Nach dem Vortrag lobte jeder den klaren Aufbau.",
        target: "jeder",
        answer: { main: "Pronomen", pronounType: "Indefinit" },
        hint: "Das Wort meint eine unbestimmte Personengruppe.",
      },
      {
        sentence: "Lina bindet sich vor dem Lauf die Schuhe fester.",
        target: "sich",
        answer: { main: "Pronomen", pronounType: "Reflexiv" },
        hint: "Das Pronomen bezieht sich auf das Subjekt zurueck.",
      },
      {
        sentence: "Sein Fahrrad steht noch vor der alten Werkstatt.",
        target: "Sein",
        answer: { main: "Pronomen", pronounType: "Possessiv" },
        hint: "Dieses Pronomen zeigt Besitz oder Zugehoerigkeit.",
      },
      {
        sentence:
          "Obwohl der Weg steil war, erreichten die Wanderer bei Sonnenuntergang die Huette.",
        target: "steil",
        answer: { main: "Adjektiv", pronounType: null },
        hint: "Das Wort beschreibt den Zustand des Weges.",
      },
      {
        sentence:
          "Nachdem der Regen nachliess, trugen die Kinder die nassen Jacken ins Haus.",
        target: "trugen",
        answer: { main: "Verb", pronounType: null },
        hint: "Suche die Handlung im Satz und pruefe die Zeitform.",
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
  const regex = new RegExp(`\\b${escapeRegExp(target)}\\b`);
  return sentence.replace(regex, `<span class="target">${target}</span>`);
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
