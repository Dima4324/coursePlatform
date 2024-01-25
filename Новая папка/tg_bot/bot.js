const TelegramBot = require('node-telegram-bot-api');
const token = '6872237218:AAGS37TmbK5NkcnPUP_VjzVIDdFuhnD5mVY';
const bot = new TelegramBot(token, { polling: true });
const mongoose = require('mongoose');
const db = 'mongodb://localhost:27017/CoursePlatform'
const helloMessage = `Привет! Это бот платформы "Web University" \n\nВыбери, из меню что тебе нужно:`;

mongoose
    .connect(db)
    .then(() => console.log('Connected to DB'))
    .catch(error => console.log(error))

const commands = [
    {
        command: "menu",
        description: "Меню бота"
    }
]

const lessons = {
    reply_markup: {
        inline_keyboard: [
            [{ text: 'Показать уроки', callback_data: 'show' }]
        ],
    },
    parse_mode: 'markdown'
}

const menu = {
    reply_markup: {
        keyboard: [
            ['Посмотреть все курсы', 'Инфа о курсе']
        ],
        resize_keyboard: true
    }
}

bot.setMyCommands(commands);

function getCourses(msg) {
    var requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };

    fetch("http://localhost:3000/all-courses", requestOptions)
        .then(response => response.text())
        .then(result => {
            const resParse = JSON.parse(result)
            let output = '*Список курсов*\n\n'
            resParse.forEach(item => {
                output += `${item.name}\n`
            })
            bot.sendMessage(msg.chat.id, output, { parse_mode: 'markdown' })
        })
        .catch(error => console.log('error', error));
}

function getCourse(msg, name) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("name", name);
    console.log(urlencoded)

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
    };

    fetch("http://localhost:3000/courses", requestOptions)
        .then(response => response.text())
        .then(result => {
            const resParse = JSON.parse(result)
            const output = `*Название:* ${resParse.name}\n\n*Описание:* ${resParse.description}\n\n*Время прохождения:* ${resParse.time}`
            bot.sendMessage(msg.chat.id, output, lessons)
        })
        .catch(error => bot.sendMessage(msg, error.status))
}

function getLessons(msg, namelesson) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    
    var urlencoded = new URLSearchParams();
    urlencoded.append("courseName", namelesson);
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/lessons", requestOptions)
        .then(response => response.text())
        .then(result => {
            const resParse = JSON.parse(result)
            let i = 1
            resParse.forEach(item => {
                const str = `*Урок ${i}:* ${item.title}\n\n*Контент урока:* ${item.content}\n\n *Статус урока:* ${item.status}`
                bot.sendMessage(msg, str, { parse_mode: 'markdown' })
                i++
            })
        })
        .catch(error => console.log('error', error));
}

bot.on('text', msg => {
    switch (msg.text) {
        case '/start':
            bot.sendMessage(msg.chat.id, helloMessage, menu)
            break;
        case '/menu':
            bot.sendMessage(msg.chat.id, `Выбери, что тебе нужно:`, menu)
            break;
        case 'Посмотреть все курсы':
            getCourses(msg)
            break;
        case 'Инфа о курсе':
            bot.sendMessage(msg.chat.id, `Введи название курса`)
            bot.once('text', msg => {
                const name = msg.text;
                getCourse(msg, name)
            })
            break;
    }
})

bot.once('callback_query', query => {
    const chatId = query.message.chat.id;
    const data = query.data;
    switch (data) {
        case 'show':
            const nameLesson = query.text
            getLessons(chatId, nameLesson)
            break
    }
})  