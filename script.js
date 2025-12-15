/* =========================================
   CONFIGURATION DES NIVEAUX (AJOUTEZ VOS NIVEAUX ICI)
   ========================================= */

const LEVELS = [
    {
        id: 1,
        name: "Niveau 1",
        imageSrc: "./images/Charlie1.jpg",
        originalWidth: 2000,
        originalHeight: 1333,
        targetX: 1677,
        targetY: 309,
        toleranceRadius: 40
    },
    {
        id: 2,
        name: "Niveau 2",
        imageSrc: "./images/Charlie2.jpg",
        originalWidth: 2000,
        originalHeight: 1333,
        targetX: 1010,
        targetY: 1192,
        toleranceRadius: 30
    },
    {
        id: 3,
        name: "Niveau 3",
        imageSrc: "./images/Charlie3.jpg",
        originalWidth: 2000,
        originalHeight: 1333,
        targetX: 1612,
        targetY: 132,
        toleranceRadius: 25
    },
    {
        id: 4,
        name: "Niveau 4",
        imageSrc: "./images/Charlie4.jpg",
        originalWidth: 4000,
        originalHeight: 2000,
        targetX: 3418,
        targetY: 1472,
        toleranceRadius: 35
    },
    {
        id: 5,
        name: "Niveau 5",
        imageSrc: "./images/Charlie5.jpg",
        originalWidth: 2000,
        originalHeight: 1333,
        targetX: 1085,
        targetY: 502,
        toleranceRadius: 10
    }
];

// =========================================
// ÉTAT DU JEU
// =========================================

let currentLevelIndex = 0;
let startTime;
let timerInterval;
let isGameActive = true;

// Éléments du DOM
const gameImage = document.getElementById('game-image');
const gameContainer = document.getElementById('game-container');
const timerElement = document.getElementById('timer');
const levelIndicator = document.getElementById('level-indicator');
const victoryModal = document.getElementById('victory-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const finalTimeElement = document.getElementById('final-time');
const actionBtn = document.getElementById('action-btn');
const prevBtn = document.getElementById('prev-btn');

/**
 * Initialisation du jeu pour le niveau actuel
 */
function initLevel(levelIndex) {
    if (levelIndex >= LEVELS.length || levelIndex < 0) {
        return;
    }

    currentLevelIndex = levelIndex;
    const currentLevel = LEVELS[currentLevelIndex];

    gameImage.src = currentLevel.imageSrc;
    levelIndicator.textContent = `Niveau ${currentLevelIndex + 1} / ${LEVELS.length}`;

    if (currentLevelIndex === 0) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }

    isGameActive = true;

    const markers = document.querySelectorAll('.marker-found, .marker-miss');
    markers.forEach(m => m.remove());

    victoryModal.classList.add('hidden');

    startTimer();
}

/**
 * Gestion du Chronomètre
 */
function startTimer() {
    startTime = Date.now();
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (!isGameActive) return;
        const elapsedTime = Date.now() - startTime;
        timerElement.textContent = formatTime(elapsedTime);
    }, 100);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Gestion du Clic
 */
gameContainer.addEventListener('click', (event) => {
    if (!isGameActive) return;

    const currentLevel = LEVELS[currentLevelIndex];
    if (!gameImage.complete || gameImage.naturalWidth === 0) return;

    console.log("Click registered on container");
    const containerRect = gameContainer.getBoundingClientRect();
    const imageRect = gameImage.getBoundingClientRect();

    const containerX = event.clientX - containerRect.left;
    const containerY = event.clientY - containerRect.top;

    const imageClickX = event.clientX - imageRect.left;
    const imageClickY = event.clientY - imageRect.top;

    const scaleX = gameImage.offsetWidth / currentLevel.originalWidth;
    const scaleY = gameImage.offsetHeight / currentLevel.originalHeight;

    const debugX = Math.round(imageClickX / scaleX);
    const debugY = Math.round(imageClickY / scaleY);
    console.log(`📍 Clic détecté ! Pour votre config : targetX: ${debugX}, targetY: ${debugY}`);

    const targetScreenX = currentLevel.targetX * scaleX;
    const targetScreenY = currentLevel.targetY * scaleY;
    const currentTolerance = currentLevel.toleranceRadius * scaleX;

    const distance = Math.sqrt(
        Math.pow(imageClickX - targetScreenX, 2) +
        Math.pow(imageClickY - targetScreenY, 2)
    );

    if (distance <= currentTolerance) {
        const offsetLeft = imageRect.left - containerRect.left;
        const offsetTop = imageRect.top - containerRect.top;

        handleVictory(targetScreenX + offsetLeft, targetScreenY + offsetTop);
    } else {
        handleMiss(containerX, containerY);
    }
});

function handleMiss(x, y) {
    const marker = document.createElement('div');
    marker.className = 'marker-miss';
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
    gameContainer.appendChild(marker);
    setTimeout(() => marker.remove(), 1000);
}

function handleVictory(x, y) {
    isGameActive = false;
    stopTimer();

    const marker = document.createElement('div');
    marker.className = 'marker-found';
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
    gameContainer.appendChild(marker);

    setTimeout(showVictoryModal, 500);
}

/**
 * Affichage de la modale de victoire
 */
function showVictoryModal() {
    const finalTime = timerElement.textContent;
    finalTimeElement.textContent = finalTime;

    if (currentLevelIndex < LEVELS.length - 1) {
        modalTitle.textContent = "Niveau réussi ! 🎉";
        modalTitle.style.color = "#2ecc71";
        modalMessage.textContent = "Tu as trouvé Charlie en :";
        actionBtn.textContent = "Niveau Suivant";
        actionBtn.onclick = () => initLevel(currentLevelIndex + 1);
    } else {
        // FIN DU JEU
        modalTitle.textContent = "Aventure Terminée ! 🏆";
        modalTitle.style.color = "#f1c40f"; // Or
        modalMessage.textContent = "Incroyable ! Tu as terminé tous les niveaux !";
        actionBtn.textContent = "Rejouer depuis le début";
        actionBtn.onclick = () => initLevel(0);

        launchConfetti(); // Pluie de confettis
    }

    victoryModal.classList.remove('hidden');
}

/**
 * Effet de Confettis simple
 */
function launchConfetti() {
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        document.body.appendChild(confetti);

        // Nettoyage
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Bouton Précédent
prevBtn.addEventListener('click', () => {
    if (currentLevelIndex > 0) {
        initLevel(currentLevelIndex - 1);
    }
});

// =========================================
// THÈME SWITCHER
// =========================================
const themeBtn = document.getElementById('theme-toggle');

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');

    themeBtn.textContent = isDark ? '☀️' : '🌙';

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
        themeBtn.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        themeBtn.textContent = '🌙';
    }
}

themeBtn.addEventListener('click', toggleTheme);

window.onload = () => {
    initTheme();
    initLevel(0);
};
