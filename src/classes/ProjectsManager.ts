import { IProject, Project } from "./Project"


export class ProjectsManager {
    list: Project[] = []

    ui: HTMLElement

    constructor(container: HTMLElement) {
        this.ui = container
    }

    newProject(data: IProject) {
        this.validProjectInput(data)
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

    private validProjectInput(data: IProject){
        const projectNames = this.list.map((project) => {
            return project.name
        })
        const nameInUse = projectNames.includes(data.name)
        if (nameInUse) {
            throw new Error(`A project with the name "${data.name}" already exists`)
        }
        if (data.name.length < 5) {
            throw new Error(`project name have to longer than 5 charactor`)
        }        
    }

    private setDetailsPage(project: Project){
        const detailsPage = document.getElementById("project-details")
        if (!detailsPage) { return }
        const details = {
            name: project.name,
            icon_char: [project.name.slice(0,2),
                        project.ui.getAttribute("icon-color")],
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
                        detail.textContent = this.y4m2d2(value)
                        break;
                    case "progress":
                        detail.textContent = `${value * 100}%`
                        detail.style.width = `${value * 100}%`
                        break;
                    case "icon_char":
                        detail.textContent = value[0]
                        detail.style.backgroundColor = value[1]
                        break;
                    default:
                        detail.textContent = value
                    
                }
            }
        }  
        // set To-Do list
        let todoList = document.getElementById('todo-list')
        if (!todoList) {return}
        let ui: HTMLElement = document.createElement('div')
        const todo = project.todoList[0]
        // project.todoList.forEach( todo => {
        //     const todoui
        //     const todoUi
        const datestr = todo.msgDate.toDateString().split(" ")
        const msgdate = datestr[0] + ", " + datestr[2] + " " + datestr[1]
        todoList.innerHTML = `<div class="todo-item" >
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; column-gap: 15px; align-items: center;">
                    <span class="material-icons-round" style="padding: 10px; background-color: #686868; border-radius: 10px;">construction</span>
                    <p>${todo.message}</p>
                </div>
                <p style="text-wrap: nowrap; margin-left: 10px;">
                ${msgdate}</p>
            </div>
        </div>`
        //     ui.append(todoUI)
        // })
        // todoList = ui
        // todoList.innerHTML=`<div class="todo-item" >
        //     <div style="display: flex; justify-content: space-between; align-items: center;">
        //         <div style="display: flex; column-gap: 15px; align-items: center;">
        //             <span class="material-icons-round" style="padding: 10px; background-color: #686868; border-radius: 10px;">construction</span>
        //             <p>Make anything here as you want, even something longer.</p>
        //         </div>
        //         <p style="text-wrap: nowrap; margin-left: 10px;">Fri, 20 sep</p>
        //     </div>
        // </div>`

    }

    getProject(id: string) {
        const project = this.list.find((project) => {
            // const idMatch = Project.id === id
            return project.id === id
        })
        return project
    }

    editProject(projectName: string, updateData: IProject) {
        if(!projectName) { return }
        if(projectName != updateData.name) {this.validProjectInput(updateData)}
        const project: Project = this.getProjectByName(projectName) as Project
        Object.assign(project, updateData)   
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

    newTodo(todoMessage: string) {
        if(todoMessage === ""){return}
        console.log("input new todo", todoMessage)
        return
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

    y4m2d2(value: any){
        // let date
        // if (typeof value === 'string'){
        //     date =new Date(value)
        // }else if(value instanceof Date) {
        //     date = value
        // }else {
        //     throw new Error('Invalid Date string or Date instance')
        // }
        // date = value instanceof Date ? value : typeof value === 'string' ? new Date(value) : 'Invalid Date string or Date instance'
        let date = value instanceof Date ? value : new Date(value ?? 'Invalid Date string or Date instance');

        return `${
            date.getFullYear()
        }-${
            (date.getMonth()+1).toString().padStart(2,"0")
        }-${
            date.getDate().toString().padStart(2,"0")
        }`
    }
}