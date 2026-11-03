
/* =========================================
   TASKFLOW - TO-DO WEB APP
   Complete JavaScript Functionality
========================================= */


/* ---------- DOM Elements ---------- */

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskCategory = document.getElementById("task-category");
const taskPriority = document.getElementById("task-priority");
const taskDate = document.getElementById("task-date");

const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");

const totalCount = document.getElementById("total-count");
const pendingCount = document.getElementById("pending-count");
const completedCount = document.getElementById("completed-count");
const progressPercent = document.getElementById("progress-percent");
const progressFill = document.getElementById("progress-fill");
const taskCounter = document.getElementById("task-counter");

const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");
const sidebarLinks = document.querySelectorAll(".nav-item");

const currentDay = document.getElementById("current-day");
const currentDate = document.getElementById("current-date");

/* Edit Modal Elements */

const editModal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-form");
const editTaskId = document.getElementById("edit-task-id");
const editTaskInput = document.getElementById("edit-task-input");
const editTaskCategory = document.getElementById("edit-task-category");
const editTaskPriority = document.getElementById("edit-task-priority");
const editTaskDate = document.getElementById("edit-task-date");

const closeModalBtn = document.getElementById("close-modal");
const cancelEditBtn = document.getElementById("cancel-edit");


/* ---------- Application State ---------- */

// Load previously saved tasks from Local Storage.

let tasks = [];

try {
    const savedTasks = localStorage.getItem("taskflow_tasks");
    const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];

    tasks = Array.isArray(parsedTasks) ? parsedTasks : [];
} catch (error) {
    console.error("Unable to load saved tasks:", error);
    tasks = [];
}

// Default filter
let currentFilter = "all";


/* ---------- Utility Functions ---------- */

// Save tasks in Local Storage.

function saveTasks() {
    localStorage.setItem("taskflow_tasks", JSON.stringify(tasks));
}


// Generate unique task ID.

function generateTaskId() {
    if (window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    }

    return Date.now().toString() + Math.random().toString(36).slice(2);
}


// Format date.

function formatDate(dateString) {
    if (!dateString) {
        return "";
    }

    const date = new Date(dateString + "T00:00:00");

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


// Check whether a task is overdue.

function isOverdue(task) {
    if (!task.dueDate || task.completed) {
        return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(task.dueDate + "T00:00:00");

    return dueDate < today;
}


/* ---------- Current Date ---------- */

function displayCurrentDate() {
    const today = new Date();

    currentDay.textContent = today.toLocaleDateString("en-IN", {
        weekday: "long"
    });

    currentDate.textContent = today.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


/* ---------- Add New Task ---------- */

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (!title) {
        taskInput.focus();
        return;
    }

    const newTask = {
        id: generateTaskId(),
        title: title,
        category: taskCategory.value,
        priority: taskPriority.value,
        dueDate: taskDate.value,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);

    saveTasks();

    taskForm.reset();

    taskPriority.value = "Medium";

    renderTasks();
    updateStatistics();

    taskInput.focus();
});


/* ---------- Create Task Card ---------- */

function createTaskElement(task) {

    const taskItem = document.createElement("div");

    taskItem.className = "task-item";

    if (task.completed) {
        taskItem.classList.add("completed");
    }

    taskItem.dataset.id = task.id;


    // Checkbox

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task as completed");


    // Task Details

    const details = document.createElement("div");

    details.className = "task-details";

    const title = document.createElement("h3");

    title.textContent = task.title;

    const meta = document.createElement("div");

    meta.className = "task-meta";


    // Category

    const category = document.createElement("span");

    category.className = "task-category";
    category.textContent = task.category;


    // Priority

    const priority = document.createElement("span");

    priority.className = "task-priority";
    priority.textContent = task.priority;

    priority.classList.add(
        "priority-" + task.priority.toLowerCase()
    );

    meta.appendChild(category);
    meta.appendChild(priority);


    // Due Date

    if (task.dueDate) {

        const dueDate = document.createElement("span");

        dueDate.className = "task-due-date";
        dueDate.textContent = "Due: " + formatDate(task.dueDate);

        if (isOverdue(task)) {
            dueDate.classList.add("overdue");
            dueDate.textContent += " (Overdue)";
        }

        meta.appendChild(dueDate);
    }


    details.appendChild(title);
    details.appendChild(meta);


    // Action Buttons

    const actions = document.createElement("div");

    actions.className = "task-actions";


    // Edit Button

    const editButton = document.createElement("button");

    editButton.type = "button";
    editButton.className = "task-action-btn edit-btn";
    editButton.textContent = "✎";
    editButton.title = "Edit Task";
    editButton.setAttribute("aria-label", "Edit task");


    // Delete Button

    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.className = "task-action-btn delete-btn";
    deleteButton.textContent = "⌫";
    deleteButton.title = "Delete Task";
    deleteButton.setAttribute("aria-label", "Delete task");


    actions.appendChild(editButton);
    actions.appendChild(deleteButton);


    // Assemble Task Card

    taskItem.appendChild(checkbox);
    taskItem.appendChild(details);
    taskItem.appendChild(actions);

    return taskItem;
}


/* ---------- Render Tasks ---------- */

function renderTasks() {

    // Remove old task cards.

    taskList.querySelectorAll(".task-item").forEach(item => {
        item.remove();
    });


    // Search filtering.

    const searchTerm = searchInput.value.trim().toLowerCase();

    let filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm) ||
            task.category.toLowerCase().includes(searchTerm) ||
            task.priority.toLowerCase().includes(searchTerm);

        let matchesFilter = true;

        if (currentFilter === "pending") {
            matchesFilter = !task.completed;
        }

        if (currentFilter === "completed") {
            matchesFilter = task.completed;
        }

        return matchesSearch && matchesFilter;
    });


    // Display matching tasks.

    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);

        taskList.appendChild(taskElement);
    });


    // Empty State.

    if (filteredTasks.length === 0) {

        emptyState.style.display = "flex";

        const emptyHeading = emptyState.querySelector("h3");
        const emptyParagraph = emptyState.querySelector("p");

        if (tasks.length === 0) {
            emptyHeading.textContent = "No tasks yet!";
            emptyParagraph.textContent =
                "Your task list is empty. Add your first task and start being productive.";

        } else if (searchTerm) {
            emptyHeading.textContent = "No matching tasks!";
            emptyParagraph.textContent =
                "Try searching with a different keyword.";

        } else if (currentFilter === "pending") {
            emptyHeading.textContent = "No pending tasks!";
            emptyParagraph.textContent =
                "Great! You have completed all your tasks.";

        } else {
            emptyHeading.textContent = "No completed tasks!";
            emptyParagraph.textContent =
                "Complete some tasks to see them here.";
        }

    } else {

        emptyState.style.display = "none";
    }

}


/* ---------- Update Statistics ---------- */

function updateStatistics() {

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const pending = total - completed;

    const progress = total === 0
        ? 0
        : Math.round((completed / total) * 100);


    totalCount.textContent = total;

    pendingCount.textContent = pending;

    completedCount.textContent = completed;

    progressPercent.textContent = progress + "%";

    progressFill.style.width = progress + "%";

    taskCounter.textContent =
        total + (total === 1 ? " Task" : " Tasks");
}


/* ---------- Complete / Undo Task ---------- */

function toggleTaskCompletion(taskId) {

    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    saveTasks();

    renderTasks();

    updateStatistics();
}


/* ---------- Delete Task ---------- */

function deleteTask(taskId) {

    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    const shouldDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!shouldDelete) {
        return;
    }

    tasks = tasks.filter(task => task.id !== taskId);

    saveTasks();

    renderTasks();

    updateStatistics();
}


/* ---------- Open Edit Modal ---------- */

function openEditModal(taskId) {

    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    editTaskId.value = task.id;

    editTaskInput.value = task.title;

    editTaskCategory.value = task.category;

    editTaskPriority.value = task.priority;

    editTaskDate.value = task.dueDate || "";

    editModal.classList.add("show");

    editModal.setAttribute("aria-hidden", "false");

    editTaskInput.focus();
}


/* ---------- Close Edit Modal ---------- */

function closeEditModal() {

    editModal.classList.remove("show");

    editModal.setAttribute("aria-hidden", "true");

    editForm.reset();
}


closeModalBtn.addEventListener("click", closeEditModal);

cancelEditBtn.addEventListener("click", closeEditModal);


// Close modal by clicking outside it.

editModal.addEventListener("click", function (event) {

    if (event.target === editModal) {
        closeEditModal();
    }

});


// Close modal with Escape key.

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape" && editModal.classList.contains("show")) {
        closeEditModal();
    }

});


/* ---------- Update Existing Task ---------- */

editForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskId = editTaskId.value;

    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    const updatedTitle = editTaskInput.value.trim();

    if (!updatedTitle) {
        editTaskInput.focus();
        return;
    }

    task.title = updatedTitle;

    task.category = editTaskCategory.value;

    task.priority = editTaskPriority.value;

    task.dueDate = editTaskDate.value;

    saveTasks();

    closeEditModal();

    renderTasks();

    updateStatistics();

});


/* ---------- Task Event Delegation ---------- */

// Handle checkbox, edit and delete actions.

taskList.addEventListener("click", function (event) {

    const taskItem = event.target.closest(".task-item");

    if (!taskItem) {
        return;
    }

    const taskId = taskItem.dataset.id;


    // Edit Task

    if (event.target.closest(".edit-btn")) {
        openEditModal(taskId);
    }


    // Delete Task

    if (event.target.closest(".delete-btn")) {
        deleteTask(taskId);
    }

});


// Handle completion checkbox separately.

taskList.addEventListener("change", function (event) {

    if (!event.target.classList.contains("task-checkbox")) {
        return;
    }

    const taskItem = event.target.closest(".task-item");

    if (!taskItem) {
        return;
    }

    toggleTaskCompletion(taskItem.dataset.id);

});


/* ---------- Task Filters ---------- */

function setFilter(filter) {

    currentFilter = filter;

    // Update filter button appearance.

    filterButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.filter === filter
        );

    });

    renderTasks();
}


filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        setFilter(button.dataset.filter);

    });

});


/* ---------- Sidebar Navigation ---------- */

sidebarLinks.forEach(link => {

    link.addEventListener("click", function () {

        const filter = link.dataset.filter;

        if (filter) {
            setFilter(filter);
        }

        sidebarLinks.forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");

    });

});


/* ---------- Search Tasks ---------- */

searchInput.addEventListener("input", function () {

    renderTasks();

});


/* ---------- Initial Application Setup ---------- */

function initializeApp() {

    displayCurrentDate();

    renderTasks();

    updateStatistics();

}


// Start the application.

initializeApp();
