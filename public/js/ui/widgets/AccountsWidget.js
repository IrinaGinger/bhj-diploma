/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    this.element = element;
   
    this.registerEvents();
    this.update();
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
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const accountsPanel = document.querySelector('.accounts-panel');
    const createAccountElement = document.querySelector('.create-account');

    accountsPanel.addEventListener('click', (event) => {
      let accountElements = Array.from(document.getElementsByClassName('account'));

      if (event.target.closest('.create-account') === createAccountElement) {
        App.getModal('createAccount').open();
      }

      for (let item of accountElements) {
        if (event.target.closest('.account') === item) {
          event.preventDefault();
          this.onSelectAccount(item);
        }
      }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    let currentUser = User.current();
    
    if (currentUser !== null) {
      Account.list(currentUser, ( err, response ) => {
        if (err) {
          console.log('ошибка обновления списка счетов: ', err);
          return;
        }

        this.clear();
        response.data.forEach(elem => {
          this.renderItem(elem);             
        }); 
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    let accountElements = Array.from(document.getElementsByClassName('account'));
    
    for (let item of accountElements) {
      item.remove();
    }
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    if (!element.classList.contains('active')) {
      const currentActiveAccount = document.querySelector('.active');
      
      if (currentActiveAccount) {
        currentActiveAccount.classList.remove('active');
      }
                                    
      element.classList.add('active');
    }

    App.showPage( 'transactions', { account_id: element.dataset.id });                             
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    return `<li class="account" data-id=${item.id}>
              <a href="#">
                <span>${item.name}</span> /
                <span>${item.sum}</span>
              </a>
            </li>`;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    let accountHtml = this.getAccountHTML(data);
    this.element.insertAdjacentHTML('beforeEnd', accountHtml);
  }
}
