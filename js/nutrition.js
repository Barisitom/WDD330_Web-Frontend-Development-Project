// placeholder nutrition module
// TODO: integrate with Spoonacular or Edamam
const foodForm = document.getElementById('food-search-form');
const foodResults = document.getElementById('food-results');

foodForm?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const q = document.getElementById('food-query').value.trim();
  foodResults.innerHTML = `<p>Searching foods for "${q}" (demo)...</p>`;
});