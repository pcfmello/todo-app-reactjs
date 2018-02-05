import React, {Component} from 'react'
import axios from 'axios'

import PageHeader from '../template/pageHeader'
import TodoForm from './todoForm'
import TodoList from './todoList'

const URL = 'http://localhost:3003/api/todos'

export default class Todo extends Component {

    constructor(props) {
        super(props)
        this.state = { description: '', list: [] }
        this.add = this.add.bind(this)
        this.change = this.change.bind(this)
        this.refresh = this.refresh.bind(this)
        this.remove = this.remove.bind(this)
        this.markAsDone = this.markAsDone.bind(this)
        this.markAsPending = this.markAsPending.bind(this)
        this.search = this.search.bind(this)
        this.clear = this.clear.bind(this)
        
        this.refresh()
    }

    add() {
        axios.post(URL, { description: this.state.description })
            .then(resp => this.refresh())
    }

    change(event) {
        this.setState({...this.state, description: event.target.value})
    }

    refresh(description = '') {
        const search = description ? `&description__regex=/${description}/i` : ''
        axios.get(`${URL}?sort=-createdAt${search}`)
            .then(resp => this.setState({ ...this.state, description, list: resp.data }))
    }
    
    remove(todo) {
        axios.delete(`${URL}/${todo._id}`)
            .then(resp => this.refresh(this.state.description))
    }

    markAsDone(todo) {
        axios.put(`${URL}/${todo._id}`, { ...todo, done: true })
            .then(resp => this.refresh(this.state.description))
    }

    markAsPending(todo) {
        axios.put(`${URL}/${todo._id}`, { ...todo, done: false })
            .then(resp => this.refresh(this.state.description))
    }

    search() {
        this.refresh(this.state.description)
    }

    clear() {
        this.refresh();
    }

    render() {
        return (
            <div>
                <PageHeader name="Tarefas" small="Cadastro" />
                <TodoForm 
                        description={this.state.description}
                        handleAdd={this.add} 
                        handleChange={this.change}
                        handleSearch={this.search}
                        handleClear={this.clear} />

                <TodoList list={this.state.list} 
                        handleRemove={this.remove} 
                        handleMarkAsDone={this.markAsDone} 
                        handleMarkAsPending={this.markAsPending}/>
            </div>
        )
    }
}