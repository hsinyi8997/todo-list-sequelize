const express = require('express')
const { redirect } = require('express/lib/response')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/new', (req, res) => {
  const UserId = req.user.id
  const { name } = req.body
  Todo.create({ name, UserId })
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err))
})

router.get('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  return Todo.findOne({ where:{ id, UserId}})
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  Todo.findOne({ where: { UserId, id}})
    .then(todo => res.render('edit', { todo: todo.toJSON() }))
})

router.put('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  const { name } = req.body
  const isDone = req.body.isDone === 'on'
  Todo.update({ name, isDone}, { where: { UserId, id }})
    .then(() => res.redirect(`/todos/${id}`))
    .catch((err) => console.log(err))
})

router.delete('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  Todo.findOne({ where: { UserId, id }})
    .then(todo => todo.destroy())
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err))
})


module.exports = router