const url = "http://localhost:3000";
const productList = document.getElementById("productList");
const namePro = document.getElementById("name");
const price = document.getElementById("price");
const description = document.getElementById("description");
const btnAdd = document.getElementById("btn-add");
const openModalAdd = document.getElementById("openModalAdd");
const titleModalAll = document.getElementById("exampleModalLabel");
const username = document.getElementById("username");
const password = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");
const btnLogOut = document.getElementById("btnLogOut");
const userLogin = document.getElementById("userLogin");
const user = JSON.parse(sessionStorage.getItem("user"));
let editingId;

// Set value add
openModalAdd.addEventListener("click", function () {
    titleModalAll.textContent = "Add product";
    namePro.value = "";
    price.value = "";
    description.value = "";
    btnAdd.textContent = "Add Product";
    editingId = null;
});

const fetchProduct = async function () {
    const response = await fetch(`${url}/products`);
    const data = await response.json();
    productList.innerHTML = data.map(product => /*html*/`
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.description}</td>
            <td>
                <button class="btn btn-success btn-edit" data-id="${product.id}" data-bs-toggle="modal" data-bs-target="#modalAddProduct">Edit</button>
                <button class="btn btn-danger btn-delete" data-id="${product.id}">Delete</button>
            </td>
        </tr>
    `).join('');

    const btnsDelete = document.querySelectorAll('.btn-delete');
    const btnsUpdate = document.querySelectorAll('.btn-edit');

    for (const btn of btnsDelete) {
        const id = btn.getAttribute('data-id');
        btn.addEventListener('click', () => deleteProduct(id));
    }

    for (const btn of btnsUpdate) {
        const id = btn.getAttribute('data-id');
        btn.addEventListener('click', () => setValueUpdate(id));
    }
};

// Delete product
const deleteProduct = async function (id) {
    if (confirm("Are you sure to delete product")) {
        await fetch(`${url}/products/${id}`, {
            method: "DELETE",
        });
        alert("Delete product successfully");
    }
};

// Validate
const validate = function (product) {
    if (product.name === "") {
        alert("Please enter a name");
        return false;
    } else if (product.price === "") {
        alert("Please enter a price");
        return false;
    } else if (isNaN(Number(product.price))) {
        alert("Price must be a number");
        return false;
    } else if (Number(product.price) <= 0) {
        alert("Price must be greater than zero");
        return false;
    } else if (product.description === "") {
        alert("Please enter a description");
        return false;
    }

    return true;
};

const performAction = async function (data) {
    if (!editingId) {
        await fetch(`${url}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        alert("Add product successfully");
    } else {
        await fetch(`${url}/products/${editingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        alert("Update product successfully");
    }
}

// Add/update product
const addProduct = function () {
    const new_pro = {
        name: namePro.value.trim(),
        price: price.value.trim(),
        description: description.value.trim(),
    }

    if (validate(new_pro)) {
        performAction(new_pro);
    }
}

// Set value update
const setValueUpdate = async function (id) {
    const response = await fetch(`${url}/products/${id}`);
    const data = await response.json();
    titleModalAll.textContent = "Update product";
    namePro.value = data.name;
    price.value = data.price;
    description.value = data.description;
    btnAdd.textContent = "Update product";
    editingId = data.id;
}

const login = async function () {
    const response = await fetch(`${url}/users`);
    const data = await response.json();
    if (data.some(user => user.username === username.value && user.password === password.value)) {
        sessionStorage.setItem('user', JSON.stringify({ username: username.value, password: password.value }));
        alert("Login successfully");
        window.location.reload();
    } else {
        alert("Login failed");
    }
}

fetchProduct();
btnAdd.addEventListener('click', addProduct);
btnLogin.addEventListener('click', login);
btnLogOut.addEventListener('click', function () {
    sessionStorage.removeItem('user');
    window.location.reload();
});

if (user) {
    userLogin.textContent = "Hello " + user.username;
}