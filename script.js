'use strict'
import MagicGrid    from '/web_modules/magic-grid.js';
import { render }   from '/web_modules/timeago.js';
import { throttle } from '/web_modules/tiny-throttle.js'
import '/web_modules/particles.js';

particlesJS.load('particles-js', 'particlesconfig.json')
 
let timestamps = document.querySelectorAll('.timeago')

let magicGrid = new MagicGrid({
    container: '#cardContainer',
    animate: true,
    gutter: 30,
    maxColumns: 3,
    static: true,
    useMin: true
})
magicGrid.listen()

function isEmptyOrSpaces(str){
  return str === null || str.match(/^\s*$/) !== null;
}

const toggleSwitch = document.querySelector('input[type="checkbox"]');
function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
    }    
}
toggleSwitch.addEventListener('change', switchTheme, false);

let sticky = header.offsetTop + 80;
function stickiedHeader() {
  if (window.pageYOffset > sticky) {
    document.documentElement.setAttribute('data-scroll', 'scrolled');
  } else {
    document.documentElement.setAttribute('data-scroll', 'nonscrolled');
  }
}

// !TUTAJ performance issue
let x = function() {
  stickiedHeader();
  console.log('click');
};

window.addEventListener('scroll', throttle(x, 1000))
// !FIX THIS

function addNote(title, note, checked) {
  if (isEmptyOrSpaces(title) && isEmptyOrSpaces(note)) {
    return;
  }

  let card = document.createElement("div");
  card.className = "card";

  let removeLogo = document.createElement("img");
  removeLogo.src="svgs/remove.svg"
  removeLogo.alt="Remove Logo"
  removeLogo.className = "removeLogo";
  removeLogo.classList.add(checked);

  let contentDiv = document.createElement("div");
  contentDiv.className = "cardContent";

  let h2 = document.createElement("h2");
  h2.innerHTML = title;
  let p = document.createElement("p");
  p.innerHTML = note;
  
  let timewrapDiv = document.createElement("div");
  timewrapDiv.classList.add("timestampWrapper");
  let timeLogo = document.createElement("img");
  timeLogo.src="svgs/time.svg"
  timeLogo.alt="Clock Logo"
  timeLogo.className = "clockLogo";
  let timeDiv = document.createElement("div");
  timeDiv.classList.add("timeago");
  timeDiv.setAttribute("datetime", Date.now());

  timewrapDiv.appendChild(timeLogo);
  timewrapDiv.appendChild(timeDiv);

  contentDiv.appendChild(h2);
  contentDiv.appendChild(p);
  contentDiv.appendChild(timewrapDiv);

  card.appendChild(removeLogo);
  card.appendChild(contentDiv);

  cardContainer.appendChild(card);

  magicGrid = new MagicGrid({
    container: '#cardContainer',
    animate: true,
    gutter: 30,
    maxColumns: 3,
    static: true,
    useMin: true
  });
  magicGrid.listen();

  timestamps = document.querySelectorAll('.timeago');
  render(timestamps);
}

addButton.onclick = function(event) {
  newNoteModal.style.removeProperty('display');
  modalBackground.classList.add("boxblur");
  document.getElementsByClassName('particles-js-canvas-el')[0].classList.add("boxblur");
}

function delNote(note) {
  note.parentNode.parentNode.removeChild(note.parentNode);

  magicGrid = new MagicGrid({
    container: '#cardContainer',
    animate: true,
    gutter: 30,
    maxColumns: 3,
    static: true,
    useMin: true
  });
  magicGrid.listen();
}

cardContainer.onclick = function(event) {
  if (event.target.classList.contains("removeLogo")) delNote(event.target);
}

// ADD NEW NOTE MODAL
newNoteModal.onclick = function(event) {
  if (event.target.classList.contains("modalRemoveLogo")) {
    newNoteModal.style.display = "none";
    modalCardContent.reset();
    modalBackground.classList.remove("boxblur");
    document.getElementsByClassName('particles-js-canvas-el')[0].classList.remove("boxblur");
  }
  if (event.target.classList.contains("modalAcceptLogo")) {
    newNoteModal.style.display = "none";
    let checked = document.querySelector('input[name="priority"]:checked').value;
    addNote(title1.value, note1.value, checked);
    modalCardContent.reset();
    modalBackground.classList.remove("boxblur");
    document.getElementsByClassName('particles-js-canvas-el')[0].classList.remove("boxblur");
  }
}