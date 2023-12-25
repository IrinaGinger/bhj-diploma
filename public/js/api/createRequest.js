/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  let formData;
  let optionUrl = options.url;
  
  if (options.method === 'GET') {
    if (options.data) {
      optionUrl = optionUrl + '?';
      for (key in options.data) {
        optionUrl = optionUrl + key + '=' + options.data[key] + '&';
      }
      optionUrl = optionUrl.slice(0, -1);
    }
  } else {
    formData = new FormData();

    if (options.data) {
      for (key in options.data) {
        formData.append(key, options.data[key]);
      }
    }
  }  
       
  try {
    xhr.open(options.method, optionUrl);
    xhr.send(formData);
  }
  catch (e) {
    options.callback(e);
  }

  xhr.addEventListener('load', () => {     
    options.callback(null, xhr.response);
  })
}
