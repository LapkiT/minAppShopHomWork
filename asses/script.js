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
                              <button id = "${products.id}" class="btn btn-primary giveCount">Добавить в корзину</button>
                            </div>
                          </div>`;

            block.innerHTML = html;

            block.addEventListener('click', (e) => {
              console.log(e.target.id)
                if (e.target.id == "") {
                  return;
                } else {
                  buyCourse(e.target.id);
                  alert(`Товар ${products.title} был добавлен в корзину.`);
                }
            })

            containerBlockWrap.appendChild(block);

        }

    blocks.appendChild(fragment);
}

attachEventListeners();

function attachEventListeners() {

  shoppingCartContent.addEventListener("click", removeCourse);


  clearCartBtn.addEventListener("click", clearCart);


  document.addEventListener("DOMContentLoaded", getFromLocalStorage);
}

function buyCourse(event) {
      const course = event;

      getCourseInfo(course);
}

function getCourseInfo(course) {

    console.log(course)
    const courseInfo = products.find(el => el.id == course);
    console.log(courseInfo)

    addIntoCard(courseInfo);
}

function addIntoCard(course) {

    const row = document.createElement("tr");

    row.innerHTML = `
      <tr>
        <td>
          <img src="${course.photo}" width=100>
        </td>
        <td>${course.title}></td>
        <td>${course.price}</td>
        <td>
            <a href="#" class="remove" data-id="${course.id}">X</a>
        </td>
      </tr>
    `;

    shoppingCartContent.appendChild(row);
  

    saveIntoStorage(course);
}

function getCoursesFromStorage() {
    let courses;
  

    if (localStorage.getItem("courses") === null) {
      courses = [];
    } else {
      courses = JSON.parse(localStorage.getItem("courses"));
    }
    return courses;
}

function saveIntoStorage(course) {
    let courses = getCoursesFromStorage();
  

    courses.push(course);

    localStorage.setItem("courses", JSON.stringify(courses));
}

function removeCourse(event) {
    let course, courseId; 
    if (event.target.classList.contains("remove")) {
      event.target.parentElement.parentElement.remove();
      course = event.target.parentElement.parentElement;
      courseId = course.querySelector("a").getAttribute("data-id");
    }
  

    removeCourseLocalStorage(courseId);
}



function clearCart() {

 
    while (shoppingCartContent.firstChild) {
      shoppingCartContent.removeChild(shoppingCartContent.firstChild);
    }
  

    clearLocalStorage();
}

function clearLocalStorage() {
  localStorage.clear();
}

  
function getFromLocalStorage() {
    let coursesLS = getCoursesFromStorage();
  

    coursesLS.forEach(course => {

      const row = document.createElement("tr");

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
  

      shoppingCartContent.appendChild(row);
  });
}

function removeCourseLocalStorage(id) {

  let coursesLS = getCoursesFromStorage();
  console.log(coursesLS)
  coursesLS.forEach((courseLS, index) => {
      if (courseLS.id == id) {
      coursesLS.splice(index, 1);
      }
  });


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