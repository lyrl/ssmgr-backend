var router = require('express').Router();
var User = require('../../models/User');
var Node = require('../../models/Node');
var logger = require('../../component/Logger');
var auth = require('../auth');


/**
 * 获取产品下所有节点
 */
router.get('/', auth.required, function (req, res, next) {
    logger.info('增加服务节点 id: %s!', req.params.id);


    // Product.findById(req.params.id).then(product => {
    //     if (!product) {return res.status(404).json({errors: {message: "产品不存在!"}})}
    //
    //     product.getNodes().then(nodes => {
    //         res.json({nodes: nodes});
    //     });
    // }).catch(next);
});


/**
 * 增加产品服务节点
 */
router.post('/', auth.required, function (req, res, next) {
    logger.info('增加服务节点 id: %s!', req.params.id, req.body.node);

    User.findById(req.payload.id).then(user => {
        if (!user) {return  res.status(401).json({ errors: { message: "未授权的访问!"}}) }

        if (user.id !== 1) {return res.status(403).json({ errors: { message: "您没有权限执行此操作!"}}) }

        // Product.findById(req.params.id).then(product => {
        //     if (!product) {return res.status(404).json({errors: {message: "产品不存在!"}})}
        //
        //     Node.create(req.body.node).then(node => {
        //         product.addNode(node).then(() => {
        //             Product.findOne({
        //                 where: {id: product.id},
        //                 include: [{model: Node}]
        //             }).then(product => {
        //                 return res.json({product: product});
        //             })
        //         })
        //     });
        //
        //
        // });
    }).catch(next);
});



/**
 * 删除产品节点
 */
router.delete('/:nodeid', auth.required, function (req, res, next) {
    logger.info('删除服务节点 productId: %s nodeId: %s!', req.params.productId, req.params.nodeId);

    User.findById(req.payload.id).then(user => {
        if (!user) {return  res.status(401).json({ errors: { message: "未授权的访问!"}}) }

        if (user.id !== 1) {return res.status(403).json({ errors: { message: "您没有权限执行此操作!"}}) }

        // Node.findOne({
        //     where: {
        //         id: req.params.nodeId,
        //         product_id: req.params.productId
        //     }
        // }).then(node => {
        //     if (!node) {return res.status(404).json({errors: {message: "产品或者节点不存在!"}})}
        //
        //
        //     node.destroy().then(success => {
        //         if (success) {logger.info('删除成功!')}
        //
        //         Product.findOne({
        //             where: {id: req.params.productId},
        //             include: [{model: Node}]
        //         }).then(product => {
        //             return res.json({product: product});
        //         })
        //     })
        // });

    }).catch(next);
});


module.exports = router;