import React, { useState } from 'react';
import { Book, Page, BookController } from './BookController';
import Button from '@mui/material/Button';
import Slider, { Settings } from 'react-slick';
import './Player.css';

type BookProps = {
  controller: BookController;
  book: Book;
  onBackButtonClick: () => void;
}

function BookView(props: BookProps) {

  const [ book, setBook ] = useState<Book>(props.book);
  const inputRef = React.createRef<HTMLInputElement>();

  const settings: Settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
  };

  async function handleFileSelected() {
    const input = inputRef.current;
    if (input == null || input.files == null) {
      return;
    }
    await props.controller.addPage(book, input.files[0]);
    setBook(new Book(book.id, book.pages));
  }

  function handleAddPage() {
    const input = inputRef.current;
    input?.click();
  }

  function renderPage(page: Page) {
    return (
      <div key={page.imageKey} className='page'>
        <img src={page.imageUrl} />
      </div>
    );
  }

  function renderLastPage() {
    return (
      <div className='page'>
        <input
          accept='image/*' capture='environment' className='visually-hidden' type='file'
          ref={inputRef}
          onChange={() => handleFileSelected()} />
        <div>
          <Button className='addPageButton' variant="contained" onClick={() => handleAddPage()}>
            Add page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="Player">
      <div>
        <div className='backButton'>
          <Button variant="contained" onClick={props.onBackButtonClick}>Back</Button>
        </div>
        <Slider {...settings}>
          { book.pages.map((page) => renderPage(page)) }
          { renderLastPage() }
        </Slider>
      </div>
    </div>
  );
}

export { BookView };
