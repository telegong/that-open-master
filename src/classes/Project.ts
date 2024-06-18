import { v4 as uuidv4 } from 'uuid'

export type UserRole = "Architect" | "Engineer" | "Developer"
export type ProjectStatus = "Pending" | "Active" | "Finished"

export interface IProject {
    name: string 
    description: string
    userRole: UserRole
    status: ProjectStatus
    finishDate: Date
}
export interface ITodo {
    message: string
    msgDate: Date
    status: boolean
}

export class Todo {
    message: string
    msgDate: Date
    status: boolean
    constructor(todo: ITodo){
        for (const key in todo) {
            this[key] = todo[key];
        }
    }
}
export const defaultTodo: ITodo = {
    message: "Make anything here as you want, even something longer.",
    msgDate: new Date(),
    status: false
}

export class Project {
    //To Satisfy IProject
    name: string 
    description: string
    userRole: UserRole
    // userRole: "Architect" | "Engineer" | "Developer"
    status: ProjectStatus
    // status: "Pending" | "Active" | "Finished"
    finishDate: Date

    //Class internals
    ui: HTMLDivElement
    cost: number = 100000
    progress: number = 0.9
    id: string
    // iconColor: HTMLElement
    todoList: Todo[] =[]//defaultTodo]
    
    constructor(data: IProject) {
        //Project data definition
        for (const key in data) {
            this[key] = data[key];
        }
        // this.name = data.name
        // this.description = data.description
        // this.status = data.status
        // this.userRole = data.userRole
        // this.finishDate = data.finishDate
        if(!this.id){
            this.id = uuidv4()
        }
        this.setUI()
    } 

    //creates the project card UI
    setUI() {
        //if (this.ui) {return}
        this.ui = document.createElement("div")
        this.ui.className = "project-card"
        const idx = Math.floor(Math.random() * 5)  // background-color: #ca8134; //var(--icon-char-bg-color${idx});  
        this.ui.setAttribute("icon-color", `var(--icon-char-bg-color${idx})`)
        this.updateUI()       
        // console.log(this.ui)
    }
    
    //update the project card UI
    updateUI() {

        this.ui.setAttribute("pname", this.name)
        this.ui.innerHTML = `
        <div class="card-header">
            <p style="background-color: ${this.ui.getAttribute("icon-color")};
                    padding: 5px; border-radius: 8px; aspect-ratio: 1;
                    text-transform: uppercase; text-align: center; width: 36px;
                    display: flex; flex-direction: column; justify-content: center;"  >
                ${this.name.slice(0,2)}</p>
            <div>
                <h5>${this.name}</h5>
                <!--h5>${this.id}</h5-->
                <p>${this.description}</p>
            </div>
        </div>
        <div class="card-content">
            <div class="card-property">
                <p style="color: #969696;">Status</p>
                <p>${this.status}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Role</p>
                <p>${this.userRole}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Cost</p>
                <p>$${this.cost}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Estimated Progress</p>
                <p>${this.progress * 100}%</p>
            </div>
        </div> `
    }
}

