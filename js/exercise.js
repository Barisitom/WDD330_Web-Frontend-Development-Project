// placeholder exercise module
// TODO: wire to ExerciseDB API
const form = document.getElementById('exercise-search-form');
const results = document.getElementById('exercise-results');

form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const q = document.getElementById('exercise-query').value.trim();
  results.innerHTML = `<p>Searching for "${q}" (demo)...</p>`;
  // real implementation would call external API and render cards
});