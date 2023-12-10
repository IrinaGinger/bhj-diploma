/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.register(data, ( err, response ) => {
      if (err) {
        console.log('ошибка регистрации: ', err);
        return;
      }
    
      this.element.reset();
      App.setState('user-logged');
      console.log(response);                 // убрать

      const currentModal = App.getModal('register');
      currentModal.close();
    });
  }
}

// Регистрирует пользователя через User.register
// При успешной регистрации сбрасывает форму
// При успешной регистрации задаёт состояние App.setState( 'user-logged' ). 
// То есть мы сразу авторизуем пользователя после успешной регистрации.
// Находит окно, в котором находится форма и закрывает его (через метод Modal.close)