import React from 'react';
import Button from '@mui/material/Button';
import Slider, { Settings } from 'react-slick';
import { openDB } from 'idb';
import './Player.css';

class Page {
  id: string;
  imageKey: IDBValidKey;
  imageUrl: string;

  constructor(id: string, imageKey: IDBValidKey) {
    this.id = id;
    this.imageKey = imageKey;
    this.imageUrl = '';
  }
}

class Book {
  id: string;
  pages: Page[];

  constructor(id: string) {
    this.id = id;
    this.pages = [];
  }
}

class PlayerProps {
}

class Player extends React.Component<PlayerProps> {
  state: {
    books: Book[];
    currentBook: Book | null;
  }

  inputRef = React.createRef<HTMLInputElement>();

  constructor(props: PlayerProps) {
    super(props);
    this.state = {
      books: [],
      currentBook: null,
    };
  }

  componentDidMount() {
    this.loadBooks();
  }

  async loadBooks() {
    const jsonBooks = localStorage.getItem('books');
    if (jsonBooks == null) {
      return;
    }
    const parsedBooks = JSON.parse(jsonBooks);
    const books: Book[] = [];
    for (const value of parsedBooks) {
      const book = new Book(value.id);
      Object.assign(book, value);
      for (const page of book.pages) {
        const imageFile = await this.getPageImage(page.imageKey);
        page.imageUrl = URL.createObjectURL(imageFile);
      }
      books.push(book);
    }
    this.setState({ books: books });
  }

  async putPageImage(file: File) {
    const db = await openDB('PicturebookPlayer', 1, {
      upgrade(db) {
        db.createObjectStore('PageImages', { autoIncrement: true });
      },
    });
    const key = await db.add('PageImages', file);
    db.close();
    return key;
  }

  async getPageImage(key: IDBValidKey) {
    const db = await openDB('PicturebookPlayer');
    const file = await db.get('PageImages', key);
    db.close();
    return file;
  }

  handleAddBook() {
    const bookId = this.state.books.length.toString();
    const book = new Book(bookId);
    this.setState(
      {
        books: this.state.books.concat([book]),
        currentBook: book
      },
      () => { localStorage.setItem('books', JSON.stringify(this.state.books)); }
    );
  }

  handleThumbnailClick(book: Book) {
    this.setState({ currentBook: book });
  }

  renderThumbnail(book: Book) {
    return (
      <div className='thumbnail' key={book.id} onClick={() => this.handleThumbnailClick(book)}>
        { book.pages.length > 0 ? (
          <img src={book.pages[0].imageUrl} />
        ) : (
          <p>Thumbnail</p>
        ) }
      </div>
    );
  }

  handleBack() {
    this.setState({ currentBook: null });
  }

  handleAddPage() {
    const input = this.inputRef.current;
    input?.click();
  }

  async handlePutPageImageSucceeded(key: IDBValidKey) {
    if (this.state.currentBook == null) {
      return;
    }
    const book = this.state.currentBook;
    const pageId = book.pages.length.toString();
    const file = await this.getPageImage(key);
    const page = new Page(pageId, key);
    page.imageUrl = URL.createObjectURL(file);
    book.pages = book.pages.concat([page]);
    this.setState({ currentBook: book });
    localStorage.setItem('books', JSON.stringify(this.state.books));
  }

  handleFileSelected() {
    if (this.state.currentBook == null) {
      return;
    }
    const input = this.inputRef.current;
    if (input == null || input.files == null) {
      return;
    }
    this.putPageImage(input.files[0]).then(this.handlePutPageImageSucceeded.bind(this));
  }

  renderPage(page: Page) {
    return (
      <div key={page.id} className='page'>
        <img src={page.imageUrl} />
      </div>
    );
  }

  renderLastPage() {
    return (
      <div className='page'>
        <input
          accept='image/*' capture='environment' className='visually-hidden' type='file'
          ref={this.inputRef}
          onChange={() => this.handleFileSelected()} />
        <div>
          <Button className='addPageButton' variant="contained" onClick={() => this.handleAddPage()}>
            Add page
          </Button>
        </div>
      </div>
    );
  }
  
  settings: Settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
  };

  render () {
    return (
      <div className="Player">
        { this.state.currentBook != null ? (
          <div>
            <div className='backButton'>
              <Button variant="contained" onClick={() => this.handleBack()}>Back</Button>
            </div>
            <Slider {...this.settings}>
              { this.state.currentBook.pages.map((page) => this.renderPage(page)) }
              { this.renderLastPage() }
            </Slider>
          </div>
        ) : (
          <div className='thumbnails'>
            { this.state.books.map((book) => this.renderThumbnail(book)) }
            <Button variant="contained" onClick={() => this.handleAddBook()}>Add book</Button>
          </div>
        ) }
      </div>
    );
  }
}

export { Player };
