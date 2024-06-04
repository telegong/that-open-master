import { IProject, UserRole, ProjectStatus } from "./classes/Project.ts"
import { ProjectsManager } from "./classes/ProjectsManager.ts"

function toggleModal (id: string, action: "show" | "hide") {
    const modal = document.getElementById(id)
    if (!(modal && modal instanceof HTMLDialogElement)) {
        console.warn("The provided modal wasn't found. ID: ", id)
        return
    } 
    switch (action) {
        case "show":
            modal.showModal()
            break
        case "hide":
            modal.close()
            break
    }             
}

let projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)


const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn) {
    newProjectBtn.addEventListener("click",()=>{
        document.getElementsByName('finishDate')[0].valueAsDate = new Date(projectsManager.y4m2d2(Date()))
        toggleModal("new-project-modal","show")
        projectsListUI = projectsManager.ui
    } )
} else {
    console.warn("New projects button was not found")
}

function navPageSwitcher (id : string) {
    const pages = document.querySelectorAll('.page')
    for (const page of pages) {
        page.style.display = (id === page.id) ? "flex" : "none"
    }
}

const projectsListPageBtn = document.getElementById("projects-list-page-button")
if (projectsListPageBtn) {
    projectsListPageBtn.addEventListener("click", () => {
        navPageSwitcher("projects-page")
    })
} else {
    console.warn("Projects List button was not found")
}

const usersListPageBtn = document.getElementById("users-list-page-button")
if (usersListPageBtn) {
    usersListPageBtn.addEventListener("click", () => {
        navPageSwitcher("users-page")
    })
} else {     
    console.warn("Users List button was not found")
}

//====Get created values from form 생성 프로젝트 양식 값 가져오기=====
const projectForm = document.getElementById("new-project-form")

if (projectForm && projectForm instanceof HTMLFormElement) {
    projectForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const formData = new FormData(projectForm) 
        const projectData: IProject = {
            name:formData.get("name") as string, 
            description:formData.get("description") as string, 
            userRole: formData.get("userRole") as UserRole,
            status: formData.get('status') as ProjectStatus,
            finishDate: new Date(formData.get('finishDate') as string),  
        }
        try {
            const project = projectsManager.newProject(projectData)
            projectForm.reset()
            toggleModal("new-project-modal","hide")
        } catch (err) {
            const errorMessage = document.getElementById("error-message") as HTMLElement
            errorMessage.textContent=`${err.message}`
            toggleModal("error-message-modal", "show")
        }
    })    

    const errorMessagCheckBTN = document.getElementById("error-message-check-button") as HTMLButtonElement
    errorMessagCheckBTN.addEventListener("click",()=>{
        toggleModal("error-message-modal","hide")
    })

    const projectInputCancelBTN = document.getElementById("project-input-canel") as HTMLButtonElement
    projectInputCancelBTN.addEventListener("click", () => {
        projectForm.reset()
        toggleModal("new-project-modal","hide")
    })
} else {
    console.warn("The project form was not found. Check the ID!")
}


const exportProjectsBtn = document.getElementById("export-projects-btn")
if(exportProjectsBtn){
    exportProjectsBtn.addEventListener("click", ()=>{
        projectsManager.exportToJSON()
    })
}

const importProjectsBtn = document.getElementById("import-projects-btn")
if(importProjectsBtn){
    importProjectsBtn.addEventListener("click", ()=>{
        projectsManager.importFromJSON()
    })
}


const editProjectBtn = document.getElementById("edit-project-btn")
if (editProjectBtn) {
    editProjectBtn.addEventListener("click", ()=>{
        const projectDetails = document.getElementById("project-details")
        if (!projectDetails) return
        let projectName = projectDetails.querySelector("[data-project-info='name']")?.textContent as string
        if (!projectName) return
        console.log(projectName)

        toggleModal("edit-project-modal","show")

        // Edit Project in Project Details Page
        const editProjectForm = document.getElementById("edit-project-form")
        
        if (editProjectForm instanceof HTMLFormElement  ) {   
            const preDatum = {
                name: "input[name='name']",
                description: "textarea[name='description']",
                userRole: "select[name='userRole']",
                status: "select[name='status']",
                finishDate: "input[name='finishDate']",
            } 
            for (const key in preDatum) {
                const pdata = editProjectForm.querySelector(preDatum[key]) as HTMLInputElement
                pdata.value = projectDetails.querySelector(`[data-project-info='${key}']`)?.textContent as string
            }

            // Get edited values from form 수정 값 가져오기
            editProjectForm.addEventListener("submit", (e) => {
                e.preventDefault()
                const formData = new FormData(editProjectForm) 
                const updateData = {
                    name : formData.get("name") as string,
                    description : formData.get("description") as string,
                    userRole : formData.get("userRole") as UserRole,
                    status : formData.get('status') as ProjectStatus,
                    finishDate : new Date(formData.get('finishDate') as string)
                }
                try {

                    projectsManager.editProject(projectName, updateData)
                    //editProjectForm.reset() //index.html 폼 데이터 상태로 프로젝트 값이 없어진다. Error발생 원인
                    toggleModal("edit-project-modal","hide")

                    
                } catch (err) {
                    const errorMessage = document.getElementById("edit-error-message") as HTMLElement
                    errorMessage.textContent=`Error: ${err.message}`
                    toggleModal("edit-error-message-modal", "show")
                
                } finally {
                    projectName ="" // Initialize projectName of current details 프로젝트 이름만 초기화
                }
            })    

            const errorMessagCheckBTN = document.getElementById("edit-error-message-check-button") as HTMLButtonElement
            errorMessagCheckBTN.addEventListener("click",()=>{
                toggleModal("edit-error-message-modal","hide")
            })

            const editProjectInputCancelBTN = document.getElementById("edit-project-input-canel") as HTMLButtonElement
            editProjectInputCancelBTN.addEventListener("click", () => {
                editProjectForm.reset()
                toggleModal("edit-project-modal","hide")                
            })

        } else {
            console.warn("The project form was not found. Check the ID!")
        }

    })
} else {
    console.warn("Edit projects button was not found")
}

const newToDoBtn = document.getElementById("new-todo-btn")
if (newToDoBtn) {
    newToDoBtn.addEventListener("click", () => {
        // const todo: string = prompt("Add new To-Do") as string
        toggleModal("new-todo-modal","show")
        const newTodoForm = document.getElementById("new-todo-form") 
        if (newTodoForm instanceof HTMLFormElement){
            newTodoForm.addEventListener("submit", (e) => {
                e.preventDefault()
                const formData = new FormData(newTodoForm) 
                const todoMessage = formData.get('todo-message') as string
                projectsManager.newTodo(todoMessage)
                newTodoForm.reset()
                toggleModal("new-todo-modal","hide")
            })

        } else {
            console.warn("New ToDo form was not found")
        }
    })
} else {     
    console.warn("New Todo button was not found")
}



// defaultProjectCreate
if(projectsManager.list.length == 0){
    const defaultProjectData: IProject = {
        name : "Default Project Name", 
        description : "Housing Complex in Seoul",
        userRole : "Architect",
        status : "Active",
        finishDate : new Date("2022-05-01"),        
    }
    projectsManager.newProject(defaultProjectData)
}