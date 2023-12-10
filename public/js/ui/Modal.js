/**
 * Класс Modal отвечает за
 * управление всплывающими окнами.
 * В первую очередь это открытие или
 * закрытие имеющихся окон
 * */
class Modal {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью Modal.registerEvents()
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    this.element = element;
     
    this.registerEvents();
  }

  get element() {
    return this._element;
  }

  set element(value) {
    if (value.length === 0) {
      console.log("модальное окно не существует");
      return;
    }
    this._element = value;
  }

  /**
   * При нажатии на элемент с data-dismiss="modal"
   * должен закрыть текущее окно
   * (с помощью метода Modal.onClose)
   * */
  registerEvents() {
    const closeElements = this.element.querySelectorAll("button[data-dismiss='modal']");
        
    closeElements.forEach( elem => {
      elem.addEventListener('click', e => this.onClose(e));
    });
  }

  /**
   * Срабатывает после нажатия на элементы, закрывающие окно.
   * Закрывает текущее окно (Modal.close())
   * */
  onClose(e) {
    e.preventDefault();
    this.close();
  }
  /**
   * Открывает окно: устанавливает CSS-свойство display
   * со значением «block»
   * */
  open() {
    this.element.setAttribute('style', 'display: block');
  }
  /**
   * Закрывает окно: удаляет CSS-свойство display
   * */
  close(){
    this.element.removeAttribute('style');
  }
}