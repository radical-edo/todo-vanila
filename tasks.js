// definiujemy funckje `init`
var init = function () {
  // wyszukujemy w HTMLu obiektu o id `toDoForm`
  var toDoForm = document.getElementById('toDoForm');
  // jezeli jest, to wartosc `toDoForm` bedzie elementem HTML
  var taskList = document.getElementById('taskList');
  
  taskList.addEventListener('click', function (ev) {
    ev.preventDefault();
    var element = ev.target;
    if (element.tagName.toLowerCase() === 'button') {
      var id = ev.target.dataset.id;
      removeTaskFromUserTasks(id);
      //removeTaskFromDatabase(id);
      showTasks();
    }
  });
  
  var removeTaskFromUserTasks = function (id) {
    var tempArr = [];
    for (var i = 0; i < userTasks.length; ++i) {
      var task = userTasks[i];
      if (id !== task.id) {
        tempArr.push(task);
      }
    }
    userTasks = tempArr;
  };
  
  window.addIdsToDatabase = function () {
    for (var i = 0; i < window.cache.tasks.length; ++i) {
      var task = window.cache.tasks[i];
      task.id = generateId();
    }
    localStorage.setItem('tasks', JSON.stringify(window.cache.tasks));
  };

  // definiujemy obiekt cacheujacy, ktory bedzie ptrzetzymywal obecny stan naszej bazy danych
  window.cache = {
    currentUser: window.helpers.fetchFromDatabase('currentUser', {}), // obecny uzytkownik
    tasks: window.helpers.fetchFromDatabase('tasks', []) // lista taskow
  };

  var userTasks = []; // lista taskow nalezacnych do obecnego uzytkowniaka
  var tasks = window.cache.tasks;
  for (var i = 0; i < tasks.length; ++i) { // iterjmey przez cala liste taskow
    var task = tasks[i];
    if (task.owner.email === window.cache.currentUser.email) {
      // jezeli task ma pod polem
      // `owner.email` wartosc rowna `currentUser.email` tzn. ze task nalezy do uzytkownika
      userTasks.push(task); // dodajmy task do tablicy uzytkownikow
    }
  }

  // na aszym formularzu zakladamy event Listner gdzie nasluchujemy na event `submit`
  toDoForm.addEventListener('submit', function (e) {
    e.preventDefault(); // zatrzymujey domyslne zachowanie formularza
    var titleElement = document.getElementById('formTitle'); // wybieramy element, ktory zawiera wartosc `title` 
    var priorityElement = document.getElementById('formPriority'); // wybieramy element, ktory zawiera wartosc `priority`
    var task = createNewTask(titleElement.value, priorityElement.value); // tworzymy nowy `task`
    // funckcja createNewTask zwraca albo wartosc `null`, jezeli
    // podano niepoprawne wartosci, jezeli podano poprawne wartosci
    // to funkcja ta zwroci nowy obiekt `task`
    if (task == null) {
      // jezeli task nie stworzony to nic nie robimy
    } else {
      save(task); // jezeli `task` istnieje, to zapisjuemy do bazy 
      showTasks(); // wyswieltalmy liste taskow
      titleElement.value = ""; // usuwamy wprowadzonwa wartosc `title` z `input`a
    }
  });

  // funkcja tworzy nowy task na podstawie podanego tytulu
  // oraz priorytetu
  var createNewTask = function (title, priority) {
    var task = null;
    if (title) { // obiekt `task` jest poprawny w momencie gdy podano jego `title`, zawsze title bedzie stirngiem
      task = {
        id: generateId(),
        title: title
        , priority: Number(priority), // kowertujemy nasz priorytet do liczby, gdyz jest stringiem
        owner: window.cache.currentUser // przypisujemy do taska jego obecnego uzytkowniak, to nam posluzy do filtracji taskow (opisane wyzej)
      };
    }
    return task; // zwrracamy wartosc spod zmiennej `task`, ktora albo bedize `null` albo obiket `task`
  };

  // zapisujemy do bazy danych nasz obiekt `task` stworzony przez funkcje `createNewTask`
  var save = function (task) {
    userTasks.push(task);
    window.cache.tasks.push(task); // najpierw trzeba dodac do tablicy przetrzymywanej w pamieci nowy task
    localStorage.setItem('tasks', JSON.stringify(window.cache.tasks)); // zapisujemy wszystkie taski do bazy danych
  };
  
  // funkcja wystwietlajaca taski w przegladrce
  var showTasks = function () {
    // przypisujemy element `tasksList` do zmiennej `taskList`
    var tasksList = document.getElementById('taskList');
    tasksList.innerHTML = ""; // czyscimy zwartosc calej listy
    
    for (var i = 0; i < userTasks.length; ++i) {
      var task = userTasks[i]; // przpisujemy sobie obecny taks do zmiennej pomocniczej `task`
      var taskItem = document.createElement('li'); // tworzymy nowy element html `li`
      taskItem.className = 'tasks-list-item'; // nadajemy mu klase `tasks-list-item`
      appendSpanElement(taskItem, task.title); // wywolujemy funkcje `appendSpanElement`
      appendSpanElement(taskItem, task.priority, 'tasks-item-priority'); // wywolujemy funkcje `appendSpanElement`
      console.log(task)
      addDeleteButton(taskItem, task.id);
      tasksList.appendChild(taskItem); // dodajemy nasz element `li` do listy taskow
    }
  };

  // parent - element `li`
  // id - indeks tablicy
  var addDeleteButton = function (parent, id) {
    var btn = document.createElement('button');
    btn.setAttribute('data-id', id);
    btn.textContent = 'Remove';
    parent.appendChild(btn);
  };

  var generateId = function () {
    return (Date.now()/1000 + Math.random()).toString(36);
  };

  // przyjmuje 3 parametry
  // parent - okresla rodzica do ktorego beda dodawane nowe elementy
  // content - zwawartosc nowego element
  // className - opcjonalny parametr okreslajacy klase `span`
  var appendSpanElement = function (parent, content, className) {
    var span = document.createElement('span'); // tworzymy element `span`
    span.textContent = content; // okreslamy jego zawartosc
    if (className) {
      // jezeli podano kalse
      span.className = className; // to ustawiwamy na elemencie klase
    }
    parent.appendChild(span); // dopisujemy do rodzica nowe dziecko (do `li` dodajemy `span`)
  };

  // wywolujemy funkcje `showTasks`
  showTasks();

  console.log(window.cache);
};

// wywolujemy funkcje `init`
init();