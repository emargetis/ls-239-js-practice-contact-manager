import debounce from '../other_modules/debounce.js';

export default class View {
  constructor() {
    this.compileTemplates(document.querySelector('#contactCardTemplate'));
    this.contactList = document.querySelector('#contactList');
    this.tagFilterDropdown = document.querySelector('#tagFilterDropdown');
    this.newContactSection = document.querySelector('#newContactSection');
    this.mainSection = document.querySelector('#main');
    this.newContactForm = document.querySelector('#newContactForm');
    this.editContactSection = document.querySelector('#editContactSection');
    this.applyFilters = debounce(this.applyFilters.bind(this), 300);
    this.serverErrorMessage = document.querySelector('#serverErrors');
  }
  
  displayServerErrorMessage(message) {
    this.serverErrorMessage.innerHTML = message;
  }
  
  clearServerErrorMessage() {
    this.serverErrorMessage.innerHTML = '';
  }
  
  renderContacts(contacts) {
    let html = this.contactCardTemplate({contacts});
    this.contactList.innerHTML = html;
  }
  
  renderTagFilter(tags) {
    this.tagFilterDropdown.innerHTML = "";
    let allNode = document.createElement('option');
    allNode.setAttribute("value", "all");
    allNode.innerText = "all";
    this.tagFilterDropdown.appendChild(allNode);
    
    tags.forEach(tag => {
      let newNode = document.createElement('option');
      newNode.setAttribute("value", tag);
      newNode.innerText = tag;
      this.tagFilterDropdown.appendChild(newNode);
    });
  }
  
  compileTemplates(templateNode) {
    this.contactCardTemplate = Handlebars.compile(templateNode.innerHTML);
  }
  
  showAddNewForm() {
    this.newContactSection.classList.replace('hidden', 'visible');
    this.mainSection.classList.replace('visible', 'hidden');
    this.editContactSection.classList.replace('visible', 'hidden');
  }
  
  showMain() {
    this.newContactSection.classList.replace('visible', 'hidden');
    this.mainSection.classList.replace('hidden', 'visible');
    this.editContactSection.classList.replace('visible', 'hidden');
  }
  
  showEditForm() {
    this.newContactSection.classList.replace('visible', 'hidden');
    this.mainSection.classList.replace('visible', 'hidden');
    this.editContactSection.classList.replace('hidden', 'visible');
  }
  
  populateEditForm(contactInfo) {
    this.editContactSection.querySelectorAll('input').forEach(inputField => {
      inputField.value = contactInfo[inputField.name];
    });
  }
  
  resetForms() {
    this.newContactForm.reset();
    document.querySelectorAll('.errorMessage').forEach(errorMessage => {
      errorMessage.innerHTML = "";
    });
  }
  
  removeContactCard(deleteButtonNode) {
    deleteButtonNode.parentElement.remove();
  }
  
  
  applyFilters(tagValue, searchValue) {
    let tagRegex = new RegExp(`(^${tagValue}|,${tagValue},|,${tagValue}$)`, 'gi');
    let searchRegex = new RegExp(`${searchValue}`, 'gi');
    
    document.querySelectorAll('.contactCard').forEach(contactCard => {
      contactCard.classList.replace('hidden', 'visible');
      let fullName = contactCard.querySelector('.contactNameDisplay').innerText;

      if (tagValue === "all") {
        if (!fullName.match(searchRegex)) {
          contactCard.classList.replace('visible', 'hidden');
        }
      } else { 
        if (!contactCard.dataset.tags.match(tagRegex) || !fullName.match(searchRegex)) {
          contactCard.classList.replace('visible', 'hidden');
        }
      }
    });
  }
  
  removeErrorMessage(inputNode) {
    inputNode.parentElement.querySelector('.errorMessage').innerHTML = "";
  }
}
