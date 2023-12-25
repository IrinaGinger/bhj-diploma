/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    this.element = element;
    this.lastOptions = '';
    
    this.registerEvents();
  }

  get element() {
    return this._element;
  }

  set element(value) {
    if (!value) {
      throw new Error("счет не существует");
    } else {
      this._element = value;
    }
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions !== '') {
      this.render(this.lastOptions);
    } else {
      this.render();
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccountElement = document.querySelector('.remove-account');
    let removeTransactionButtons = Array.from(document.getElementsByClassName('transaction__remove'));
    
    removeAccountElement.addEventListener('click', (e) => {
      e.preventDefault();
      this.removeAccount();
    });

    for (let item of removeTransactionButtons) {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        this.removeTransaction(item.dataset.id);                                            // ??????????? 
      }); 
    }
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions === '') {
      return;
    }

    let answer = confirm("Вы действительно хотите удалить счет?");
    if (answer) {
      Account.remove({ id: this.lastOptions.account_id }, ( err, responseRemove ) => {
        if (err) {
          console.log('ошибка удаления счета: ', err);
          return;
        }

        if (responseRemove.success) {
          this.clear(); 
          App.updateWidgets();
          App.updateForms();
        }
      });
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    let answer = confirm("Вы действительно хотите удалить эту транзакцию?");

    if (answer) {
      Transaction.remove({ id: id }, ( err, responseRemove ) => {
        if (err) {
          console.log('ошибка удаления транзакции: ', err);
          return;
        }
  
        if (responseRemove.success) {
          App.update();
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options) {
      return;
    }

    this.renderTransactions([]);

    this.lastOptions = options;
    
    Account.get(options.account_id, ( err, responseGet ) => {
      if (err) {
        console.log('ошибка получения данных о счете: ', err);
        return;
      }

      this.renderTitle(responseGet.data.name);

      Transaction.list({ account_id: responseGet.data.id }, ( err, responseList ) => {
        if (err) {
          console.log('ошибка получения списка транзакций: ', err);
          return;
        }

        this.renderTransactions(responseList.data);
      });
      
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = '';

  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const accountNameElement = document.querySelector('.content-title');
    accountNameElement.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    let dateForParse;

    if (!date.includes('T')) {
      let dateComponents = date.split(' ');
      dateForParse = dateComponents[0] + 'T' + dateComponents[1];
    } else {
      dateForParse = date.split('.')[0];
    }
    
    let dateObject = new Date(dateForParse);

    let dateFormat = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };
    
    return dateObject.toLocaleString("ru", dateFormat); 
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    let formattedDate = this.formatDate(item.created_at);

    return `<div class="transaction transaction_${item.type} row">
              <div class="col-md-7 transaction__details">
                <div class="transaction__icon">
                    <span class="fa fa-money fa-2x"></span>
                </div>
                <div class="transaction__info">
                    <h4 class="transaction__title">${item.name}</h4>
                    <div class="transaction__date">${formattedDate}</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="transaction__summ">
                  ${item.sum} <span class="currency">₽</span>
                </div>
              </div>
              <div class="col-md-2 transaction__controls">
                  <button class="btn btn-danger transaction__remove" data-id=${item.id}>
                      <i class="fa fa-trash"></i>  
                  </button>
              </div>
            </div>`;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const transactionContent = document.querySelector('.content');

    if (data.length === 0) {
      transactionContent.innerHTML = '';
    }

    for (let item of data) {
      let TransactionHTML = this.getTransactionHTML(item);
      transactionContent.insertAdjacentHTML('beforeEnd', TransactionHTML);
    }
  }
}