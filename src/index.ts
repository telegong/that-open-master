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
        toggleModal("new-project-modal","show")
        projectsListUI = projectsManager.ui
    } )
} else {
    console.warn("New projects button was not found")
}

const editProjectBtn = document.getElementById("edit-project-btn")
if (editProjectBtn) {
    editProjectBtn.addEventListener("click", ()=>{
        const projectDetails = document.getElementById("project-details")
        if (!projectDetails) return
        const projectName = projectDetails.querySelector("[data-project-info='name']")
        console.log(projectName?.textContent)
        let curProject = projectsManager.getProjectByName(projectName?.textContent)
        toggleModal("edit-project-modal","show")

        const editProjectForm = document.getElementById("edit-project-form")
        if (editProjectForm && editProjectForm instanceof HTMLFormElement) {
            let defaultName = editProjectForm.querySelector("input[name='name']")
            defaultName.value = curProject?.name
            let defaultDescription = editProjectForm.querySelector("textarea[name='description']")
            defaultDescription.value = curProject?.description
            let defaultUserRole = editProjectForm.querySelector("select[name='userRole']")
            defaultUserRole.value = curProject?.userRole
            let defaultStatus = editProjectForm.querySelector("select[name='status']")
            defaultStatus.value = curProject?.status
            let defaultFinishDate = editProjectForm.querySelector("input[name='finishDate']")
            defaultFinishDate.value = projectsManager.y4m2d2(curProject?.finishDate)

            // 수정 값 가져오기
            editProjectForm.addEventListener("submit", (e) => {
                e.preventDefault()
                const formData = new FormData(editProjectForm) 
                curProject.name = formData.get("name") as string
                curProject.description = formData.get("description") as string
                curProject.userRole = formData.get("userRole") as UserRole
                curProject.status = formData.get('status') as ProjectStatus
                curProject.finishDate = new Date(formData.get('finishDate') as string)  

                try {
                    projectsManager.editProject(curProject)
                    //editProjectForm.reset() //index.html 폼 데이터 상태로 프로젝트 값이 없어진다. 에러발생 원인
                    toggleModal("edit-project-modal","hide")
                } catch (err) {
                    const errorMessage = document.getElementById("edit-error-message") as HTMLElement
                    errorMessage.textContent=`${err}`
                    toggleModal("edit-error-message-modal", "show")
                }
            })    

            const errorMessagCheckBTN = document.getElementById("error-message-check-button") as HTMLButtonElement
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

//====생성 프로젝트 양식 값 가져오기=====
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
            errorMessage.textContent=`${err}`
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

 // defaultProjectCreate
const defaultProjectData: IProject = {
    name : "Default Project Name", 
    description : "Housing Complex in Seoul",
    userRole : "Architect",
    status : "Active",
    finishDate : new Date(2022,5,1),
}
if(projectsManager.list.length == 0){
    //const defaultProject = 
    projectsManager.newProject(defaultProjectData)
}