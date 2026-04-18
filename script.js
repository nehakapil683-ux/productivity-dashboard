let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let studyData = JSON.parse(localStorage.getItem("studyData")) || [];

// TASKS
function loadTasks() {
  let list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    let li = document.createElement("li");

    let span = document.createElement("span");
    span.textContent = task.text;
    if (task.done) span.style.textDecoration = "line-through";

    span.onclick = () => {
      tasks[index].done = !tasks[index].done;
      saveTasks();
    };

    let del = document.createElement("button");
    del.textContent = "❌";
    del.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
    };

    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function addTask() {
  let input = document.getElementById("taskInput");
  let text = input.value;
  if (text === "") return;

  tasks.push({ text, done: false });
  input.value = "";
  saveTasks();
}

// MODE
function toggleMode() {
  document.body.classList.toggle("light-mode");
}

// TIMER (FIXED)
let seconds = 0;
let timer = null;

function updateTime() {
  let hrs = Math.floor(seconds / 3600);
  let mins = Math.floor((seconds % 3600) / 60);
  let secs = seconds % 60;

  document.getElementById("time").textContent =
    `${hrs.toString().padStart(2, '0')}:` +
    `${mins.toString().padStart(2, '0')}:` +
    `${secs.toString().padStart(2, '0')}`;
}

function startTimer() {
  if (timer) return; // prevent multiple timers

  timer = setInterval(() => {
    seconds++;
    updateTime();
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;

  let minutes = Math.floor(seconds / 60);
  if (minutes > 0) {
    let today = new Date().toLocaleDateString();
    studyData.push({ date: today, time: minutes });
    localStorage.setItem("studyData", JSON.stringify(studyData));
    loadChart();
  }
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  seconds = 0;
  updateTime();
}

// CHART
let chart;

function loadChart() {
  let ctx = document.getElementById("myChart").getContext("2d");

  let labels = studyData.map(d => d.date);
  let data = studyData.map(d => d.time);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Study Minutes",
        data: data
      }]
    }
  });
}

// INIT
loadTasks();
loadChart();