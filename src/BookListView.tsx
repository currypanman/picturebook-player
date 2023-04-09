import { useEffect, useState } from 'react';
import { Book, BookController } from './BookController';
import Button from '@mui/material/Button';
import './Player.css';

type BookListProps = {
  controller: BookController;
  onBookClick: (book: Book) => void;
}

function BookListView(props: BookListProps) {

  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    props.controller.getAll().then(books => {
      setBooks(books);
    });
  }, []);

  function handleThumbnailClick(book: Book) {
    props.onBookClick(book);
  }

  async function handleAddBook() {
    const book = await props.controller.create([]);
    props.onBookClick(book);
  }

  function renderThumbnail(book: Book) {
    return (
      <div className='thumbnail' key={book.id} onClick={() => handleThumbnailClick(book)}>
        { book.pages.length > 0 ? (
          <img src={book.pages[0].imageUrl} />
        ) : (
          <p>No page</p>
        ) }
      </div>
    );
  }

  return (
    <div className="Player">
        <div className='thumbnails'>
          { books.map((book) => renderThumbnail(book)) }
          <div className='thumbnail'>
            <Button variant="contained" onClick={() => handleAddBook()}>Add book</Button>
          </div>
        </div>
    </div>
  );
}

export { BookListView };
