import React from 'react';
import Button from '@mui/material/Button';
import Slider, { Settings } from 'react-slick';
import './Player.css';
import { Book, Page, BookController } from './BookController';

class PlayerProps {
}

class Player extends React.Component<PlayerProps> {
  state: {
    books: Book[];
    currentBook: Book | null;
  }

  inputRef = React.createRef<HTMLInputElement>();
  controller = new BookController();

  constructor(props: PlayerProps) {
    super(props);
    this.state = {
      books: [],
      currentBook: null,
    };
  }

  componentDidMount() {
    this.controller.init().then(() => {
      this.loadBooks();
    });
  }

  async loadBooks() {
    const books: Book[] = await this.controller.getAll();
    for (const book of books) {
      await this.controller.loadPageImages(book);
    }
    this.setState({ books: books });
  }

  async handleAddBook() {
    const book = await this.controller.create([]);
    this.setState({ currentBook: book });
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
          <p>No page</p>
        ) }
      </div>
    );
  }

  async handleBack() {
    const books: Book[] = await this.controller.getAll();
    this.setState({ books: books, currentBook: null });
  }

  handleAddPage() {
    const input = this.inputRef.current;
    input?.click();
  }

  async handleFileSelected() {
    if (this.state.currentBook == null) {
      return;
    }
    const input = this.inputRef.current;
    if (input == null || input.files == null) {
      return;
    }
    await this.controller.addPage(this.state.currentBook, input.files[0]);
    this.setState({ currentBook: this.state.currentBook });
  }

  renderPage(page: Page) {
    return (
      <div key={page.imageKey} className='page'>
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
            <div className='thumbnail'>
              <Button variant="contained" onClick={() => this.handleAddBook()}>Add book</Button>
            </div>
          </div>
        ) }
      </div>
    );
  }
}

export { Player };
