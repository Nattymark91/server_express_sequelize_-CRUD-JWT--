const ApiError = require('../error/ApiError');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {Users} = require('../models/models')

const generateJwt = (id, name) => {
    return jwt.sign(
        {id, name},
        process.env.SECRET_KEY,
        {expiresIn: '1h'}
    )
}

class UsersController {
    async registration(req, res, next) {
        try {
            const {name, password, age} = req.body
            if (!name || !password) {
                return next(ApiError.badRequest('Некорректное имя или пароль'))
            }
            if (!age) {
                return next(ApiError.badRequest('Укажите возраст'))
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const user = await Users.create({name, password: hashPassword, age})
            const id = user.id
            const token = generateJwt(user.id, user.name)
            return res.json({token, id})
        } catch (error) {
            next(ApiError.internal(`К сожалению на сервере произошла ошибка. Пожалуйста, повторите позже.`))
        }     
    }

    async login(req, res, next) {
            try {
            const {id, password} = req.body
            const user = await Users.findOne({where: {id}})
            if (!user) {
                return next(ApiError.badRequest('Некорректный email или пароль'))
            }
            let comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                return next(ApiError.badRequest('Некорректный email или пароль'))
            }
            const token = generateJwt(user.id, user.name)
            return res.json({token})
        } catch (error) {
            next(ApiError.internal(`К сожалению на сервере произошла ошибка. Пожалуйста, повторите позже.`))
        } 
    }


    async update(req, res, next) {
        try {
            const {id} = req.params
            const userId = req.userId
            let {name, age} = req.body
            console.log(userId, name, age)
            if (!userId)  {
                return next(ApiError.forbidden('Войдите или зарегистрируйтесь'))
            }
            if (userId != id)  {
                return next(ApiError.forbidden('Вы не можете редактировать данные другого пользователя'))
            }
            if (!name && !age)  {
                return next(ApiError.badRequest('Не выбраны данные для изменения'))
            }
            if (!name)  {
                const user = await Users.update(
                    {age: age},
                    {where: { id: id}})
                    return res.status(200).json({message: "Возраст изменен"})
            }
            if (!age)  {
                const user = await Users.update(
                    {name: name},
                    {where: { id: id}})
                    return res.status(200).json({message: "ФИО изменены"})
            }
            const user = await Users.update(
                {age: age, name: name},
                {where: {id: id}})
                return res.status(200).json({message: "Данные изменены"})
        } catch (error) {
            next(ApiError.internal(`К сожалению на сервере произошла ошибка. Пожалуйста, повторите позже.`))
        } 
    }

    async getAll(req, res, next) {
        try {
            let {page, limit} = req.query
                page = +page || 1
                limit = +limit || 50
                let offset = page * limit - limit
                let users = await Users.findAndCountAll ({limit, offset,
                        attributes: { exclude: ['password'] }, 
                })
                return res.json(users)
        } catch (error) {
            next(ApiError.internal(`К сожалению на сервере произошла ошибка. Пожалуйста, повторите позже.`))
        } 
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params
            const user = await Users.findOne ({where: {id}, attributes: { exclude: ['password'] }})
                return res.json(user)
        } catch (error) {
            next(ApiError.internal(`К сожалению на сервере произошла ошибка. Пожалуйста, повторите позже.`))
        } 
    }
}

module.exports = new UsersController()