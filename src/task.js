let isPlaying = false;
let targetX = 0;
let currentX = 0;
const witchmove = document.getElementById("witch");
const witchimg = document.getElementById("witch").querySelector("img");
const eastereggaudio = new Audio("./assets/MirrorMirror.wav");
const easterEggButton = document.getElementById("eastereggButton");
window.scrollTo({ top: 0, behavior: "smooth" });
document.documentElement.style.scrollBehavior = "smooth";

easterEggButton.addEventListener("click", function () {
  if (!isPlaying) {
    isPlaying = true;
    eastereggaudio.play();
    eastereggaudio.onended = () => (isPlaying = false);
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
          <button id="modalConfirm" style="background:#fb91df; border:none; color:#fff; padding:10px 20px; border-radius:10px; cursor:pointer; margin-right:10px"></button>
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
  const taskText = document.getElementById("task-text");
  const getTaskBtn = document.getElementById("get-task-btn");
  const completeTaskBtn = document.getElementById("complete-task-btn");
  const taskCounterSpan = document.getElementById("task-counter");

  function updateTaskCounter() {
    const completedCount = localStorage.getItem("completedTasks") || 0;
    taskCounterSpan.innerText = completedCount;
  }

  function setupTaskUI() {
    const currentTask = localStorage.getItem("currentTask");
    const isTaskCompleted = localStorage.getItem("isTaskCompleted") === "true";

    updateTaskCounter();

    if (currentTask && !isTaskCompleted) {
      taskText.innerText = currentTask;
      getTaskBtn.style.display = "none";
      completeTaskBtn.style.display = "inline-block";
      cancelTaskBtn.style.display = "inline-block";
      taskText.style.opacity = 1;
    } else if (currentTask && isTaskCompleted) {
      taskText.innerHTML = `${currentTask}<br><em>(Task Completed)</em>`;
      getTaskBtn.style.display = "inline-block";
      completeTaskBtn.style.display = "none";
      cancelTaskBtn.style.display = "none";
      taskText.style.opacity = 0.5;
    } else {
      taskText.innerText = "Click to receive your task...";
      getTaskBtn.style.display = "inline-block";
      completeTaskBtn.style.display = "none";
      cancelTaskBtn.style.display = "none";
    }
  }

  getTaskBtn.addEventListener("click", async () => {
    const currentTask = localStorage.getItem("currentTask");
    const isTaskCompleted = localStorage.getItem("isTaskCompleted") === "true";
    const lastTaskTime =
      parseInt(localStorage.getItem("lastTaskTimestamp")) || 0;
    const now = Date.now();

    const oneHour = 60 * 60 * 1000;
    const timeSinceLastTask = now - lastTaskTime;

    if (currentTask && !isTaskCompleted) return;

    if (lastTaskTime && timeSinceLastTask < oneHour) {
      const minutesLeft = Math.ceil(
        (oneHour - timeSinceLastTask) / (60 * 1000)
      );
      taskText.innerText = `You have now completed your task, the next task is in ${minutesLeft} minutes.`;
      return;
    }

    getTaskBtn.disabled = true;
    getTaskBtn.innerText = "Loading Task...";

    try {
      const task = await fetchRandomTaskWithAI();
      if (task) {
        localStorage.setItem("currentTask", task);
        localStorage.setItem("isTaskCompleted", "false");
        localStorage.setItem("lastTaskTimestamp", now.toString());
      } else {
        taskText.innerText =
          "The task could not be retrieved. Please try again.";
      }
    } catch (err) {
      taskText.innerText = "Error";
      console.error(err);
    } finally {
      setupTaskUI();
      getTaskBtn.disabled = false;
      getTaskBtn.innerText = "Get Task";
    }
  });

  completeTaskBtn.addEventListener("click", async () => {
    const confirmed = await showModal({
      title: "Are you sure you completed the task?",
      confirmText: "Yes",
      cancelText: "Cancel",
    });

    if (confirmed) {
      let completedCount =
        parseInt(localStorage.getItem("completedTasks")) || 0;
      completedCount++;
      localStorage.setItem("completedTasks", completedCount);
      localStorage.setItem("isTaskCompleted", "true");
      setupTaskUI();
    }
  });

  const cancelTaskBtn = document.getElementById("cancel-task-btn");
  cancelTaskBtn.addEventListener("click", async () => {
    const confirmed = await showModal({
      title: "Do you want to cancel the current task?",
      confirmText: "Yes",
      cancelText: "No",
    });

    if (confirmed) {
      localStorage.removeItem("currentTask");
      localStorage.removeItem("isTaskCompleted");
      localStorage.removeItem("lastTaskTimestamp");
      setupTaskUI();
    }
  });

  setupTaskUI();
});

const backBtn = document.getElementById("floating-back-btn");
backBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

async function fetchRandomTaskWithAI() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");

  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });

  const timestamp = `${day}.${month}.${year} ${hour}:${minute}:${second} ${weekday}`;

  const basePrompt =
    "bana%20rastgele%20bir%20görev%20ver,%20sadece%20görevi%20yaz%20ve%20vericeğin%20görevi%20%22%7B%7D%22%20sembolleri%20içine%20al.%20Herhangi%20bir%20şey%20olabilir.%20Şu%20an%20Saat,";
  const fullURL = `https://text.pollinations.ai/${basePrompt}${encodeURIComponent(timestamp)}`;

  try {
    const response = await fetch(fullURL);
    if (!response.ok) throw new Error(`Fetch Fail ${response.status}`);
    const text = await response.text();

    const match = text.match(/{(.*?)}/);
    return match ? match[1].trim() : null;
  } catch (err) {
    console.error("Fetch Error", err);
    return null;
  }
}
