
import { createNoteObject } from './utils.js';

/**
 * @typedef {import('./utils.js').Note} Note
 */

export default class MainPageEventsController {
  constructor(noteLibrary) {
    this.noteLibrary = noteLibrary;
  }

  /**
   * TODO : Ouvre la modale du formulaire de création
   */
  openModalListener() {
    const createNoteButton = document.getElementById('createNoteButton');
    const modal = document.getElementById('createNoteModal');
    
    createNoteButton.addEventListener('click', () => {
      modal.showModal();
    });

  }

  /**
   * TODO : Ferme la modale du formulaire de création
   */
  closeModalListener() {
    const modal = document.getElementById('closeModal');
    const closeModal = document.getElementById('createNoteModal');

    modal.addEventListener('click', () => {
      closeModal.close();
    });
  }

  /**
   * TODO : Gère l'événement de la soumission du formulaire.
   * Sauvegarde la nouvelle note et met à jour le rendu de la page
   */
  submitListener() {
    const form = document.getElementById('noteForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = this.getNoteDetailsFromModal();
      this.noteLibrary.storageManager.saveNote(note);
      this.noteLibrary.updateListsInterface(this.noteLibrary.storageManager.getNotes());
      document.getElementById('createNoteModal').close();
    });
    
  }

  /**
   * TODO : Récupère les informations du formulaire et génère un objet Note
   * @returns {Note} la note définie dans le formulaire
   */
  getNoteDetailsFromModal() {
    const title = document.getElementById('titleInput').value;
    const content = document.getElementById('contentInput').value;
    const tags = document.getElementById('tagsInput').value.split(',').map(tag => tag.trim());
    const color = document.getElementById('colorInput').value;
    const pinned = document.getElementById('pinnedInput').checked;
    return createNoteObject(title, content, tags, color, pinned);

  }

  /**
   * TODO : Trie les notes dans la page en fonction de l'option choisie dans le menu déroulant
   */
  sortListener() {
    const sortSelector = document.getElementById('sortSelector');
    sortSelector.addEventListener('change', () => {
      this.noteLibrary.ascendingValueComparer = sortSelector.value;
      const notes = this.noteLibrary.storageManager.getNotes();
      this.noteLibrary.updateListsInterface(notes);
    });
  }

  /**
   * TODO : Gère l'événement de click pour la suppression de toutes les notes
   */
  deleteAllListener() {
    const deleteAllButton = document.getElementById('delete-all-button');
    deleteAllButton.addEventListener('click', () => {
      this.noteLibrary.deleteAll();
    });
  }

  /**
   * TODO : Gère les événements de clavier pour les raccourcis "P" et "Delete"
   * Les événements sont ignorés s'il n'y a pas de note sélectionnée
   */
  addKeyBoardEvents() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Delete') {
        if (this.noteLibrary.selectedNote) {
          const id = this.noteLibrary.selectedNote.getAttribute('data-id');
          this.noteLibrary.deleteNote(id);
        }
      }
      if (e.key === 'P' || e.key === 'p') {
        if (this.noteLibrary.selectedNote) {
          const id = this.noteLibrary.selectedNote.getAttribute('data-id');
          this.noteLibrary.pinNote(id);
        }
      }
    });
    
  }
  
  /**
   * TODO : Configure la gestion de la modale et formulaire de création
   */
  manageModal() {
    this.openModalListener();
    this.closeModalListener();
    this.submitListener();
  }

  listenToAllEvents() {
    this.manageModal();
    this.addKeyBoardEvents();
    this.deleteAllListener();
    this.sortListener();
  }
}
