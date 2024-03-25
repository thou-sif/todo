import {TodoItem} from "./todoItem.js";
import inquirer from "inquirer";
import {JsonTodoCollection} from "./jsonTodoCollection.js";

let todos = [
    new TodoItem(1, "Walk Along the park"),
    new TodoItem(2, "Watch the river till sun sets"),
    new TodoItem(3, "Wow the starry sky", true),
    new TodoItem(4, "Oh my, it's already morning")
]

let collection = new JsonTodoCollection("Toshi", todos);
let showCompleted = true;

function displayTodoList(): void {
    console.log(`${collection.userName}'s Todo List ` + `(${collection.getItemCounts().incomplete} items to do)`);
    collection.getTodoItems(showCompleted).forEach(item => item.printDetails());
}

enum Commands {
    Add = "Add new Task",
    Complete = "Complete Task",
    Toggle = "Show/Hide Completed",
    Purge = "Remove completed tasks",
    Quit = "Quit"
}

function promptAdd(): void {
    console.clear();
    inquirer.prompt({type: "input", name: "add", message: "Enter task:"})
        .then(answers => {
            if (answers["add"] !== "") {
                collection.addTodo(answers["add"]);
            }
            promptUser();
        })
}

function promptComplete(): void {
    console.clear();
    inquirer.prompt({
        type: "checkbox", name: "complete", message: "Mark task as complete",
        choices: collection.getTodoItems(showCompleted).map(item => ({
            name: item.task,
            value: item.id,
            checked: item.complete
        }))
    }).then(answers => {
        let completedTasks = answers["complete"] as number[];
        collection.getTodoItems(true).forEach(item => collection.markComplete(item.id,
            completedTasks.find(id => id === item.id) != undefined));
        promptUser();
    })
}

function promptUser(): void {
    console.clear();
    displayTodoList();
    inquirer.prompt({
        choices: Object.values(Commands),
        message: "Choose option",
        name: "command",
        type: "list"
    }).then((answers: { [x: string]: Commands; }) => {
        switch (answers["command"]) {
            case Commands.Toggle:
                showCompleted = !showCompleted;
                promptUser();
                break;

            case Commands.Add:
                promptAdd();
                break;

            case Commands.Complete:
                if (collection.getItemCounts().incomplete > 0) {
                    promptComplete();
                } else {
                    promptUser();
                }
                break;
            case Commands.Purge:
                collection.removeComplete();
                promptUser();
                break;
        }
    })
}

promptUser();
