'use strict';

var age = function age(birthday) {
  var then = moment(birthday);
  var now = moment();
  var years = now.diff(then, 'years');
  then.add(years, 'years');
  var months = now.diff(then, 'months');
  then.add(months, 'months');
  var weeks = now.diff(then, 'weeks');
  then.add(weeks, 'weeks');
  var days = now.diff(then, 'days');
  then.add(days, 'days');
  return {
    years: years,
    months: months,
    weeks: weeks,
    days: days
  };
};

var displayAges = function displayAges() {
  var people = document.getElementsByClassName('person');
  Array.from(people).forEach(function (person) {
    var data = person.dataset;
    var personAge = age(data.birthday);
    Array.from(person.childNodes).forEach(function (child) {
      if (child.className === 'name') {
        // eslint-disable-next-line no-param-reassign
        child.textContent = data.name;
      } else if (child.className === 'delete-person') {
        // eslint-disable-next-line no-useless-return
        return;
      } else {
        // eslint-disable-next-line no-param-reassign
        child.textContent = personAge[child.className];
      }
    });
  });
};

var appendPerson = function appendPerson(person) {
  var name = person.name,
      birthday = person.birthday;
  var people = document.querySelector('.people');
  var personContainer = document.createElement('div');
  personContainer.className = 'person';
  personContainer.setAttribute('data-name', name);
  personContainer.setAttribute('data-birthday', birthday);
  ['name', 'years', 'months', 'weeks', 'days'].forEach(function (item) {
    var ageElement = document.createElement('div');
    ageElement.className = item;
    personContainer.append(ageElement);
  });
  var deletePerson = document.createElement('div');
  deletePerson.textContent = 'x';
  deletePerson.className = 'delete-person';
  personContainer.append(deletePerson);
  people.append(personContainer);
  displayAges();
};

var toggleModal = function toggleModal() {
  var people = document.querySelector('.people');
  people.classList.toggle('blur');
  var modal = document.querySelector('#modal');
  modal.classList.toggle('hidden');
  var element = document.querySelector('#open-modal');
  element.classList.toggle('hidden');
  var navigation = document.querySelector('.navigation-home-container');
  navigation.classList.toggle('hidden');
};

var checkStorage = function checkStorage() {
  var storage = JSON.parse(localStorage.getItem('storage') || '{}');
  var people = storage.people || [];

  if (people.length) {
    people.forEach(function (person) {
      appendPerson(person);
    });
  }
};

var addToStorage = function addToStorage(person) {
  var storage = JSON.parse(localStorage.getItem('storage') || '{}');
  var people = storage.people || [];
  people.push(person);
  storage.people = people;
  localStorage.setItem('storage', JSON.stringify(storage));
};

var removeFromStorage = function removeFromStorage(person) {
  var storage = JSON.parse(localStorage.getItem('storage') || '{}'); // eslint-disable-next-line max-len

  var people = storage.people.filter(function (p) {
    return p.name !== person.name && p.birthday !== person.birthday;
  });
  storage.people = people;
  localStorage.setItem('storage', JSON.stringify(storage));
};

var createPerson = function createPerson() {
  var nameElement = document.querySelector('#modal input[name="name"]');
  var birthdayElement = document.querySelector('#modal input[name="birthday"]'); // TODO: deal with long names

  var name = nameElement.value;
  var birthday = birthdayElement.value;
  if (!name || !birthday) return;
  nameElement.value = '';
  birthdayElement.value = '';
  appendPerson({
    name: name,
    birthday: birthday
  });
  addToStorage({
    name: name,
    birthday: birthday
  });
  toggleModal();
};

var deletePerson = function deletePerson(target) {
  if (target.className === 'delete-person') {
    var parent = target.parentNode;
    var person = {
      name: parent.dataset.name,
      birthday: parent.dataset.birthday
    };
    removeFromStorage(person);
    parent.remove();
  }
};

var addEventListeners = function addEventListeners() {
  var openModal = document.querySelector('#open-modal');
  openModal.addEventListener('click', toggleModal);
  var closeModal = document.querySelector('#close-modal');
  closeModal.addEventListener('click', toggleModal);
  var submitButton = document.querySelector('#modal input[type="submit"]');
  submitButton.addEventListener('click', createPerson);
  var people = document.querySelector('.people');
  people.addEventListener('click', function (event) {
    return deletePerson(event.target);
  });
};

displayAges();
setInterval(function () {
  displayAges();
}, 1000);
checkStorage();
addEventListeners();
