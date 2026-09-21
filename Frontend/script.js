// Shared script for login, register, and todos pages
const SERVER_URL = "http://localhost:8081";
const token = localStorage.getItem("token");

// ---------- Toast notifications ----------
function showToast(message, type = "error") {
    const container = document.getElementById("toast-container");
    if (!container) {
        alert(message);
        return;
    }
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("hide");
        setTimeout(() => toast.remove(), 250);
    }, 3000);
}

// ---------- Password visibility toggle ----------
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".toggle-password").forEach((icon) => {
        icon.addEventListener("click", function () {
            const input = document.getElementById(icon.dataset.target);
            if (!input) return;
            input.type = input.type === "password" ? "text" : "password";
        });
    });
});

function setButtonLoading(button, isLoading, loadingText, defaultText) {
    if (!button) return;
    button.disabled = isLoading;
    button.textContent = isLoading ? loadingText : defaultText;
}

// Login page logic
function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const btn = document.getElementById("login-btn");

    if (!email || !password) {
        showToast("Please enter both email and password");
        return;
    }

    setButtonLoading(btn, true, "Logging in...", "Login");

    fetch(`${SERVER_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        return response.json().catch(() => ({})).then(data => {
            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }
            return data;
        });
    })
    .then(data => {
        localStorage.setItem("token", data.token);
        window.location.href = "todos.html";
    })
    .catch(error => {
        showToast(error.message);
        setButtonLoading(btn, false, "Logging in...", "Login");
    });
}

// Register page logic
function register() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const btn = document.getElementById("register-btn");

    if (!email || !password) {
        showToast("Please enter both email and password");
        return;
    }

    setButtonLoading(btn, true, "Creating account...", "Register");

    fetch(`${SERVER_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (response.ok) {
            showToast("Registration successful! Please login.", "success");
            setTimeout(() => window.location.href = "login.html", 900);
        } else {
            return response.json().catch(() => ({})).then(data => {
                throw new Error(data.message || "Registration failed");
            });
        }
    })
    .catch(error => {
        showToast(error.message);
        setButtonLoading(btn, false, "Creating account...", "Register");
    });
}

// Logout
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// ---------- Todos page logic ----------
const PAGE_SIZE = 4;
let allTodos = [];
let currentPage = 1;

const emptyStateMarkup = `
    <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
        <p>No todos yet</p>
        <span>Add your first task above to get started</span>
    </div>`;

function createTodoCard(todo) {
    const card = document.createElement("div");
    card.className = "todo-card" + (todo.isCompleted ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.isCompleted;
    checkbox.addEventListener("change", function () {
        const updatedTodo = { ...todo, isCompleted: checkbox.checked };
        updateTodoStatus(updatedTodo);
    });

    const span = document.createElement("span");
    span.textContent = todo.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M10 11v6"/><path d="M14 11v6"/>
    </svg>`;
    deleteBtn.onclick = function () { deleteTodo(todo.Id ?? todo.id); };

    card.appendChild(checkbox);
    card.appendChild(span);
    card.appendChild(deleteBtn);

    return card;
}

function updateProgress(todos) {
    const progressText = document.getElementById("progress-text");
    const progressFill = document.getElementById("progress-fill");
    if (!progressText || !progressFill) return;

    const total = todos.length;
    const done = todos.filter(t => t.isCompleted).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    progressText.textContent = `${done} of ${total} done`;
    progressFill.style.width = `${percent}%`;
}

function renderTodos() {
    const todoList = document.getElementById("todo-list");
    const pagination = document.getElementById("pagination-controls");
    todoList.innerHTML = "";

    updateProgress(allTodos);

    if (allTodos.length === 0) {
        todoList.innerHTML = emptyStateMarkup;
        if (pagination) pagination.hidden = true;
        return;
    }

    const totalPages = Math.max(1, Math.ceil(allTodos.length / PAGE_SIZE));
    currentPage = Math.min(Math.max(1, currentPage), totalPages);

    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = allTodos.slice(start, start + PAGE_SIZE);
    pageItems.forEach(todo => {
        todoList.appendChild(createTodoCard(todo));
    });

    if (pagination) {
        pagination.hidden = totalPages <= 1;
        document.getElementById("page-indicator").textContent = `Page ${currentPage} of ${totalPages}`;
        document.getElementById("prev-page").disabled = currentPage === 1;
        document.getElementById("next-page").disabled = currentPage === totalPages;
    }
}

function changePage(delta) {
    currentPage += delta;
    renderTodos();
}

function loadTodos(jumpToLastPage = false) {
    if (!token) {
        showToast("Please login first");
        window.location.href = "login.html";
        return;
    }

    fetch(`${SERVER_URL}/todo`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to get todos");
        }
        return response.json();
    })
    .then((todos) => {
        allTodos = todos || [];
        if (jumpToLastPage) {
            currentPage = Math.max(1, Math.ceil(allTodos.length / PAGE_SIZE));
        }
        renderTodos();
    })
    .catch(error => {
        document.getElementById("todo-list").innerHTML =
            `<p style="color:#ff6b6b; text-align:center; padding: 1.5rem 0;">Failed to load todos</p>`;
    });
}

function addTodo() {
    const input = document.getElementById("new-todo");
    const todoText = input.value.trim();

    if (!todoText) return;

    fetch(`${SERVER_URL}/todo/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: todoText, isCompleted: false })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to add todo");
        }
        return response.json();
    })
    .then(() => {
        input.value = "";
        loadTodos(true);
    })
    .catch(error => {
        showToast(error.message);
    });
}

function updateTodoStatus(todo) {
    fetch(`${SERVER_URL}/todo`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(todo)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to update todo");
        }
        return response.json();
    })
    .then(() => loadTodos())
    .catch(error => {
        showToast(error.message);
    });
}

function deleteTodo(id) {
    fetch(`${SERVER_URL}/todo/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to delete todo");
        }
        return response.text();
    })
    .then(() => loadTodos())
    .catch(error => {
        showToast(error.message);
    });
}

// Page-specific initializations
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("todo-list")) {
        loadTodos();

        const newTodoInput = document.getElementById("new-todo");
        if (newTodoInput) {
            newTodoInput.addEventListener("keydown", function (e) {
                if (e.key === "Enter") addTodo();
            });
        }
    }

    ["email", "password"].forEach(id => {
        const el = document.getElementById(id);
        const form = el && el.closest(".container");
        if (el && form) {
            el.addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                    const loginBtn = document.getElementById("login-btn");
                    const registerBtn = document.getElementById("register-btn");
                    if (loginBtn) login();
                    else if (registerBtn) register();
                }
            });
        }
    });
});
