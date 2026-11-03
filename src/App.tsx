import { useState } from "react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { useAuthenticator } from "@aws-amplify/ui-react";
import type { Schema } from "../amplify/data/resource";
import outputs from "../amplify_outputs.json";
import "./App.css";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function App() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [ingredients, setIngredients] = useState<string>("");
  const [recipe, setRecipe] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!ingredients.trim()) return;
    setLoading(true);
    setRecipe("");

    try {
      const ingredientList = ingredients.split(",").map((item) => item.trim());
      const response = await client.queries.askBedrock({
        ingredients: ingredientList,
      });

      if (response.data?.body) {
        setRecipe(response.data.body);
      } else if (response.data?.error) {
        setRecipe(`Error: ${response.data.error}`);
      }
    } catch (err) {
      console.error("Bedrock invocation error:", err);
      setRecipe("An error occurred while generating the recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div style={{ textAlign: "right", maxWidth: "48rem", margin: "0 auto" }}>
        <button className="signout-btn" onClick={signOut}>
          Sign Out ({user?.signInDetails?.loginId || "User"})
        </button>
      </div>

      <div className="header-container">
        <h1 className="main-header">
          AI <span className="highlight">Recipe Generator</span>
        </h1>
        <p className="description">
          Enter ingredients you have on hand, separated by commas, and let Bedrock generate a recipe for you!
        </p>
      </div>

      <div className="form-container">
        <div className="search-container">
          <input
            type="text"
            className="wide-input"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g. chicken, garlic, spinach, olive oil"
          />
          <button
            className="search-button"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating Recipe..." : "Get Recipe"}
          </button>
        </div>
      </div>

      {recipe && (
        <div className="result-container">
          <div className="result">
            <h3>Suggested Recipe:</h3>
            <p>{recipe}</p>
          </div>
        </div>
      )}
    </div>
  );
}