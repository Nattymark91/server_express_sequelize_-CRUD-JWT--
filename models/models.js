const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const Users = sequelize.define('users', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    age: {type: DataTypes.INTEGER, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},

})

const Children = sequelize.define('childrens', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    age: {type: DataTypes.INTEGER, allowNull: false},
})

Users.hasMany(Children)
Children.belongsTo(Users)

module.exports = {
    Users,
    Children
}