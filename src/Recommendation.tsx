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
  const [content, setContent] = useState<Recommendations>({
    collaborative: [],
    //content: [],
    //azure: [],
  });
  const [itemId, setItemId] = useState<string>("");

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

  const fetchContent = async () => {
    try {
      const response = await fetch(
        `http://172.200.211.84:5000/get_recommendations?title=${itemId}`
      );
      const jsonData = await response.json(); // Parse the JSON response once
      console.log(jsonData.recommendations);
      if (jsonData.recommendations) {
        setContent({
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
      <label htmlFor="UserId">UserID </label>
      <input
        id="UserId"
        type="text"
        placeholder="Enter UserID"
        value={selectedID}
        onChange={(e) => setSelectedID(e.target.value)}
        style={{ marginRight: "20px" }}
      />
      <button
        onClick={() => {
          fetchRecommendations();
        }}
      >
        Get Recommendations
      </button>
      <br />
      <div>
        <label htmlFor="content">ItemId </label>
        <input
          id="content"
          type="text"
          placeholder="Enter ItemId"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          style={{ marginRight: "20px" }}
        />
        <button
          onClick={() => {
            fetchContent();
          }}
        >
          Get Recommendations
        </button>
        <p>Collaborative Filtering</p>
        <ul>
          {recommendations.collaborative.map((id, index) => (
            <li key={index}>{id}</li>
          ))}
        </ul>

        <p>Content Filtering</p>
        <ul>
          {content.collaborative.map((id, index) => (
            <li key={index}>{id}</li>
          ))}
        </ul>
        {/*}
        <p>Azure ML</p>
        <ul>
          {recommendations.azure.map((id, index) => (
            <li key={index}>{id}</li>
          ))}
        </ul> */}
      </div>
    </div>
  );
};

export default Recommendation;
