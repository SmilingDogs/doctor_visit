import Card from './Card.js';

export default class Filter {
  constructor(token, cardsUrl) {
    this.token = token;
    this.cardsUrl = cardsUrl;
  }
  _renderFilterCard(data) {
    const root = document.getElementById('root');
    const lenghtRoot = root.childNodes.length;
    
    for (let i = 0; i < lenghtRoot; i++) {
      root.childNodes[0].remove()
      console.log(1);
    }

    for (const iterator of data) {
      const card = new Card(iterator.id, iterator.content);
      card.cardsBtnHandler();
      root.append(card.cardItem)
    }
  }
  _filterData(data) {
    let flData = [];
    const titleSearch = document.getElementById('search-title')
    const status = document.getElementById('status-select')
    const urgency = document.getElementById('urgency-select');
    let i = 0;
    data.forEach(element => {
      const content = element.content;
      if (
          (urgency.value === content.priority ||
            urgency.value === 'Все') &&
          (status.value === content.status ||
            status.value === 'Все') &&
          (content.description.includes(titleSearch.value) ||
        content.description.includes(titleSearch.value))
      ) {
        flData[i] = element;
      }
      i++
    });
    return flData
  }
  getAllCard() {
    const filterData = this._filterData;
    const renderFilterCard = this._renderFilterCard;
      axios
        .get(this.cardsUrl, {
          headers: {"Authorization": "Bearer " + this.token}
        })
        .then(function (response) {
          const data = filterData(response.data);
          renderFilterCard(data);
          return response.data
      })
      .catch(function (error) {
        console.log(error);
      });
    }
};
