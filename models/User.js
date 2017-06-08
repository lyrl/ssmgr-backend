var Sequelize = require('sequelize');
var sequelize = require('./DatabaseConnection');
var logger = require('../component/Logger');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;
var crypto = require('crypto');

logger.info('用户数据库模型初始化');


const User = sequelize.define('user', {
    user_name: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING(512),
        allowNull: false,

    },
    salt: {
        type: Sequelize.STRING(64),
        allowNull: true
    },
    email: {
        type: Sequelize.STRING(64),
        allowNull: false,
        isEmail: true,
        unique: true
    },
    status: {
        type: Sequelize.STRING(24),
        allowNull: false,
        defaultValue: 0
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 't_user',
    comment: '用户表'
}
);

// 生成json web token
User.Instance.prototype.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this.id,
        user_name: this.user_name,
        exp: parseInt(exp.getTime() / 1000)
    }, secret);
};


User.Instance.prototype.toAuthJSON = function(){
    return {
        user_name: this.user_name,
        email: this.email,
        token: this.generateJWT()
    };
};

User.Instance.prototype.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto.pbkdf2Sync(password, this.salt, 10000, 256, 'sha512').toString('hex');
};


User.Instance.prototype.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 256, 'sha512').toString('hex');
    return this.password === hash;
};






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

module.exports = User;