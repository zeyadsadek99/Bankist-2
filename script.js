'use strict';

///////////////////////////////////////
// Modal window

//

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const scrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

scrollTo.addEventListener('click', function (e) {
  const s1Bound = section1.getBoundingClientRect();
  console.log(s1Bound);
  console.log(e.target.getBoundingClientRect());
  console.log('current Scroll XY', window.pageXOffset, window.pageYOffset); // how much you scroll down from top or side
  console.log(
    'height/width',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  ); // the view part you can see from the website

  //scrolling
  // window.scrollTo({
  //   left: s1Bound.left + window.pageXOffset,
  //   top: s1Bound.top + window.pageYOffset,
  //   behavior: 'smooth',
  // }); // onlu work when you are at the top of the window (if use s1Bound.left and top only)
  section1.scrollIntoView({ behavior: 'smooth' }); //more easier
});
/////////////////////
// page Navigation

/////
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
document.querySelector('.nav__links').addEventListener('click', function (e) {
  // console.log(e.target);
  e.preventDefault();
  console.log(e.currentTarget);
  //Matching Strategy
  if (e.target.classList.contains('nav__link')) {
    console.log('link');
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
//////////////
//

tabsContainer.addEventListener('click', function (e) {
  // const clicked = e.target;// get the span inside the button as child if we use parent element it will handle this but the button will get its parent so it wrong
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);
  //guard clause
  if (!clicked) return;
  //Remove active classes
  tabs.forEach(el => el.classList.remove('operations__tab--active')); // we add this to activate only the one tab we click
  tabsContent.forEach(el => el.classList.remove('operations__content--active'));

  //activate Tab
  clicked.classList.add('operations__tab--active');

  //activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
//menu animation

const hovering = function (e) {
  // console.log(this);
  // console.log(opacity);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// passing "argument" into handler
nav.addEventListener('mouseover', hovering.bind(0.5));
nav.addEventListener('mouseout', hovering.bind(1));
// nav.addEventListener('mouseover', function (e) {
//   hovering(e, 0.5);
// });
// nav.addEventListener('mouseout', function (e) {
//   hovering(e, 1);
// });
// Sticky scroll
// const bounds = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   // console.log(bounds);
//   // console.log(this.window.scrollY);
//   if (window.scrollY > bounds.top) {
//     nav.classList.add('sticky');
//   } else nav.classList.remove('sticky');
// });

//sticky navigation
// const obsCallBack = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };
// const observer = new IntersectionObserver(obsCallBack, obsOptions);
// observer.observe(section1);
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  // console.log(entries);
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});
////
//Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
const loadingImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  //replace datasrc with src
  entry.target.src = entry.target.dataset.src;
  entry.target.classList.remove('lazy-img');

  imgTargets.unobserve(entry.target); // to not observe it again for peerformance
};
const imgObserver = new IntersectionObserver(loadingImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', // postive to load image eariler
});
imgTargets.forEach(img => imgObserver.observe(img));
////////////////////////
//Sliders
const slidefunc = function () {
  const sliders = document.querySelectorAll('.slide');
  const dotContainer = document.querySelector('.dots');
  // const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  let curSlide = 0;
  const maxSlide = sliders.length;
  // slider.style.transform = 'scale(0.4) translateX(-800px)';
  // slider.style.overflow = 'visible';
  //FUNCTIONS
  const createDots = function () {
    sliders.forEach(function (s, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}" ></button>`
      );
    });
  };
  //activate dot
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const gotoSlide = function (slide) {
    sliders.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
  };
  //Intiazlize
  // sliders.forEach(
  //   (slide, i) => (slide.style.transform = `translateX(${100 * i}%)`)
  // ); //Go to slide 0
  //Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    gotoSlide(curSlide);
    activateDot(curSlide);
  };
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    gotoSlide(curSlide);
    activateDot(curSlide);
  };
  const init = function () {
    createDots();
    gotoSlide(0);
    activateDot(0);
  };
  init();
  // Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  // 0,100,200,300 ----> -100,0,100,200

  document.addEventListener('keydown', function (e) {
    // e.key === 'ArrowLeft' && prevSlide()
    if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'ArrowRight') nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      console.log('zoz');
      // const slide = e.target.dataset.slide;
      const { slide } = e.target.dataset;
      gotoSlide(slide);
      activateDot(slide);
    }
  });
};
slidefunc();
