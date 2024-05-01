const {Users, Children} = require('../models/models');
const ApiError = require('../error/ApiError');

class ChildrenController {
    async create(req, res, next) {
        try {
            const userId = req.userId
            let {name, age} = req.body
            if (!userId)  {
                return next(ApiError.forbidden('Войдите или зарегистрируйтесь'))
            }
            if (!name || !age)  {
                return next(ApiError.badRequest('Заполните все поля'))
            }
            const haveachildren = await Children.findAll({where: {userId}})
            if (haveachildren.length >= 5) {
                return next(ApiError.badRequest('Превышено максимальное количество детей'))
            }
            const child = await Children.create({userId, name, age})
                return res.status(200).json({message: "Ребенок добавлен"})
        } catch (e) {
            next(ApiError.badRequest(`К сожалению на сервере произошла ошибка. Пожалуйста, повторите позже.`))
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params
            const userId = req.userId
            let {name, age} = req.body;
            if (!userId)  {
                return next(ApiError.forbidden('Войдите или зарегистрируйтесь'))
            }
            const haveachildren = await Children.findOne({where: {id}})
            if (userId != haveachildren.userId) {
                return next(ApiError.forbidden('Вы не можете изменять данные чужого ребенка'))
            }
            if (!name && !age)  {
                return next(ApiError.badRequest('Не выбраны данные для изменения'))
            }
            if (!name)  {
                const child = await Children.update(
                    {age: age},
                    {where: { id: id}})
                    return res.status(200).json({message: "Возраст ребенка изменен"})
            }
            if (!age)  {
                const child = await Children.update(
                    {name: name},
                    {where: { id: id}})
                    return res.status(200).json({message: "ФИО ребенка изменены"})
            }
            const child = await Children.update(
                {age: age, name: name},
                {where: {id: id}})
                return res.status(200).json({message: "Данные о ребенке изменены"})
        } catch (e) {
            next(ApiError.badRequest(`К сожалению на сервере произошла ошибка. Пожалуйста, повторите позже.`))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const userId = req.userId
            const haveachildren = await Children.findOne({where: {id}})
            if (userId != haveachildren.userId) {
                return next(ApiError.forbidden('Вы не можете удалять данные о чужом ребенке'))
            }
            const child = await Children.destroy(
                {where: {id}})
                return res.status(200).json({message: "Данные о ребенке удалены"})
        } catch (e) {
            next(ApiError.badRequest(`К сожалению на сервере произошла ошибка. Пожалуйста, повторите позже.`))
        }
    }

    async getAll(req, res, next) {
        try {
            let {userId, page, limit} = req.query
            if (userId) {
                let children = await Children.findAll ({ where: {userId} })
                return res.json(children)
            }
                page = +page || 1
                limit = +limit || 30
                let offset = page * limit - limit
                let children = await Children.findAndCountAll ({limit, offset})
                return res.json(children)
        } catch (e) {
            next(ApiError.badRequest(`К сожалению на сервере произошла ошибка. Пожалуйста, повторите позже.`))
        }     
    }  
    
}

module.exports = new ChildrenController()