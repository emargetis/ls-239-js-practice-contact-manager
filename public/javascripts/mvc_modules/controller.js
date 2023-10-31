export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.loadContactListPage();
    this.bindListeners();
  }
  
  async loadContactListPage() {
    try {
      await this.model.fetchContacts();
      this.view.renderContacts(this.model.getContacts());
  
      this.model.compileTags();
      this.view.renderTagFilter(this.model.getTags());

      this.view.resetForms();
    } catch(error) {
      this.view.displayServerErrorMessage('Cannot get contact list');
    }
  }
  
  bindListeners() {
    document.querySelector('#addContact').addEventListener('click', this.handleAddNewButtonClick.bind(this));
    document.querySelector('#cancelAddContact').addEventListener('click', this.handleCancelButtonClick.bind(this));
    document.querySelector('#newContactForm').addEventListener('submit', this.handleSubmitNewContactButtonClick.bind(this));
    document.querySelector('#newContactForm').addEventListener('change', this.handleFormInputChange.bind(this));
    document.querySelector('#contactList').addEventListener('click', this.routeContactButtonClick.bind(this));
    document.querySelector('#cancelEditContact').addEventListener('click', this.handleCancelButtonClick.bind(this));
    document.querySelector('#editContactForm').addEventListener('submit', this.handleSubmitEditContactButtonClick.bind(this));
    document.querySelector('#editContactForm').addEventListener('change', this.handleFormInputChange.bind(this));
    document.querySelector('#tagFilterDropdown').addEventListener('change', this.handleFilterChange.bind(this));
    document.querySelector('#searchBar').addEventListener('input', this.handleFilterChange.bind(this));
  }
  
  handleAddNewButtonClick(event) {
    event.preventDefault();
    this.view.clearServerErrorMessage();
    
    this.view.showAddNewForm();
  }
  
  handleCancelButtonClick(event) {
    event.preventDefault();
    this.view.clearServerErrorMessage();
    
    this.view.showMain();
    this.view.resetForms();
  }
  
  async handleSubmitNewContactButtonClick(event) {
    event.preventDefault();
    this.view.clearServerErrorMessage();
    
    let newContactForm = document.querySelector('#newContactForm');
    if (this.validateContactFormInput(newContactForm)) return;
    
    try{
      await this.model.addContact(newContactForm);
    } catch(error) {
      this.view.displayServerErrorMessage('Could not add contact. Please try again');
    } finally {
      await this.loadContactListPage();
      this.view.showMain();
    }
  }
  
  validateContactFormInput(form) {
    let inputFields = document.querySelectorAll(`#${form.getAttribute('id')} .inputField`);
    
    let invalidTrigger = false;
    
    inputFields.forEach(inputField => {
      let field = inputField.querySelector('input');
      let fieldError = inputField.querySelector('.errorMessage');
      fieldError.innerHTML = '';
      
      if (field.validity.valueMissing) {
        fieldError.innerHTML = 'Field is required';
        invalidTrigger = true;
      } else if (!field.checkValidity()) {
        fieldError.innerHTML = 'Please format this field properly before submitting.';
        invalidTrigger = true;
      }
    });
    
    return invalidTrigger;
  }
  
  handleFormInputChange(event) {
    if (event.target.tagName === 'INPUT') {
     this.view.removeErrorMessage(event.target);
    }
  }
  
  routeContactButtonClick(event) {
    if (event.target.classList.contains('editContact')) {
      this.handleEditContact(event);
    } else if (event.target.classList.contains('deleteContact')) {
      this.handleDeleteContact(event);
    }
  }
  
  async handleEditContact(event) {
    event.preventDefault();
    this.view.clearServerErrorMessage();
    
    try {
      let contactInfo = await this.model.fetchSingleContactInfo(event.target);
      this.view.populateEditForm(contactInfo);
      this.view.showEditForm();
    } catch(error) {
      this.view.displayServerErrorMessage('Could not edit contact information. Please try again.');
    }
  }
  
  async handleSubmitEditContactButtonClick(event) {
    event.preventDefault();
    this.view.clearServerErrorMessage();
    
    let editContactForm = document.querySelector('#editContactForm');
    if (this.validateContactFormInput(editContactForm)) return;
    
    try {
      await this.model.updateContact(editContactForm);
    } catch(error) {
      this.view.displayServerErrorMessage('Could not update contact. Please try again.');
    } finally {
      await this.loadContactListPage();
      this.view.showMain();
    }
  }
  
  async handleDeleteContact(event) {
    event.preventDefault();
    this.view.clearServerErrorMessage();
    
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await this.model.deleteContact(event.target);
        this.view.removeContactCard(event.target);
      } catch(error) {
        this.view.displayServerErrorMessage('Could not delete contact. Please try again.');
      }
    }
  }
  
  handleFilterChange(event) {
    event.preventDefault();
    this.view.clearServerErrorMessage();
    this.view.applyFilters(document.querySelector('#tagFilterDropdown').value, document.querySelector('#searchBar').value);
  }
  
}