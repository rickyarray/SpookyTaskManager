let isImportant = false;
let isVisable = true;


// ***** SAVING TASK *******
function saveTask(){
    //** get the values
    const title = $("#txtTitle").val();
    const description = $("#txtDescription").val();
    const color = $("#selColor").val();
    const date = $("#selDate").val();
    const status = $("#selStatus").val();
    const budget =$("#txtBudget").val();


    //** build object
    let taskSave = new Task(isImportant,title,description,color,date,status,budget);
    console.log("Task being saved:", taskSave);


    //** save to server
    $.ajax({
        type: "POST",
        url: "http://fsdiapi.azurewebsites.net/api/tasks/",
        data:JSON.stringify(taskSave),
        contentType: "application/json",
        success: function(response) {
            console.log(response);
        //** display the task & then clear form
            displayTask(taskSave);
        },
        error: function(error){
            console.log(error);
            alert("something went wrong");
        }
    });


    clearForm();
}
//** Clearing the Form */
function clearForm(){
    $("#txtTitle").val('')
    $("#txtDescription").val('')
    $("#selDate").val('')
    $("#selStatus").val('')
    $("#txtBudget").val('');
    $("#selColor").val('#000000');
}

// ** Is It Important? ***
function toggleImportant(){
    const nonImportantIcon = "fas fa-exclamation-circle important-icon";
    const importantIcon = "fa-solid fa-check";

    if(isImportant) {
        $("#iImportant").removeClass(importantIcon + " important-icon-large").addClass(nonImportantIcon);
        isImportant = false;
        $(".icon-hint").text("*Mark as Important");
    }
    else {
        $("#iImportant").removeClass(nonImportantIcon).addClass(importantIcon + " important-icon-large");
        isImportant = true;
        $(".icon-hint").text("**Marked as Important!**");
    }

    console.log("Working!");
}

//  ** DISPLAY TASK **
function displayTask(task){
    let importantIndicator = task.important ? "*" : "";
    let syntax = `
    <div class='task' style='border-color:${task.color}' data-task-id="${task.id}">
        <div class='info'>
            <h5>${importantIndicator} ${task.title}</h5> <!-- Include the asterisk here -->
            <p>${task.description}</p>
        </div>
        <label class='status'>${task.status}</label>
        <div class='date-budget'>
            <label>${task.startDate}</label>
            <label>${task.budget}</label>
        </div>
        <i class="fas fa-trash-alt delete-icon"></i>
    </div>`;

    $(".pending-tasks").append(syntax);
}


function deleteTask() {
    // Get the task element
    let taskElement = $(this).closest(".task");
    let taskId = taskElement.data("task-id");

    // Remove from server (if needed)

    $.ajax({
        type: "DELETE",
        url: `http://fsdiapi.azurewebsites.net/api/tasks/${taskId}`,
        success: function(response) {
            console.log("Task deleted:", response);
        },
        error: function(error){
            console.log(error);
            alert("Error deleting task");
        }
    });
    

    // Remove from UI
    taskElement.remove();
}


function toggleVisibility(){
    $("#form").toggle();
}


function testRequest() 
{
    $.ajax({
        type: "GET",
        url: "http://fsdiapi.azurewebsites.net/",
        success: function(response) {
            console.log(response);
        },
        error: function(error){
            console.log(error);
        }
    });
}

    
// Create a GET request function to "http://fsdiapi.azurewebsites.net/api/tasks"
function loadTask() {  
    $.ajax({
        type: "GET",
        url: "http://fsdiapi.azurewebsites.net/api/tasks",
        
        success: function(response){
            let data = JSON.parse(response);
            
            // Clear existing tasks from the UI
            $(".pending-tasks").empty();

            console.log(response); // Console log the request from server
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                let task = data[i];
                if (task.name == "Ricky")
                console.log(task);
            }
        },
        error: function(error) {
            console.log(error);
        }
    })
}



//find the elements in the server that contains title=Market
//render only those elements in the taskManager Panel


function init(){
    console.log("task manager");

    //load data
    loadTask();


    //assign events
    $("#btnSave").click(saveTask)
    $("#iImportant").click(toggleImportant)
    $("#btnDetails").click(toggleVisibility);

    // Assign delete event
    $(".pending-tasks").on("click", ".delete-icon", deleteTask);
}

window.onload = init;


