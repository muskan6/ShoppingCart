import React from 'react';
import './App.css';
import ItemList from './datacomponent/ItemList';
function App() {
    const s = "<";
  return (
    <div className="App">
        <div id="mainhead">{s} Order Summary</div>
        <div id="maindiv">
              <ItemList/>
        </div>
    </div>

  );
}

export default App;
