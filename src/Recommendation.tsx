import { useState } from "react";

interface Recommendations {
  collaborative: string[];
  //content: string[];
  //azure: string[];
}

const Recommendation: React.FC = () => {
  const [selectedID, setSelectedID] = useState<string>("");
  const [recommendations, setRecommendations] = useState<Recommendations>({
    collaborative: [],
    //content: [],
    //azure: [],
  });

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(
        `http://172.200.211.84:5000/recommend?user_id=${selectedID}`
      );
      const jsonData = await response.json(); // Parse the JSON response once

      if (jsonData.recommendations) {
        setRecommendations({
          collaborative: Array.isArray(jsonData.recommendations)
            ? jsonData.recommendations
            : [],
          //content: contentData,
          //azure: azureData,
        });
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter UserID"
        value={selectedID}
        onChange={(e) => setSelectedID(e.target.value)}
        style={{ marginRight: "20px" }}
      />
      <button onClick={fetchRecommendations}>Get Recommendations</button>

        <br />
        <br />

      <p><b>Collaborative Filtering</b></p>
      <ul style={{ textAlign: "left" }}>
        {recommendations.collaborative.length > 0 ? (
          recommendations.collaborative.map((item, index) => (
            <li key={index}>{item}</li>
          ))
        ) : (
          <p>No recommendations available.</p>
        )}
      </ul>

      <p><b>Content Filtering Goes Here</b></p>

      <p><b>Azure Goes Here</b></p>
    </div>
  );
};

export default Recommendation;
