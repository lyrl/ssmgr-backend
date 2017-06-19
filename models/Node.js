var Sequelize = require('sequelize');
var sequelize = require('./DatabaseConnection');
var logger = require('../component/Logger');

var User = require('../models/User');

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
    paranoid: true,
    tableName: 't_node',
    comment: 'shadowsocks节点'
}
);

// many to many
const UserNodes = sequelize.define('userNodes', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    method: Sequelize.STRING(64),
    password: Sequelize.STRING(64),
    port: Sequelize.INTEGER,
    traffic_total: Sequelize.INTEGER,
    status: Sequelize.STRING(24)
},  {

    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 't_user_node',
    comment: '用户与节点关联表'
});

Node.belongsToMany(User, {through: UserNodes, constraints: false});
User.belongsToMany(Node, {through: UserNodes, constraints: false});

module.exports = {Node, UserNodes};