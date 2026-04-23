let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let studyData = JSON.parse(localStorage.getItem("studyData")) || [];

let seconds = 0;
let timer = null;
let chart;

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
  if (input.value === "") return;

  tasks.push({ text: input.value, done: false });
  input.value = "";
  saveTasks();
}

// TIMER
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
  if (timer) return;

  timer = setInterval(() => {
    seconds++;
    updateTime();
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;

  let minutes = Math.max(1, Math.floor(seconds / 10));

  let now = new Date();

  let date = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short'
  });

  let time = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  let label = `${date} ${time}`;

  studyData.push({ date: label, time: minutes });

  localStorage.setItem("studyData", JSON.stringify(studyData));
  loadChart();
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  seconds = 0;
  updateTime();
}

// DARK MODE
function toggleMode() {
  document.body.classList.toggle("light-mode");
}

// GRAPH
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
    },
    options: {
      scales: {
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  });
}

// INIT
loadTasks();
loadChart();
