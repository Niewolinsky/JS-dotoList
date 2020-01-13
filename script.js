'use strict'
import MagicGrid    from '/web_modules/magic-grid.js';
import { render }   from '/web_modules/timeago.js';
import { throttle } from '/web_modules/tiny-throttle.js'
import '/web_modules/particles.js';
particlesJS.load('particles-js', 'particlesconfig.json')

function Note(title, note, priority, date) {
  this.title = title;
  this.note = note;
  this.priority = priority;
  this.date = date;
}

const LOCAL_STORAGE_NOTE_KEY = 'todo.savedNotes';
let notes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NOTE_KEY)) || [];

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

for (let i = 0; i < notes.length; i++) {
  addNote(notes[i].title, notes[i].note, notes[i].priority, notes[i].date);
}

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

function addNote(title, note, priority, date) {
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
  timeDiv.setAttribute("data-timestamp", date);
  

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
  //!DODAJ USUWANIE NOTATKI Z CACHE, ZROB MOZE DATA-ATTRIBUTE DO KAZDEJ NOTATKI
  //??BEDZIESZ MUSIAL RENDEROWAC NA NOWO
  //## CZEMU U CIEBIE W EDYTORZE NIE MA KOLOROW NA ROZNYCH TEKSTACH TAK JAK NA WEBDEV SIMPLIFIED? MASZ WSZYSTKO BIALE PRAWIE A ON WSZYSTKO KOLORWE
  let uniqueTimestamp = event.target.nextSibling.lastChild.lastChild.getAttribute("data-timestamp");
  notes = notes.filter(function( obj ) {
    return obj.date != uniqueTimestamp;
  });
  localStorage.setItem(LOCAL_STORAGE_NOTE_KEY, JSON.stringify(notes));

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
    let newObjectNote = new Note(title1.value, note1.value, priority, Date.now());
    notes.push(newObjectNote);
    localStorage.setItem(LOCAL_STORAGE_NOTE_KEY, JSON.stringify(notes));

    addNote(newObjectNote.title, newObjectNote.note, newObjectNote.priority, newObjectNote.date)
    
    modalCardContent.reset();
    modalBackground.classList.remove("boxblur");
    document.getElementsByClassName('particles-js-canvas-el')[0].classList.remove("boxblur");
  }
}