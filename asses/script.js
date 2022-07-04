window.onload = () => {
    setTimeout(getData, 200);
}

const shoppingCartContent = document.querySelector("#cart-content tbody"),
  clearCartBtn = document.querySelector("#clear-cart");
  console.log(shoppingCartContent, clearCartBtn)

let catalog = [];
let products = [];
let Cor = [];

async function getData() {
    await axios.get(`https://dh.cubicle.53xapps.com/products`).then((response)=>{
        products = response.data;
        console.log(products)
    })

    await axios.get(`https://dh.cubicle.53xapps.com/categories`).then((response) => {
        catalog = response.data;
        console.log(catalog)
    })

    render(products, catalog);
}

function render(list, catalog) {

    const blocks = document.querySelector('.blocks');
    blocks.innerHTML = "";

    const main = document.createElement('div');
    main.className = "main__container";

    const containerBlockWrap = document.createElement('div');
    containerBlockWrap.className = "container__blockwrap";
    main.appendChild(containerBlockWrap);

    const fragment = document.createDocumentFragment();
    fragment.appendChild(main);
        
        for (let products of list) {

            let category;

            catalog.forEach((element) => {
                if (products.category == element.id) {
                    category = element.title;
                }
            });

            const block = document.createElement('div');
            block.className = "block shadow rounded text-center";

            const html = `<div class="block card" data-id = "${products.id}">
                            <img src="${products.photo}" class = "rounded user-img">
                            <div class="card-body">
                              <h5 class="card-title">${products.title}</h5>
                              <p class="card-text">Категория: ${category}</p>
                              <p class="card-text">description: ${products.description}</p>
                              <p class="card-text">Стоимость: ${products.price}</p>
                              <button class="btn btn-primary giveCount">Добавить в корзину</button>
                            </div>
                          </div>`;

            block.innerHTML = html;

            block.addEventListener('click', (e) => {
                // РЕАЛИЗОВАТЬ БЛОК КОДА ДОБАВЛЕНИЯ В ЛОКАЛ ХРАНИЛИЩЕ ДАННЫЕ ИЗ МАГАЗИНА
                if (event.target.className == "btn btn-primary giveCount") {
                  buyCourse(e);
                  alert(`Товар ${products.title} был добавлен в корзину.`)
                }
            })

            containerBlockWrap.appendChild(block);

        }

    blocks.appendChild(fragment);
}

attachEventListeners();

function attachEventListeners() {
  // Когда добавляются новые курсы

  // Когда нажата кнопка удаления
  shoppingCartContent.addEventListener("click", removeCourse);

  // Кнопка очистить корзину
  clearCartBtn.addEventListener("click", clearCart);

  // Чтение документа
  document.addEventListener("DOMContentLoaded", getFromLocalStorage);
}

function buyCourse(event) {
    // Используйте делегирование, чтобы найти добавленный курс
    if (event.target.className == "btn btn-primary giveCount") {
      // Прочитать стоимость курса
      const course = event.target.parentElement.parentElement;
      // Прочитать значение
      getCourseInfo(course);
    }
}

function getCourseInfo(course) {
    // Создать объект с данными курса
    console.log(course)
    const courseInfo = {
      image: course.querySelector("img").src,
      title: course.querySelector(".card-title").textContent,
      price: course.querySelector(".card-text").textContent,
      id: course.getAttribute("data-id"),
    };
    
    // Вставить в карту покупок
    addIntoCard(courseInfo);
}

function addIntoCard(course) {
    // Создать  <tr>
    const row = document.createElement("tr");
  
    // Создайте шаблон
    row.innerHTML = `
      <tr>
        <td>
          <img src="${course.image}" width=100>
        </td>
        <td>${course.title}></td>
        <td>${course.price}</td>
        <td>
            <a href="#" class="remove" data-id="${course.id}">X</a>
        </td>
      </tr>
    `;
    // Добавить в корзину
    shoppingCartContent.appendChild(row);
  
    // Добавить курс в хранилище
    saveIntoStorage(course);
}

function getCoursesFromStorage() {
    let courses;
  
    // если что-то существует в хранилище, мы получаем значение, в противном случае создаем пустой массив
    if (localStorage.getItem("courses") === null) {
      courses = [];
    } else {
      courses = JSON.parse(localStorage.getItem("courses"));
    }
    return courses;
}

function saveIntoStorage(course) {
    let courses = getCoursesFromStorage();
  
    // добавить курсы в массив
    courses.push(course);
    // поскольку хранилище сохраняет только строки, нам нужно преобразовать JSON в String
    localStorage.setItem("courses", JSON.stringify(courses));
}

function removeCourse(event) {
    let course, courseId; console.log(event.target.classList.contains("remove"));
    if (event.target.classList.contains("remove")) {
      event.target.parentElement.parentElement.remove();
      course = event.target.parentElement.parentElement;
      courseId = course.querySelector("a").getAttribute("data-id");
    }
  
    // удалить из локального хранилища
    removeCourseLocalStorage(courseId);
}


// Очищает корзину
function clearCart() {
    // shoppingCartContent.innerHTML = '';
 
    while (shoppingCartContent.firstChild) {
      shoppingCartContent.removeChild(shoppingCartContent.firstChild);
    }
  
    // Очищение хранилища
    clearLocalStorage();
}
  // Очищает все локальное хранилище
function clearLocalStorage() {
  localStorage.clear();
}
  // Загружается, когда документ готов, и распечатывает курсы в корзину.
  
function getFromLocalStorage() {
    let coursesLS = getCoursesFromStorage();
  
    // ПЕРЕЙТИ по курсам и распечатайте их в корзине
    coursesLS.forEach(course => {
      // Создать <tr>
      const row = document.createElement("tr");
      // Создайте шаблон
      row.innerHTML = `
        <tr>
          <td>
            <img src="${course.image}" width=100>
          </td>
          <td>${course.title}</td>
          <td>${course.price}</td>
          <td>
              <a href="#" class="remove" data-id="${course.id}">X</a>
          </td>
        </tr>
      `;
  
      // Добавить в корзину
      shoppingCartContent.appendChild(row);
  });
}

function removeCourseLocalStorage(id) {
  //получить данные локального хранилища
  let coursesLS = getCoursesFromStorage();

  //пройтись по массиву и найти индекс для удаления
  coursesLS.forEach(function (courseLS, index) {
    if (courseLS.id === id) {
      coursesLS.splice(index, 1);
    }
  });

  // Добавьте остальную часть массива
  localStorage.setItem("courses", JSON.stringify(coursesLS));
}
  

const dropdown = document.querySelector('.dropdown-menu');

dropdown.addEventListener('click', (e) => {
    const category = e.target.dataset.type;

    const child = [...dropdown.children];
    child.forEach(el => el.firstChild.classList.remove('active'));
    e.target.classList.add('active');

    const dropdownTitle = document.getElementById('dropdown-toggle');

    if (category !== 'all') {
        dropdownTitle.textContent = e.target.innerHTML;
    } else{
        dropdownTitle.textContent = 'Все товары'
    }

    filter(category);
})


function filter(id) {
    const filterProducts = products.filter(product => {
        return product.category == id || id === 'Все товары'
    })

    render(filterProducts, catalog)
}

const form = document.forms.search;

form.onsubmit = (e) => {
    e.preventDefault();
    find(e.srcElement[0].value)
}

function find(name) {

    const product = products.find(product => {
        return product.title === name
    }) || products;
    
    console.log(product)
    render([product], catalog);

}