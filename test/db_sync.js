var User = require('../models/User');
var {Node, UserNodes} = require('../models/Node');

User.sync({force: true}).then(() => {
    User.create(
        {
            "user_name": "lyrl",
            "password": "e31f790a7318037e526e32a90a0ab1958c838f5a904001536b316f037e6ec1dfd27b6ede8fbd8c234b1190249990241bb24ac2cefc0a4a895e80cbbb932ecd31bb8069bcf6863aa455350107dae50c38c10f1f13c15c9c728cc11874c4ee5f4926ea08e478a7e9f5dd63d2ba2942836db1ae2eaae3c412c750c63eabe72ea4798a26cb55417cf9873cd6de23c651d8f4f5a2876ba479d71ce7b5bc6d40d803b76ab2f2c890078642a8d9c8bccd7e3a1a78658ed1b766ceb93012bd093d6088a67dd6a95623db8b4a5351080cd5dd96f356c583067fce9e64d7a404df9241c9723eed18afb242bb7b47397b9174003908f5edaeb36c64bf356bd40aa228849e32",
            "email": "184387904@qq.com",
            "salt": "2b67ea694cbe1283a3f293bb41df678b"
        }
    ).then();
});

UserNodes.sync({force: true}).then(() => {
});


Node.sync({force: true}).then(() => {
    var node = Node.create({
        node_name: '香港九龙',
        node_ip: '111.111.111.111',
        node_port: 14143,
        node_key: '1z2x3c4v',
        node_encry_mode: "sha256-cfb"
    }).then((node) => {
    });
});