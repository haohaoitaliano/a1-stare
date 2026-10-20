(function () {
  "use strict";

  var questions = [
    { sentence: "Io ___ bene, grazie.", options: ["sto", "stai", "sta"], answer: 0 },
    { sentence: "Tu come ___?", options: ["sto", "stai", "state"], answer: 1 },
    { sentence: "Giulio ___ così così.", options: ["stanno", "stiamo", "sta"], answer: 2 },
    { sentence: "Noi ___ abbastanza bene.", options: ["stiamo", "state", "stanno"], answer: 0 },
    { sentence: "Voi come ___?", options: ["stiamo", "state", "stai"], answer: 1 },
    { sentence: "Giulio e Anna non ___ bene.", options: ["sta", "state", "stanno"], answer: 2 },
    {
      sentence: "Come stai oggi?",
      prompt: "请选择合适的回答：",
      options: ["Ho 30 anni.", "Sto molto bene, grazie.", "Sono cinese."],
      answer: 1,
      explanation: "Sto molto bene, grazie. = 我很好，谢谢。"
    },
    {
      sentence: "Giulio sta così così.",
      prompt: "请选择正确的中文意思：",
      options: ["Giulio 很好。", "Giulio 一般般。", "Giulio 头疼。"],
      answer: 1,
      explanation: "Così così = 一般般。"
    }
  ];

  var letters = ["A", "B", "C"];
  var currentIndex = 0;
  var isAnswered = false;

  var quizView = document.getElementById("quiz-view");
  var completionView = document.getElementById("completion-view");
  var progress = document.getElementById("progress");
  var progressBar = document.getElementById("progress-bar");
  var partLabel = document.getElementById("part-label");
  var instructionIt = document.getElementById("instruction-it");
  var instructionZh = document.getElementById("instruction-zh");
  var questionNumber = document.getElementById("question-number");
  var questionText = document.getElementById("question-text");
  var options = document.getElementById("options");
  var feedback = document.getElementById("feedback");
  var continueButton = document.getElementById("continue-button");
  var restartTop = document.getElementById("restart-top");
  var restartBottom = document.getElementById("restart-bottom");

  function renderQuestion() {
    var question = questions[currentIndex];
    var isPartTwo = currentIndex >= 6;

    isAnswered = false;
    progress.textContent = (currentIndex + 1) + " / " + questions.length;
    progressBar.style.width = ((currentIndex + 1) / questions.length * 100) + "%";
    partLabel.textContent = isPartTwo ? "PARTE 2｜第二部分" : "PARTE 1｜第一部分";
    instructionIt.textContent = isPartTwo ? "Come stai?" : "Scegli la forma corretta.";
    instructionZh.textContent = isPartTwo
      ? (question.prompt || "请选择正确答案。")
      : "选择正确的动词变位。";
    questionNumber.textContent = "DOMANDA " + (currentIndex + 1) + "｜第 " + (currentIndex + 1) + " 题";
    questionText.textContent = question.sentence;
    feedback.hidden = true;
    feedback.className = "feedback";
    feedback.textContent = "";
    continueButton.hidden = true;
    options.innerHTML = "";

    question.options.forEach(function (option, optionIndex) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "option-button";
      button.setAttribute("data-index", String(optionIndex));
      button.setAttribute("aria-label", letters[optionIndex] + ". " + option);

      var letter = document.createElement("span");
      letter.className = "option-letter";
      letter.setAttribute("aria-hidden", "true");
      letter.textContent = letters[optionIndex];

      var text = document.createElement("span");
      text.className = "option-text";
      text.textContent = option;

      var status = document.createElement("span");
      status.className = "option-status";
      status.setAttribute("aria-hidden", "true");
      status.textContent = "·";

      button.appendChild(letter);
      button.appendChild(text);
      button.appendChild(status);
      button.addEventListener("click", chooseAnswer);
      options.appendChild(button);
    });
  }

  function chooseAnswer(event) {
    if (isAnswered) {
      return;
    }

    var selectedButton = event.currentTarget;
    var selectedIndex = Number(selectedButton.getAttribute("data-index"));
    var question = questions[currentIndex];

    if (selectedIndex === question.answer) {
      isAnswered = true;
      selectedButton.classList.remove("is-wrong");
      selectedButton.classList.add("is-correct");
      selectedButton.querySelector(".option-status").textContent = "✓";
      feedback.textContent = "Bravissimo/a!（太棒了！）";

      if (question.explanation) {
        var explanation = document.createElement("span");
        explanation.className = "explanation";
        explanation.textContent = question.explanation;
        feedback.appendChild(explanation);
      }

      feedback.className = "feedback correct";
      feedback.hidden = false;
      continueButton.hidden = false;

      Array.prototype.forEach.call(options.children, function (button) {
        button.disabled = true;
      });
      continueButton.focus();
      return;
    }

    selectedButton.classList.add("is-wrong");
    selectedButton.querySelector(".option-status").textContent = "×";
    feedback.textContent = "Riprova!（再试一次！）";
    feedback.className = "feedback wrong";
    feedback.hidden = false;
    selectedButton.setAttribute(
      "aria-label",
      letters[selectedIndex] + ". " + question.options[selectedIndex] + ", risposta errata（错误答案）"
    );
  }

  function nextQuestion() {
    if (!isAnswered) {
      return;
    }

    if (currentIndex < questions.length - 1) {
      currentIndex += 1;
      renderQuestion();
      questionText.focus();
      window.scrollTo(0, 0);
      return;
    }

    quizView.hidden = true;
    completionView.hidden = false;
    restartTop.hidden = true;
    completionView.focus();
    window.scrollTo(0, 0);
  }

  function restart() {
    currentIndex = 0;
    isAnswered = false;
    completionView.hidden = true;
    quizView.hidden = false;
    restartTop.hidden = false;
    renderQuestion();
    questionText.focus();
    window.scrollTo(0, 0);
  }

  questionText.setAttribute("tabindex", "-1");
  completionView.setAttribute("tabindex", "-1");
  continueButton.addEventListener("click", nextQuestion);
  restartTop.addEventListener("click", restart);
  restartBottom.addEventListener("click", restart);

  renderQuestion();
}());
