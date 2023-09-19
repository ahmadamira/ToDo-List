let taskId = 1;
async function fetchTasks() {
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

      taskId++;
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

fetchTasks();

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const todoDescription = taskInput.value.trim();

  if (todoDescription !== "") {
    const taskList = document.getElementById("taskList");

    const newRow = taskList.insertRow();
    newRow.innerHTML = `
            <td>${taskId}</td>
            <td>${todoDescription}</td>
            <td>1</td>
            <td>Pending</td>
            <td class="actions">
                <button onclick="markDone(this)">Done</button>
                <button onclick="deleteTask(this)">Delete</button>
            </td>
        `;

    taskId++;
    taskInput.value = "";
  }
}

function markDone(button) {
  const row = button.closest("tr");
  row.cells[3].textContent = "Done";
}

function deleteTask(button) {
  const row = button.closest("tr");
  row.remove();
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
