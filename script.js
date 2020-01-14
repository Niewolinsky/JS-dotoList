'use strict'
// MODULES & PACKAGES
import MagicGrid    from '/web_modules/magic-grid.js'
import { render }   from '/web_modules/timeago.js'
import { throttle } from '/web_modules/tiny-throttle.js'
import                   '/web_modules/particles.js'

// GLOBAL FUNCTIONS //
function isEmptyOrSpaces(str) {
  return str === null || str.match(/^\s*$/) !== null
}

function modalCardReset() {
  modalCardContent.reset();
  modalBackground.classList.remove("boxblur");
  document.getElementsByClassName('particles-js-canvas-el')[0].classList.remove("boxblur");
}

function refreshGrid() {
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

function notificationPopup(notificationType) {
  switch (notificationType) {
    case 'note-empty':
      let notificationNoteEmpty = document.createElement("div");
      notificationNoteEmpty.classList.add('notification');
    
      let notificationIconNoteEmpty = document.createElement("div");
      notificationIconNoteEmpty.classList.add('notificationIconNoteEmpty');
      notificationIconNoteEmpty.innerHTML = '!';
    
      let notificationMessageNoteEmpty = document.createElement("div"); 
      notificationMessageNoteEmpty.classList.add('notificationMessageNoteEmpty');
      notificationMessageNoteEmpty.innerHTML = 'Cannot add empty notes!';
    
      notificationNoteEmpty.appendChild(notificationIconNoteEmpty);
      notificationNoteEmpty.appendChild(notificationMessageNoteEmpty);
      document.body.appendChild(notificationNoteEmpty)
    
      setTimeout(function() {
        document.body.removeChild(document.body.lastChild);
      }, 4000);
      break;

      case 'login-disabled':
        let notificationLoginDisabled = document.createElement("div");
        notificationLoginDisabled.classList.add('notification');
      
        let notificationIconLoginDisabled = document.createElement("div");
        notificationIconLoginDisabled.classList.add('notificationIconLoginDisabled');
        notificationIconLoginDisabled.innerHTML = ':(';
      
        let notificationMessageLoginDisabled = document.createElement("div"); 
        notificationMessageLoginDisabled.classList.add('notificationMessageLoginDisabled');
        notificationMessageLoginDisabled.innerHTML = 'Logging in not yet available.';
      
        notificationLoginDisabled.appendChild(notificationIconLoginDisabled);
        notificationLoginDisabled.appendChild(notificationMessageLoginDisabled);
        document.body.appendChild(notificationLoginDisabled)
      
        setTimeout(function() {
          document.body.removeChild(document.body.lastChild);
        }, 4000);
        break;  
    
    default:
      return;
  }
}

function delNote(note) {
  let uniqueTimestamp = event.target.nextSibling.lastChild.lastChild.getAttribute("data-timestamp");
  notes = notes.filter(function( obj ) {
    return obj.date != uniqueTimestamp;
  });
  localStorage.setItem(LOCAL_STORAGE_NOTE_KEY, JSON.stringify(notes));

  note.parentNode.parentNode.removeChild(note.parentNode);

  refreshGrid();
}

function addNote( {title, note, priority, date} ) {
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

  refreshGrid();

  timestamps = document.querySelectorAll('.timeago');
  render(timestamps);
}

// GLOBAL VARIABLE DEFINITIONS & ON-LOAD FUNCTIONS //
particlesJS.load('particles-js', 'particlesconfig.json')

function Note(title, note, priority, date) {
  this.title = title
  this.note = note
  this.priority = priority
  this.date = date
}

let timestamps
let magicGrid
const LOCAL_STORAGE_NOTE_KEY = 'todo.savedNotes'
let notes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NOTE_KEY)) || []

for (let note of notes) {
  addNote(note)
}

const toggleSwitch = document.querySelector('input[type="checkbox"]') //ELEMENT: toggle switch for darkmode/lightmode

// EVENT LISTENERS & HANDLERS //
toggleSwitch.onchange = function(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute('data-theme', 'dark')
  }
  else {
    document.documentElement.setAttribute('data-theme', 'light')
  }  
}

addButton.onclick = function(e) {
  newNoteModal.style.removeProperty('display')
  modalBackground.classList.add("boxblur")
  document.getElementsByClassName('particles-js-canvas-el')[0].classList.add("boxblur")
}

userLogin.onclick = function(e) {
  notificationPopup('login-disabled')
}

cardContainer.onclick = function(e) {
  if (e.target.classList.contains("removeLogo")) delNote(e.target);
}

newNoteModal.onclick = function(e) {
  if (e.target.classList.contains("modalRemoveLogo")) {
    newNoteModal.style.display = "none"

    modalCardReset()
  }

  else if (e.target.classList.contains("modalAcceptLogo")) {
    newNoteModal.style.display = "none"

    if (isEmptyOrSpaces(noteTitle.value) && isEmptyOrSpaces(noteNote.value)) {
      notificationPopup('note-empty')
      modalCardReset()
      return;
    }

    let priority = document.querySelector('input[name="priority"]:checked').value;
    let newObjectNote = new Note(noteTitle.value, noteNote.value, priority, Date.now())
    notes.push(newObjectNote)
    localStorage.setItem(LOCAL_STORAGE_NOTE_KEY, JSON.stringify(notes))
    addNote(newObjectNote)
    
    modalCardReset()
  }
}

// !FIX PERFORMANCE AND BUGS
let sticky = header.offsetTop + 80
function stickiedHeader() {
  if (window.pageYOffset > sticky) {
    document.documentElement.setAttribute('data-scroll', 'scrolled')
  } 
  else {
    document.documentElement.setAttribute('data-scroll', 'nonscrolled')
  }
}
let x = function() {
  stickiedHeader();
};
window.addEventListener('scroll', throttle(x, 1000))
// !FIX PERFORMANCE AND BUGS