export default class Model {
  constructor() {
    this.contacts = [];
  }
  
  getContacts() {
    return this.contacts;
  }
  
  async fetchContacts() {
    try {
      let response = await fetch('/api/contacts');
      this.contacts = await response.json();
      
      if (!response.ok) {
        throw new Error;
      }
    } catch (error) {
      throw error;
    }
  }

  getTags() {
    return this.tags;
  }
  
  compileTags() {
    let tags = [];
    this.contacts.forEach(contact => {
      if (contact.tags) {
        let contactTags = contact.tags.split(',');
        contactTags.forEach(tag => {
          if (tags.indexOf(tag.toLowerCase()) === -1) {
            tags.push(tag.toLowerCase());
          }
        });
      }
    });
    
    this.tags = tags; 
  }
  
  async addContact(formNode) {
    try {
      let formData = new FormData(formNode);
      let object = {};
      formData.forEach((value, key) => object[key] = value);
      let json = JSON.stringify(object);
      
      let response = await fetch(formNode.action, {
        method: formNode.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: json
      });
      
      if (!response.ok) {
        throw new Error;
      }
      
    } catch (error) {
      throw error;
    }
  }
  
  async deleteContact(deleteButtonNode) {
    try {
      let userId = event.target.dataset.id;
      let response = await fetch(`/api/contacts/${userId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error;
      }
    } catch (error) {
      throw error;
    }
  }
  
  async fetchSingleContactInfo(editButtonNode) {
    try {
      let userId = event.target.dataset.id;
      let response = await fetch(`/api/contacts/${userId}`);
      let contact = await response.json();
      return contact;
      
      if (!response.ok) {
        throw new Error;
      }
    } catch (error) {
      throw error;
    }
  }
  
  async updateContact(formNode) {
    try {
      let formData = new FormData(formNode);
      let object = {};
      formData.forEach((value, key) => object[key] = value);
      let json = JSON.stringify(object);
      let url = `${formNode.action}${object['id']}`;

      let response = await fetch(url, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: json
      });
      
      if (!response.ok) {
        throw new Error;
      }
    } catch (error) {
      throw error;
    }
  }
}