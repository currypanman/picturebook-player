import { useState, useRef, useEffect } from 'react';
import { Book, BookController } from './BookController';
import { Opening } from './Opening';
import { BookListView } from './BookListView'
import { BookView } from './BookView'
import './App.css';

enum View {
  Opening,
  BookList,
  Book,
}

function App() {
  const [view, setView] = useState(View.Opening);
  const [opacity, setOpacity] = useState(1);

  const controllerRef = useRef<BookController>(new BookController());
  const currentBookRef = useRef<Book>();

  useEffect(() => {
    controllerRef.current.init();
  }, []);

  function changeView(newView: View) {
    setOpacity(0);
    setTimeout(() => {
      setView(newView);
      setOpacity(1);
    }, 500);
  }

  switch (view) {
    case View.Opening:
      return (
        <div className="App" style={{opacity: opacity}}>
          <Opening onAnimationComplete={() => changeView(View.BookList)}/>
        </div>
      );
    case View.BookList:
      return (
        <div className="App" style={{opacity: opacity}}>
          <BookListView
            controller={controllerRef.current}
            onBookClick={(book) => {
              currentBookRef.current = book;
              changeView(View.Book);
            }}
          />
        </div>
      );
    case View.Book:
      return (
        <div className="App" style={{opacity: opacity}}>
          <BookView
            controller={controllerRef.current}
            book={currentBookRef.current!}
            onBackButtonClick={() => {
              changeView(View.BookList);
            }}
          />
        </div>
      );
  }
}

export default App;
