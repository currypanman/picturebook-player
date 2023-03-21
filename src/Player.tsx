import React from 'react';
import Button from '@mui/material/Button';
import Slider, { Settings } from 'react-slick';
import './Player.css';

class Page {
  id: string;
  imageUrl: string;

  constructor(id: string, imageUrl: string) {
    this.id = id;
    this.imageUrl = imageUrl;
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

  handleAddBook() {
    const bookId = this.state.books.length.toString();
    this.setState({ books: this.state.books.concat([new Book(bookId)]) });
    localStorage.setItem('books', JSON.stringify(this.state.books));
  }

  handleThumbnailClick(book: Book) {
    this.setState({ currentBook: book });
  }

  renderThumbnail(book: Book) {
    return (
      <div key={book.id} onClick={() => this.handleThumbnailClick(book)}>Thumbnail</div>
    );
  }

  handleBack() {
    this.setState({ currentBook: null });
  }

  handleAddPage() {
    const input = this.inputRef.current;
    input?.click();
  }

  handleFileSelected() {
    if (this.state.currentBook == null) {
      return;
    }
    const input = this.inputRef.current;
    if (input == null || input.files == null) {
      return;
    }
    const book = this.state.currentBook;
    const pageId = book.pages.length.toString();
    book.pages = book.pages.concat([new Page(pageId, URL.createObjectURL(input.files[0]))]);
    this.setState({ currentBook: book });
    localStorage.setItem('books', JSON.stringify(this.state.books));
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
          <div>
            <p>Thumbnails are shown.</p>
            { this.state.books.map((book) => this.renderThumbnail(book)) }
            <Button variant="contained" onClick={() => this.handleAddBook()}>Add book</Button>
          </div>
        ) }
      </div>
    );
  }
}

export { Player };
