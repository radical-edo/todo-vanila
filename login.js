var init = function () {
  var loginForm = document.getElementById('loginForm');

  window.cache = window.helpers.fetchFromDatabase('users', []);
  
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var formEmail = document.getElementById('formEmail');
    var formPassword = document.getElementById('formPassword');
    var user = findUser(formEmail.value, formPassword.value);
    if (user == null) {
      showMessage('Nie poprawne haslo albo email');
    } else {
      login(user);
      navigateToTasks();
    }
  });
  
  var findUser = function (email, password) {
    var user = null;
    for (var i = 0; i < cache.length; ++i) {
      if (email === cache[i].email && cache[i].password === password) {
        user = cache[i];
      }
    }
    return user;
  };
  
  var login = function (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  };
  
  var navigateToTasks = function () {
    var goToTasks = document.getElementById('goToTasks');
    goToTasks.click();
  };
  
};

init();