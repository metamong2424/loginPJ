// backend/models/user.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Sequelize 인스턴스를 가져옴

const User = sequelize.define('User', {
    googleId: {
        type: DataTypes.STRING,
        unique: true,
    },
    token: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true, // 생성 및 수정 시간 기록
});

module.exports = User;
