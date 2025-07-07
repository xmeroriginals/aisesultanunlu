let isPlaying = false;
let targetX = 0;
let currentX = 0;
const witchmove = document.getElementById("witch");
const nextDateText = document.getElementById("nextdatetext");
const witchUpload = document.getElementById("witch");
const witchimg = witchUpload.querySelector("img");
const todayFull = new Date();
const today = todayFull.toISOString().split("T")[0];
const modal = document.createElement("div");

const eastereggaudio = new Audio("./assets/MirrorMirror.wav");
const easterEggButton = document.getElementById("eastereggButton");
window.scrollTo({ top: 0, behavior: "smooth" });
document.documentElement.style.scrollBehavior = "smooth";

easterEggButton.addEventListener("click", function () {
  if (!isPlaying) {
    isPlaying = true;
    eastereggaudio.play();
    eastereggaudio.onended = function () {
      isPlaying = false;
    };
  }
});

function animate() {
  currentX += (targetX - currentX) * 0.1;
  witchmove.style.left = `${currentX}px`;

  requestAnimationFrame(animate);
}

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = scrollTop / docHeight;

  const maxX = window.innerWidth - 200;
  targetX = scrollPercent * maxX;
});

animate();

function showModal({
  title = "Are you sure?",
  confirmText = "Ok",
  cancelText = "Cancel",
}) {
  return new Promise((resolve) => {
    let modal = document.getElementById("customModal");

    if (!modal) {
      modal = document.createElement("div");
      modal.id = "customModal";
      modal.innerHTML = `
          <div class="modal-content">
            <p id="modalTitle" style="margin-bottom:20px"></p>
            <button id="modalConfirm" style="background:#fa485b; border:none; color:#fff; padding:10px 20px; border-radius:10px; cursor:pointer; margin-right:10px"></button>
            <button id="modalCancel" style="background:#fb91df; border:none; color:#fff; padding:10px 20px; border-radius:10px; cursor:pointer"></button>
          </div>
        `;
      document.body.appendChild(modal);
    }

    modal.querySelector("#modalTitle").textContent = title;
    modal.querySelector("#modalConfirm").textContent = confirmText;
    modal.querySelector("#modalCancel").textContent = cancelText;

    modal.style.display = "block";
    void modal.offsetWidth;
    modal.classList.add("show");

    const confirmHandler = () => close(true);
    const cancelHandler = () => close(false);

    function close(result) {
      modal.classList.remove("show");
      setTimeout(() => {
        modal.style.display = "none";
        resolve(result);
      }, 300);
      modal
        .querySelector("#modalConfirm")
        .removeEventListener("click", confirmHandler);
      modal
        .querySelector("#modalCancel")
        .removeEventListener("click", cancelHandler);
    }

    modal
      .querySelector("#modalConfirm")
      .addEventListener("click", confirmHandler);
    modal
      .querySelector("#modalCancel")
      .addEventListener("click", cancelHandler);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  let tasks = [];

  fetch("tasks/tasks.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Fetch Error " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      tasks = data;
    })
    .catch((error) => {
      console.error("Fetch Error ", error);
    });

  const taskText = document.getElementById("task-text");
  const getTaskBtn = document.getElementById("get-task-btn");
  const completeTaskBtn = document.getElementById("complete-task-btn");
  const taskCounterSpan = document.getElementById("task-counter");

  const today = new Date().toISOString().split("T")[0];

  function updateTaskCounter() {
    const completedCount = localStorage.getItem("completedTasks") || 0;
    taskCounterSpan.innerText = completedCount;
  }

  function setupDailyTask() {
    const lastTaskDate = localStorage.getItem("lastTaskDate");
    const currentTask = localStorage.getItem("currentTask");
    const isTaskCompleted = localStorage.getItem("isTaskCompleted") === "true";

    updateTaskCounter();

    if (lastTaskDate === today) {
      getTaskBtn.style.display = "none";
      taskText.innerText = currentTask;

      if (isTaskCompleted) {
        taskText.innerHTML += "<br><em>(Today's Task Completed)</em>";
        completeTaskBtn.style.display = "none";
        taskText.style.opacity = 0.5;
      } else {
        completeTaskBtn.style.display = "inline-block";
      }
    } else {
      taskText.innerText = "There is a special task for you today...";
      getTaskBtn.style.display = "inline-block";
      completeTaskBtn.style.display = "none";
    }
  }

  getTaskBtn.addEventListener("click", () => {
    const task = tasks[Math.floor(Math.random() * tasks.length)];
    localStorage.setItem("currentTask", task);
    localStorage.setItem("lastTaskDate", today);
    localStorage.setItem("isTaskCompleted", "false");
    setupDailyTask();
  });

  completeTaskBtn.addEventListener("click", async () => {
    const confirmed = await showModal({
      title:
        "Are you sure you completed the task? You will not receive any more task today.",
      confirmText: "Yes",
      cancelText: "Cancel",
    });

    if (confirmed) {
      let completedCount =
        parseInt(localStorage.getItem("completedTasks")) || 0;
      completedCount++;
      localStorage.setItem("completedTasks", completedCount);
      localStorage.setItem("isTaskCompleted", "true");
      setupDailyTask();
    }
  });

  setupDailyTask();
});

const heartEl = document.querySelector(".heart");
const hearts = [
  "💘",
  "💝",
  "💖",
  "💗",
  "💓",
  "💞",
  "❣️",
  "❤️",
  "🩷",
  "💛",
  "💚",
  "💙",
  "🩵",
  "💜",
  "🤎",
  "🖤",
  "🩶",
  "🤍",
  "🫶🏻",
];
let index = 0;

function showNextHeart() {
  heartEl.textContent = hearts[index];
  index = (index + 1) % hearts.length;
}

setInterval(showNextHeart, 1700);

document.addEventListener("DOMContentLoaded", function () {
  const avatar = document.getElementById("avatar");
  const avatars = ["./assets/mem/asu.jpeg", "./assets/mem/asun.jpg"];

  const randomIndex = Math.floor(Math.random() * avatars.length);
  avatar.src = avatars[randomIndex];
});
