import { loadLogs, saveLog } from '../data/localStorage.js';
const form = document.getElementById('habit-form');
const list = document.getElementById('habit-list');

let habits = [];

function render(){
  list.innerHTML = '';
  habits.forEach(h => {
    const li = document.createElement('li');
    li.textContent = h;
    list.appendChild(li);
  })
}

form?.addEventListener('submit', e=>{
  e.preventDefault();
  const name = document.getElementById('habit-name').value.trim();
  if(!name) return;
  habits.push(name);
  render();
  document.getElementById('habit-name').value = '';
});