/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  let optionUrl = options.url;
  console.log(optionUrl);                                   // убрать
  console.log(options);                                     // убрать
     
  try {
    if (options.method === 'GET') {
      if (!options.data.email) {
        alert("Не указан Email");
        return;
      }  
        
      optionUrl = optionUrl + '?mail=' + options.data.email + '&password=' + options.data.password;

      xhr.open(options.method, optionUrl);
      xhr.send();

    } else {
      formData = new FormData();

      if (options.data) {
        if (options.data.name) {
          formData.append('name', options.data.name);
        }
        if (options.data.email) {
          formData.append('email', options.data.email);
        }
        if (options.data.password) {
          formData.append('password', options.data.password);  
        }
      }
          
      xhr.open(options.method, optionUrl);
      xhr.send(formData);
    }
    
    xhr.addEventListener('load', () => {     // loadend?
        
      if (xhr.status != 200) {               // надо?
        options.callback(err);
        return;
      }
      options.callback(null, xhr.response);
    })

  }
  catch (err) {
    // перехват сетевой ошибки
    options.callback(err);
  }
};

