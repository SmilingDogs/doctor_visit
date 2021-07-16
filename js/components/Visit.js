import Form from './Form.js';
import Card from './Card.js';

export default class Visit extends Form {
  constructor(id, className) {
    super(id, className);
    this.token = localStorage.getItem('myToken');
  }
  _renderElementsForm() {
    const doctorArr = [
      {value: "Кардиолог", content: 'Кардиолог'},
      {value: "Стоматолог", content: 'Стоматолог' },
      {value: "Терапевт", content: 'Терапевт'},
    ]
    const urgency = [
      {value: "Обычный", content: 'Обычный' },
      {value: "Приоритетный", content: 'Приоритетный'},
      {value: "Неотложный", content: 'Неотложный'},
    ]

    const doctorSelect = this._createSelect(doctorArr, 'doctors');
    const purpose = this._createInput('form-input', 'visitTarget', "text", "visitTarget", "Цель визита", true);
    const desc = document.createElement('textarea');
    desc.setAttribute("placeholder", 'Краткое описание визита');
    desc.classList.add('form-textarea');
    desc.setAttribute("name", 'description');
    desc.id = 'description';

    const priority = this._createSelect(urgency, 'priority');
    priority.id = 'priority';

    const dateLastVisit = this._createInput('form-input', 'lastvisit', "text", "lastvisit", "Дата последнего посещения", false);
    const pressure = this._createInput('form-input', 'bloodPress', "text", "bloodPress", "Обычное давление", false);
    const massIndex = this._createInput('form-input', 'bodyWeight', "text", "bodyWeight", "Индекс массы тела", false);
		const diseases = this._createInput('form-input', 'heartIllnesses', "text", "heartIllnesses", "Перенесенные заболевания сердечно-сосудистой системы", false);
    const age = this._createInput('form-input', 'age', "text", "age", "Возраст", false);
    const fullName = this._createInput('form-input', 'fullName', "text", "fullName", "ФИО", true);
    const createBtn = this._createSubmit('Создать', 'btn-send')
    createBtn.classList.add('form-btn')
    this.createBtn = createBtn;

    const elements = [
      doctorSelect,
      purpose,
      desc,
      priority,
      dateLastVisit,
      pressure,
      massIndex,
      diseases,
      age,
      fullName,
      createBtn]

    elements[4].classList.add('not-active');

		return elements;
  }
  dentistFormBuilding() {
    this.formElements.forEach(e => {
      e.classList.remove('not-active');
    });
    this.formElements[5].classList.add('not-active');
    this.formElements[6].classList.add('not-active');
    this.formElements[7].classList.add('not-active');
    this.formElements[8].classList.add('not-active');
  }
  cardiologistFormBuilding() {
    this.formElements.forEach(e => {
      e.classList.remove('not-active');
    });
    this.formElements[4].classList.add('not-active');
  }
  therapistFormBuilding() {
    this.formElements.forEach(e => {
      e.classList.remove('not-active');
    });
    this.formElements[4].classList.add('not-active');
    this.formElements[5].classList.add('not-active');
    this.formElements[6].classList.add('not-active');
    this.formElements[7].classList.add('not-active');
  }
  _collectorCard() {
    const visitData = {};
    this.formElements.forEach(element => {
      if (element.className.includes('not-active') || element.className.includes('form-btn')) {
        return
      } else {
        visitData[element.id] = element.value;
      }
    });
    return visitData
  }
  _postCard(data) {
    const root = document.getElementById('root');
    const titleRoot = document.querySelector('.root__title-empty');

    axios ({method: 'post',
    url: "https://ajax.test-danit.com/api/cards",
    data,
    headers: {
			"Content-type": "application/json; charset=UTF-8",
			"Authorization": "Bearer " + this.token
		},
    })
    .then(function (response) {
      const visitCard = new Card(response.data.id, response.data.content);
      visitCard.cardsBtnHandler();
      root.append(visitCard.cardItem);
      titleRoot.remove();

			localStorage.setItem(`card-${response.id}`, response.id);
      return response.data
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  _editCard(data, editId) {
    const root = document.getElementById('root');

    axios ({method: 'put',
    url: "https://ajax.test-danit.com/api/cards/" + editId,
    data,
    headers: {
			"Content-type": "application/json; charset=UTF-8",
			"Authorization": "Bearer " + this.token
		},
    })
      .then(function (response) {
      console.log(response);
      const delCard = document.getElementById(`card-${data.id}`)
      delCard.remove();
      
      const visitCard = new Card(response.id, response.content);
      visitCard.cardsBtnHandler();
      root.append(visitCard.cardItem);
      
			localStorage.setItem(`card-${response.id}`, response.id);
      return response.data
    })
    .catch(function (error) {
      console.log(error.message);
    });
  }
  postBtnHandler(editId) {
    this.createBtn.addEventListener('click', () => {
      const dataCard = this._collectorCard();
      if (this.createBtn.value === "Создать" && dataCard.fullName && dataCard.visitTarget) {
        this._postCard(dataCard);
      }
      if (this.createBtn.value === "Изменить" && dataCard.fullName && dataCard.visitTarget) {
        const dataCard = this._collectorCard();
        this._editCard(dataCard, editId)
      }
    })
  }
};
