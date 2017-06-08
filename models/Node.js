var Sequelize = require('sequelize');
var sequelize = require('./DatabaseConnection');
var logger = require('../component/Logger');

logger.info('节点数据库模型初始化');

const Node = sequelize.define('node', {
    node_name: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    node_ip: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    node_port: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    node_key: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    node_encry_mode: {
        type: Sequelize.STRING(24),
        allowNull: false
    }
},
{
    timestamps: true,
    underscored: true,
    tableName: 't_node',
    comment: 'shadowsocks节点'
}
);

module.exports = Node;