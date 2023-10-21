import StorageManager from './storageManager.js';

/**
 * @typedef {import('./utils.js').Note} Note
 */

export default class NoteEditor {
  /**
   * TODO : configurer l'attribut de la classe
   * @param {StorageManager} storageManager gestionnaire du LocalStorage
   */
  constructor(storageManager) {
    this.storageManager = storageManager;
  }

  /**
   * Récupère l'attribut "id" à partir de l'URL de la page
   * @returns {string | null} l'identifiant de la note
   */
  getNoteIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  }

  /**
   * TODO : Affiche les informations de la note en générant le HTML nécessaire.
   * Si l'id dans l'URL est invalide, affiche "La note demandée n'existe pas."
   * La note est récupéré du LocalStorage
   */
  displayNoteDetails() {
    const noteId = this.getNoteIdFromURL();
    const note = this.storageManager.get(noteId);

    if (note) {

      document.getElementById('noteTitle').innerText = note.title;
      document.getElementById('noteContent').innerText = note.content;
      document.getElementById('noteTags').innerText = `Tags: ${note.tags.join(", ")}`;
    }

    else{
      document.body.innerHTML = "La note demandée n'existe pas.";
    }
  }

  /**
   * TODO : Modifie l'état épinglé de la note et la sauvegarde.
   * Modifie l'affichage de l'état épingé dans la page.
   */
  pin() {
    const noteId = this.getNoteIdFromURL();
    let note = this.storageManager.get(noteId);

    if (note){
      note.pinned = !note.pinned;
      this.storageManager.setNotes(noteId, note);
    }
  }

  /**
   * TODO : Affiche une modale de confirmation.
   * Supprime la note si l'utilisateur confirme et redirige vers la page principale.
   */
  delete() {
    if(confirm("Être-vous sûr de vouloir supprimer cette note?")){
      const noteId=this.getNoteIdFromURL();
      this.storageManager.remove(noteId);
      window.location.href = "index.html";
    }
  }
}

/**
 * TODO : Ajoute un gestionnaire de click sur le bouton de sauvegarde.
 * Gère la modification de la note en fonction des éléments HTML modifiés dans la page.
 * @param {NoteEditor} noteEditor gestionnaire d'édition de la note
 * @param {StorageManager} storageManager gestionnaire du LocalStorage
 */
function saveChangesByIdListener(noteEditor, storageManager) {
  const saveButton = document.getElementById('save-button');
  const contentElement = document.getElementById('noteContent');

  saveButton.addEventListener('click', () => {
    const noteId = noteEditor.getNoteIdFromURL();
    let note= storageManager.get(noteId);

    if (note){
      note.content= contentElement.value;
      storageManager.setNotes(noteId,note);
    }

    else{
      alert("La note n'existe pas");
    }
  });
}

/**
 * TODO : Ajoute un gestionnaire pour les événements de clavier pour les raccourcis "P" et "Delete".
 * Les raccourcis sont ignorés si les étiquettes ou le contenu ont le focus de la page.
 * @param {NoteEditor} noteEditor gestionnaire d'édition de la note
 */
function addKeyBoardEvents(noteEditor) {
  document.addEventListener('keydown', (e) => {
    if (e.target.id !== 'noteTags' && e.target.id !== 'noteContent'){
      if (e.key == 'p' || e.key === 'P') {
        noteEditor.pin();
      }

      if (e.key ==='Delete'){
        noteEditor.delete();
      }
    }
  })
}

window.onload = () => {
  const storageManager = new StorageManager();
  const noteEditor = new NoteEditor(storageManager);

  noteEditor.displayNoteDetails();

  saveChangesByIdListener(noteEditor, storageManager);
  addKeyBoardEvents(noteEditor);
}
