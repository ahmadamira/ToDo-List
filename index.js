let taskId = parseInt(sessionStorage.getItem("taskId")) || 1;
let taskListArray = JSON.parse(sessionStorage.getItem("taskListArray")) || [];

function loadTasksFromSessionStorage() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  taskListArray.forEach((task) => {
    const newRow = taskList.insertRow();
    newRow.innerHTML = `
        <td>${task.id}</td>
        <td>${task.description}</td>
        <td>${task.userId}</td>
        <td>${task.status}</td>
        <td class="actions">
            <button class="done-button" onclick="markDone(this)">Done</button>
            <button class="delete-button" onclick="deleteTask(this)">Delete</button>
        </td>
    `;
    taskId = Math.max(taskId, task.id + 1);
  });
}

window.onload = () => {
  loadTasksFromSessionStorage();
  updateTotalTodosCount();
};

async function fetchTasksFromAPI() {
  try {
    const response = await fetch("https://dummyjson.com/todos");
    const tasks = await response.json();

    console.log(tasks);

    const taskList = document.getElementById("taskList");

    tasks.todos.forEach((task) => {
      const newRow = taskList.insertRow();
      newRow.innerHTML = `
            <td>${taskId}</td>
            <td>${task.todo}</td>
            <td>${task.userId}</td>
            <td>Pending</td>
            <td class="actions">
                <button class="done-button" onclick="markDone(this)">Done</button>
                <button class="delete-button" onclick="deleteTask(this)">Delete</button>
            </td>
        `;

      const newTask = {
        id: taskId,
        description: task.todo,
        userId: task.userId,
        status: "Pending",
      };

      taskListArray.push(newTask);

      taskId++;
    });

    sessionStorage.setItem("taskId", taskId);
    sessionStorage.setItem("taskListArray", JSON.stringify(taskListArray));
    updateTotalTodosCount();
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

function loadTasks() {
  if (taskListArray.length === 0) {
    fetchTasksFromAPI();
  } else {
    loadTasksFromSessionStorage();
  }
}

loadTasks();

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const todoDescription = taskInput.value.trim();

  if (todoDescription !== "") {
    const taskList = document.getElementById("taskList");
    const newRow = taskList.insertRow();

    const task = {
      id: taskId,
      description: todoDescription,
      userId: 1,
      status: "Pending",
    };

    taskListArray.push(task);

    sessionStorage.setItem("taskId", taskId);
    sessionStorage.setItem("taskListArray", JSON.stringify(taskListArray));

    newRow.innerHTML = `
        <td>${taskId}</td>
        <td>${todoDescription}</td>
        <td>1</td>
        <td>Pending</td>
        <td class="actions">
            <button class="done-button" onclick="markDone(this)">Done</button>
            <button class="delete-button" onclick="deleteTask(this)">Delete</button>
        </td>
      `;

    taskId++;
    taskInput.value = "";

    updateTotalTodosCount();
  }
}

function markDone(button) {
  const row = button.closest("tr");
  row.cells[3].textContent = "Done";

  const taskId = parseInt(row.cells[0].textContent);
  const task = taskListArray.find((task) => task.id === taskId);
  if (task) {
    task.status = "Done";

    sessionStorage.setItem("taskListArray", JSON.stringify(taskListArray));
  }
  updateTotalTodosCount();
}

function deleteTask(button) {
  const row = button.closest("tr");
  const taskId = parseInt(row.cells[0].textContent);
  const taskIndex = taskListArray.findIndex((task) => task.id === taskId);

  const confirmed = confirm("Are you sure you want to delete this TODO?");
  if (confirmed) {
    row.remove();
    if (taskIndex !== -1) {
      taskListArray.splice(taskIndex, 1);
      sessionStorage.setItem("taskListArray", JSON.stringify(taskListArray));
      updateTotalTodosCount();
    }
  }
}

function searchTask() {
  const searchInput = document.getElementById("searchInput");
  const searchText = searchInput.value.toLowerCase().trim();
  const taskList = document.getElementById("taskList");
  const rows = taskList.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const taskDescription = rows[i].cells[1].textContent.toLowerCase();

    if (taskDescription.includes(searchText)) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
}

function updateTotalTodosCount() {
  const totalTodos = taskListArray.length;
  const totalTodosElement = document.getElementById("totalTodos");
  totalTodosElement.textContent = totalTodos.toString();
}
