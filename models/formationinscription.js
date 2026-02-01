'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class formationinscription extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            formationinscription.belongsTo(models.formation, {
                foreignKey: 'formationId',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        }
    }
    formationinscription.init({
        formationId: DataTypes.INTEGER,
        nomcomplet: DataTypes.STRING,
        tel: DataTypes.STRING,
        email: DataTypes.STRING,
        motivation: DataTypes.TEXT,
        status: DataTypes.STRING, // Ajout de la colonne status
    }, {
        sequelize,
        modelName: 'formationinscription',
    });
    return formationinscription;
};