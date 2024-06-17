[Javascript] 부모, 자식, 형제 노드(node)와 요소(element) 찾기
출처: https://hianna.tistory.com/712 [어제 오늘 내일:티스토리](https://hianna.tistory.com/712)

[버블링과 캡처링](https://ko.javascript.info/events)

[[JavaScript] 이벤트 버블링(Event Bubbling), 이벤트 캡처링(Event Capturing)](https://jhyonhyon.tistory.com/24)

[onclick event](https://www.w3schools.com/jsref/event_onclick.asp)

```js
function setCurTodo (el) {
    if (!el) return null; // 종료 조건: el이 null이면 null 반환
    if (el.classList.contains('todo-item')) {
        el.setAttribute('current-todo', true);
        return el;
    } 
    return setCurTodo(el.parentElement); // 부모 요소로 재귀 호출
}

const editTodoItemIndex = [...document.querySelectorAll('.todo-item')].findIndex(item => item.hasAttribute('current-todo') ) 
console.log(editTodoItemIndex)

const todoItems = document.querySelectorAll('.todo-item');
const editTodoItemIndex = Array.from(todoItems).findIndex(item => {
  item.hasAttribute('current-todo')
});

const todoItems = document.querySelectorAll('.todo-item');
const editTodoItemIndex = [...todoItems].findIndex(item => { 
  item.hasAttribute('current-todo')
});

```



## [JS 클릭한 요소의 index 구하기](https://gurtn.tistory.com/134)

### 1.

```js
const boxs = document.querySelectorAll(".boxList > div");

boxs.forEach((el, index) => {
  el.onclick = () => {
    console.log(index);
  }
});
```

### 2. 

```js
const $box = document.querySelector(".boxList");

$box.onclick = (e) => {
  const nodes = [...e.target.parentElement.children];

  const index = nodes.indexOf(e.target);
  
  console.log(index);
}
```

### 3.

```js
const boxs = document.querySelectorAll(".boxList > div");

boxs.forEach(el => {
  el.onclick = (e) => {
    const nodes = [...e.target.parentElement.children];

    console.log(e.target.parentElement, nodes);

    const index = nodes.indexOf(e.target);

    console.log(index)
  }
});
```