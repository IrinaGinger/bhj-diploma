/**
 * Класс AsyncForm управляет всеми формами
 * приложения, которые не должны быть отправлены с
 * перезагрузкой страницы. Вместо этого данные
 * с таких форм собираются и передаются в метод onSubmit
 * для последующей обработки
 * */
class AsyncForm {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
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
      console.log("форма не существует");
      return;
    }
    this._element = value;
  }


  /**
   * Необходимо запретить отправку формы и в момент отправки
   * вызывает метод submit()
   * */
  registerEvents() {
    this.element.addEventListener('submit', (event) => {
      try {
        event.preventDefault();
        this.submit();
      }
      catch (err) {
        console.log('ошибка отправки: ', err);           // ???????????????
      }

    })
  }

  /**
   * Преобразует данные формы в объект вида
   * {
   *  'название поля формы 1': 'значение поля формы 1',
   *  'название поля формы 2': 'значение поля формы 2'
   * }
   * */
  getData() {
    const formData = new FormData(this.element),
          entries = formData.entries();

    let dataObject = {};

    for (let item of entries) {
      const key = item[0],
            value = item[1];
      dataObject[key] = value;
    }

    return dataObject;
  }

  onSubmit(options){

  }

  /**
   * Вызывает метод onSubmit и передаёт туда
   * данные, полученные из метода getData()
   * */
  submit() {
    let data = this.getData();
    console.log('получены данные в классе AsyncForm', data);

    this.onSubmit(data);
  }
}