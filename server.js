const path = require('path');
const mongoose = require('mongoose')
const express = require('express');
const User = require('./models/user')
const Course = require('./models/course')
const Lesson = require('./models/lesson')
const Comment = require('./models/comment');
const Cookies = require('cookies');
const app = express();

const PORT = 3000
const db = 'mongodb://localhost:27017/CoursePlatform'

mongoose
    .connect(db)
    .then(() => console.log('Connected to DB'))
    .catch(error => console.log(error))

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`listening port ${PORT}`);
});

app.use(express.urlencoded({ extended: false }))

// регистрация
app.post('/registration', (req, res) => {
    const { username, password, email } = req.body
    User.create({ username, password, email, role: 'user' })
        .then(result => {
            console.log(result)
            res.status(200).send('Добро пожаловать!')
        })
        .catch(error => {
            console.log(error)
            res.status(400).send('Такой пользователь уже есть!')
        })
})

// авторизация
app.post('/login', (req, res) => {
    const { username, password } = req.body
    const cookies = Cookies(req, res);

    if (cookies.get('username') == username) {
        return res.status(400).send('Вы уже авторизованы!');
    }
    
    User.findOne({ username, password })
        .then(result => {
            if (result) {
                cookies.set('username', username)
                res.status(200).send('Добро пожаловать!')
            } else {
                res.status(400).send('Неверно введен логин или пароль')
            }
        })
        .catch(error => {
            console.log(error)
            res.status(400).send('Неверно введен логин или пароль')
        })
})

// смена имени
app.patch('/rename', (req, res) => {
    const { username } = req.body
    const cookies = Cookies(req, res)
    User.findOneAndUpdate({ 'username': cookies.get('username') }, { username }, { runValidators: true })
        .then(result => {
            if (result) {
                cookies.set('username', username)
                res.status(200).send('Имя успешно изменено')
            } else {
                res.status(400).send('Пользователь не найден')
            }
        })
        .catch(error => {
            console.log(error)
            res.status(400).send(error.message)
        })
})

// смена пароля
app.patch('/change-password', (req, res) => {
    const { password } = req.body
    const cookies = Cookies(req, res)

    if (!cookies.get('username')) {
        res.status(400).send('Вы не авторизованы!')
    }

    User.findOneAndUpdate({ 'username': cookies.get('username') }, { password }, { runValidators: true })
        .then(result => result ? res.status(200).send('Пароль успешно изменен') : res.status(400).send('Пользователь не найден'))
        .catch(error => {
            console.log(error)
            res.status(400).send(error.message)
        })
})

// смена роли пользователя
app.patch('/change-role', (req, res) => {
    const { username, role } = req.body
    const cookies = Cookies(req, res)

    if (!cookies.get('username')) {
        res.status(400).send('Вы не авторизованы!')
    }

    User.findOneAndUpdate({ username }, { role }, { runValidators: true })
        .then(result => {
            if (result) {
                res.status(200).send(`Роль изменена на ${role}`)
            } else {
                res.status(400).send('Пользователь не найден')
            }
        })
        .catch(error => {
            console.log(error)
            res.status(400).send(error.message)
        })
})

// добавления курса
app.post('/add-course', (req, res) => {
    const { name, description, time } = req.body
    const cookies = Cookies(req, res)

    if (!cookies.get('username')) {
        res.status(400).send('Вы не авторизованы!')
    }

    Course.create({ name, description, time, deleted: false })
        .then(result => {
            console.log(result)
            res.status(200).send('Курс успешно добавлен!')
        })
        .catch(error => {
            console.log(error)
            res.status(400).send(error.message)
        })
})

// вывод курса по запросу
app.get('/courses', (req, res) => {
    const { name } = req.body
    Course.find({ name })
        .then(result => result ? res.status(200).send(result) : res.status(400).send('Курсы не найдены'))
        .catch(error => {
            console.log(error)
            res.status(400).send(error.message)
        })
})

// удалить курс
app.patch('/remove-course', async (req, res) => {
    const { name, deleted } = req.body
    const cookies = Cookies(req, res)

    if (!cookies.get('username')) {
        res.status(400).send('Вы не авторизованы!')
    }

    const userRole = await User.findOne({ 'username': cookies.get('username') })
    if (userRole.role != 'admin') {
        console.log(userRole.role)
        return res.status(400).send(`У вас недостаточно прав`)
    }

    const deleteCourse = await Course.findOneAndUpdate({ name }, { deleted })

    deleteCourse ? res.status(200).send(`Курс удален`) : res.status(400).send(`Курс не удален, так как его не существует`)
})

//добавление урока
app.post('/add-lesson', (req, res) => {
    const { course_name, title, content } = req.body
    const cookies = Cookies(req, res)

    if (!cookies.get('username')) {
        res.status(400).send('Вы не авторизованы!')
    }

    Lesson.create({ course_name, title, content, status: 'unread' })
        .then(result => result ? res.status(200).send('Урок успешно добавлен!') : res.status(400).send('Такой урок уже существует'))
        .catch(error => {
            console.log(error)
            res.status(400).send(error.message)
        })
})

// поиск уроков по курсу
app.get('/lessons', (req, res) => {
    const { course_name } = req.body
    Lesson.find({ course_name })
        .then(result => result ? res.status(200).send(result) : res.status(400).send('Курсы не найдены'))
        .catch(error => {
            console.log(error)
            res.status(400).send(error.message)
        })
})

// удаление урока или его возвращение
app.patch('/remove-course', (req, res) => {
    const { name, deleted } = req.body
    const cookies = Cookies(req, res)
    if (!cookies.get('username')) {
        res.status(400).send('Вы не авторизованы!')
    }
    Lesson.findOneAndUpdate({ name }, deleted)
        .then(result => {
            result ? res.status(200).send(`Курс удален`) : res.status(400).send(`Курс не удален, так как его не существует`)
        })
        .catch(error => {
            console.log(error)
            res.status(400).send(error.message)
        })
})

// добавление комментария
app.post('/add-comment', (req, res) => {
    const { lessonName, text } = req.body
    const cookies = Cookies(req, res)

    if (!cookies.get('username')) {
        res.status(400).send('Вы не авторизованы!')
    }

    User.findOne({ 'username': cookies.get('username') })
        .then(result => {
            Lesson.findOne({ title: lessonName })
                .then(result => {
                    Comment.create({ 'username': cookies.get('username'), lessonName, text })
                        .then(result => {
                            console.log(result)
                            result
                                ? res.status(200).send({ username: result.username, сreatedAt: result.createdAt, lessonName: result.lessonName, text: result.text })
                                : res.status(200).send()
                        })
                        .catch(error => {
                            console.log(error)
                            res.status(400).send(error.message)
                        })
                })
        })
})

// вывод комментариев по уроку
app.get('/lesson-comment', (req, res) => {
    const { name, title } = req.body
    const cookies = Cookies(req, res)

    if (!cookies.get('username')) {
        res.status(400).send('Вы не авторизованы!')
    }

    Course.findOne({ name })
        .then(result => {
            Lesson.findOne({ title })
                .then(result => {
                    Comment.find({ lessonName: title })
                        .then(result => {
                            console.log(result)
                            result
                            ? res.status(200).send(result)
                            : res.status(400).send('Комментарии не найдены')
                        })
                        .catch(error => {
                            console.log(error)
                            res.status(400).send(error.message)
                        })
                })
        })
})

app.use((req, res) => {
    res.status(400).json({
        message: 'Ошибка'
    })
})