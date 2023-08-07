const addNewTaskBtn = document.querySelector(".add-new-task-btn");
const backdrop = document.querySelector(".backdrop");
const newTaskText = document.querySelector(".new-task-text");
const newTaskHead = document.querySelector(".new-task-head");
const todoTasksRef = document.querySelector("#todo .task-list");
const inProgressTasksRef = document.querySelector("#in-progress .task-list");
const inReviewTasksRef = document.querySelector("#in-review .task-list");
const doneTasksRef = document.querySelector("#done .task-list");
const mainContainer = document.querySelector(".main-container");

const getRandom = () => {
  return Math.round(Math.random() * 25 + 1);
};

const generateUID = () => {
  let UID = "";
  for (let i = 0; i < 3; i++) {
    UID += String.fromCharCode(getRandom() + 64).toLowerCase();
    UID += getRandom();
  }

  return UID;
};

const generateTaskItem = (taskData) => {
  const { id, taskText, taskPriority } = taskData;

  return `<div class="priority ${taskPriority}"></div>
            <div class="task-content">
              <div class="task-text">${taskText}</div>
              <div class="task-footer">                
                <span class="task-id">${id}</span>
                <div class="controles">
                  <span><i class="bi bi-pencil-square edit-task"></i></span>
                  <span><i class="bi bi-trash-fill delete-task"></i></span>
                  <span><i class="bi bi-grip-vertical drag-task"></i></i></span>
                </div>
              </div>
          </div>`;
};

const toggleBackdrop = () => {
  backdrop.classList.toggle("show");
};

const toggleLevel = (element) => {
  document.querySelectorAll(".task-level").forEach((ele) => {
    ele.classList.remove("active");
  });
  element.classList.toggle("active");
};

const togglePriority = (element) => {
  document.querySelectorAll(".task-priority").forEach((ele) => {
    ele.classList.remove("active");
  });
  element.classList.toggle("active");
};

const resetAddNewTaskMenu = () => {
  backdrop.removeAttribute("edit-id");

  newTaskHead.innerText = "CREATE A NEW TASK";
  newTaskText.value = "";
  document.querySelectorAll(".task-priority").forEach((ele) => {
    ele.classList.remove("active");
  });
  document.querySelectorAll(".task-level").forEach((ele) => {
    ele.classList.remove("active");
  });
};

addNewTaskBtn.addEventListener("click", () => {
  toggleBackdrop();
  resetAddNewTaskMenu();
});

const getTaskData = () => {
  return JSON.parse(localStorage.getItem("task-data")) || [];
};
console.log(getTaskData());

const renderTaskData = () => {
  const data = getTaskData();

  document.querySelectorAll(".task-list").forEach((taskList) => {
    taskList.innerHTML = "";
  });

  data.forEach((task) => {
    const taskWrapper = document.createElement("div");
    taskWrapper.classList.add("task");
    taskWrapper.setAttribute("data-id", `${task.id}`);
    taskWrapper.setAttribute("draggable", "true");

    taskWrapper.innerHTML = generateTaskItem(task);

    if (task.taskLevel === "todo") {
      todoTasksRef.appendChild(taskWrapper);
    }
    if (task.taskLevel === "in-progress") {
      inProgressTasksRef.appendChild(taskWrapper);
    }
    if (task.taskLevel === "in-review") {
      inReviewTasksRef.appendChild(taskWrapper);
    }
    if (task.taskLevel === "done") {
      doneTasksRef.appendChild(taskWrapper);
    }
  });

  document.querySelectorAll(".task-section").forEach((taskSection) => {
    const taskCount = taskSection.querySelector(".task-list").children.length;
    taskSection.querySelector(".task-count").innerHTML = taskCount;
  });
};

const deleteTask = (taskId) => {
  const data = getTaskData();
  const filteredData = data.filter((task) => task.id !== taskId);

  localStorage.setItem("task-data", JSON.stringify(filteredData));
  renderTaskData();
};

backdrop.addEventListener("click", (e) => {
  const currTargetClasses = e.target.classList;

  const isBackdrop = currTargetClasses.contains("backdrop");
  const isCancel = currTargetClasses.contains("cancel");
  const isSubmit = currTargetClasses.contains("add-task");
  const isPriority = currTargetClasses.contains("task-priority");
  const isLevel = currTargetClasses.contains("task-level");
  const isEditing = backdrop.getAttribute("edit-id");

  if (isBackdrop || isCancel) {
    toggleBackdrop();
    resetAddNewTaskMenu();
  }

  if (isLevel) {
    toggleLevel(e.target);
  }

  if (isPriority) {
    togglePriority(e.target);
  }

  if (isSubmit) {
    if (isEditing) {
      const editTaskId = backdrop.getAttribute("edit-id");
      const data = getTaskData();
      const editingTask = data.find((task) => task.id === editTaskId);

      editingTask.taskText = newTaskText.value;

      document.querySelectorAll(".task-priority").forEach((ele) => {
        if (ele.classList.contains("active")) {
          editingTask.taskPriority = ele.dataset.priority;
        }
      });

      document.querySelectorAll(".task-level").forEach((ele) => {
        if (ele.classList.contains("active")) {
          editingTask.taskLevel = ele.dataset.level;
        }
      });

      localStorage.setItem("task-data", JSON.stringify(data));
      renderTaskData();
      toggleBackdrop();
      resetAddNewTaskMenu();
      return;
    }

    let taskPriority = "p3";
    let taskLevel = "todo";

    document.querySelectorAll(".task-priority").forEach((ele) => {
      if (ele.classList.contains("active")) {
        taskPriority = ele.dataset.priority;
      }
    });

    document.querySelectorAll(".task-level").forEach((ele) => {
      if (ele.classList.contains("active")) {
        taskLevel = ele.dataset.level;
      }
    });

    if (newTaskText.value.trim() != "") {
      const newTaskData = {
        id: generateUID(),
        taskText: newTaskText.value,
        taskLevel,
        taskPriority,
      };

      const prevData = getTaskData();
      const newData = [...prevData, { ...newTaskData }];

      localStorage.setItem("task-data", JSON.stringify(newData));

      renderTaskData();
    }

    toggleBackdrop();
  }
});

mainContainer.addEventListener("click", (e) => {
  const currTargetClasses = e.target.classList;

  const isEditTask = currTargetClasses.contains("edit-task");
  const isDeleteTask = currTargetClasses.contains("delete-task");

  if (isDeleteTask) {
    const currTaskId = e.target.closest(".task").dataset.id;
    deleteTask(currTaskId);
  }

  if (isEditTask) {
    const currTaskId = e.target.closest(".task").dataset.id;
    const data = getTaskData();
    const currSelected = data.find((task) => task.id === currTaskId);

    backdrop.setAttribute("edit-id", currTaskId);

    newTaskHead.innerText = "EDIT TASK";
    newTaskText.value = currSelected.taskText;

    console.log(currSelected);

    document.querySelectorAll(".task-priority").forEach((ele) => {
      if (ele.dataset.priority === currSelected.taskPriority) {
        ele.classList.add("active");
      }
    });

    document.querySelectorAll(".task-level").forEach((ele) => {
      if (ele.dataset.level === currSelected.taskLevel) {
        ele.classList.add("active");
      }
    });
    toggleBackdrop();
  }
});

mainContainer.addEventListener("dragstart", (e) => {
  let selected = e.target;
  selected.classList.add("dragging");
});

mainContainer.addEventListener("drop", (e) => {
  const selected = document.querySelector(".dragging");
  selected.classList.remove("dragging");

  const currSection = selected.closest(".task-section").dataset.section;
  const data = getTaskData();
  const currSelected = data.find((task) => task.id === selected.dataset.id);
  currSelected.taskLevel = currSection;

  localStorage.setItem("task-data", JSON.stringify(data));
  renderTaskData();
});

mainContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
  const selected = document.querySelector(".dragging");
  const isTaskList = e.target.closest(".task-list");
  if (isTaskList) {
    isTaskList.appendChild(selected);
  }
});

renderTaskData();
