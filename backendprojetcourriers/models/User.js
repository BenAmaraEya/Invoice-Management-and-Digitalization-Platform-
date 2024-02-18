const { DataTypes } = require('sequelize');
const  {sequelize}  = require('../database');

const User = sequelize.define('User', {
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    last_login:{
        type:DataTypes.DATE,

    },
    password:{
        type:DataTypes.STRING,
    },
    profil:{
        type:DataTypes.STRING,
    },
    isactive:{
        type:DataTypes.BOOLEAN,
    },
    phone:{
        type:DataTypes.STRING
    }
});

module.exports = User;