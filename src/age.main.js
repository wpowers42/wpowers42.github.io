const age = (birthday) => {
  const then = moment(birthday);
  const now = moment();
  const years = now.diff(then, 'years');
  then.add(years, 'years');
  const months = now.diff(then, 'months');
  then.add(months, 'months');
  const weeks = now.diff(then, 'weeks');
  then.add(weeks, 'weeks');
  const days = now.diff(then, 'days');
  then.add(days, 'days');

  return {
    years,
    months,
    weeks,
    days,
  };
};

const displayAges = () => {
  const people = document.getElementsByClassName('person');
  Array.from(people).forEach((person) => {
    const data = person.dataset;
    const personAge = age(data.birthday);
    Array.from(person.childNodes).forEach((child) => {
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

const appendPerson = (person) => {
  const { name, birthday } = person;
  const people = document.querySelector('.people');
  const personContainer = document.createElement('div');
  personContainer.className = 'person';
  personContainer.setAttribute('data-name', name);
  personContainer.setAttribute('data-birthday', birthday);

  ['name', 'years', 'months', 'weeks', 'days'].forEach((item) => {
    const ageElement = document.createElement('div');
    ageElement.className = item;
    personContainer.append(ageElement);
  });
  const deletePerson = document.createElement('div');
  deletePerson.textContent = 'x';
  deletePerson.className = 'delete-person';
  personContainer.append(deletePerson);
  people.append(personContainer);
  displayAges();
};

const toggleModal = () => {
  const people = document.querySelector('.people');
  people.classList.toggle('blur');
  const modal = document.querySelector('#modal');
  modal.classList.toggle('hidden');
  const element = document.querySelector('#open-modal');
  element.classList.toggle('hidden');
  const navigation = document.querySelector('.navigation-home-container');
  navigation.classList.toggle('hidden');
};

const checkStorage = () => {
  const storage = JSON.parse(localStorage.getItem('storage') || '{}');
  const people = storage.people || [];
  if (people.length) {
    people.forEach((person) => {
      appendPerson(person);
    });
  }
};

const addToStorage = (person) => {
  const storage = JSON.parse(localStorage.getItem('storage') || '{}');
  const people = storage.people || [];
  people.push(person);
  storage.people = people;
  localStorage.setItem('storage', JSON.stringify(storage));
};

const removeFromStorage = (person) => {
  const storage = JSON.parse(localStorage.getItem('storage') || '{}');
  // eslint-disable-next-line max-len
  const people = storage.people.filter((p) => (p.name !== person.name && p.birthday !== person.birthday));
  storage.people = people;
  localStorage.setItem('storage', JSON.stringify(storage));
};

const createPerson = () => {
  const nameElement = document.querySelector('#modal input[name="name"]');
  const birthdayElement = document.querySelector('#modal input[name="birthday"]');
  // TODO: deal with long names
  const name = nameElement.value;
  const birthday = birthdayElement.value;
  if (!name || !birthday) return;
  nameElement.value = '';
  birthdayElement.value = '';
  appendPerson({ name, birthday });
  addToStorage({ name, birthday });
  toggleModal();
};

const deletePerson = (target) => {
  if (target.className === 'delete-person') {
    const parent = target.parentNode;
    const person = {
      name: parent.dataset.name,
      birthday: parent.dataset.birthday,
    };
    removeFromStorage(person);
    parent.remove();
  }
};

const addEventListeners = () => {
  const openModal = document.querySelector('#open-modal');
  openModal.addEventListener('click', toggleModal);

  const closeModal = document.querySelector('#close-modal');
  closeModal.addEventListener('click', toggleModal);

  const submitButton = document.querySelector('#modal input[type="submit"]');
  submitButton.addEventListener('click', createPerson);

  const people = document.querySelector('.people');
  people.addEventListener('click', (event) => deletePerson(event.target));
};

displayAges();
setInterval(() => {
  displayAges();
}, 1000);

checkStorage();
addEventListeners();
