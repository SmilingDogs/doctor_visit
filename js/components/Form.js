export default class Form {
  constructor(id, className) {
    this.id = id;
    this.className = className;
    this.formElements = this._renderElementsForm();
    this._closeBtn = null;
		this.wrapper = this.renderModal();
		this.btnEvt = document.getElementsByClassName('btn-evt');
	}
	renderModal() {
		const wrapper = document.createElement('div');
		wrapper.classList.add('modal');

		const close = document.createElement("span");
		close.className = "close";
		close.innerHTML = "&times;";
    this._closeBtn = close;
		const form = this._renderFormVisit();

		wrapper.append(close, form);
		return wrapper;
	}
  _renderFormVisit() {
    const form = document.createElement("form");
		form.classList.add(...this.className);
		form.id = this.id;
    form.setAttribute("action", "#");

    form.append(...this.formElements)
    return form;
  }
  _createSelect(optionArr, id) {
    const select = document.createElement("select");
    for (const i of optionArr) {
      const option = document.createElement('option');
      option.setAttribute("value", i.value);
      option.textContent = i.content;
      select.append(option);
    }
    select.classList.add('form-select')
    select.id = id;
    return select;
  }
	_createInput(className, id, type, name, placeholder, required) {
		const input = document.createElement("input");
		input.setAttribute("type", type);
		input.setAttribute("name", name);
		input.setAttribute("placeholder", placeholder);
		if (required) {
			input.setAttribute("required", required);
    }
    input.classList.add(className);
    input.id = id;
		return input;
  }
  _createSubmit(val, id) {
		const submitBtn = document.createElement("input");
		submitBtn.setAttribute("type", "submit");
    submitBtn.setAttribute("value", val);
    submitBtn.classList.add('btn-evt', 'btn');
    submitBtn.id = id;
		return submitBtn;
  }
  removeBtnHandler() {
		this._closeBtn.addEventListener("click", () => {
      this.wrapper.remove();
    });
    document.addEventListener('click', (evt) => {
      if (evt.target === this.wrapper ||
        this.wrapper.contains(evt.target) ||
        Array.from(this.btnEvt).includes(evt.target))
    {
      return;
    }
      this.wrapper.remove();
    })
  }
};
