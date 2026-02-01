'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('formationinscriptions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            formationId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'formations',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            nomcomplet: {
                type: Sequelize.STRING
            },
            tel: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            motivation: {
                type: Sequelize.TEXT
            },
            status: { // Ajout de la colonne status
                type: Sequelize.STRING,
                allowNull: false
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
        await queryInterface.dropTable('formationinscriptions');
    }
};