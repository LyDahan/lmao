
/**
 * @typedef {import('./utils.js').Note} Note
 */

export default class NoteLibrary {
  noteList = document.getElementById('notes');
  pinnedNoteList = document.getElementById('pinned-notes');
  ascendingValueComparer = 'newest';
  selectedNote = null;

  constructor(storageManager) {
    this.storageManager = storageManager;
  }

  /**
   * TODO : Génère le code HTML pour une note à afficher à l'écran.
   * Ajoute les gestionnaires de click pour les icônes d'épingle, suppression et détails.
   * Ajoute un gestionnaire de click global sur l'élément pour sélectionner/désélectionner la note
   * @param {Note} note note à afficher
   * @returns {HTMLDivElement} élément div parent de l'affichage pour la note
   */
  createHTMLNote(note) {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.setAttribute('data-id', note.id);
    noteDiv.style.backgroundColor=note.color;

    const headerDiv = document.createElement('div');
    headerDiv.innerHTML=`<h2>${note.title}</h2>`;

    const pin = document.createElement('i');
    pin.classList.add('fa', 'fa-paperclip', 'pin', 'hidden');
    headerDiv.appendChild(pin);

    noteDiv.appendChild(headerDiv);


    const tags= document.createElement('p');
    tags.innerHTML= `Tags: ${note.tags.join(", ")}`;
    noteDiv.appendChild(tags);

    const date = document.createElement('p');
    date.classList.add('date');
    date.innerHTML = `Dernière modification: ${note.lastEdit.toLocaleDateString()}`;
    noteDiv.appendChild(date);

    const trash = document.createElement('i');
    trash.classList.add('delete-button', 'fa', 'fa-trash-o', 'hidden');
    noteDiv.appendChild(trash);

    const details=document.createElement('i');
    details.classList.add('details-button', 'fa', 'fa-info', 'hidden');
    noteDiv.appendChild(details);

    noteDiv.addEventListener('click', (zoneClicked) => {
      //Si la zone selectionnee nest pas un icone
      if (!zoneClicked.target.classList.contains('fa')) {
          this.selectNote({trash,details});
          this.selectedNote=noteDiv;
        }  
    })

    //appel des methodes en-dessous
    trash.addEventListener('click', ()=> this.deleteNote(note.id));
    pin.addEventListener('click', ()=> this.pinNote(note.id));
    details.addEventListener('click', (e)=> {
      e.stopPropagation();
      window.location.href = `detail.html?id=${note.id}`;});

    return noteDiv;

  }

  /**
   * Ajoute ou retire la classe 'hidden' aux éléments
   * @param {{deleteIcon: HTMLElement, detailsIcon: HTMLElement}} noteNodeElements contient les icônes de suppression et détails
   *
  */
  selectNote(noteNodeElements) {
    noteNodeElements.trash.classList.toggle('hidden');
    noteNodeElements.details.classList.toggle('hidden');
  }

  /**
   * TODO : Génère le HTML pour toutes les notes dans les 2 listes en fonction de l'attribut "pinned" de chaque note.
   * TODO : Vous NE POUVEZ PAS utiliser une boucle for() classique pour cette fonction
   * @param {Array<Note>} notes notes à afficher dans la page
   */
  generateHTMLNotes(notes) {
    this.noteList.innerHTML='';
    this.pinnedNoteList.innerHTML='';

    notes.forEach(note=> {
      if (note.pinned) {
        this.pinnedNoteList.appendChild(this.createHTMLNote(note));
      }
      else {
        this.noteList.appendChild(this.createHTMLNote(note));
      }

    })
  }

  /**
   * TODO : Met à jour les listes des notes affichées dans la page
   * @param {Array<Note>} notes notes à afficher dans la page
   */
  updateListsInterface(notes) {
    this.noteList.innerHTML = '';
    this.pinnedNoteList.innerHTML = '';
    
    
    notes.forEach(note => {
        
        const htmlNote = this.createHTMLNote(note);
        
        
        if (note.pinned) {
            this.addNoteToList(note, this.pinnedNoteList);
        } else {
            this.addNoteToList(note, this.noteList);
        }
    })
  }

  /**
   * TODO : Ajoute une note à une des listes.
   * La note est ajoutée au début ou à la fin de la liste en fonction de l'option de tri choisie dans la page
   * @param {Note} note note à ajouter
   * @param {HTMLElement} listElement liste (Notes Épinglées ou Notes) à modifier
   */
  addNoteToList(note, listElement) {
    if(this.ascendingValueComparer==='newest'){
      listElement.prepend(this.createHTMLNote(note));
    }
    else {
      listElement.append(this.createHTMLNote(note));
    }
  }

  /**
   * TODO : Supprime une note en fonction de son ID et met à jour la vue
   * @param {string} id identifiant de la note
   */
  deleteNote(id) {
    this.storageManager.deleteNoteById(id);
    const updated = this.storageManager.getNotes();
    this.updateListsInterface(updated);
  }

  /**
   * TODO : Modifie l'état épinglé de la note en fonction de son ID et met à jour la vue
   * @param {string} id identifiant de la note
   */
  pinNote(id) {
    this.storageManager.pinById(id);
    const updatedNotes = this.storageManager.getNotes();
    this.updateListsInterface(updatedNotes);
  }

  /**
   * TODO : Supprime toutes les notes du site et met à jour la vue
   */
  deleteAll() {
    this.storageManager.deleteAllNotes();
    this.noteList.innerHTML = '';
    this.pinnedNoteList.innerHTML = '';

    }
}
