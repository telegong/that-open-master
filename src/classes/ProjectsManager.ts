import { IProject, Project } from "./Project"


export class ProjectsManager {
    list: Project[] = []

    ui: HTMLElement

    constructor(container: HTMLElement) {
        this.ui = container
    }

    newProject(data: IProject) {
        const projectNames = this.list.map((project) => {
            return project.name
        })
        const nameInUse = projectNames.includes(data.name)
        if (nameInUse) {
            throw new Error(`A project with the name "${data.name}" already exists`)
        }
        const project = new Project(data)
        project.ui.addEventListener("click", () => {
            const projectsPage = document.getElementById("projects-page")
            const detailsPage = document.getElementById("project-details")
            if (!(projectsPage && detailsPage)) {return}
            projectsPage.style.display = "none"
            detailsPage.style.display = "flex"
            this.setDetailsPage(project)
        })
        this.ui.append(project.ui)
        this.list.push(project)
        return project
    }

    private setDetailsPage(project: Project){
        const detailsPage = document.getElementById("project-details")
        if (!detailsPage) { return }
        const details = {
            name: project.name,
            description: project.description,
            name_s: project.name,
            description_s: project.description,
            status: project.status,
            userRole: project.userRole,
            cost: project.cost,
            finishDate: project.finishDate,
            progress: project.progress
        }
        for (const key in details) {
            const detail = detailsPage.querySelector(`[data-project-info='${key}']`)
            if (detail) {
                const value = details[key]
                switch (key) {
                    case "cost":
                        detail.textContent = "$" + value
                        break;
                    case "finishDate":
                        detail.textContent = `${value.getFullYear()}-${(value.getMonth()+1).toString().padStart(2,"0")}-${value.getDate().toString().padStart(2,"0")}`
                        break;
                    case "progress":
                        detail.textContent = `${value * 100}%`
                        detail.style.width = `${value * 100}%`
                        break;
                    default:
                        detail.textContent = value
                }
            }
        }  
    }

    getProject(id: string) {
        const project = this.list.find((project) => {
            // const idMatch = Project.id === id
            return project.id === id
        })
        return project
    }

    editProject(project: Project) {
        if(!project) { return }
        // update project from edit dialog form input data 
        // set project setdetailspage
        console.log("let's update Project Items!")


        project.updateUI()
        this.setDetailsPage(project)
        return project
    }

    deleteProject(id: string) {
        const project = this.getProject(id)
        if(!project) { return }
        project.ui.remove()
        const remaining = this.list.filter((project) => {
            return project.id !== id
        })
        this.list = remaining
    }
        
    totalCostOfAllProjects() {
        // const totalCost: number = this.list.reduce((acc, cur, idx) => {return acc += cur.cost}, 0)
        const totalCost: number = this.list.reduce((acc, cur) => acc + cur.cost, 0)
        return totalCost
    }

    getProjectByName(name: string) {
        const project = this.list.find((project) => {
            return project.name === name
        })
        return project
    }


    exportToJSON(fileName: string = "projects") {
        const json = JSON.stringify(this.list, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
        URL.revokeObjectURL(url)
    }

    importFromJSON() {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'application/json'
        const reader = new FileReader()
        reader.addEventListener("load", () => {
            const json = reader.result
            if (!json) { return }
            const projects: IProject[] = JSON.parse(json as string)
            for (const project of projects) {
                try {
                    this.newProject(project)
                } catch (err) {
                    console.log(err)
                }
            }
        })

        input.addEventListener('change', () => {
            const filesList = input.files
            if (!filesList) { return }
            reader.readAsText(filesList[0])
        })
        input.click()
    }
    y4m2d2(date: Date){
        return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,"0")}-${date.getDate().toString().padStart(2,"0")}`
    }
}