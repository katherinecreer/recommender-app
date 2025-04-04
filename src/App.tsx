import './App.css'
import Recommendation from './Recommendation'



const App: React.FC = () => {
  return (
    <>
      <h2>Welcome to the Recommendation Site for Group 1-2!</h2>
      <br />
      <br />
      <div>
      <p>Please select either UserID or ItemID for relevant suggestions:</p>
      <Recommendation />
    </div>
    </>
  );
};

export default App
