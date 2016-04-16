var init = function () {
  'use strict';
  var asd = document.getElementById('registerForm');

  window.cache = window.helpers.fetchFromDatabase('users', []);

  asd.addEventListener('submit', function (e) {
    e.preventDefault();
    var emailEl = document.getElementById('formEmail');
    var passwordEl = document.getElementById('formPassword');
    var passwordConfirmationEl = document.getElementById('formPasswordConfirmation');
    //var info = checkIfPresent(emailEl.value, 'Email');
    // if (info) {
    //   showMessage(info);
    //   return ;
    // }
    // info = checkIfPresent(passwordEl.value, 'Haslo');
    // if (info) {
    //   showMessage(info);
    //   return ;
    // }
    // info = checkIfPresent(passwordConfirmationEl.value, 'Potwierdzenie hasla');
    // if (info) {
    //   showMessage(info);
    //   return ;
    // }
    // info = checkIfPasswordMatch(passwordEl.value, passwordConfirmationEl.value);
    // if (info) {
    //   showMessage(info);
    //   return ;
    // }
    var info = checkPasswordStrength(passwordEl.value);
    if (info) {
      showMessage(info);
      return;
    }
    info = checkAllPresent(emailEl.value, passwordEl.value, passwordConfirmationEl.value);
    if (info) {
      showMessage(info);
      return;
    }
    info = checkIfPasswordMatch(passwordEl.value, passwordConfirmationEl.value);
    if (info) {
      showMessage(info);
      return;
    }

    info = checkIfEmailIsValid(emailEl.value);
    if (info) {
      showMessage(info);
      return;
    }
    save(emailEl.value, passwordEl.value);
  });

  var checkPasswordStrength = function (password) {
    if (password.length < 8) {
      return 'Haslo musi posiadac przynajmniej 8 znakow';
    }
    var bigLetterCount = 0;
    for (var i = 1; i < password.length - 1; ++i) {
      var code = password.charCodeAt(i);
      if (code >= 65 && code <= 90) {
        ++bigLetterCount;
      }
    }
    if (bigLetterCount < 2) {
      return 'Haslo musi posiadac przynajmniej dwie wielkie litery, ale nie na poczatku ani na koncu.'
    }
    var numberCount = 0;
    var numberAtEnd = 0;
    for (var i = 0; i < password.length; ++i) {
      if (isNumber(password[i])) {
        ++numberCount;
        if (i === 0 || i === password.length - 1) {
          ++numberAtEnd
        }
      }
    }
    if (numberCount < 2 || numberAtEnd === 2) {
      return 'Haslo musi przynajmniej posiadac dwie liczby, ale tylko jedna moze byc na poczatku albo na koncu.'
    }
    return '';
  };

  var isNumber = function (a) {
    return Number(a) === Number(a);
  };

  var save = function (email, password) {
    var user = {
      email: email
      , password: password
    };
    var userExists = false;
    for (var i = 0; i < cache.length; ++i) {
      if (!userExists) {
        userExists = cache[i].email === email;
      }
    }
    if (userExists) {
      showMessage('Uzytkownik juz istnieje');
    } else {
      cache.push(user);
      localStorage.setItem('users', JSON.stringify(cache));
      navigateToLoginPage();
      showMessage('Stworzono nowego uzytkownika');
    }
  };
  var navigateToLoginPage = function () {
    var loginPage = document.getElementById('goToLogin');
    loginPage.click();
  };

  var showUser = function (user) {
    var userList = document.getElementById('userList');
    var li = document.createElement('li');
    li.textContent = user.email;
    userList.appendChild(li);
  };

  var checkIfEmailIsValid = function (email) {
    // var textMessage = 'Email nie jest poprawny';
    // for (var i = 0; i < email.length; i++) {
    //   var letter = email[i];
    //   if (letter === '@') {
    //     textMessage = '';
    //   }
    // }
    // return textMessage;
    if (email.indexOf('@') !== -1) {
      return ''
    } else {
      return 'Email nie jest poprawny';
    }
  };

  var checkIfPasswordMatch = function (password, passwordConfimation) {
    if (password !== passwordConfimation) {
      return 'Hasla sie roznia'
    }
    return '';
  };

  var checkIfPresent = function (str, context) {
    if (str) {
      return '';
    } else {
      return context + ' musi byc podany';
    }
  };

  var showMessage = function (textMessage) {
    var message = document.getElementById('message');
    message.textContent = textMessage;
  };

  var checkAllPresent = function (email, password, passwordConfimation) {
    if (!email) {
      return 'Email musi byc podany';
    }
    if (!password) {
      return 'Haslo musi byc podane';
    }
    if (!passwordConfimation) {
      return 'Potwierdzenie hasla musi byc podane';
    }
    return '';
  };
};


init();