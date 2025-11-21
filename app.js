// Reward Hub — demo logic (client-side only)
// Clean iOS minimal style. Uses localStorage as a demo DB.

const RATE_POINTS = 500000; // points = RATE_POINTS => $20
const RATE_DOLLARS = 20;

const offersData = [
  { id: 'subway', name: 'Subway Surfers (Sim)', ppm: 25000, minSec: 15 },
  { id: 'candy', name: 'Candy Crush (Sim)', ppm: 20000, minSec: 15 },
  { id: 'pool', name: '8 Ball Pool (Sim)', ppm: 22000, minSec: 15 },
];

const state = {
  points: Number(localStorage.getItem('points') || 0),
  pending: JSON.parse(localStorage.getItem('pending') || '[]'),
  activeOffer: null,
  playStart: null,
  playTimer: null,
  playSeconds: 0
};

// UI refs
const balanceEl = document.getElementById('balance');
const offersEl = document.getElementById('offers');
const toastEl = document.getElementById('toast');
const playModal = document.getElementById('playModal');
const playTitle = document.getElementById('playTitle');
const playTimer = document.getElementById('playTimer');
const stopPlayBtn = document.getElementById('stopPlay');
const pendingList = document.getElementById('pendingList');

function saveState() {
  localStorage.setItem('points', String(state.points));
  localStorage.setItem('pending', JSON.stringify(state.pending));
}

function showToast(msg, timeout=2000) {
  toastEl.hidden = false;
  toastEl.textContent = msg;
  setTimeout(()=> toastEl.hidden = true, timeout);
}

function renderBalance() {
  balanceEl.textContent = state.points + ' pts';
}

function renderOffers() {
  offersEl.innerHTML = '';
  offersData.forEach(o=>{
    const div = document.createElement('div');
    div.className = 'offer';
    div.innerHTML = `<div>
      <div style="font-weight:600">${o.name}</div>
      <div style="font-size:12px;color:#6b7280">${o.ppm} pts / min • min ${o.minSec}s</div>
    </div>`;
    const btn = document.createElement('button');
    btn.className = 'primary';
    btn.textContent = (state.activeOffer && state.activeOffer.id===o.id) ? 'Playing…' : 'Play';
    btn.onclick = ()=> {
      if(state.activeOffer && state.activeOffer.id===o.id) {
        // already playing; ignore
        return;
      }
      startPlay(o);
    };
    div.appendChild(btn);
    offersEl.appendChild(div);
  });
}

function renderPending() {
  pendingList.innerHTML = '';
  if(state.pending.length===0) {
    pendingList.innerHTML = '<li class="muted">No pending cashouts</li>';
    return;
  }
  state.pending.forEach(p=>{
    const li = document.createElement('li');
    li.textContent = `${p.email} — $${Number(p.dollars).toFixed(2)} • ${p.status} • ${new Date(p.timestamp).toLocaleString()}`;
    pendingList.appendChild(li);
  });
}

/* Play simulation */
function startPlay(offer) {
  state.activeOffer = offer;
  state.playStart = Date.now();
  state.playSeconds = 0;
  playTitle.textContent = 'Playing: ' + offer.name;
  playTimer.textContent = '0s';
  playModal.classList.remove('hidden');
  updatePlayButton(offer.id, true);
  state.playTimer = setInterval(()=>{
    state.playSeconds += 1;
    playTimer.textContent = state.playSeconds + 's';
  }, 1000);
}

function stopPlay() {
  if(!state.activeOffer) return;
  clearInterval(state.playTimer);
  const elapsed = state.playSeconds;
  const offer = state.activeOffer;
  state.activeOffer = null;
  state.playTimer = null;
  state.playStart = null;
  state.playSeconds = 0;
  playModal.classList.add('hidden');
  updatePlayButton(offer.id, false);

  if(elapsed < offer.minSec) {
    showToast(`Too short: played ${elapsed}s — no reward`);
    return;
  }
  const minutes = Math.max(1, Math.floor(elapsed/60));
  const awarded = Math.min(500000, offer.ppm * minutes);
  state.points += awarded;
  saveState();
  renderBalance();
  showToast(`Awarded ${awarded.toLocaleString()} pts`);
}

function updatePlayButton(id, playing) {
  // re-render offers to update button states
  renderOffers();
}

stopPlayBtn.addEventListener('click', stopPlay);

/* Built in mini games */
document.getElementById('scratchBtn').addEventListener('click', ()=>{
  state.points += 100000;
  saveState();
  renderBalance();
  showToast('Scratch win: +100,000 pts');
});
document.getElementById('spinBtn').addEventListener('click', ()=>{
  state.points += 50000;
  saveState();
  renderBalance();
  showToast('Spin: +50,000 pts');
});
document.getElementById('adBtn').addEventListener('click', ()=>{
  setTimeout(()=>{
    state.points += 50000;
    saveState();
    renderBalance();
    showToast('Ad complete: +50,000 pts');
  }, 900);
});

/* Cashout simulation */
document.getElementById('requestCash').addEventListener('click', ()=>{
  const email = document.getElementById('paypalEmail').value.trim();
  const amt = Number(document.getElementById('cashAmt').value);
  if(!email || !amt || amt<=0) {
    showToast('Enter email and amount');
    return;
  }
  const required = Math.ceil((amt / RATE_DOLLARS) * RATE_POINTS);
  if(state.points < required) {
    showToast(`Not enough points. Need ${required.toLocaleString()} pts`);
    return;
  }
  state.points -= required;
  const req = { id: Date.now(), email, dollars: amt, timestamp: Date.now(), status: 'Requested' };
  state.pending.push(req);
  saveState(); renderBalance(); renderPending();
  showToast('Cashout requested (simulated)');
});

/* Reset demo */
document.getElementById('resetBtn').addEventListener('click', ()=>{
  if(confirm('Reset demo data?')) {
    state.points = 0;
    state.pending = [];
    saveState(); renderBalance(); renderPending(); showToast('Demo reset');
  }
});

/* Initial render */
renderBalance();
renderOffers();
renderPending();

/* Expose startPlay for buttons in offers render */
window.startPlay = startPlay;
