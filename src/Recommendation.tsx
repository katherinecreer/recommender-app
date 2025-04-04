
// Handle necessary imports
import { useState } from "react";


interface Recommendations {
  collaborative: string[];
  azure: string[];
}

// Define necessary variables for Azure
const AZURE_ENDPOINT = "http://6a61ea1b-8cc2-470d-8835-627574e50f70.eastus2.azurecontainer.io/score";
const AZURE_KEY = "PSBnwkCBD9z9hc1DF8BWAXqItMcPzmat";

const Recommendation: React.FC = () => 
{
  const [selectedID, setSelectedID] = useState<string>("");
  const [recommendations, setRecommendations] = useState<Recommendations>({
    collaborative: [],
    azure: [],
  });

  // Keep the content-based recommendations separate
  interface ContentRecs {
    collaborative: string[];
  }
  const [content, setContent] = useState<ContentRecs>({
    collaborative: [],
  });

  const [itemId, setItemId] = useState<string>("");

  // Function to fetch user-based (collaborative) and Azure simultaneously
  const fetchRecommendations = async () => 
  {
    try 
    {
      const response = await fetch(
        `http://172.200.211.84:5000/recommend?user_id=${selectedID}`
      );
      const jsonData = await response.json();

      if (jsonData.recommendations) 
      {
        setRecommendations({
          collaborative: Array.isArray(jsonData.recommendations)
            ? jsonData.recommendations
            : [],
          azure: [],
        });
      }
    } 
    catch (error) 
    {
      console.error("Error fetching recommendations:", error);
    }

    //
    if (!selectedID.trim())
    {
      return;
    }

    console.log('Azure recommendations currently loading...');
    
    try
    {
      // Build the requestBody using the selectedID
      const requestBody = { user_id: selectedID };

      // Make the POST request to the Azure endpoint
      const response = await fetch(AZURE_ENDPOINT,
      {
          method: "POST",
          headers:
          {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${AZURE_KEY}`
          },
          body: JSON.stringify(requestBody)
      });

      // If the response.ok returns false...
      if (!response.ok)
      {
          // Throw an error if not connected
          throw new Error(`Azure endpoint error: ${response.statusText}`);
      }

      // Define the data variable as the JSON response
      const data = await response.json();
      // Output the data in the console log
      console.log("Azure response data:", data);

      // Set the data as the azure recommendations variable, or blank (fallback)
      setRecommendations((prev) =>
        ({
          ...prev,
          azure: data.recommendations || []
      }));
    }

    // If an error was found
    catch (err: any)
    {
      // Report an error
      console.error("Error calling Azure endpoint:", err);
    } 

  };

  // Function to fetch content-based recommendations
  const fetchContent = async () => 
  {
    try 
    {
      const response = await fetch(
        `http://172.200.211.84:5000/get_recommendations?title=${itemId}`
      );
      const jsonData = await response.json();
      console.log(jsonData.recommendations);
      if (jsonData.recommendations) 
      {
        setContent({
          collaborative: Array.isArray(jsonData.recommendations)
            ? jsonData.recommendations
            : [],
        });
      }
    } 
    catch (error) 
    {
      console.error("Error fetching recommendations:", error);
    }
  };


  // Return the data in an HTML format
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
        <label htmlFor="content">ItemID </label>
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
          <br /><br />
        <strong><p>Collaborative Filtering</p></strong>
        <ul style={{ textAlign: 'left' }}>
          {recommendations.collaborative.map((id, index) => (
            <li key={index}>{id}</li>
          ))}
        </ul>
          <br />
        <strong><p>Content Filtering</p></strong>
        <ul style={{ textAlign: 'left' }}>
          {content.collaborative.map((id, index) => (
            <li key={index}>{id}</li>
          ))}
        </ul>
          <br />
        <strong><p>Azure ML</p></strong>
        <ul style={{ textAlign: 'left' }}>
          {recommendations.azure.map((id, index) => (
            <li key={index}>{id}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// export the recommendation
export default Recommendation;
