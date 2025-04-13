let count = 0;
let clickValue = 1;
let autoValue = 0;
let autoInterval = null;

const upgrades = {
  clickPower: { level: 0, cost: 50 },
  auto: { level: 0, cost: 100 },
  doubleClick: { level: 0, cost: 250 }
};

const countDisplay = document.getElementById('salutCount');
const button = document.getElementById('clickButton');
const clickSound = document.getElementById('clickSound');
const upgradeSound = document.getElementById('upgradeSound');
const backgroundMusic = document.getElementById('backgroundMusic');
const muteBtn = document.getElementById('muteBtn');

let musicStarted = false;
let musicMuted = false;  // Pour suivre l'état du mute

// Démarrer la musique après l'interaction
function startMusic() {
  if (!musicStarted) {
    backgroundMusic.play();
    musicStarted = true;  // La musique ne redémarre pas après le premier clic
  }
}

// Gérer l'état de Mute/Unmute
muteBtn.addEventListener('click', () => {
  if (musicMuted) {
    backgroundMusic.muted = false;  // Démute la musique
    muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';  // Icône volume activé
    musicMuted = false;  // Mettez à jour l'état du mute
  } else {
    backgroundMusic.muted = true;  // Mute la musique
    muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';  // Icône volume coupé
    musicMuted = true;  // Mettez à jour l'état du mute
  }
});

button.addEventListener('click', (e) => {
  count += clickValue;
  updateDisplay();
  clickSound.play();  // Joue le son du clic
  startMusic();  // Démarre la musique si ce n'est pas encore fait

  // Générer des particules (étoiles)
  for (let i = 0; i < 15; i++) {  // Augmente le nombre de particules
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${e.clientX + (Math.random() - 0.5) * 50}px`;
    particle.style.top = `${e.clientY + (Math.random() - 0.5) * 50}px`;
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1500);  // Retirer la particule après animation
  }
});

function buyUpgrade(type) {
  const upgrade = upgrades[type];
  if (count >= upgrade.cost) {
    count -= upgrade.cost;
    upgrade.level++;

    // Ajouter un effet d'explosion lumineuse lors de l'achat
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    document.body.appendChild(explosion);
    setTimeout(() => explosion.remove(), 1000);  // Retirer l'explosion après 1 seconde

    if (type === 'clickPower') {
      clickValue += Math.pow(2, upgrade.level - 1);
      upgrade.cost = Math.floor(upgrade.cost * 1.5);
    } else if (type === 'auto') {
      autoValue += Math.pow(2, upgrade.level - 1);
      upgrade.cost = Math.floor(upgrade.cost * 1.5);
      startAutoGain();
    } else if (type === 'doubleClick') {
      clickValue *= 2;
      upgrade.cost = Math.floor(upgrade.cost * 2);
    }
    updateDisplay();
    saveGame();
    upgradeSound.play();  // Joue le son de l'achat d'amélioration
  }
}

function startAutoGain() {
  if (autoInterval) return;
  autoInterval = setInterval(() => {
    count += autoValue;
    updateDisplay();
    saveGame();
  }, 1000);
}

function updateDisplay() {
  countDisplay.textContent = `Saluts : ${count}`;
  document.getElementById('clickPowerInfo').textContent = `+${Math.pow(2, upgrades.clickPower.level)} Salut/clic — Coût : ${upgrades.clickPower.cost}`;
  document.getElementById('autoInfo').textContent = `+${Math.pow(2, upgrades.auto.level)} Salut/sec — Coût : ${upgrades.auto.cost}`;
  document.getElementById('doubleClickInfo').textContent = `×${Math.pow(2, upgrades.doubleClick.level + 1)} clics — Coût : ${upgrades.doubleClick.cost}`;
}

function saveGame() {
  const data = {
    count,
    clickValue,
    autoValue,
    upgrades
  };
  localStorage.setItem('salutClickerSave', JSON.stringify(data));
}

function loadGame() {
  const save = JSON.parse(localStorage.getItem('salutClickerSave'));
  if (save) {
    count = save.count;
    clickValue = save.clickValue;
    autoValue = save.autoValue;
    for (let key in upgrades) {
      upgrades[key] = save.upgrades[key];
    }
    if (autoValue > 0) startAutoGain();
    updateDisplay();
  }
}

function resetGame() {
  if (confirm("Es-tu sûr de vouloir tout réinitialiser ? Cette action est irréversible.")) {
    localStorage.removeItem('salutClickerSave');
    location.reload();
  }
}

window.onload = loadGame;
