var Sequelize = require('sequelize');
var sequelize = require('./DatabaseConnection');
var logger = require('../component/Logger');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;
var crypto = require('crypto');

logger.info('网络活动数据库模型初始化');

const NetworkActivity = sequelize.define('activity', {
      remote_address: {
        type: Sequelize.STRING(64),
        allowNull: false,
    },
      local_address: {
        type: Sequelize.STRING(64),
        allowNull: false,
    },
      protocal: {
        type: Sequelize.STRING(16),
        allowNull: false
    },
      type: {
        type: Sequelize.STRING(16),
        allowNull: false
    },
      traffic: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
      time: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 't_network_activity',
    comment: '网络活动记录'
}
);




module.exports = NetworkActivity;