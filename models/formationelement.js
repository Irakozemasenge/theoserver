'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class formationelement extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            formationelement.belongsTo(models.formation, {
                foreignKey: 'formationId',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        }
    }
    formationelement.init({
        formationId: DataTypes.INTEGER,
        element: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'formationelement',
    });
    return formationelement;
};