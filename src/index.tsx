import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { Sidebar } from "./react-components/Sidebar.tsx"
import { ProjectsPage } from "./react-components/ProjectsPage.tsx"

import { color } from "three/examples/jsm/nodes/Nodes.js"
import * as OBC from "openbim-components"
import { Project, IProject, UserRole, ProjectStatus } from "./classes/Project.ts"
import { ProjectsManager } from "./classes/ProjectsManager.ts"
import * as THREE from "three"

import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
// import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.d.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import {MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
// import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'; 
//D:\ThatOpenCompany\masterbimdev\that-open-master\node_modules\three\examples\jsm\loaders\GLTFLoader.js

const rootElement = document.getElementById("app") as HTMLDivElement
const appRoot = ReactDOM.createRoot(rootElement)
appRoot.render(
    <>
    <Sidebar />
    <ProjectsPage />
    </>
)


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

//====Get created values from form:생성 프로젝트 양식 값 가져오기=====
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
        const projectDetails = document.getElementById("project-details") as HTMLElement
        let projectName = projectDetails.querySelector("[data-project-info='name']")?.textContent as string
        if (!(projectDetails && projectName)) return
        // console.log(projectName)

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
                    if(projectsManager.editProject(projectName, updateData)) {
                        editProjectForm.reset() //index.html 폼 데이터 상태로 프로젝트 값이 없어진다. Error발생 원인
                    }
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
    })
} else {     
    console.warn("New Todo button was not found")
}
    

const newTodoForm = document.getElementById("new-todo-form") as HTMLFormElement
if (newTodoForm instanceof HTMLFormElement) {
    newTodoForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const projectDetails = document.getElementById("project-details") as HTMLElement
        let todoprojectName = projectDetails.querySelector("[data-project-info='name']")?.textContent as string
        if (!(projectDetails && todoprojectName)) return

        const formData = new FormData(newTodoForm) 
        let todoMessage = formData.get('todo-message') as string        
        const todoStatus = formData.get('todo-status')? true : false

        try {
            if(todoMessage && projectsManager.newTodo(todoprojectName, todoMessage, todoStatus)) {
                newTodoForm.reset()
            }
            toggleModal("new-todo-modal","hide")
            // throw Error('raise an error');
            
        } catch(err) {
            // console.log("newTodoForm submit Error : ",err.message)
            const errorMessage = document.getElementById("edit-error-message") as HTMLElement
            errorMessage.textContent=`Error: ${err.message}`
            toggleModal("edit-error-message-modal", "show")
        } finally {
            //인수로 넘어온 값들을 초기화? 해준다
            todoprojectName = "" 
            todoMessage = ""
        }
        // return
    })

    const errorMessagCheckBTN = document.getElementById("edit-error-message-check-button") as HTMLButtonElement
    errorMessagCheckBTN.addEventListener("click",()=>{
        toggleModal("edit-error-message-modal","hide")
    })

} else {
    console.warn("New ToDo form was not found")
}

const editTodoItem = document.getElementById("todo-list")
if (editTodoItem) {
    editTodoItem.addEventListener("click", (e) => {
        if(e.target.id == 'todo-list') return
        const currentTodoItem = setCurTodo(e.target)
        let currentTodoItemIndex = Array.from(editTodoItem.children).findIndex(item => {            
            return item === currentTodoItem
        })
        // console.log(currentTodoItemIndex)
        toggleModal("edit-todo-modal","show")

        const editTodoForm = document.getElementById("edit-todo-form") as HTMLFormElement
        if (editTodoForm instanceof HTMLFormElement) {
            const todoExistMessage = editTodoForm.querySelector('textarea[name="edit-todo-message"]') as HTMLTextAreaElement    
            todoExistMessage.textContent = currentTodoItem.querySelector('p[name="todomessage"]').textContent
            const todoExistStatus = editTodoForm.querySelector('input[name="edit-todo-status"]') as HTMLInputElement
            todoExistStatus.checked = currentTodoItem.querySelector('span[name="todostatus"]').textContent === 'done'   

            editTodoForm.addEventListener("submit",(e)=>{
                e.preventDefault()
                const projectDetails = document.getElementById("project-details") as HTMLElement
                let todoprojectName = projectDetails.querySelector("[data-project-info='name']")?.textContent as string
                if (!(projectDetails && todoprojectName)) {return}

                const formData = new FormData(editTodoForm) 
                let todoMessage = formData.get('edit-todo-message') as string        
                let todoStatus = formData.get('edit-todo-status')? true : false

                try{
                    if(todoMessage && projectsManager.editTodo(todoprojectName, todoMessage, todoStatus, currentTodoItemIndex)) {
                        editTodoForm.reset()
                    }
                    toggleModal("edit-todo-modal","hide")
                    //throw Error('raise an error');                 
                }catch(err){
                    // console.log("newTodoForm submit Error : ",err.message)
                    const errorMessage = document.getElementById("edit-error-message") as HTMLElement
                    errorMessage.textContent=`Error: ${err.message}`
                    toggleModal("edit-error-message-modal", "show")
                }finally{
                    //인수로 넘어온 값들을 초기화? 해준다
                    todoprojectName = "" 
                    todoMessage = ""
                    currentTodoItemIndex = NaN
                }
                return
            })
            const errorMessagCheckBTN = document.getElementById("edit-error-message-check-button") as HTMLButtonElement
            errorMessagCheckBTN.addEventListener("click",()=>{
                toggleModal("edit-error-message-modal","hide")
            })
        } else {
            console.warn("Edit ToDo form was not found")
        }
        return 
    })
} else {     
    console.warn("todo-list was not found")
}

function setCurTodo (el) {
    if (!el) return null;
    if (el.classList.contains('todo-item')) {
        return el
    } 
    return setCurTodo(el.parentElement)
}

//todo lists filtered by search text
const todoSearch = document.getElementById('todo-search')
if (todoSearch) {
    todoSearch.addEventListener( 'input', searchTodos)
}

function searchTodos(event) {
    const searchText = event.target.value.toLowerCase()

    const projectDetails = document.getElementById("project-details") as HTMLElement
    const todoprojectName = projectDetails.querySelector("[data-project-info='name']")?.textContent as string
    if (!(projectDetails && todoprojectName)) {return}
    
    const curproject = projectsManager.getProjectByName(todoprojectName) as Project
    projectsManager.updateTodoListUI(curproject)

    if (searchText){
        const allTodos = document.getElementById('todo-list') as HTMLElement
        const sourcetodos = [...allTodos.children]
        allTodos.innerHTML = ''
        sourcetodos.forEach(todo => {
            if(todo.querySelector('[name="todomessage"]')?.textContent?.toLowerCase().includes(searchText)) {
                allTodos.appendChild(todo)
            }
        })
    } 
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
    // projectsManager.newProject(defaultProjectData)
    const project = projectsManager.newProject(defaultProjectData)
    project.ui.click()
}

// ThreeJS Viewer

// const scene = new THREE.Scene()  //Scene

// const screen_viewercontainer = document.getElementById("viewer-container") as HTMLElement  //Screen

// const camera = new THREE.PerspectiveCamera(75) //Camera
// camera.position.z = 5

// const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true}) //Renderer CameraMan, 
//                                         // Renderer's configuration object
// screen_viewercontainer.append(renderer.domElement) //Cinema Theater Play

// function resizeViewer() {
//     const screen_containerDimensions = screen_viewercontainer.getBoundingClientRect()
//     renderer.setSize(screen_containerDimensions.width, screen_containerDimensions.height)
//     const aspectRatio = screen_containerDimensions.width / screen_containerDimensions.height 
//     camera.aspect = aspectRatio
//     camera.updateProjectionMatrix()
// }

// window.addEventListener("resize", resizeViewer)

// resizeViewer()

const boxGeometry = new THREE.BoxGeometry()
const material = new THREE.MeshStandardMaterial()
const cube = new THREE.Mesh(boxGeometry, material)
cube.material.color = new THREE.Color("skyblue")//#a09911")
// const directionalLight = new THREE.DirectionalLight()
// directionalLight.position.set(-3, 9, 6)
// directionalLight.intensity = 0.8
// const directionalLightBack = new THREE.DirectionalLight()
// directionalLightBack.position.set(3, -9, -6)
// directionalLightBack.intensity = 0.2

// const ambientLight = new THREE.AmbientLight()
// ambientLight.intensity = 0.4

// const spotLight = new THREE.SpotLight()
// spotLight.position.set(1, 9, 5)
// spotLight.decay = 1
// spotLight.distance = 0
// spotLight.penumbra = 0.2
// spotLight.intensity = 10

// // spotLight.castShadow = true
// console.log("spotLight.intensity: ",spotLight.intensity)
// console.log("spotLight.position: ",spotLight.position)
// console.log("spotLight.penumbra: ", spotLight.penumbra)
// console.log("spotLight.decay: ", spotLight.decay)
// console.log("spotLight.distance: ", spotLight.distance)

// const spotLightHelper = new THREE.SpotLightHelper(spotLight)

// // scene.add(cube, directionalLight, ambientLight ,directionalLightBack)
// scene.add(cube, directionalLight, ambientLight ,directionalLightBack, spotLight, spotLightHelper)

// const cameraControls = new OrbitControls(camera, screen_viewercontainer)



// const axes = new THREE.AxesHelper()
// const grid = new THREE.GridHelper()
// grid.material.transparent = true
// grid.material.opacity = 0.4
// grid.material.color = new THREE.Color("#808080")
// scene.add(axes, grid)

// // cube.position.x = 2
// // cube.position.y = 0
// // cube.position.z = 1
// cube.position.set(2,0,-1)

// const gui = new GUI()

// const cubeControls = gui.addFolder("CubeBox")

// cube.visible = false
// cubeControls.add(cube.position, "x", -10, 10, 1)
// cubeControls.add(cube.position, "y", -10, 10, 1)
// cubeControls.add(cube.position, "z", -10, 10, 1)

// cubeControls.add(cube, "visible") //cube.visible
// cubeControls.addColor(cube.material, "color") //cube.material.color


// // const someObject = {name: "Eugene", age: 55}

// // cubeControls.add(someObject,'age')
// // cubeControls.add(someObject, "name")

// // m3c2l6 Lesson Assignments
// // directional light gui controls
// const directionalLightControls = gui.addFolder("Directional Light")

// directionalLightControls.add(directionalLight.position, 'x', -10, 10, 0.5)
// directionalLightControls.add(directionalLight.position, 'y', -10, 10, 0.5)
// directionalLightControls.add(directionalLight.position, 'z', -10, 10, 0.5)

// directionalLightControls.add(directionalLight, 'intensity', 0, 1, 0.1 )

// directionalLightControls.addColor(directionalLight, 'color' )


// // m3c2l7 Lesson Assignments
// // spot light gui controls
// const spotLightControls = gui.addFolder("Spot Light")
// spotLightControls.add(spotLight, 'intensity', 0, 100, 1)
// spotLightControls.add(spotLight.position, 'x', -100, 100, 1)
// spotLightControls.add(spotLight.position, 'y', -100, 100, 1)
// spotLightControls.add(spotLight.position, 'z', -100, 100, 1)
// spotLightControls.add(spotLight, 'penumbra', 0, 1, 0.1)
// spotLightControls.add(spotLight, 'decay', 0, 10, 1)
// spotLightControls.add(spotLight,'distance', 0, 10, 0.1)
// spotLightControls.add(spotLightHelper,'visible')




const viewer = new OBC.Components()

const sceneComponent = new OBC.SimpleScene(viewer)
sceneComponent.setup()
viewer.scene = sceneComponent
const scene = sceneComponent.get()
scene.background = null

const viewerContainer = document.getElementById("viewer-container") as HTMLDivElement
const rendererComponent = new OBC.SimpleRenderer(viewer, viewerContainer)
viewer.renderer = rendererComponent
const renderer = rendererComponent.get()

const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer)
viewer.camera = cameraComponent
const camera = cameraComponent.get()

viewer.init()
cameraComponent.updateAspect()
scene.add(cube)






// objloader
const objloader = new OBJLoader()
const mtlloader = new MTLLoader()


mtlloader.load("../assets/Gear/Gear1.mtl", (materials) => {
    materials.preload()
    objloader.setMaterials(materials)
    objloader.load("../assets/Gear/Gear1.obj", (meshs) => {
        scene.add(meshs)
        meshs.position.set(0, -2.8, 0)
    })
})

// // m3c2l7 Lesson Assignments
// // 2. glTFloader
let gltfmodel, mixer, gltfskeleton

const gltfloader = new GLTFLoader()
gltfloader.load("../assets/glTF/BrainStem.glb", (gltf)=>{
    gltfmodel = gltf.scene
    console.log(gltf)
    scene.add(gltfmodel)

//     // gltfskeleton = new THREE.SkeletonHelper(gltfmodel)
//     // gltfskeleton.visible = true
//     // scene.add(gltfskeleton)
    mixer = new THREE.AnimationMixer(gltfmodel)
    const clips = gltf.animations;
    const clip = THREE.AnimationClip.findByName( clips, 'animation_0')
    const action = mixer.clipAction( clip)
    action.play()

//     // clips.forEach((clip)=> {
//     //     console.log(clip)
//     //     mixer.clipAction(clip).play()
//     // })

})


const clock = new THREE.Clock()

function updateAnimation() {
    const deltaTime = clock.getDelta()
    if (mixer) mixer.update(deltaTime)
}

function renderAnimation() {   
    updateAnimation()
    renderer.render(scene, camera)
    requestAnimationFrame(renderAnimation)
}

renderAnimation()

