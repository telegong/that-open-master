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

const editProjectBtn = document.getElementById("edit-project-btn")
if (editProjectBtn) {
    editProjectBtn.addEventListener("click", ()=>{
        // Current project name which project details are shown
        // get project from projectmanager.getprojectbyname
        const projectDetails = document.getElementById("project-details")
        if (!projectDetails) return
        const projectName = projectDetails.querySelector("[data-project-info='name']")
        console.log(projectName?.textContent)
        const project = projectsManager.getProjectByName(projectName?.textContent)
        console.log(project,"before")

        toggleModal("edit-project-modal","show")

        console.log(projectsManager.list,"after")
        const editProjectForm = document.getElementById("edit-project-form")
        if (editProjectForm && editProjectForm instanceof HTMLFormElement) {
        // if (true) {
            let defaultName = editProjectForm.querySelector("input[name='name']")
            defaultName.value = project?.name
            //defaultDescription = `<textarea name="description" cols="30" rows="5">${project?.description} </textarea>`
            let defaultDescription = editProjectForm.querySelector("textarea[name='description']")
            defaultDescription.value = project?.description
            let defaultUserRole = editProjectForm.querySelector("select[name='userRole']")
            defaultUserRole.value = project?.userRole
            let defaultStatus = editProjectForm.querySelector("select[name='status']")
            defaultStatus.value = project?.status
            let defaultFinishDate = editProjectForm.querySelector("input[name='finishDate']")
            defaultFinishDate.value = projectsManager.y4m2d2(project?.finishDate)
            // defaultFinishDate.value = project?.finishDate.toISOString().slice(0, 10);
            // console.log(defaultDescription.value,'\r\n'
            //             ,defaultUserRole.value,'\r\n'
            //             ,defaultStatus.value,'\r\n'
            //             ,defaultFinishDate.value)

            // 수정 값 가져오기
            editProjectForm.addEventListener("submit", (e) => {
                e.preventDefault()
                // const editformData = new FormData(editProjectForm) 
                const formData = new FormData(editProjectForm) 
                const editProjectData: IProject = {
                    name:formData.get("name") as string, 
                    description:formData.get("description") as string, 
                    userRole: formData.get("userRole") as UserRole,
                    status: formData.get('status') as ProjectStatus,
                    finishDate: new Date(formData.get('finishDate') as string),  
                }
                try {
                    projectsManager.editProject(editProjectData, project)
                    editProjectForm.reset()
                    toggleModal("edit-project-modal","hide")
                } catch (err) {
                    //alert(err)
                    const errorMessage = document.getElementById("edit-error-message") as HTMLElement
                    //errorMessage.innerHTML=`${err}`
                    errorMessage.textContent=`${err}`
                    toggleModal("edit-error-message-modal", "show")
                }
                //console.log(project, projectsManager)
            })    

            const errorMessagCheckBTN = document.getElementById("error-message-check-button") as HTMLButtonElement
            errorMessagCheckBTN.addEventListener("click",()=>{
                toggleModal("error-message-modal","hide")
            })

            const projectInputCancelBTN = document.getElementById("edit-project-input-canel") as HTMLButtonElement
            projectInputCancelBTN.addEventListener("click", () => {
                editProjectForm.reset()
                toggleModal("edit-project-modal","hide")
            })
        
        } else {
            console.warn("The project form was not found. Check the ID!")
        }
        // 1. get current project name from #project-details context to set edit dialog form items before show.modal 
        // 2. preview project item.value on dialog formdata
        // 3. edit item.value formdata
        // 4. summit formdata to update project item.value
        // 5. hide modal window
        // this.editProject(project)
    })
    // const projectDetails = document.getElementById("project-details")
    // const editProjectForm = document.getElementById("edit-project-form")

    // if (projectDetails && editProjectForm && editProjectForm instanceof HTMLFormElement) {
    //     // 기존 값 미리보기
    //     let inputnamedefault = editProjectForm.querySelector("input[name='name']")
    //     const projectName = projectDetails.querySelector("[data-project-info='name']")
    //     inputnamedefault.value = projectName?.textContent
    //     console.log(inputnamedefault.value,projectName?.textContent)
    // }
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

//====기존 프로젝트 양식 값 설정 및 가져오기=====
// const projectDetails = document.getElementById("project-details")
// const editProjectForm = document.getElementById("edit-project-form")

// if (projectDetails && editProjectForm && editProjectForm instanceof HTMLFormElement) {
    // 기존 값 미리보기
    // let inputnamedefault = editProjectForm.querySelector("input[name='name']")
    // const projectName = projectDetails.querySelector("[data-project-info='name']")
    // inputnamedefault.value = projectName?.textContent
    
    
    
    // // 수정 값 가져오기
    // editProjectForm.addEventListener("submit", (e) => {
    //     e.preventDefault()
    //     const editformData = new FormData(editProjectForm) 
    //     const formData = new FormData(editProjectForm) 
    //     const editProjectData: IProject = {
    //         name:formData.get("name") as string, 
    //         description:formData.get("description") as string, 
    //         userRole: formData.get("userRole") as UserRole,
    //         status: formData.get('status') as ProjectStatus,
    //         finishDate: new Date(formData.get('finishDate') as string),  
    //     }
    //     try {
    //         const project = projectsManager.editProject(editProjectData)
    //         editProjectForm.reset()
    //         toggleModal("edit-project-modal","hide")
    //     } catch (err) {
    //         //alert(err)
    //         const errorMessage = document.getElementById("edit-error-message") as HTMLElement
    //         //errorMessage.innerHTML=`${err}`
    //         errorMessage.textContent=`${err}`
    //         toggleModal("edit-error-message-modal", "show")
    //     }
    //     //console.log(project, projectsManager)
    // })    

    // const errorMessagCheckBTN = document.getElementById("error-message-check-button") as HTMLButtonElement
    // errorMessagCheckBTN.addEventListener("click",()=>{
    //     toggleModal("error-message-modal","hide")
    // })

    // const projectInputCancelBTN = document.getElementById("project-input-canel") as HTMLButtonElement
    // projectInputCancelBTN.addEventListener("click", () => {
    //     editProjectForm.reset()
    //     toggleModal("edit-project-modal","hide")
    // })
// } else {
//     console.warn("The project form was not found. Check the ID!")
// }

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


