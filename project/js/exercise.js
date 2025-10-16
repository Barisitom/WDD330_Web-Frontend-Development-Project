const form = document.getElementById("exercise-search-form");
const exerciseInput = document.getElementById("exercise-query");
const resultOutput = document.getElementById("exercise-results");

const API_URL = "https://exercisedb-api1.p.rapidapi.com/api/v1/exercises/search?search=";
const API_OPTIONS = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "d2426e21d1msheb13395cf80a47dp111bb4jsn75468fc8a90d",
    "x-rapidapi-host": "exercisedb-api1.p.rapidapi.com"
  }
};

// Handle form submission
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = exerciseInput.value.trim();
  if (!query) {
    resultOutput.innerHTML = "<p>Please enter an exercise name.</p>";
    return;
  }

  resultOutput.innerHTML = "<p>Loading results...</p>";

  try {
    const response = await fetch(`${API_URL}${encodeURIComponent(query)}`, API_OPTIONS);
    const data = await response.json();

    console.log("API Response:", data); // 👈 helpful for debugging

    // Normalize response: handle if API returns an object or nested array
    const exercises = Array.isArray(data)
      ? data
      : Array.isArray(data.data)
        ? data.data
        : [];
    
    if (exercises.length === 0) {
      resultOutput.innerHTML = "<p>No exercises found. Try a different search.</p>";
      return;
    }
    
    displayResults(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    resultOutput.innerHTML = "<p>There was an error fetching exercises. Please try again later.</p>";
  }
});

// Display search results
function displayResults(exercises) {
    const query = exerciseInput.value.trim();
    exercises.forEach(exercise => {
        if (exercise.name == query) {
        console.log(`Found exercise: ${exercise.name}  ${exercise.imageUrl}`);
        }
    });
//   resultOutput.innerHTML = exercises.map(exercise => `
//     <div class="exercise-card">
//       <img src="${exercise.imageUrl}" alt="${exercise.name}" loading="lazy">
//       <h4>${exercise.name}</h4>
//     </div>
//   `).join("");
}
