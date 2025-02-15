import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, update, remove} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js";

const firebaseConfig = {
apiKey: "AIzaSyA-Tma3QdP0XHsKsspv0wDteLFHEy5HEwI",
authDomain: "first-a382a.firebaseapp.com",
databaseURL: "https://first-a382a-default-rtdb.firebaseio.com",
projectId: "first-a382a",
storageBucket: "first-a382a.firebasestorage.app",
messagingSenderId: "510845985083",
appId: "1:510845985083:web:6360dd2a1ebd009a71571e",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const todosRef = ref(db, 'todos');

// Thêm công việc
const todoAppCreate = document.querySelector("#todo-app-create");
if(todoAppCreate) {
    todoAppCreate.addEventListener("submit", (event) => {
        event.preventDefault();

        const content = todoAppCreate.content.value;
        if(content) {
            const data = {
                content: content,
                complete: false
            };

            const newTodoRef = push(todosRef);
            set(newTodoRef, data).then(() => {
                console.log("Tạo thành công");
            })

            todoAppCreate.content.value = "";
        }
    })
}
// Hết thêm công việc

//Lấy danh sách công việc
onValue(todosRef, (items) => {
    const htmls = []; 

    items.forEach((item) => {
        
        const key = item.key;
        const data = item.val();

        let ButtonComplete = "";
        if(!data.complete) {
            ButtonComplete = `
                <button class="todo-app__item-button todo-app__item-button--complete"
                button-complete="${key}">
                    <i class="fa-solid fa-check"></i>
                </button>
            ` 
        } else {
            ButtonComplete = `
                <button class="todo-app__item-button todo-app__item-button--undo"
                button-undo="${key}">
                    <i class="fa-solid fa-rotate-left"></i>
                </button>
            ` 
        }

        let html = `
            <div class="todo-app__item ${data.complete ? 'todo-app__item--complete' : ''}">
                <span class="todo-app__item-content">${data.content}</span>
                <div class="todo-app__item-actions">
                    <button class="todo-app__item-button todo-app__item-button--edit">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    ${ButtonComplete}
                    <button
                        class="todo-app__item-button todo-app__item-button--delete"
                        button-remove="${key}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

        htmls.push(html);
    })

    const todoAppList = document.querySelector("#todo-app-list");
    todoAppList.innerHTML = htmls.reverse().join("");

    //Tính năng hoàn thành công việc 
    const listButtonComplete = document.querySelectorAll("[button-complete]");
    listButtonComplete.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("button-complete");
            const dataUpdate = {
                complete: true 
            };
            update(ref(db, '/todos/' + id), dataUpdate).then(() => {
                console.log("Cập nhật thành công!")
            });
        })
    })
    
    //Hết Tính năng hoàn thành công việc 

    //Tính năng hoàn tác công việc 
    const listButtonUndo = document.querySelectorAll("[button-undo]");
    listButtonUndo.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("button-undo");
            const dataUpdate = {
                complete: false 
            };
            update(ref(db, '/todos/' + id), dataUpdate).then(() => {
                console.log("Cập nhật thành công!")
            });
        })
    })

    // Tính năng xóa công việc
    const listButtonRemove = document.querySelectorAll("[button-remove]");
    listButtonRemove.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("button-remove");
            remove(ref(db, '/todos/' + id)).then(() => {
                console.log("Xóa thành công!");
            });
        })
    })
    
    // Hết Tính năng xóa công việc
    
    // Hết Tính năng hoàn tác công việc 

    // Cập nhật công việc
    // const buttonUpdate = document.querySelector(".button-update");
    // buttonUpdate.addEventListener("click", () => {
    //     const id = "-OIoRhaYP9saIPlE-PKS";
    //     const dataUpdate = {
    //         fullName: "Le Van B"
    //     };
    //     update(ref(db, '/users/' + id), dataUpdate);
    // })

    // Hết cập nhật công việc
})

//Hết Lấy danh sách công việc



