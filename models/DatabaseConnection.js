var Sequelize = require('sequelize');

const sequelize = new Sequelize('ssmgr', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: 'Asia/Chongqing',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;