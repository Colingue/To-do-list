const express = require('express')
const ejs = require('ejs')
const mongoose = require('mongoose')
const Task = require('./models/tasks')
const bodyParser = require('body-parser')
const methodOverride = require('method-override');
const { $where } = require('./models/tasks')
const moment = require('moment')

const app = express()

mongoose.connect('mongodb://localhost/to_do_list', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));

mongoose.set('useFindAndModify', false);


app.set('view engine', 'ejs')

app.get("/", async (req, res) => {
    const tasksActualDate = await Task.find().where('finished', false).where('date', { $ne: null }).sort({ date: 'asc' })
    const tasksActualNoDate = await Task.find().where('finished', false).where('date', null)
    const tasksFinished = await Task.find().where('finished', true)
    res.render('all_task.ejs', { tasksActualDate: tasksActualDate, tasksActualNoDate: tasksActualNoDate, tasksFinished: tasksFinished })
})

app.get('/edit/:id', async (req, res) => {
    const task = await Task.findById(req.params.id)
    res.render('edit.ejs', { task: task, moment: moment});
})

app.get("/new", (req, res) => {
    res.render('new.ejs', {task: new Task()})
})

app.post("/new", async (req, res, next) => {
    req.task = new Task()
    next()
}, saveTaskAndRedirect('new'));

app.put("/edit/:id", async (req, res, next) => {
    req.task = await Task.findById(req.params.id)
    next()
}, saveTaskAndRedirect('edit'));

app.put("/finished/:id", async (req, res, next) => {
    if(req.body.checkbox_task){
        await Task.findOneAndUpdate({ _id: req.params.id }, { finished: true })       
    }
    else{
        await Task.findOneAndUpdate({ _id: req.params.id }, { finished: false })       
    }
    next(),
    res.redirect('/')
})


function saveTaskAndRedirect(path){
    return async (req, res) => {
        let task = req.task
        task.content = req.body.content
        task.date = req.body.date
        try {
            task = await task.save()
            res.redirect('/')
        } catch (error) {
            res.render(`${path}`, {task: task})
        }
    }
}




app.listen(5000)