/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)

    this.renderAccountsList();    
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(User.current(), ( err, response ) => {
      if (err) {
        console.log('ошибка получения списка счетов: ', err);
        return;
      }

      if (!response.success) {
        return;
      } 
      
      const transactionType = this.element.getAttribute('id').slice(4, -5);
      const selectAccountListElement = document.querySelector(`#${transactionType}-accounts-list`);
      selectAccountListElement.innerHTML = '';

      response.data.forEach(elem => {
        selectAccountListElement.insertAdjacentHTML('beforeEnd', 
          `<option value="${elem.id}">${elem.name}</option>`
        );
      });
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, ( err, response ) => {
      if (err) {
        console.log('ошибка создания транзакции: ', err);
        return;
      }

      if (!response.success) {
        alert(response.error);
        return;
      }

      const formId = this.element.getAttribute('id').slice(4, -5);
      const formType = 'new' + formId.substring(0, 1).toUpperCase() + formId.substring(1);
    
      App.getModal(formType).close();
      this.element.reset();
      App.update();
    });
  }
}