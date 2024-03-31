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

const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)


const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn) {
    newProjectBtn.addEventListener("click",()=>{toggleModal("new-project-modal","show")} )
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

//====양식 값 가져오기=====
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
            //alert(err)
            const errorMessage = document.getElementById("error-message") as HTMLElement
            //errorMessage.innerHTML=`${err}`
            errorMessage.textContent=`${err}`
            toggleModal("error-message-modal", "show")
        }
        //console.log(project, projectsManager)
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

 

// defaultProjectCreate
const defaultProjectData: IProject = {
    name : "Default Project Name", 
    description : "Housing Complex in Seoul",
    userRole : "Architect",
    status : "Active",
    finishDate : new Date(2022,5,1),
}
const defaultProject = projectsManager.newProject(defaultProjectData)

console.log(defaultProject)


