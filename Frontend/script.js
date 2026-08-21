// Shared script for login, register, and todos pages
const SERVER_URL = "http://localhost:8081";
const token = localStorage.getItem("token");

// Login page logic
function login() {
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;  
    
    fetch(`${SERVER_URL}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email,password})
    })
    .then(response =>{
        if(!response.ok){
            throw new Error(data.message || "Login failed");
        }
        return response.json();
    })
    .then(data=> {
        localStorage.setItem("token", data.token);
        window.location.href="todos.html";
    })
    .catch(error=> {
        alert(error.message);
    })
}

// Register page logic
function register() {
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;  
    
    fetch(`${SERVER_URL}/auth/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email,password})
    })
    .then(response =>{
        if(response.ok){
            alert("Registration Successful!, Please Login!");
            window.location.href="login.html";
        }else{
            return response.json().then(data => {throw new Error(data.message || "Registration failed")});
        }
    }).catch(error=> {
        alert(error.message);
    })
}

// Todos page logic
function createTodoCard(todo) {
    const card= document.createElement("div");
    card.className="todo-card";

    const checkbox=document.createElement("input");
    checkbox.type="checkbox";
    checkbox.checked=todo.isCompleted;
    checkbox.addEventListener("change",function() {
        const updatedTodo={...todo, isCompleted: checkbox.checked}
        updateTodoStatus(updatedTodo);
    });

    const todoContent=document.createElement("div");
    todoContent.className="todo-content";

    const title=document.createElement("span");
    title.className="todo-title";
    title.textContent=todo.title;

    const description=document.createElement("p");
    description.className="todo-description";
    description.textContent=todo.description || "No description";

    todoContent.appendChild(title);
    todoContent.appendChild(description);

    if(todo.isCompleted){
        title.style.textDecoration="line-through";
        title.style.color="#aaa";
    }

    const deleteBtn=document.createElement("button");
    deleteBtn.textContent="X";
    deleteBtn.onclick=function() {deleteTodo(todo.id);};

    const editBtn=document.createElement("button");
    editBtn.className="edit-button";
    editBtn.textContent="Edit";
    editBtn.onclick=function() {editTodo(todo, card);};

    card.appendChild(checkbox);
    card.appendChild(todoContent);
    card.appendChild(editBtn);
    card.appendChild(deleteBtn);

    return card;

}

function loadTodos() {
    if(!token){
        alert("Please Login First");
        window.location.href="login.html";
        return;
    }

    fetch(`${SERVER_URL}/todo`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        },
       
    })
    .then(response => {
        if(!response.ok){
            throw new Error(data.message || "Failed to get todos");
        }
        return response.json();
    })
    .then((todos) => {
        const todoList=document.getElementById("todo-list");
        todoList.innerHTML="";

        if(!todos || todos.length ==0){
            todoList.innerHTML=`<p id="empty-message">No Todos yet. Add one below!</p>`
        }
        else{
            todos.forEach(todo =>{
                todoList.appendChild(createTodoCard(todo));
            });
        }
    })
    .catch(error => {
        document.getElementById("todo-list").innerHTML=`<p style="color:red">Failed to load Todos</p>`
    })
}

function addTodo() {
    const titleInput=document.getElementById("new-todo");
    const descriptionInput=document.getElementById("new-description");
    const todoText=titleInput.value.trim();
    const description=descriptionInput.value.trim();

    if(!todoText) return;

    fetch(`${SERVER_URL}/todo/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({title: todoText, description, isCompleted:false})
       
    })
    .then(response => {
        if(!response.ok){
            throw new Error(data.message || "Failed to add todo");
        }
        return response.json();
    })
    .then((newTodo) => {
        titleInput.value="";
        descriptionInput.value="";
        loadTodos();
    })
    .catch(error => {
        alert(error.message);
    })
}

function updateTodoStatus(todo) {
    updateTodo(todo);
}

function updateTodo(todo) {
    fetch(`${SERVER_URL}/todo`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(todo)
       
    })
    .then(response => {
        if(!response.ok){
            throw new Error(data.message || "Failed to Update todo");
        }
        return response.json();
    })
    .then(() => loadTodos())
    .catch(error => {
        alert(error.message);
    })
}

function editTodo(todo, card) {
    card.classList.add("editing");
    card.innerHTML="";

    const editFields=document.createElement("div");
    editFields.className="edit-fields";

    const titleInput=document.createElement("input");
    titleInput.type="text";
    titleInput.value=todo.title || "";
    titleInput.setAttribute("aria-label", "Todo title");

    const descriptionInput=document.createElement("textarea");
    descriptionInput.value=todo.description || "";
    descriptionInput.setAttribute("aria-label", "Todo description");

    const editActions=document.createElement("div");
    editActions.className="edit-actions";

    const cancelBtn=document.createElement("button");
    cancelBtn.className="cancel-button";
    cancelBtn.textContent="Cancel";
    cancelBtn.onclick=function() {loadTodos();};

    const saveBtn=document.createElement("button");
    saveBtn.className="save-button";
    saveBtn.textContent="Save";
    saveBtn.onclick=function() {
        const title=titleInput.value.trim();
        if(!title){
            alert("Please enter a todo title");
            return;
        }
        updateTodo({...todo, title, description: descriptionInput.value.trim()});
    };

    editFields.appendChild(titleInput);
    editFields.appendChild(descriptionInput);
    editActions.appendChild(cancelBtn);
    editActions.appendChild(saveBtn);
    card.appendChild(editFields);
    card.appendChild(editActions);
    titleInput.focus();
}

function deleteTodo(id) {
    fetch(`${SERVER_URL}/todo/${id}`, {
        method: "DELETE",
        headers: {Authorization: `Bearer ${token}`},
       
    })
    .then(response => {
        if(!response.ok){
            throw new Error(data.message || "Failed to delete todo");
        }
        return response.text();
    })
    .then(() => loadTodos())
    .catch(error => {
        alert(error.message);
    })
}

// Page-specific initializations
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("todo-list")) {
        loadTodos();
    }
});
