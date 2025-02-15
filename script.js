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

// Hiển thị thông báo
const showAlert = (content = null, time = 3000) => {
    if(content) {
        const newAlert = document.createElement("div");
        newAlert.setAttribute("class", "alert alert--success");

        newAlert.innerHTML = `
            <span class="alert__content">${content}</span>
            <span class="alert__close">
                <i class="fa-solid fa-x"></i>
            </span>
        `;

        const alertList = document.querySelector(".alert-list");

        alertList.appendChild(newAlert);

        const alertClose = newAlert.querySelector(".alert__close");

        alertClose.addEventListener("click", () => {
            alertList.removeChild(newAlert);
        })

        setTimeout(() => {
            alertList.removeChild(newAlert);
        }, time);
    }
    
}
// Hết Hiển thị thông báo

const closeModal = (element) => {
    const body = document.querySelector("body");

    const modalClose = element.querySelector(".modal__close");
    const modalOverlay = element.querySelector(".modal__overlay");
    const buttonClose = element.querySelector(".button__close");

    buttonClose.addEventListener("click", () => {
        body.removeChild(element);
    })

    modalClose.addEventListener("click", () => {
        body.removeChild(element);
    })

    modalOverlay.addEventListener("click", () => {
        body.removeChild(element);
    })
}

// Hiển thị comfirm 
const showConfirmDelete = (id) => {
    const body = document.querySelector("body");

    const elementConfirm = document.createElement("div");
    elementConfirm.classList.add("modal");

    elementConfirm.innerHTML = `
        <div class="modal__main">
            <button class="modal__close">
                <i class="fa-solid fa-x"></i>
            </button>
            <div class="modal__content">
                <div class="modal__text">
                    Bạn có chắc chắn muốn xóa công việc này ?
                </div>
                <div class ="modal__item-actions">
                    <button class="button__close">Hủy</button>
                    <button class="button__agree">Đồng Ý</button>
                </div>
            </div>
        </div>
        <div class="modal__overlay"></div>
    `;

    body.appendChild(elementConfirm);

    closeModal(elementConfirm);

    const buttonAgree = elementConfirm.querySelector(".button__agree");
    buttonAgree.addEventListener("click", () => {
        remove(ref(db, '/todos/' + id)).then(() => {
            body.removeChild(elementConfirm);
            showAlert("Xóa thành công!", 3000);
        });
    })

    
}
// Hết Hiển thị comfirm 

// Hiển thị edit

const showConfirmEdit = (id) => {
    const body = document.querySelector("body");

    const elementEdit = document.createElement("div");
    elementEdit.classList.add("modal");

    elementEdit.innerHTML = `
        <div class="modal__main">
            <button class="modal__close">
                <i class="fa-solid fa-x"></i>
            </button>
            <div class="modal__content">
                <div class="modal__text">
                    Chỉnh sửa công việc ?
                </div>
                <input class="modal__input" name="content"/>
                <div class="modal__item-actions">
                    <button class="button__close">Hủy</button>
                    <button class="button__agree">Thay đổi</button>
                </div>      
            </div>
        </div>
        <div class="modal__overlay"></div>
    `;

    body.appendChild(elementEdit);

    closeModal(elementEdit);

    const buttonAgree = elementEdit.querySelector(".button__agree");
    buttonAgree.addEventListener("click", () => {
        const content = elementEdit.querySelector("input[name='content']").value;
        if(content) {
            const dataUpdate = {
                content: content
            };
            update(ref(db, 'todos/' + id), dataUpdate).then(() => {
                body.removeChild(elementEdit);
                showAlert("Cập nhật thành công !", 3000);
            });
        }
    })
    onValue(ref(db, '/todos/' + id), (item) => {
        const data = item.val();
        elementEdit.querySelector("input[name='content']").value = data.content;
    })
}
// Hết Hiển thị edit




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
                showAlert("Tạo thành công", 3000);
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
                    <button
                        class="todo-app__item-button todo-app__item-button--edit"
                        button-edit="${key}">
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
                showAlert("Cập nhật thành công!", 3000);
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
                showAlert("Hoàn tác thành công!", 3000);
            });
        })
    })

    // Hết Tính năng hoàn tác công việc 

    // Tính năng xóa công việc
    const listButtonRemove = document.querySelectorAll("[button-remove]");
    listButtonRemove.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("button-remove");
            showConfirmDelete(id);
        })
    })
    
    // Hết Tính năng xóa công việc

    // Tính năng chỉnh sửa công việc
    const listButtonEdit = document.querySelectorAll("[button-edit]");
    listButtonEdit.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("button-edit");

            showConfirmEdit(id);
        })
    })
    // Hết Tính năng chỉnh sửa công việc
    
    
})

//Hết Lấy danh sách công việc
