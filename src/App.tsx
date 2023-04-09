import { useState } from 'react';
import { Opening } from './Opening';
import { Player } from './Player';
import './App.css';

enum State {
  Opening,
  BookList,
  Book,
}

function App() {
  const [state, setState] = useState(State.Opening);

  switch (state) {
    case State.Opening:
      return (
        <div className="App">
          <Opening onAnimationComplete={() => setState(State.Book)}/>
        </div>
      );
    case State.BookList:
    case State.Book:
      return (
        <div className="App">
          <Player />
        </div>
      );
  }
}

export default App;
