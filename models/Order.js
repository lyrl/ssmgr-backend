var Sequelize = require('sequelize');
var sequelize = require('./DatabaseConnection');
var logger = require('../component/Logger');

logger.info('订单数据库模型初始化');


const Order = sequelize.define('order', {
    amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
    },
    traffic: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    traffic_limit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    paid_time: {
        type: Sequelize.DATE,
        allowNull: true
    },
    end_time: {
        type: Sequelize.DATE,
        allowNull: true
    },
    status: {
        type: Sequelize.STRING(24),
        allowNull: false,
        defaultValue: 'unpaid'
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 't_order',
    comment: '订单表'
}
);

// force: true will drop the table if it already exists
// User.sync({force: true}).then(() => {
//     // Table created
//     return User.create({
//         user_name: 'lyrl',
//         password: 'abc123',
//         slat: 'slat',
//         email: '184387904@qq.com',
//         status: 0
//     });
// });

// User.findAll().then(users => {
//     console.log(users)
// })

// module.exports = User;

module.exports = Order;