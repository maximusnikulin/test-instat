import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { observable, computed, action } from 'mobx'
import { observer } from 'mobx-react'

import './index.css'

const VISIBLE_ALL = 'VISIBLE_ALL'
const VISIBLE_COMPLETED = 'VISIBLE_COMPLETED'
const VISIBLE_UNCOMPLETED = 'VISIBLE_UNCOMPLETED'

class TodoStore {
  @observable todos = []
  @observable filterText = ''
  @observable filterVisibility = VISIBLE_ALL

  checkFilterText (el, filterText) {
    if (!filterText) {
      return true
    }

    const text = el.text.toLowerCase()
    filterText = filterText.toLowerCase()
    return text.indexOf(filterText) !== -1
  }

  checkFilterVisiblity (el, filterVisibility) {
    switch (filterVisibility) {
    case VISIBLE_ALL:
      return true
    case VISIBLE_COMPLETED:
      return el.completed
    case VISIBLE_UNCOMPLETED:
      return !el.completed
    default:
      return true
    }
  }

  @computed get filteredTodos() {
    // ALWAYS NEED STRAIGHT ACCESS TO DEPENDING FIELDS ???
    return this.todos.filter(
      todo => this.checkFilterVisiblity(todo, this.filterVisibility) && this.checkFilterText(todo, this.filterText)
    )
  }

  @action changeFilterText(text) {
    this.filterText = text
  }

  @action changeFilterVisibility(type) {
    this.filterVisibility = type
  }

  @action toggleCompleteTodo (id) {
    const todo = this.todos.find(todo => todo.id === id)
    todo.completed = !todo.completed
  }

  @action addTodo(text) {
    this.todos.push({
      id: _.uniqueId('todo_'),
      text,
      completed: false
    })
    this.filterText = ''
  }
}

const store = new TodoStore()

setTimeout(() => {
  store.addTodo('Rachel dances')
  store.addTodo('Joey eats')
  store.addTodo('Monica cleans')
  store.addTodo('Phoebe sings')
}, 1000)

const App = observer(({ store }) => (
  <div>
    <h1>That's my awesome list {Date.now()}</h1>
    <TodoSmartFilter
      filterText={store.filterText}
      onEnter={(e) => {
        store.addTodo(e.target.value)
      }}
      onChangeText={(e) => store.changeFilterText(e.target.value)}
      onChangeVisibility={(value) => store.changeFilterVisibility(value)} />
    <TodoList todos={store.filteredTodos} onClickTodo = {(e) => {
      // USE DELEGATE FOR MANY ITEMS
      if (e.target.classList.contains('js-todo-toggler')) {
        store.toggleCompleteTodo(e.target.getAttribute('id'))
      }
    }} />
  </div>
))

const TodoSmartFilter = observer(({
  filterText,
  onChangeText,
  onEnter,
  onChangeVisibility
}) => (
  <div className='todos__filter'>
    <input
      value={filterText}
      onChange={onChangeText}
      onKeyDown={(e) => e.keyCode === 13 && onEnter(e)} />
    <button onClick={() => onChangeVisibility(VISIBLE_ALL)}>ALL</button>
    <button onClick={() => onChangeVisibility(VISIBLE_COMPLETED)}>COMPLETED</button>
    <button onClick={() => onChangeVisibility(VISIBLE_UNCOMPLETED)}>UNCOMPLETED</button>
  </div>
))

const TodoList = observer(({ todos, onClickTodo }) => (
  <ul onClick={onClickTodo} className='todos'>
    {todos.map(todo => <TodoItem {...todo} key={todo.id} />)}
  </ul>
))

const TodoItem = ({id, text, completed}) => (
  <li id={id} className={`js-todo-toggler todos__item ${completed ? 'todos__item_completed' : ''}`}>
    <p>{text}</p>
  </li>
)

ReactDOM.render(<App store={store}/>, document.getElementById('root'))