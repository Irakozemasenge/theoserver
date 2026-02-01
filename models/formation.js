'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class formation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.formation.hasMany(models.formationelement, {
                onDelete: "CASCADE",
                onUpdate: 'CASCADE'
            });
            models.formation.hasMany(models.formationinscription, {
                onDelete: "CASCADE",
                onUpdate: 'CASCADE'
            });
        }
    }
    formation.init({
        titre: DataTypes.STRING,
        description: DataTypes.TEXT,
        photo: DataTypes.TEXT,
        debut: DataTypes.DATE,
        fin: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'formation',
    });
    return formation;
};