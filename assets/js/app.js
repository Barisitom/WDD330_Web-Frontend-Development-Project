// assets/js/app.js - Core app logic

// --- localStorage helpers ---
const STORAGE_KEY = "healthy_dashboard_v1";
function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  try { return raw ? JSON.parse(raw) : {exercises:[],meals:[],habits:{drinkWater:false},glasses:0,history:[]}; }
  catch(e){ console.error("Failed to parse state", e); return {exercises:[],meals:[],habits:{drinkWater:false},glasses:0,history:[]}; }
}
function saveState(state){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

// --- Simple API wrappers (stubs) ---
// Replace 'YOUR_API_KEY' with real keys when available and update endpoints as needed.

// Nutrition API stub (example: Edamam/Nutritionix etc.)
async function fetchNutritionInfo(mealName){
  // This is a stub. In production, call a real API like Nutritionix or Edamam.
  // Example:
  // const res = await fetch(`https://api.edamam.com/api/nutrition-data?app_id=...&app_key=...&ingr=${encodeURIComponent(mealName)}`);
  // return await res.json();
  console.log("fetchNutritionInfo stub for", mealName);
  return {calories: Math.round(200 + Math.random()*600), note:"Estimated (stub)"};
}

// ExerciseDB stub (example: Wger or ExerciseDB)
// For ExerciseDB you might call: https://exercisedb.p.rapidapi.com/exercises/bodyPart/{bodyPart}
async function fetchExerciseDetails(exerciseName){
  console.log("fetchExerciseDetails stub for", exerciseName);
  return {name:exerciseName, burnEstimatePerMin:6 + Math.round(Math.random()*8)};
}

// --- UI bindings ---
const state = loadState();
const exerciseListEl = document.getElementById("exerciseList");
const mealListEl = document.getElementById("mealList");
const habitEl = document.getElementById("habits");
const glassesCountEl = document.getElementById("glassesCount");
const recommendationsEl = document.getElementById("recommendations");

function renderExercises(){
  exerciseListEl.innerHTML = "";
  state.exercises.forEach((ex,idx)=>{
    const li = document.createElement("li");
    li.textContent = `${ex.name} — ${ex.duration} min`;
    const del = document.createElement("button");
    del.textContent = "Remove";
    del.style.marginLeft = "8px";
    del.onclick = ()=>{ state.exercises.splice(idx,1); saveState(state); renderAll(); };
    li.appendChild(del);
    exerciseListEl.appendChild(li);
  });
}
function renderMeals(){
  mealListEl.innerHTML = "";
  state.meals.forEach((m,idx)=>{
    const li = document.createElement("li");
    li.textContent = `${m.name} — ${m.calories} kcal (${m.note||''})`;
    const del = document.createElement("button");
    del.textContent = "Remove";
    del.style.marginLeft = "8px";
    del.onclick = ()=>{ state.meals.splice(idx,1); saveState(state); renderAll(); };
    li.appendChild(del);
    mealListEl.appendChild(li);
  });
}
function renderHabits(){
  habitEl.innerHTML = `<div>Drink Water Habit: <strong>${state.habits.drinkWater ? "On":"Off"}</strong></div>`;
}
function renderHydration(){
  glassesCountEl.textContent = state.glasses;
}
function renderRecommendations(){
  // Very simple personalized tips based on current state
  const tips = [];
  const totalCalories = state.meals.reduce((s,m)=>s+(m.calories||0),0);
  const totalExerciseMin = state.exercises.reduce((s,e)=>s+(e.duration||0),0);
  if(totalExerciseMin < 30) tips.push("Try to add at least 20–30 minutes of activity today.");
  if(totalCalories > 2200) tips.push("Consider a lighter meal or split portions to manage calories.");
  if(state.habits.drinkWater && state.glasses < 6) tips.push("You're tracking water — aim for 6-8 glasses.");
  if(tips.length===0) tips.push("Great job — keep your routine consistent!");
  recommendationsEl.innerHTML = tips.map(t => `<div>• ${t}</div>`).join("");
}

// --- Event handlers ---
document.getElementById("addExercise").addEventListener("click", async ()=>{
  const name = document.getElementById("exerciseType").value;
  const duration = Number(document.getElementById("duration").value)||0;
  const details = await fetchExerciseDetails(name);
  state.exercises.push({name, duration, details});
  state.history.push({t:Date.now(),type:"exercise",name, duration});
  saveState(state);
  renderAll();
  updateChart();
});

document.getElementById("addMeal").addEventListener("click", async ()=>{
  const name = document.getElementById("mealName").value || "Meal";
  const calories = Number(document.getElementById("calories").value) || 0;
  const info = await fetchNutritionInfo(name);
  const meal = {name, calories, note: info.note};
  state.meals.push(meal);
  state.history.push({t:Date.now(),type:"meal",name, calories});
  saveState(state);
  renderAll();
  updateChart();
});

document.getElementById("toggleHabit").addEventListener("click", ()=>{
  state.habits.drinkWater = !state.habits.drinkWater;
  saveState(state);
  renderAll();
});

document.getElementById("addGlass").addEventListener("click", ()=>{
  state.glasses = (state.glasses||0) + 1;
  saveState(state);
  renderHydration();
  renderRecommendations();
});

// Sync button — demonstrates where to call APIs to sync
document.getElementById("syncBtn").addEventListener("click", async ()=>{
  // Example sync: fetch details for each exercise and recalibrate estimates
  for(const ex of state.exercises){
    const d = await fetchExerciseDetails(ex.name);
    ex.details = d;
  }
  saveState(state);
  renderAll();
  alert("Sync completed (stub). Replace stubs with real APIs and keys.");
});

// --- Chart.js integration ---
let chartInstance = null;
function updateChart(){
  const ctx = document.getElementById('progressChart').getContext('2d');
  // Aggregate last 7 days
  const days = 7;
  const labels = [];
  const caloriesData = [];
  const exerciseData = [];
  for(let i=days-1;i>=0;i--){
    const day = new Date();
    day.setDate(day.getDate()-i);
    const dayKey = day.toISOString().slice(0,10);
    labels.push(dayKey);
    // sum entries in state.history with same day
    const dayMeals = state.history.filter(h=>h.type==="meal" && h.t && new Date(h.t).toISOString().slice(0,10)===dayKey);
    const dayEx = state.history.filter(h=>h.type==="exercise" && h.t && new Date(h.t).toISOString().slice(0,10)===dayKey);
    caloriesData.push(dayMeals.reduce((s,m)=>s+(m.calories||0),0));
    exerciseData.push(dayEx.reduce((s,e)=>s+(e.duration||0),0));
  }
  const data = {
    labels,
    datasets: [
      { label: 'Calories', data: caloriesData, yAxisID: 'y', tension:0.3 },
      { label: 'Exercise minutes', data: exerciseData, yAxisID: 'y1', tension:0.3 }
    ]
  };
  const config = {
    type: 'line',
    data,
    options: {
      responsive:true,
      interaction:{mode:'index',intersect:false},
      stacked:false,
      scales:{
        y:{ type:'linear', position:'left' },
        y1:{ type:'linear', position:'right', grid:{drawOnChartArea:false} }
      }
    }
  };
  if(chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, config);
}

// --- Render all UI pieces ---
function renderAll(){ renderExercises(); renderMeals(); renderHabits(); renderHydration(); renderRecommendations(); }
renderAll();
updateChart();