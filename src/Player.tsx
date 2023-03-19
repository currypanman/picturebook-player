import React, { useState } from 'react';
import Button from '@mui/material/Button';

class Page {

}

class Book {
  pages: Page[];

  constructor() {
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

  constructor(props: PlayerProps) {
    super(props);
    this.state = {
      books: [],
      currentBook: null,
    };
  }

  handleAddBook() {
    this.setState({ books: this.state.books.concat([new Book()]) });
  }

  handleThumbnailClick(book: Book) {
    this.setState({ currentBook: book });
  }

  renderThumbnail(book: Book) {
    return (
      <div onClick={() => this.handleThumbnailClick(book)}>Thumbnail</div>
    );
  }

  handleBack() {
    this.setState({ currentBook: null });
  }

  handleAddPage() {
    if (this.state.currentBook == null) {
      return;
    }
    const pages = this.state.currentBook.pages.concat([new Page()]);
    this.state.currentBook.pages = pages;
    this.setState({ currentBook: this.state.currentBook });
  }

  renderPage(page: Page) {
    return (
      <div>Page</div>
    );
  }
  
  render () {
    return (
      <div className="Player">
        { this.state.currentBook != null ? (
          <div>
            <p>A selected book is shown.</p>
            <Button variant="contained" onClick={() => this.handleBack()}>Back</Button>
            { this.state.currentBook.pages.map((page) => this.renderPage(page)) }
            <Button variant="contained" onClick={() => this.handleAddPage()}>Add page</Button>
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
