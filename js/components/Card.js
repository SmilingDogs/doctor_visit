import Visit from './Visit.js';

export default class Card {
	constructor(id, content){
		this.dataId = id,
		this.contentObj = content,
		this.cardItem = this.renderCard();
	}
	//метод выводящий Карточку на экран
	renderCard() {
		const content = this.contentObj;
		const cardContain = document.createElement('div');
		cardContain.classList.add('card');
		cardContain.id = 'card-' + this.dataId;

		const close = document.createElement("span");
		close.className = "close close-card";
		close.innerHTML = "&times;";
		this.closeBtn = close;

		const fullName = document.createElement('h3');
		fullName.className = "card__full-name";
		fullName.innerHTML = `Пациент:<br>${content.fullName.bold()}`;

		const doctor = document.createElement('p');
		doctor.className = "card__doctors";
		doctor.innerHTML = `Врач: ${content.doctors.bold()}`;

		const btnContain = document.createElement('div')
		btnContain.className = "card__btn-container";

		const editImg = document.createElement('img');
		editImg.setAttribute("src", './img/edit.png');
		editImg.setAttribute("alt", 'edit img');
		editImg.setAttribute("height", '40');
		editImg.classList.add('btn-evt');

		const editBtn = document.createElement('a');
		editBtn.setAttribute("href", '#');
		editBtn.innerHTML = '<br>Редактировать'
		editBtn.classList.add('card__edit-btn', 'btn-evt');
		editBtn.prepend(editImg);
		this.editBtn = editBtn;

		const moreInfo = document.createElement('a');
		moreInfo.setAttribute("href", '#');
		moreInfo.textContent = 'Показать больше';
		moreInfo.classList.add('more-btn', 'btn');
		this.moreBtn = moreInfo;

		btnContain.append(editBtn, moreInfo);
		this.moreInfoBox =	this.renderMoreInfo()
		cardContain.append(close, fullName, doctor, btnContain, this.moreInfoBox)

		return cardContain
	}
	renderMoreInfo() {
		const content = this.contentObj;
		const moreInfoBox = document.createElement('div');
		moreInfoBox.className = "card__more-info";
		const infoList = document.createElement('ul');

		const infoPrior = document.createElement('li');
		if (content.priority === 'Неотложный') {
			infoPrior.innerHTML = `${"Срочность:".bold()}  ${content.priority.fontcolor('red').bold()}`;
		};
		if (content.priority === 'Приоритетный') {
			infoPrior.innerHTML = `${"Срочность:".bold()}  ${content.priority.fontcolor('blue').bold()}`;
		};
		if (content.priority === 'Обычный') {
			infoPrior.innerHTML = `${"Срочность:".bold()}  ${content.priority.fontcolor('green').bold()}`;
		};
		infoList.append(infoPrior);

		const infoDesc = this.renderMoreItem('Краткое описание:', content.description);
		infoList.append(infoDesc);
		
		const infoTarget = this.renderMoreItem('Цель визита:', content.visitTarget);
		infoList.append(infoTarget);

		for (let key in content) {
			if (key == "fullName" || key == "doctors" || key == "priority" || key == "description" || key == "visitTarget") {
				continue;
			}
			if (key == "lastvisit") {
				const infoItem = this.renderMoreItem('Дата последнего визита:', content.lastvisit);
				infoList.append(infoItem);
				continue;
			}
			if (key == "age") {
				const infoItem = this.renderMoreItem('Возраст:', content.age);
				infoList.append(infoItem);
				continue;
			}
			if (key == "heartIllnesses") {
				const infoItem = this.renderMoreItem('Болезни серд-сосуд. системы:', content.heartIllnesses);
				infoList.append(infoItem);
				continue;
			}
			if (key == "bloodPress") {
				const infoItem = this.renderMoreItem('Кровяное давление:', content.bloodPress);
				infoList.append(infoItem);
				continue;
			}
			if (key == "bodyWeight") {
				const infoItem = this.renderMoreItem('Индекс массы тела:', content.bodyWeight);
				infoList.append(infoItem);
			};
		};
		moreInfoBox.append(infoList);
		return moreInfoBox
	};
	renderMoreItem(keyTitle, info) {
		const infoItem = document.createElement('li');
		infoItem.innerHTML = `${keyTitle.bold()} ${info}`;
		return infoItem
	};
	_deleteCard(cardId) {
		const token = localStorage.getItem("myToken");
		const url = 'https://ajax.test-danit.com/api/cards/';
		axios
      .delete(url + this.dataId, {
        headers: {"Authorization": "Bearer " + token}
      })
      .then(function (response) {
				localStorage.removeItem("card-" + cardId)
        return response.data
    })
    .catch(function (error) {
      console.log(error.message);
    });
	}
	changeCard() {
		const content = this.contentObj;
		const body = document.body;
		const formRender = new Visit('clear-form', ['form__change-vis', 'form']);
		body.append(formRender.wrapper);
		formRender.removeBtnHandler();
		formRender.postBtnHandler(this.dataId);

		const sendBtn = document.getElementById('btn-send');
		const doctorSelect = document.getElementById('doctors');

		sendBtn.value = "Изменить";
		if (content.doctors === 'Кардиолог') {
			doctorSelect[0].selected = true;
			formRender.cardiologistFormBuilding()
		}
		if (content.doctors === 'Стоматолог') {
			doctorSelect[1].selected = true;
			formRender.dentistFormBuilding()
		}
		if (content.doctors === 'Терапевт') {
			doctorSelect[2].selected = true;
			formRender.therapistFormBuilding()
		}
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
	}
	cardsBtnHandler() {
		const moreInfoBox = this.moreInfoBox;
		const root = document.getElementById('root');

		this.moreBtn.addEventListener('click', function () {
			moreInfoBox.classList.toggle('box-active');
			if (this.textContent == "Показать больше") {
				this.textContent = "Спрятать";
			} else {
				this.textContent = "Показать больше";
			}
		});

		this.closeBtn.addEventListener('click', () => {
			this._deleteCard(this.dataId);
			const delCard = document.getElementById(`card-${this.dataId}`)
			delCard.remove();
			if (!root.innerHTML) {
				const rootTitleEmpty = document.createElement('h2');
				rootTitleEmpty.classList.add('root__title-empty');
				rootTitleEmpty.textContent = 'Визитов не добавлено';
				root.append(rootTitleEmpty);
			}
		});

		this.editBtn.addEventListener('click', () => {
			this.changeCard()
		});

		const cardItem = this.cardItem;
		const closeBtn = this.closeBtn;
		const moreBtn = this.moreBtn;
		const editBtn = this.editBtn;

		cardItem.onmousedown = function(e) {
			if (e.target != closeBtn ) if (e.target != moreBtn) if (e.target != editBtn) {
				let coords = getCoords(cardItem);
				let shiftX = e.pageX - coords.left;
				let shiftY = e.pageY - coords.top;

				cardItem.style.position = 'absolute';
				document.body.appendChild(cardItem);
				moveAt(e);

				cardItem.style.zIndex = 100; // над другими элементами

				function moveAt(e) {
				cardItem.style.left = e.pageX - shiftX + 'px';
				cardItem.style.top = e.pageY - shiftY + 'px';
				}

				document.onmousemove = function(e) {
				moveAt(e);
				};

				cardItem.onmouseup = function() {
				document.onmousemove = null;
				cardItem.onmouseup = null;
				};
			}
		}
		cardItem.ondragstart = function() {
			return false;
		};

		function getCoords(elem) {
			let box = elem.getBoundingClientRect();
			return {
				top: box.top + pageYOffset,
				left: box.left + pageXOffset
			}
		}
	}
}