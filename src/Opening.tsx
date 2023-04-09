import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import './Opening.css';

type OpeningProps = {
  onAnimationComplete: () => void;
}

function Opening(props: OpeningProps) {
  const header = React.createRef<HTMLHeadingElement>();
  const bear = React.createRef<HTMLImageElement>();

  useEffect(() => {
    const tl = gsap.timeline({ onComplete: props.onAnimationComplete });
    tl.to('.opening-logo span', {x:-425 - window.innerWidth / 2, duration: 0.3, stagger: 0.3});
    tl.to(bear.current, {y:-400, duration: 1});
    return () => {
      tl.eventCallback('onComplete', null);
      tl.clear();
    };
  }, [header, bear]);

  return (
    <div className="opening-container">
      <h1 className="opening-logo" ref={header}>
        <span className="opening-logo-blue">クマさんと</span>
        <span>&nbsp;</span>
        <span className="opening-logo-pink">えほんを</span>
        <span>&nbsp;</span>
        <span className="opening-logo-green">よもう!</span>
      </h1>
      <img className="opening-bear" ref={bear}
        src={`${process.env.PUBLIC_URL}/present_kuma.png`} />
      <img className="opening-bookshelf"
        src={`${process.env.PUBLIC_URL}/tosyokan_book_tana.png`} />
    </div>
  );
}

export { Opening };
