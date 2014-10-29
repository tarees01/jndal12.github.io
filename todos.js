var taskInput = document.getElementById("new-task");
var addButton = document.getElementsByTagName("button")[0];
var incompleteTasksHolder = document.getElementById("incomplete-tasks");
var completedTasksHolder = document.getElementById("completed-tasks");
//var field = document.getElementById("field");

// need to add priority  aspect 
var createNewTaskElement = function(taskString) {
  var listItem = document.createElement("li");
                                              
  var checkBox = document.createElement("input");
  var label = document.createElement("label");
  var editInput = document.createElement("input");
  var editButton = document.createElement("button");
  var deleteButton = document.createElement("button");
  
  //need to add prriority to each new element

  checkBox.type = "checkbox";
  //priority bar.type = "scrollbar";
  editInput.type = "text";

  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";

  label.innerText = taskString;

  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);
  //need to append priority to list item

  return listItem;

}

var addTask = function() {
  console.log("Add task...");

  var listItem = createNewTaskElement(taskInput.value);
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
  localStorage.setItem("addTask", JSON.stringify(data));
  
  taskInput.value = "Please enter Task and Date Due";
}
var editTask = function() {
  console.log("Edit task...");
  var listItem = this.parentNode;
  var editInput = listItem.querySelector("input[type=text");
  var label = listItem.querySelector("label");
  var containsClass = listItem.classList.contains("editMode");
if(containsClass) {
  label.innerText = editInput.value;
} else {
    editInput.value = label.innerText;
}
  listItem.classList.toggle("editMode");
  //localStorage.setItem("todoData", JSON.stringify(data));
}
// var 
  

var deleteTask = function() {
  
  console.log("Delete task...");
  var listItem = this.parentNode; 
  var ul = listItem.parentNode;
  ul.removeChild(listItem);
  //localStorage.setItem("todoData", JSON.stringify(data));
}

var taskCompleted = function() {
  console.log("Task complete...");
  var listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskIncomplete);
}

var taskIncomplete = function() {
  console.log("Task incomplete...");
   var listItem = this.parentNode;
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
  
}
 /*var saveList = function() {
	stringed = JSON.stringify(addTask);
	localStorage.setItem("todoSave",stringed);
	localStorage.setItem("todoSave", JSON.stringify(data))
	}*/

var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
	// maybe add checkBoxPriorityHandler as a parameter
  console.log("Bind list item events");
  var checkBox = taskListItem.querySelector("input[type=checkbox]");
  var editButton = taskListItem.querySelector("button.edit");
  var deleteButton = taskListItem.querySelector("button.delete");
  //need to add the priority aspect 
  // var priorityScroll = taskListItem.querySelector("input[type=scroll]");
  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = checkBoxEventHandler;
  //localStorage.setItem("todoData", JSON.stringify(data));
  //priotiryBar.onchange = checkBoxPriorityHandler

}
var ajaxRequest = function() {
	console.log("AJAX request");
}
var data = JSON.parse(localStorage.getItem("addTask"));




addButton.addEventListener("click", addTask);

addButton.addEventListener("click", ajaxRequest);
addButton.addEventListener("click", data);

 
 
 
//addButton.addEventListener("click"), saveList);

for(var i = 0; i < incompleteTasksHolder.children.length; i++) {
  bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
  
}

for(var i = 0; i < completedTasksHolder.children.length; i++) {
  bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
  
}
/*if (localStorage.getItem("addTask")) {
   // Restore the contents of the text field
   field.value = localStorage.getItem("addTask");
}*/

// Listen for changes in the text field
/*addButton.addEventListener("change", function() {
   localStorage.setItem("addTask", data.value);
});*/