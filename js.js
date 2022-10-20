const searchInput = document.querySelector('.input-search');
const repoContainer = document.querySelector('.container');
const urlBase = 'https://api.github.com';
const regular = /^[a-zA-Zа-яА-ЯЁё]+(?:[\s.-][a-zA-Zа-яА-ЯЁё]+)*$/;

let arrRepo = [];

const debounce = (fn, ms) => {
  let timer;
  return function () {             
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, ms);
  };
};

const getRepositories = async (urlAdres, text) => {
  const url = `${urlAdres}/search/repositories?q=${text}`;
  try {
    const respons = await fetch(url);
    const repositories = await respons.json();
    arrRepo = repositories.items;
    autoComplete(arrRepo);
  } catch (err) {
    throw new Error(err);
  }
};


const validCheck = (reg, text) => {
  return reg.test(text);
};

const onChange = (e) => {
  const valid = validCheck(regular, searchInput.value);

  if (searchInput.value.length < 1) {
    autoComplete();
  }
  if (valid) {
    getRepositories(urlBase, e.target.value);
  }
};

const changeValue = debounce(onChange, 300);

const createElement = (tag, elementClass) => {
  const element = document.createElement(tag);
  if (elementClass) {
    element.classList.add(elementClass);
  }
  return element;
};

const getId = (arr, id) => {
  return arr.filter((e) => e.id === +id);
};

const autoComplete = (arrRepo = []) => {
  const completContainer = document.querySelector('.input-search__list');
  const maxRepo = arrRepo.length > 5 ? 5 : arrRepo.length;
  completContainer.innerHTML = '';
  const repos = arrRepo.slice(0, maxRepo);
  repos.forEach((e) => {
    const repo = createElement('li', 'input-search__item');
    repo.textContent = e.name;
    repo.setAttribute('data-id', e.id); 
    completContainer.append(repo);
  });
};

const resRepo = ({ name, owner, stars }) => {
  const markedContainer = document.querySelector('.marked__list');
  const item = createElement('li', 'marked__item');
  item.innerHTML = `<div class='marked__item-text'>Name: ${name}<br>Owner: ${owner.login}<br>
  Stars: ${stars}</div>
  <button class='delette-btn'></button>
  `;
  markedContainer.append(item);
};

searchInput.addEventListener('keyup', changeValue);

repoContainer.addEventListener('click', (e) => {
  if (e.target.classList.value === 'input-search__item') {
    const repo = getId(arrRepo, e.target.getAttribute('data-id'));
    resRepo(...repo);
    searchInput.value = '';
    autoComplete();
  }

  if (e.target.classList.value === 'delette-btn') {
    e.target.parentNode.remove();
  }
});