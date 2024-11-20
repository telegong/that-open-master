import * as React from "react"
import { Project, IProject, UserRole, ProjectStatus } from "../classes/Project.ts"
import { ProjectsManager } from "../classes/ProjectsManager.ts"

export function ProjectsPage() {
    const projectsManager = new ProjectsManager()

    const onNewProjectClick = () => {
        const modal = document.getElementById("new-project-modal")
        if (!(modal && modal instanceof HTMLDialogElement)) {
            return
        } 
        modal.showModal()
    }

    const onFormSubmit = (e: React.FormEvent) => {
        const projectForm = document.getElementById("new-project-form")
        if (!(projectForm && projectForm instanceof HTMLFormElement)) {return}
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
            console.log(project)
            projectForm.reset()
            const modal = document.getElementById("new-project-modal")
            if (!(modal && modal instanceof HTMLDialogElement)) {return} 
            modal.close()
        } catch (err) {
            const errorMessage = document.getElementById("error-message") as HTMLElement
            errorMessage.textContent=`${err.message}`
            const modal = document.getElementById("error-message-modal")
            if (!(modal && modal instanceof HTMLDialogElement)) {return} 
            modal.show()
        }
    }

    return(
        <div className="page" id="projects-page" style={{display: "flex"}}>
            <dialog id="new-project-modal">
                <form onSubmit={(e) => {onFormSubmit(e)}} id="new-project-form">
                    <h2>New Project</h2>
                    <div className="input-list">
                        <div className="form-field-container">
                            <label><span className="material-icons-round">apartment </span>Name</label>
                            <input name="name" type="text" placeholder="What's the name of your project?"/>
                            <p 
                                style={{
                                    color: "gray", 
                                    fontSize: "var(--font-sm)",
                                    marginTop: "5px",
                                    fontStyle: "italic"
                                }}
                            >
                                TIP: Give it a short name
                            </p>
                        </div>
                        <div className="form-field-container">
                            <label><span className="material-icons-round">subject </span>Description</label>
                            <textarea name="description" cols={30} rows={5} placeholder="Give your project a nice description! So people is jealous about it"></textarea>
                        </div>
                        <div className="form-field-container">
                            <label><span className="material-icons-round">person </span>Role</label>
                            <select name="userRole">
                                <option>Architect</option>
                                <option>Engineer</option>
                                <option>Developer</option>
                            </select>
                        </div>
                        <div className="form-field-container">
                            <label><span className="material-icons-round">not_listed_location </span>Status</label>
                            <select name="status">
                                <option>Pending</option>
                                <option>Active</option>
                                <option>Finished</option>
                            </select>
                        </div>
                        <div className="form-field-container">
                            <label><span className="material-icons-round">calendar_month </span>Finish Date</label>
                            <input name="finishDate" type="date" ></input>
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "flex-end", margin: "10px 0px 10px auto", columnGap: "10px"}}>
                        <button id="project-input-canel" type="button" style={{backgroundColor: "transparent"}}>Cancel</button>
                        <button type="submit" style={{backgroundColor: "rgb(18, 145, 18)"}}>Accept</button>
                    </div>
                </form>
            </dialog>
            <dialog id="error-message-modal">
                <h2>Error Occured</h2>
                <div className="form-error-message">
                    <label>
                        <span className="material-icons-round">error </span>
                        <span id="error-message">Error Message here!</span>
                    </label>
                </div>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <button id="error-message-check-button">Check</button>
                </div>
            </dialog>
            <header>
                <h2>Projects</h2>
                <div style={{display: "flex", alignItems: "center", columnGap: "15px"}}>
                    <span id="import-projects-btn" className="material-icons-round action-icon">file_upload</span>
                    <span id="export-projects-btn" className="material-icons-round action-icon">file_download</span>
                    <button onClick={onNewProjectClick} id="new-project-btn"><span className="material-icons-round">add</span>New project</button>
                </div>
            </header>
            <div id="projects-list">
                {/* <!-- <div className="project-card">
                    <div className="card-header">
                        <p style="background-color: #ca8134; padding: 10px; border-radius: 8px; aspect-ratio: 1;">HC</p>
                        <div>
                            <h5>Project Name</h5>
                            <p>Project Description Goes Here...</p>
                        </div>
                    </div>
                    <div className="card-content">
                        <div className="card-property">
                            <p style="color: #969696;">Status</p>
                            <p>Active</p>
                        </div>
                        <div className="card-property">
                            <p style="color: #969696;">Role</p>
                            <p>Engineer</p>
                        </div>
                        <div className="card-property">
                            <p style="color: #969696;">Cost</p>
                            <p>$2'000.000</p>
                        </div>
                        <div className="card-property">
                            <p style="color: #969696;">Estimated Progress</p>
                            <p>45%</p>
                        </div>

                    </div>
                </div> --> */}

            </div>
        </div>

    )
}


