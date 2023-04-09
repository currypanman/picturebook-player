import { useState } from 'react';
import { Opening } from './Opening';
import { Player } from './Player';
import './App.css';

enum View {
  Opening,
  BookList,
  Book,
}

function App() {
  const [view, setView] = useState(View.Opening);
  const [opacity, setOpacity] = useState(1);

  function changeView(newView: View) {
    setOpacity(0);
    setTimeout(() => {
      setView(newView);
      setOpacity(1);
    }, 1000);
  }

  switch (view) {
    case View.Opening:
      return (
        <div className="App" style={{opacity: opacity}}>
          <Opening onAnimationComplete={() => changeView(View.Book)}/>
        </div>
      );
    case View.BookList:
    case View.Book:
      return (
        <div className="App" style={{opacity: opacity}}>
          <Player />
        </div>
      );
  }
}

export default App;
