import { loadLogs, saveLog } from '../data/localStorage.js';

// initial UI wiring
const workoutsEl = document.getElementById('workouts-count');
const caloriesEl = document.getElementById('calories-count');
const waterEl = document.getElementById('water-count');
const activityTbody = document.getElementById('activity-tbody');

let state = {
  workouts: 0,
  calories: 0,
  water: 0,
  logs: []
};

function renderSummary(){
  workoutsEl.textContent = state.workouts;
  caloriesEl.textContent = state.calories;
  waterEl.textContent = state.water;
}

function renderLogs(){
  activityTbody.innerHTML = '';
  state.logs.forEach(log => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${log.activity}</td><td>${log.notes || ''}</td>`;
    activityTbody.appendChild(tr);
  })
}

// load saved
const saved = loadLogs();
if(saved){ state = {...state, ...saved}; }
renderSummary(); renderLogs();

// quick actions (demo)
document.getElementById('log-workout')?.addEventListener('click', ()=>{
  state.workouts += 1; state.logs.unshift({activity:'Workout', notes:'Logged via quick action'});
  saveLog(state); renderSummary(); renderLogs();
});

document.getElementById('log-water')?.addEventListener('click', ()=>{
  state.water += 1; state.logs.unshift({activity:'Water', notes:'1 glass'});
  saveLog(state); renderSummary(); renderLogs();
});

export default {};

