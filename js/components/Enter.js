import Form from './Form.js';
import Card from './Card.js';

export default class Enter extends Form {
  constructor(id, className) {
    super(id, className);
    this.loginUrl = "https://ajax.test-danit.com/api/cards/login";
  }
  _renderElementsForm() {
    const email = this._createInput('form-input', 'user-email',  "text", "email", "Введите email", true);
    const pass = this._createInput('form-input', 'user-pass',  "text", "passwords", "Введите пароль", true);
    const enterBtn = this._createSubmit('Войти', 'login');
    enterBtn.classList.add('form-btn');

    this.email = email;
    this.pass = pass;
    this.loginBtn = enterBtn;
    
    const elements = [email, pass, enterBtn]

		return elements;
  }
  _addTitleRoot(arg) {
    if (arg) {
      const rootTitleEmpty = document.createElement('h2');
      rootTitleEmpty.classList.add('root__title-empty');
      rootTitleEmpty.textContent = 'Визитов не добавлено';
      root.append(rootTitleEmpty);
      return
    }
  }
  _getAllCard(token) {
    const url = "https://ajax.test-danit.com/api/cards/";
    const root = document.getElementById('root');
    const addTitleRoot = this._addTitleRoot;
    
    axios
      .get(url, {
        headers: {"Authorization": "Bearer " + token}
      })
      .then(function (response) {
        addTitleRoot(!response.data.length);
        for (const iterator of response.data) {
          const card = new Card(iterator.id, iterator.content);
          card.cardsBtnHandler();
          root.append(card.cardItem)
        }

        return response
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  _checkBtn(token) {
    const enterSite = document.getElementById('enter');
    const createVisit = document.getElementById('create-visit');

    if (!token) {
      enterSite.textContent = 'Войти';
      createVisit.classList.remove('btn-active');
    }
    if (token) {
      enterSite.textContent = 'Выйти';
      createVisit.classList.add('btn-active');
    }
  }
  _login() {
    axios
    .post(this.loginUrl, {
      email: this.email.value,
      password: this.pass.value,
    })
      .then(function (response) {
      if (response.status === 200) {
        localStorage.setItem("myToken", response.data);
        return response.data
      }
    })
    .catch(function (error) {
      console.log(error.message);
    });
  }
  clickLogin() {
    const wrapper = this.wrapper;
    this._login();

    setTimeout(() => {
    const token = localStorage.getItem("myToken");

    this._checkBtn(token);
    this._getAllCard(token);
    }, 200);

    wrapper.remove();
    
  }
  checkLoginUser(token) {
    const root = document.getElementById('root');
    this._checkBtn(token);
    if (token) {
      this._getAllCard(token)
    }
  }
};
