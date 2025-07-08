const heartEl = document.querySelector(".heart");
const hearts = [
  "💘",
  "💝",
  "💖",
  "💗",
  "💓",
  "💞",
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
