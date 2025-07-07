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

function showModal({ title = "Are you sure?", cancelText = "Ok" }) {
  return new Promise((resolve) => {
    let modal = document.getElementById("customModal");

    if (!modal) {
      modal = document.createElement("div");
      modal.id = "customModal";
      modal.innerHTML = `
          <div class="modal-content">
            <p id="modalTitle" style="margin-bottom:20px"></p>
            <button id="modalCancel" style="background:#fb91df; border:none; color:#fff; padding:10px 20px; border-radius:10px; cursor:pointer"></button>
          </div>
        `;
      document.body.appendChild(modal);
    }

    modal.querySelector("#modalTitle").textContent = title;
    modal.querySelector("#modalCancel").textContent = cancelText;

    modal.style.display = "block";
    void modal.offsetWidth;
    modal.classList.add("show");

    const cancelHandler = () => close(false);

    function close(result) {
      modal.classList.remove("show");
      setTimeout(() => {
        modal.style.display = "none";
        resolve(result);
      }, 300);
      modal
        .querySelector("#modalCancel")
        .removeEventListener("click", cancelHandler);
    }

    modal
      .querySelector("#modalCancel")
      .addEventListener("click", cancelHandler);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const gameBoard = document.getElementById("gameBoard");
  const movesDisplay = document.getElementById("moves");
  const pairsDisplay = document.getElementById("pairs");
  const timeDisplay = document.getElementById("time");
  const restartGameBtn = document.getElementById("restartGame");
  let cards = [];
  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;
  let moves = 0;
  let pairsFound = 0;
  let timer;
  let seconds = 0;
  let gameStarted = false;
  const cardFrontImage = "assets/game/cardfront.svg";
  const imagePaths = [
    "assets/game/1.svg",
    "assets/game/2.svg",
    "assets/game/3.svg",
    "assets/game/4.svg",
    "assets/game/5.svg",
    "assets/game/6.svg",
    "assets/game/7.svg",
    "assets/game/8.svg",
  ];

  function initGame() {
    moves = 0;
    pairsFound = 0;
    seconds = 0;
    gameStarted = false;
    updateStats();
    gameBoard.innerHTML = "";
    cards = [...imagePaths, ...imagePaths];
    shuffleCards();

    cards.forEach((imagePath, index) => {
      const card = document.createElement("div");
      card.classList.add("game-card");
      card.dataset.image = imagePath;
      card.dataset.index = index;

      card.innerHTML = `
              <div class="card-front"><img src="${cardFrontImage}" alt="Card Front"></div>
              <div class="card-back"><img src="${imagePath}" alt="Card Back"></div>
            `;

      card.addEventListener("click", flipCard);
      gameBoard.appendChild(card);
    });
    clearInterval(timer);
    timeDisplay.textContent = "0";
  }

  function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    if (!gameStarted) {
      gameStarted = true;
      timer = setInterval(updateTimer, 1000);
    }

    this.classList.add("flipped");

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    moves++;
    updateStats();
    checkForMatch();
  }

  async function checkForMatch() {
    const isMatch = firstCard.dataset.image === secondCard.dataset.image;

    if (isMatch) {
      disableCards();
      pairsFound++;
      updateStats();

      if (pairsFound === imagePaths.length) {
        let completedGameCount =
          parseInt(localStorage.getItem("wonGames")) || 0;
        completedGameCount++;
        localStorage.setItem("wonGames", completedGameCount);
        updateGameCounter();
        clearInterval(timer);
        const confirmed = await showModal({
          title: `Congratulations! You completed the game in ${moves} moves and ${seconds} seconds!`,
          cancelText: "Ok",
        });
      }
    } else {
      unflipCards();
    }
  }

  function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    resetBoard();
  }

  function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");

      resetBoard();
    }, 1000);
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  function updateStats() {
    movesDisplay.textContent = moves;
    pairsDisplay.textContent = pairsFound;
  }

  function updateTimer() {
    seconds++;
    timeDisplay.textContent = seconds;
  }

  restartGameBtn.addEventListener("click", initGame);

  initGame();
  updateGameCounter();
});

const gameCounterSpan = document.getElementById("game-counter");

function updateGameCounter() {
  const completedGameCount = localStorage.getItem("wonGames") || 0;
  gameCounterSpan.innerText = completedGameCount;
}

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
