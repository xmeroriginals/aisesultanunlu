let isMusicPlaying = false;
let isPlaying = false;
let intervalId;
let currentIndex = 0;
let hovering = false;
let targetX = 0;
let currentX = 0;
const birthdayDateStr = "July 7"; // Birthday
var nameElement = document.getElementById("name");
const musicbtn = document.getElementById("musicButton");
const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");
const loader = document.getElementById("loader");
const quoteBox = document.getElementById("quoteBox");
const partyBanner = document.getElementById("party-banner");
const partyHat = document.getElementById("party-hat");
const snapGallery = document.getElementById("gallerySnap");
const savedDate = localStorage.getItem("savedDate");
const savedQuote = localStorage.getItem("savedQuote");
const savedAuthor = localStorage.getItem("savedAuthor");
const witchmove = document.getElementById("witch");
const nextDateText = document.getElementById("nextdatetext");
const avatarBorder = document.getElementById("avatar");
const witchUpload = document.getElementById("witch");
const witchimg = witchUpload.querySelector("img");
const todayFull = new Date();
const today = todayFull.toISOString().split("T")[0];
const modal = document.createElement("div");
const musicButton = document.getElementById("musicButton");
const audio = new Audio(`./assets/${Math.floor(Math.random() * 3) + 1}.mp3`);
const [birthdayMonthStr, birthdayDayStr] = birthdayDateStr.split(" ");
const birthdayDate = new Date(
  todayFull.getFullYear(),
  new Date(Date.parse(birthdayMonthStr + " 1")).getMonth(),
  parseInt(birthdayDayStr)
);
const eastereggaudio = new Audio("./assets/MirrorMirror.wav");
const easterEggButton = document.getElementById("eastereggButton");
window.scrollTo({ top: 0, behavior: "smooth" });
document.documentElement.style.scrollBehavior = "smooth";
audio.loop = true;

if (
  todayFull.getDate() === birthdayDate.getDate() &&
  todayFull.getMonth() === birthdayDate.getMonth()
) {
  partyBanner.style.display = "block";
  musicButton.style.visibility = "visible";
  nameElement.innerHTML = "Happy Birthday 🎉 Aişe Sultan Ünlü";
  avatarBorder.style.border = "0px";
  loader.style.display = "none";
  witchimg.src = "./assets/GoodWitch.png";
  startConfetti();
} else {
  musicbtn.style.display = "none";
  if (savedDate === today && savedQuote && savedAuthor) {
    loader.style.display = "none";
    quoteElement.textContent = savedQuote;
    authorElement.textContent = savedAuthor;
    quoteElement.classList.remove("hidden");
    authorElement.classList.remove("hidden");

    setTimeout(() => {
      quoteElement.style.opacity = 1;
      quoteElement.style.transform = "translateY(0)";
      authorElement.style.opacity = 0.5;
      authorElement.style.transform = "translateY(0)";
    }, 100);
  } else {
    fetchQuote();
  }
}

async function fetchQuote() {
  try {
    loader.style.display = "block";

    const badWordsResponse = await fetch(
      "https://xmeroriginals.github.io/aisesultanunlu/src/badwords-by-dsojevic.json"
    );
    const badWordsList = await badWordsResponse.json();

    let validQuoteFound = false;
    let quoteData;

    while (!validQuoteFound) {
      const response = await fetch(
        "https://api.realinspire.live/v1/quotes/random"
      );
      const data = await response.json();

      if (data && data.length > 0) {
        quoteData = data[0];
        const quoteText = quoteData.content.toLowerCase();

        const hasBadWord = badWordsList.some((badWord) => {
          const regex = new RegExp(`\\b(${badWord.match})\\b`, "i");
          if (!regex.test(quoteText)) return false;
          if (Array.isArray(badWord.exceptions)) {
            return !badWord.exceptions.some((exceptionPattern) => {
              const pattern = exceptionPattern.replace(/\*/g, ".*");
              const exceptionRegex = new RegExp(`\\b${pattern}\\b`, "i");
              return exceptionRegex.test(quoteText);
            });
          }

          return true;
        });

        if (!hasBadWord) {
          validQuoteFound = true;
        }
      }
    }

    loader.style.display = "none";
    quoteElement.textContent = '"' + quoteData.content + '"';
    authorElement.textContent = quoteData.author
      ? `~ ${quoteData.author}`
      : "~ Unknown";
    authorElement.style.opacity = 0.5;
    localStorage.setItem("savedDate", today);
    localStorage.setItem("savedQuote", '"' + quoteData.content + '"');
    localStorage.setItem("savedAuthor", authorElement.textContent);
    quoteElement.classList.remove("hidden");
    authorElement.classList.remove("hidden");

    setTimeout(() => {
      quoteElement.style.opacity = 1;
      quoteElement.style.transform = "translateY(0)";
      authorElement.style.opacity = 0.5;
      authorElement.style.transform = "translateY(0)";
    }, 100);
  } catch (error) {
    console.error("Error ", error);
    loader.style.display = "none";
    quoteElement.textContent =
      "No words today because we decided to rest like a princess... 👸🏻 (API did not respond. 🫠)";
    quoteElement.classList.remove("hidden");
  }
}

function fadeAudio(audio, targetVolume, duration) {
  const fadeInterval = 50;
  const fadeSteps = duration / fadeInterval;
  const volumeStep = (targetVolume - audio.volume) / fadeSteps;

  const interval = setInterval(() => {
    let newVolume = audio.volume + volumeStep;
    if (
      (volumeStep < 0 && newVolume <= targetVolume) ||
      (volumeStep > 0 && newVolume >= targetVolume)
    ) {
      newVolume = targetVolume;
      clearInterval(interval);
    }
    audio.volume = Math.min(Math.max(newVolume, 0), 1);
  }, fadeInterval);
}

musicButton.addEventListener("click", function () {
  if (!isMusicPlaying) {
    document.getElementById("musicButtonImg").src =
      "./assets/GiftBoxOpened.svg";
    audio.play();
    isMusicPlaying = true;
    musicButton.style.animation = "none";
  }
});

easterEggButton.addEventListener("click", function () {
  if (!isPlaying) {
    isPlaying = true;
    if (isMusicPlaying) {
      fadeAudio(audio, 0.2, 1000);
    }
    eastereggaudio.play();
    eastereggaudio.onended = function () {
      isPlaying = false;
      if (isMusicPlaying) {
        fadeAudio(audio, 1.0, 1000);
      }
    };
  }
});

witchUpload.addEventListener("click", function () {});

function startConfetti() {
  const script = document.createElement("script");
  script.src = "./src/confetti.js";
  document.body.appendChild(script);
}

function updateCountdown() {
  const countdownElement = document.getElementById("countdown-text");
  const now = new Date();
  const currentYear = now.getFullYear();

  const targetDate = new Date(
    `${birthdayDateStr}, ${currentYear} 00:00:00`
  ).getTime();
  const todayDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();

  const [monthName, dayStr] = birthdayDateStr.split(" ");
  const birthdayMonthIndex = new Date(`${monthName} 1`).getMonth();
  const birthdayDay = parseInt(dayStr, 10);
  const birthdayDate = new Date(
    currentYear,
    birthdayMonthIndex,
    birthdayDay
  ).getTime();

  if (todayDate === birthdayDate) {
    countdownElement.innerText =
      `Happy Birthday!\n` +
      `Here's to many more\n` +
      `years of laughter,\n` +
      `love, and adventure.`;
    return;
  }

  const distance = targetDate - now.getTime();

  if (distance < 0) {
    const nextYearTarget = new Date(
      `${birthdayDateStr}, ${currentYear + 1} 00:00:00`
    ).getTime();
    const newDistance = nextYearTarget - now.getTime();
    displayCountdown(newDistance, countdownElement);
  } else {
    displayCountdown(distance, countdownElement);
  }
}

function displayCountdown(distance, element) {
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  element.innerText =
    `${days} Days\n` +
    `${hours} Hours\n` +
    `${minutes} Minutes\n` +
    `${seconds} Seconds`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

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

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("memories") === "scroll") {
      const target = document.getElementById("memoriestext");

      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, null, window.location.pathname);
      }
    }
  }, 777);
});

// DB Memory Storage

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("GalleryDB", 1);

    request.onerror = (event) => {
      console.error("Database error:", event.target.errorCode);
      reject(event.target.errorCode);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { autoIncrement: true });
      }
    };
  });
}

function saveImageToDB(imageBlob) {
  openDB().then((db) => {
    const transaction = db.transaction(["images"], "readwrite");
    const store = transaction.objectStore("images");
    store.add(imageBlob);
  });
}

function deleteImageFromDB(target) {
  openDB().then((db) => {
    const transaction = db.transaction(["images"], "readwrite");
    const store = transaction.objectStore("images");
    const request = store.openCursor();

    request.onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        const stored = cursor.value;
        if (
          typeof stored === "string" &&
          typeof target === "string" &&
          stored === target
        ) {
          store.delete(cursor.key);
          return;
        }
        if (
          typeof stored === "object" &&
          stored !== null &&
          stored.data &&
          typeof stored.data === "string" &&
          stored.data === target
        ) {
          store.delete(cursor.key);
          return;
        }
        if (
          stored instanceof Blob &&
          target instanceof Blob &&
          stored.size === target.size
        ) {
          store.delete(cursor.key);
          return;
        }

        cursor.continue();
      }
    };
  });
}

function loadImagesFromDB() {
  openDB().then((db) => {
    const transaction = db.transaction(["images"], "readonly");
    const store = transaction.objectStore("images");
    const request = store.openCursor();

    const loadedImages = [];
    let hasImages = false;

    request.onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        const record = cursor.value;
        let imgSrc = null;
        let deleteTarget = null;

        if (record === "ERROR") {
          imgSrc = "./assets/mem/404.png";
          deleteTarget = null;
        } else if (
          typeof record === "string" &&
          record.startsWith("data:image/")
        ) {
          imgSrc = record;
          deleteTarget = record;
        } else if (
          typeof record === "object" &&
          record !== null &&
          record.data &&
          typeof record.data === "string" &&
          record.data.startsWith("data:image/")
        ) {
          imgSrc = record.data;
          deleteTarget = record.data;
        } else if (record instanceof Blob) {
          imgSrc = URL.createObjectURL(record);
          deleteTarget = record;
        }

        if (imgSrc) {
          hasImages = true;
          const img = document.createElement("img");
          img.loading = "lazy";
          img.src = imgSrc;
          img.draggable = false;
          if (deleteTarget) {
            setupDelete(img, deleteTarget);
          }
          snapGallery.appendChild(img);
          loadedImages.push(img);
        }
        cursor.continue();
      } else {
        if (!hasImages) {
          const fallbackImg = document.createElement("img");
          fallbackImg.loading = "lazy";
          fallbackImg.src = "./assets/mem/404.png";
          fallbackImg.draggable = false;
          snapGallery.appendChild(fallbackImg);
        }
      }
    };
  });
}

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

function setupDelete(img, blob) {
  let clickCount = 0;
  let clickTimer = null;
  img.addEventListener("contextmenu", (e) => e.preventDefault());

  img.addEventListener("click", async () => {
    clickCount++;
    if (clickCount === 1) {
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 600);
    }

    if (clickCount === 3) {
      clearTimeout(clickTimer);
      clickCount = 0;

      const confirmed = await showModal({
        title: "Do you really want to delete this image?",
        confirmText: "Ok",
        cancelText: "Cancel",
      });

      if (confirmed) {
        img.remove();
        deleteImageFromDB(blob);
      }
    }
  });
}

witchUpload.addEventListener("click", function () {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.multiple = true;
  input.style.display = "none";

  input.onchange = function (event) {
    const files = event.target.files;
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.loading = "lazy";
        img.src = e.target.result;

        setupDelete(img, e.target.result);
        snapGallery.appendChild(img);
      };
      reader.readAsDataURL(file);
      saveImageToDB(file);
    }
  };

  document.body.appendChild(input);
  input.click();
});

loadImagesFromDB();

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

const taskBtn = document.getElementById("floating-task-btn");
taskBtn.addEventListener("click", () => {
  window.location.href = "tasks.html";
});

const miniGameBtn = document.getElementById("minigame-btn");
miniGameBtn.addEventListener("click", () => {
  window.location.href = "game.html";
});
