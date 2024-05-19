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


const editProjectBtn = document.getElementById("edit-project-btn")
if (editProjectBtn) {
    editProjectBtn.addEventListener("click", ()=>{
        const projectDetails = document.getElementById("project-details")
        if (!projectDetails) return
        let projectName = projectDetails.querySelector("[data-project-info='name']")?.textContent as string
        if (!projectName) return
        console.log(projectName)
        // const curProject = projectsManager.getProjectByName(projectName?.textContent || "")
        // if (!curProject) return

        toggleModal("edit-project-modal","show")

        // Edit Project in Project Details Page
        const editProjectForm = document.getElementById("edit-project-form")
        
        if (editProjectForm instanceof HTMLFormElement  ) {            
            const defaultName = editProjectForm.querySelector("input[name='name']") as HTMLInputElement            
            defaultName.value = projectDetails.querySelector("[data-project-info='name']")?.textContent as string
                //curProject?.name || "curProject None - projectNameNone"
            const defaultDescription = editProjectForm.querySelector("textarea[name='description']") as HTMLInputElement
            defaultDescription.value = projectDetails.querySelector("[data-project-info='description']")?.textContent as string
                //curProject?.description || "curProject None"
            const defaultUserRole = editProjectForm.querySelector("select[name='userRole']") as HTMLInputElement
            defaultUserRole.value = projectDetails.querySelector("[data-project-info='userRole']")?.textContent as string
                //curProject?.userRole || "curProject None"
            const defaultStatus = editProjectForm.querySelector("select[name='status']") as HTMLInputElement
            defaultStatus.value = projectDetails.querySelector("[data-project-info='status']")?.textContent as string
                //curProject?.status || "curProject None"
            const defaultFinishDate = editProjectForm.querySelector("input[name='finishDate']") as HTMLInputElement
            defaultFinishDate.value = projectDetails.querySelector("[data-project-info='finishDate']")?.textContent as string
                //projectsManager.y4m2d2(curProject?.finishDate || new Date())
            // 수정 값 가져오기
            editProjectForm.addEventListener("submit", (e) => {
                e.preventDefault()
                const formData = new FormData(editProjectForm) 
                // const curProject = projectsManager.getProjectByName(defaultName.value || "")
                // if (!curProject) return
                try {
                    const updateData = {
                        name : formData.get("name") as string,
                        description : formData.get("description") as string,
                        userRole : formData.get("userRole") as UserRole,
                        status : formData.get('status') as ProjectStatus,
                        finishDate : new Date(formData.get('finishDate') as string)
                    }

                    projectsManager.editProject(projectName, updateData)
                    //editProjectForm.reset() //index.html 폼 데이터 상태로 프로젝트 값이 없어진다. 에러발생 원인
                    toggleModal("edit-project-modal","hide")
                    //editProjectForm.reset()
                    
                } catch (err) {
                    const errorMessage = document.getElementById("edit-error-message") as HTMLElement
                    errorMessage.textContent=`Error: ${err.message}`
                    toggleModal("edit-error-message-modal", "show")
                
                } finally {
                    //editProjectForm.reset()
                    projectName =""
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

//const editProjectBtn = document.getElementById("edit-project-btn")
// if (editProjectBtn) {
//     editProjectBtn.addEventListener("click", ()=>{
//         const projectDetails = document.getElementById("project-details")
//         if (!projectDetails) return
//         const projectName = projectDetails.querySelector("[data-project-info='name']")
//         console.log(projectName?.textContent || "projectName.textContext 값이 없네요!")
//         const curProject = projectsManager.getProjectByName(projectName?.textContent || "")
        
//         toggleModal("edit-project-modal","show")

//         // Edit Project in Project Details Page
//         const editProjectForm = document.getElementById("edit-project-form")
        
//         if (editProjectForm instanceof HTMLFormElement  ) {            
//             const defaultName = editProjectForm.querySelector("input[name='name']") as HTMLInputElement            
//             defaultName.value = curProject?.name || "curProject None - projectNameNone"
//             const defaultDescription = editProjectForm.querySelector("textarea[name='description']") as HTMLInputElement
//             defaultDescription.value = curProject?.description || "curProject None"
//             const defaultUserRole = editProjectForm.querySelector("select[name='userRole']") as HTMLInputElement
//             defaultUserRole.value = curProject?.userRole || "curProject None"
//             const defaultStatus = editProjectForm.querySelector("select[name='status']") as HTMLInputElement
//             defaultStatus.value = curProject?.status || "curProject None"
//             const defaultFinishDate = editProjectForm.querySelector("input[name='finishDate']") as HTMLInputElement
//             defaultFinishDate.value = projectsManager.y4m2d2(curProject?.finishDate || new Date())
//             // 수정 값 가져오기
//             editProjectForm.addEventListener("submit", (e) => {
//                 e.preventDefault()
//                 const formData = new FormData(editProjectForm) 
//                 try {
//                     curProject.name = formData.get("name") as string
//                     curProject.description = formData.get("description") as string
//                     curProject.userRole = formData.get("userRole") as UserRole
//                     curProject.status = formData.get('status') as ProjectStatus
//                     curProject.finishDate = new Date(formData.get('finishDate') as string)  

//                     projectsManager.editProject(curProject)
//                     //editProjectForm.reset() //index.html 폼 데이터 상태로 프로젝트 값이 없어진다. 에러발생 원인
//                     toggleModal("edit-project-modal","hide")
//                     //editProjectForm.reset()
                    
//                 } catch (err) {
//                     const errorMessage = document.getElementById("edit-error-message") as HTMLElement
//                     errorMessage.textContent=`Error: ${err.message}`
//                     toggleModal("edit-error-message-modal", "show")
                
//                 } finally {
//                     //editProjectForm.reset()
//                 }
//             })    

//             const errorMessagCheckBTN = document.getElementById("error-message-check-button") as HTMLButtonElement
//             errorMessagCheckBTN.addEventListener("click",()=>{
//                 toggleModal("edit-error-message-modal","hide")
//             })

//             const editProjectInputCancelBTN = document.getElementById("edit-project-input-canel") as HTMLButtonElement
//             editProjectInputCancelBTN.addEventListener("click", () => {
//                 editProjectForm.reset()
//                 toggleModal("edit-project-modal","hide")
                
//             })

//         } else {
//             console.warn("The project form was not found. Check the ID!")
//         }

//     })
// } else {
//     console.warn("Edit projects button was not found")
// }

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