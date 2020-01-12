'use strict'
import MagicGrid    from '/web_modules/magic-grid.js';
import { render }   from '/web_modules/timeago.js';
import { throttle } from '/web_modules/tiny-throttle.js'
import '/web_modules/particles.js';
particlesJS.load('particles-js', 'particlesconfig.json')

const LOCAL_STORAGE_TITLE_KEY = 'todo.titles';
const LOCAL_STORAGE_NOTE_KEY = 'todo.notes';
const LOCAL_STORAGE_PRIORITY_KEY = 'todo.priorities';
const LOCAL_STORAGE_DATE_KEY = 'todo.dates';

let titles = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TITLE_KEY)) || [];
let notes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NOTE_KEY)) || [];
let priorities = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PRIORITY_KEY)) || [];
let dates = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATE_KEY)) || [];

let timestamps = document.querySelectorAll('.timeago')

let magicGrid = new MagicGrid({
    container: '#cardContainer',
    animate: true,
    gutter: 30,
    maxColumns: 3,
    static: true,
    useMin: true
})
magicGrid.listen();

for (let i = 0; i < titles.length; i++) {
  addNote(titles[i], notes[i], priorities[i], dates[i]);
}

function kaszka() {
    for (let i = 0; i < 2; i++) {
      addNote(titles[i], notes[i], priorities[i], dates[i]);
    }
    console.log(titles);
}

function isEmptyOrSpaces(str){
  return str === null || str.match(/^\s*$/) !== null;
}

const toggleSwitch = document.querySelector('input[type="checkbox"]');
function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        kaszka();
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

function addNote(title, note, priority, cacheLoad = true, date = Date.now()) {
  if (isEmptyOrSpaces(title) && isEmptyOrSpaces(note)) {
    let notification = document.createElement("div");
    notification.classList.add('notification');

    let notificationIcon = document.createElement("div");
    notificationIcon.classList.add('notificationIcon');
    notificationIcon.innerHTML = '!';

    let notificationMessage = document.createElement("div"); 
    notificationMessage.classList.add('notificationMessage');
    notificationMessage.innerHTML = 'Cannot add empty notes!';

    notification.appendChild(notificationIcon);
    notification.appendChild(notificationMessage);
    document.body.appendChild(notification)

    setTimeout(function() {
      document.body.removeChild(document.body.lastChild);
    }, 4000);

    return;
  }

  if (cacheLoad == false) {
    titles.push(title);
    notes.push(note);
    priorities.push(priority);
    dates.push(date);
  }

  let card = document.createElement("div");
  card.className = "card";

  let removeLogo = document.createElement("img");
  removeLogo.src="svgs/remove.svg"
  removeLogo.alt="Remove Logo"
  removeLogo.className = "removeLogo";
  removeLogo.classList.add(priority);

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
  timeDiv.setAttribute("datetime", date);

  timewrapDiv.appendChild(timeLogo);
  timewrapDiv.appendChild(timeDiv);

  contentDiv.appendChild(h2);
  contentDiv.appendChild(p);
  contentDiv.appendChild(timewrapDiv);

  card.appendChild(removeLogo);
  card.appendChild(contentDiv);

  cardContainer.appendChild(card);

  localStorage.setItem(LOCAL_STORAGE_TITLE_KEY, JSON.stringify(titles));
  localStorage.setItem(LOCAL_STORAGE_NOTE_KEY, JSON.stringify(notes));
  localStorage.setItem(LOCAL_STORAGE_PRIORITY_KEY, JSON.stringify(priorities));
  localStorage.setItem(LOCAL_STORAGE_DATE_KEY, JSON.stringify(dates));

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
  //!DODAJ USUWANIE NOTATKI Z CACHE, ZROB MOZE DATA-ATTRIBUTE DO KAZDEJ NOTATKI
  //??BEDZIESZ MUSIAL RENDEROWAC NA NOWO
  //## CZEMU U CIEBIE W EDYTORZE NIE MA KOLOROW NA ROZNYCH TEKSTACH TAK JAK NA WEBDEV SIMPLIFIED? MASZ WSZYSTKO BIALE PRAWIE A ON WSZYSTKO KOLORWE
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
    let priority = document.querySelector('input[name="priority"]:checked').value;
    addNote(title1.value, note1.value, priority, false);
    modalCardContent.reset();
    modalBackground.classList.remove("boxblur");
    document.getElementsByClassName('particles-js-canvas-el')[0].classList.remove("boxblur");
  }
}