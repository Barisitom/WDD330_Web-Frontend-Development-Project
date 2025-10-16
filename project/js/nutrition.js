// Placeholder Nutrition Module
// TODO: Integrate with Spoonacular or Edamam properly

const form = document.getElementById("food-search-form");
const foodInput = document.getElementById("food-query");
const foodResults = document.getElementById("food-results");

const appId = "f837d32c";
const apiKey = "6f1e14c7b9595e7562242342e6b872db";

async function fetchRecipe() {
  const ingr = foodInput.value.split("\n").filter(line => line.trim() !== ""); // remove empty lines
  
  try {
    const response = await fetch(
      `https://api.edamam.com/api/nutrition-details?app_id=${appId}&app_key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ingr}),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching nutrition data:", error);
    return { error: error.message };
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // Clear previous results
  foodResults.innerHTML = "Loading nutrition data...";

  const data = await fetchRecipe();

  if (data.error) {
    foodResults.innerHTML = `<p style="color:red;">${data.error}</p>`;
  } else {
    console.log(data);
    foodResults.innerHTML = `
      <h3>Nutrition Summary</h3>
      <p><strong>Calories:</strong> ${data.calories ?? "N/A"}</p>
      <p><strong>Total Weight:</strong> ${data.totalWeight?.toFixed(2) ?? "N/A"} g</p>
    `;
  }
});
