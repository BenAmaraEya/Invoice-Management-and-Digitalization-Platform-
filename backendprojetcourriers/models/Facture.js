const { DataTypes } = require('sequelize');
const  {sequelize}  = require('../database');
const Facture = sequelize.define('Facture', {
idF:{
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
},
date_fact:{
    type: DataTypes.DATE,
    allowNull:false
},
num_fact:{
    type: DataTypes.STRING,
    allowNull:false
},
factname:{
    type : DataTypes.STRING,
    allowNull:false
},
montant:{
    type: DataTypes.FLOAT,
    allowNull:false
},
devise:{
    type: DataTypes.STRING,
    allowNull:false
},
nature:{
    type :  DataTypes.STRING,
    allowNull:false
},
status:{
    type: DataTypes.STRING,
    
},
objet:{
    type: DataTypes.STRING,
    allowNull:false
},
datereception:{
    type: DataTypes.DATE,

},
pathpdf:{
    type: DataTypes.STRING,
    
}
});

module.exports = Facture;