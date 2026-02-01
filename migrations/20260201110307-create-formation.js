'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('formations', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            titre: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.TEXT
            },
            photo: {
                type: Sequelize.TEXT
            },
            debut: { // Ajout de la colonne debut
                allowNull: false,
                type: Sequelize.DATE
            },
            fin: { // Ajout de la colonne fin
                allowNull: false,
                type: Sequelize.DATE
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('formations');
    }
};