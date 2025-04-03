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
      const collabResponse = await fetch(`http://172.200.211.84:5000/recommend?user_id=${selectedID}`);
      console.log(collabResponse.json());
      //const contentResponse = await fetch(`http://localhost:5000/content/${selectedID}`);
      //const azureResponse = await fetch(`http://localhost:5000/azure/${selectedID}`);

      const collabData: string[] = await collabResponse.json();
      //const contentData: string[] = await contentResponse.json();
      //const azureData: string[] = await azureResponse.json();

      setRecommendations({
        collaborative: Array.isArray(collabData) ? collabData : [],  // Ensure it's an array
        //content: contentData,
        //azure: azureData,
      });
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  return (
    <div>
      <h3>Recommendation System</h3>
      <input
        type="text"
        placeholder="Enter UserID or ItemID"
        value={selectedID}
        onChange={(e) => setSelectedID(e.target.value)}
      />
      <button onClick={fetchRecommendations}>Get Recommendations</button>


      <p>Collaborative Filtering</p>
      <ul>
        {recommendations.collaborative.map((id, index) => (
          <li key={index}>{id}</li>
        ))}
      </ul>

      {/* <p>Content Filtering</p>
      <ul>
        {recommendations.content.map((id, index) => (
          <li key={index}>{id}</li>
        ))}
      </ul>

      <p>Azure ML</p>
      <ul>
        {recommendations.azure.map((id, index) => (
          <li key={index}>{id}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default Recommendation;
