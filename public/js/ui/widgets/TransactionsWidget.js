/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    this.element = element;
   
    this.registerEvents();
  }
  
  get element() {
    return this._element;
  }

  set element(value) {
    if (!value) {
      throw new Error("элемент не существует");
    } else {
      this._element = value;
    }
  }

  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const createIncomeButton = document.querySelector('.create-income-button');
    const createExpenseButton = document.querySelector('.create-expense-button');

    createIncomeButton.addEventListener('click', () => {
      App.getModal('newIncome').open();
    })

    createExpenseButton.addEventListener('click', () => {
      App.getModal('newExpense').open();
    })
  }
}
