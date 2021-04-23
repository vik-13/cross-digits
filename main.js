(() => {
  const container = document.getElementById('main');
  const refreshButton = document.getElementById('refresh');
  const restartButton = document.getElementById('restart');
  const backButton = document.getElementById('back');
  const defaultList = [
    1, 2, 3, 4, 5, 6, 7, 8, 9,
    1, 1, 1, 2, 1, 3, 1, 4, 1,
    5, 1, 6, 1, 7, 1, 8, 1, 9
  ];
  const list = [];
  const history = [
    list
  ];
  let hash = {};

  let selected = -1;

  init();

  attachEvents();

  function attachEvents() {
    container.addEventListener('click', (event) => {
      const index = +event.target.getAttribute('index');
      if (selected === - 1) {
        select(index);
      } else {
        check(index);
      }
    });

    refreshButton.addEventListener('click', () => {
      refresh();
    });

    restartButton.addEventListener('click', () => {
      restart();
    });

    backButton.addEventListener('click', () => {
      back();
    });
  }

  function select(index) {
    if (index === -1 || list[index] === -1) return false;
    selected = index;
    hash[selected].classList.add('active');
  }

  function unselect() {
    hash[selected].classList.remove('active');
    selected = -1;
  }

  function check(index) {
    if (index === -1 || list[index] === -1 || selected === index) return false;
    let start = Math.min(selected, index);
    let end = Math.max(selected, index);

    if (list[index] !== list[selected] && list[index] + list[selected] !== 10) {
      unselect();
      return false;
    }

    let horizontal = true;
    for (let i = start + 1; i < end; i++) {
      if (list[i] !== -1) horizontal = false;
    }

    if (horizontal) {
      clear(index);
      return true;
    }

    if (index % 9 !== selected % 9) {
      unselect();
      return false;
    }

    for (let i = start + 9; i < end; i += 9) {
      if (list[i] !== -1) {
        unselect();
        return false;
      }
    }

    clear(index);
    return true;
  }

  function clear(index) {
    list[index] = -1;
    list[selected] = -1;
    updateHistory();
    update(index);
    update(selected);
    unselect();
  }

  function update(index) {
    hash[index].innerText = list[index];
    if (list[index] === -1) {
      hash[index].classList.add('hidden');
    } else {
      hash[index].classList.remove('hidden');
    }
  }

  function add(num) {
    const index = list.length;
    list.push(num);
    const element = document.createElement('div');
    element.classList.add('item');
    if (num === - 1) element.classList.add('hidden');
    element.innerText = num;
    element.setAttribute('index', index.toString());
    hash[index] = element;
    container.appendChild(element);
  }

  function init() {
    let dataSource = defaultList;
    const stored = window.localStorage.getItem('cross-digits');
    if (stored) {
      dataSource = JSON.parse(stored);
    }
    for (let i = 0; i < dataSource.length; i++) {
      add(dataSource[i]);
    }
  }

  function refresh() {
    const n = list.length;

    for (let i = 0; i < n; i++) {
      if (list[i] !== - 1) {
        add(list[i]);
      }
    }

    updateHistory();
  }

  function restart() {
    window.localStorage.setItem('cross-digits', '');
    cleanItems();
    init();
  }

  function updateHistory() {
    console.log(history);
    history.push([...list]);
    window.localStorage.setItem('cross-digits', JSON.stringify(history[history.length - 1]));
  }

  function cleanItems() {
    for (let index in hash) {
      hash[index].remove();
    }
  }

  function back() {
    if (history.length < 2) return false;

    history.pop();
    const previousState = history.pop();
    console.log(previousState);

    window.localStorage.setItem('cross-digits', JSON.stringify(previousState));
    cleanItems();
    init();
  }
})();
