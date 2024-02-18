const { DataTypes } = require('sequelize');
const  {sequelize } = require('../database');
const User = require('./User');
const Facture =  require('./Facture');
const Fournisseur = sequelize.define('Fournisseur', {
    iderp:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
    },
    idfiscale:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    adresse:{
        type : DataTypes.STRING,
        allowNull:false,
    },
    nationnalite:{
        type: DataTypes.STRING,
        allowNull:false
    }
});
Fournisseur.hasMany(Facture, { as: 'Factures', foreignKey: 'iderp',onDelete: 'CASCADE' });
Fournisseur.belongsTo(User);

module.exports = Fournisseur;