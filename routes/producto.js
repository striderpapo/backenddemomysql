'use strict'

var express = require('express');
var ProductoController = require('../controllers/producto');

var routerProducto = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware= multipart();

routerProducto.post('/sproduc',ProductoController.saveProduct);
routerProducto.get('/gproduc/:iduser',ProductoController.getProducto);
routerProducto.delete('/dproduc/:id/:iduser',ProductoController.deleteProducto);
routerProducto.put('/eproduc/:id/:iduser',ProductoController.updateProduct);
routerProducto.post('/uImageProd/:id/:idagrego',multipartMiddleware ,ProductoController.uploadImageproduct);



module.exports = routerProducto;