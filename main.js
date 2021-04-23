(() => {
  const container = document.getElementById('main');
  const refreshButton = document.getElementById('refresh');
  const restartButton = document.getElementById('restart');
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

    if (index % 9 !== selected % 9) return false;

    for (let i = start + 9; i < end; i += 9) {
      if (list[i] !== -1) return false;
    }

    clear(index);
    return true;
  }

  function clear(index) {
    list[index] = -1;
    list[selected] = -1;
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
    const element = document.createElement('div', );
    element.classList.add('item');
    element.innerText = num;
    element.setAttribute('index', index.toString());
    hash[index] = element;
    container.appendChild(element);
  }

  function init() {
    for (let i = 0; i < defaultList.length; i++) {
      add(defaultList[i]);
    }
  }

  function refresh() {
    const n = list.length;

    for (let i = 0; i < n; i++) {
      if (list[i] !== - 1) {
        add(list[i]);
      }
    }
  }

  function restart() {
    window.localStorage.setItem('cross-digits', '');
    window.location.reload();
  }

  function updateHistory() {
    history.push([...list]);
    window.localStorage.setItem('cross-digits', JSON.stringify(history[history.length - 1]));
  }
})();
