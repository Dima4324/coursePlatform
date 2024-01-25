# Инструкция по работе с API


## Разбор файлов
* `server.js` - Все роуты в API.
* `models` - Папка с моделями для БД.
* `API.postman_collection.json` - Файл для взаимодействия с API.

## Работа с API
Для работы с API нужно запустить файл `server.js`. В консоли должно появиться сообщение об успешном подключении к серверу и БД. Далее необходимо импортировать файл `API.postman_collection.json` в Postman и начинать работу.


## Документация по запросам

<table>
    <thead>
        <tr>
            <th>Название запроса</th>
            <th>Тип запроса</th>
            <th>Параметры</th>
            <th>Нужна авторизация</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Authorization</td>
            <td>POST</td>
            <td>username, password</td>
            <td style="text-align:center">-</td>
        </tr>
        <tr>
            <td>Registration</td>
            <td>POST</td>
            <td>username, password, email</td>
            <td style="text-align:center">-</td>
        </tr>
        <tr>
            <td>Rename</td>
            <td>PATCH</td>
            <td>username</td>
            <td style="text-align:center">+</td>
        </tr>
        <tr>
            <td>Change-roles</td>
            <td>PATCH</td>
            <td>username, role</td>
            <td style="text-align:center">+</td>
        </tr>
        <tr>
            <td>Change-password</td>
            <td>PATCH</td>
            <td>password</td>
            <td style="text-align:center">+</td>
        </tr>
        <tr>
            <td>Add-couse</td>
            <td>POST</td>
            <td>name, description, author, time</td>
            <td style="text-align:center">+</td>
        </tr>
        <tr>
            <td>Find-courses</td>
            <td>POST</td>
            <td>name</td>
            <td style="text-align:center">-</td>
        </tr>
        <tr>
            <td>Remove-course</td>
            <td>PATCH</td>
            <td>name, deleted</td>
            <td style="text-align:center">+</td>
        </tr>
        <tr>
            <td>Add-lesson</td>
            <td>POST</td>
            <td>courseName, title, content</td>
            <td style="text-align:center">+</td>
        </tr>
         <tr>
            <td>Search-lessons</td>
            <td>POST</td>
            <td>courseName</td>
            <td style="text-align:center">-</td>
        </tr>
</table>
