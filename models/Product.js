var Sequelize = require('sequelize');
var sequelize = require('./DatabaseConnection');
var Node = require('./Node');

var logger = require('../component/Logger');

var User = require('./User');
var Order = require('./Order');


logger.info('产品数据库模型初始化!');



const Product = sequelize.define('product', {
    product_name: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    product_desc: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    charge_mode: {
        type: Sequelize.STRING(24),
        allowNull: false
    },
    unit_price: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
    }
},
    {
        timestamps: true,
        underscored: true,
        tableName: 't_product',
        comment: '产品表'
    }
);

// one to many
Product.hasMany(Node, {constraints: false});
Node.belongsTo(Product, {constraints: false});

// one to many
User.hasMany(Order, {constraints: false});
Order.belongsTo(User, {constraints: false});

// one to one
Order.belongsTo(Node, {constraints: false});

// many to many
const UserNodes = sequelize.define('userNodes', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: Sequelize.STRING(24)
},  {

    timestamps: true,
    underscored: true,
    tableName: 't_user_node',
    comment: '用户与节点关联表'
});

Node.belongsToMany(User, {through: UserNodes, constraints: false});
User.belongsToMany(Node, {through: UserNodes, constraints: false});




User.sync({force: true}).then(() => {
    User.create(
            {
                "user_name": "lyrl",
                "password": "1z2x3c4v",
                "email": "184387904@qq.com"
            }
    ).then();
});

Order.sync({force: true}).then(() => {
});

UserNodes.sync({force: true}).then(() => {
});


// force: true will drop the table if it already exists
Product.sync({force: true}).then(() => {

    Node.sync({force: true}).then(() => {
        var node = Node.create({
            node_name: '香港九龙',
            node_ip: '111.111.111.111',
            node_port: 14143,
            node_key: '1z2x3c4v',
            node_encry_mode: "sha256-cfb"
        }).then((node) => {
            // Table created


            Product.create({
                product_name: '极速版',
                product_desc: '香港直连线路,速度稳定',
                charge_mode: 'traffic',
                unit_price: 1.00
            }).then((product) => {
                product.setNodes([node]).then(()=>{
                    console.log('saved!');
                    product.getNodes().then((nodes) => {
                        console.log(JSON.stringify(nodes));
                    });
                });
            });


            Product.create({
                product_name: '流量版',
                product_desc: '无限流量',
                charge_mode: 'time',
                unit_price: 10.00
            }).then((product) => {
                product.setNodes([node]).then(()=>{
                    console.log('saved!');
                    product.getNodes().then((nodes) => {
                        console.log(JSON.stringify(nodes));
                    });
                });
            });

        });
    });
});





// User.findAll().then(users => {
//     console.log(users)
// })


module.exports = Product;