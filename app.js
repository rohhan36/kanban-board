const addNewTaskBtn = document.querySelector(".add-new-task-btn");
const backdrop = document.querySelector(".backdrop");
const newTaskText = document.querySelector(".new-task-text");

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

backdrop.addEventListener("click", (e) => {
  // console.log(e.target.classList);
  // console.log(e.target.dataset);

  const currTargetClasses = e.target.classList;
  const isBackdrop = currTargetClasses.contains("backdrop");
  const isCancel = currTargetClasses.contains("cancel");
  const isAddTask = currTargetClasses.contains("add-task");
  const isPriority = currTargetClasses.contains("task-priority");
  const isLevel = currTargetClasses.contains("task-level");

  if (isBackdrop || isCancel) {
    toggleBackdrop();
  }

  if (isLevel) {
    toggleLevel(e.target);
  }

  if (isPriority) {
    togglePriority(e.target);
  }

  if (isAddTask) {
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
    const newTaskData = {
      taskText: newTaskText.value,
      taskLevel,
      taskPriority,
    };

    const prevData = getTaskData();
    const newData = [...prevData, { ...newTaskData }];

    localStorage.setItem("task-data", JSON.stringify(newData));
    toggleBackdrop();
  }
});
