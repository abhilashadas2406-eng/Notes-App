
const todoInput = document.getElementById("todo-input");
const addTodoBtn = document.getElementById("addTodoBtn");
const todoList = document.getElementById("todo-list-items");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const remainingCount = document.getElementById("remaining-count");


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";


function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


function renderTasks() {
  todoList.innerHTML = "";

  let visibleTasks = tasks;
  if (currentFilter === "completed") {
    visibleTasks = tasks.filter(function (task) {
      return task.completed;
    });
  } else if (currentFilter === "uncompleted") {
    visibleTasks = tasks.filter(function (task) {
      return !task.completed;
    });
  }

  visibleTasks.forEach(function (task) {
    const li = document.createElement("li");
    li.className = "todo-item";
    if (task.completed) {
      li.classList.add("completed");
    }

    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = task.text;
    span.addEventListener("click", function () {
      toggleTask(task.id);
    });

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "✕";
    delBtn.addEventListener("click", function (e) {
      e.stopPropagation(); // prevent triggering the toggle click too
      deleteTask(task.id);
    });

    li.appendChild(span);
    li.appendChild(delBtn);
    todoList.appendChild(li);
  });

  updateItemsLeft();
}


function addTask() {
  const text = todoInput.value.trim();
  if (text === "") return;

  tasks.push({
    id: Date.now(),
    text: text,
    completed: false
  });

  todoInput.value = "";
  saveTasks();
  renderTasks();
}


function toggleTask(id) {
  tasks = tasks.map(function (task) {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks();
  renderTasks();
}


function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  saveTasks();
  renderTasks();
}


function clearCompleted() {
  tasks = tasks.filter(function (task) {
    return !task.completed;
  });
  saveTasks();
  renderTasks();
}


function updateItemsLeft() {
  const activeCount = tasks.filter(function (task) {
    return !task.completed;
  }).length;
  remainingCount.textContent = activeCount;
}


addTodoBtn.addEventListener("click", addTask);

todoInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterBtns.forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

clearCompletedBtn.addEventListener("click", clearCompleted);


renderTasks();
