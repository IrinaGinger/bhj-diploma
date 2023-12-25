/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const toggleButton = document.querySelector('.sidebar-toggle');
    const sideBarMini = document.querySelector('.sidebar-mini');

    toggleButton.addEventListener('click', () => {
      sideBarMini.classList.toggle('sidebar-open');
      sideBarMini.classList.toggle('sidebar-collapse');
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const sideButtons = document.getElementsByClassName('menu-item');
    
    for (let item of sideButtons) {
      item.firstElementChild.addEventListener('click', (e) => {
        e.preventDefault();
        
        let classes = item.className.split(' ');
        let typeOfButton = classes.find(elem => elem.includes('menu-item_')).substring(10);
                
        if (typeOfButton === 'logout') {
          User.logout(( err, response ) => {
            if (err) {
              console.log('ошибка выхода: ', err);
              return;
            }
        
            App.setState('init');
          });
        } else {
          App.getModal(typeOfButton).open();
        }
      });
    }

    
  }
}