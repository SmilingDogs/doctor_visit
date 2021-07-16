"use strict"

import Enter from './components/Enter.js';
import Visit from './components/Visit.js';
import Filter from './components/Filter.js';

const body = document.body;

const token = localStorage.getItem('myToken');

const enterSite = document.getElementById('enter');
const createVisit = document.getElementById('create-visit');
const search = document.getElementById('search-btn');


const modalEnter = new Enter('enter-form', ['form__enter', 'form']);
modalEnter.checkLoginUser(token);

const loginBtn = modalEnter.loginBtn;
loginBtn.addEventListener('click', function () { modalEnter.clickLogin(); })

enterSite.addEventListener('click', function () {
  if (enterSite.textContent === 'Выйти') {
  localStorage.removeItem("myToken");
  location.reload();
  }
    if (enterSite.textContent === 'Войти') {
  modalEnter.removeBtnHandler();
  body.append(modalEnter.wrapper);
  }
})

createVisit.addEventListener('click', function () {
  const formRender = new Visit('clear-form', ['form__create-vis', 'form']);
  formRender.removeBtnHandler();
  formRender.postBtnHandler();
  body.append(formRender.wrapper);

  const doctorSelect = document.getElementById('doctors');

  doctorSelect.addEventListener('change', (event) => {
    if (event.target.value === 'Стоматолог') {
      formRender.dentistFormBuilding()
    };
    if (event.target.value === 'Кардиолог') {
      formRender.cardiologistFormBuilding()
    };
    if (event.target.value === 'Терапевт') {
      formRender.therapistFormBuilding()
    };
  })
})


const fiter = new Filter(token, 'https://ajax.test-danit.com/api/cards/');

search.addEventListener('click', () => {
  fiter.getAllCard()
})
