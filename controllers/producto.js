'use strict'

var Producto=require('../models/producto');
var Usuario=require('../models/usuario');
var fs=require('fs');
var path=require('path');
const cloudinary = require('cloudinary').v2;
var mysql = require('mysql2');
var con = mysql.createConnection({
	 host     : "biosgvc6986ah0fdgsyv-mysql.services.clever-cloud.com",//'localhost',
    user     : "u6ct9w1jqqti0onf",//'root',
    password : "Eb6BoFN0xzFQLrsGUaT9",//null,
    database : "biosgvc6986ah0fdgsyv"//'demonodemysql'
});



cloudinary.config({
  cloud_name: 'dnzgfrtp7',
  api_key: '831364683849261',
  api_secret: 'v3GC7jYfzlRnFafaUpUVQT8BzjY'
});

var controller = {
	saveProduct:function(req,res){
		console.log("llega aqui")
		var producto = new Producto();
		var params=req.body;
	
		producto.nombre = params.nombre;
		producto.descripcion = params.descripcion;
		producto.idagrega = params.idagrega;
		producto.imageproducto=null
		
		console.log("llegua aqui dos")
console.log(producto)
  var sql = "INSERT INTO producto (nombre,descripcion,iduseragrega,imagenproducto) VALUES ('" + producto.nombre + "','" + producto.descripcion+ "','" + producto.idagrega + "','" + producto.imageproducto + "')";
  con.query(sql, function (err, productoStored) {
    if (err) throw err;
    console.log("1 record inserted");
    return res.status(200).send({producto:productoStored});
  });
},

	getProducto:function(req,res){
	
	var iduser= req.params.iduser;

	 var sql = "SELECT * FROM producto where iduseragrega="+iduser+";";
  con.query(sql, function (err, productoStored) {
    if (err) throw err;
    console.log("all records showed");
    return res.status(200).send({producto:productoStored});
  });
},
	
deleteProducto:function(req,res){
	var productoId=req.params.id;
	var iduser=req.params.iduser;

	const sqlSelect = "SELECT imagenproducto FROM producto WHERE idproducto = '"+ productoId +"' AND iduseragrega = '"+ iduser +"'";
con.query(sqlSelect, [productoId, iduser], function (err, results) {
    if (err) throw err;
    if (!results.length) {
        return res.status(404).send({ error: "Producto no encontrado" });
    }

    const producto = results[0];
    if (!producto.imagenproducto) {
        return res.status(400).send({ error: "Producto sin imagen" });
    }

    const imagesplit = producto.imagenproducto.split('/');
	console.log(imagesplit)
    const publicId = `${imagesplit[7]}/${imagesplit[8].split(".")[0]}`;
console.log(publicId)

  cloudinary.uploader.destroy(publicId, function (error, result) {
        if (error) console.error("Error borrando imagen:", error);
        console.log("Imagen borrada:", result);

        // Ahora borrar el producto en MySQL
        const sqlDelete = "DELETE FROM producto WHERE  idproducto = '"+ productoId +"'and iduseragrega='"+iduser+"'";
        con.query(sqlDelete, [productoId, iduser], function (err, deleteResult) {
            if (err) throw err;
            console.log("Producto eliminado de la base de datos");
            return res.status(200).send({ mensaje: "Producto eliminado", deleteResult });
        });
    });

});
	},


	updateProduct:function(req,res){
		var productoId=req.params.id;
		var iduser=req.params.iduser;
		var update=req.body;

	  var sql = "UPDATE producto SET nombre = '"+ update.nombre +"',descripcion='"+ update.descripcion +"' WHERE  idproducto = '"+ productoId +"'and iduseragrega='"+iduser+"'";
 
	  con.query(sql, function (err, pruebaStored) {
    if (err) throw err;
    console.log("1 record update");
    console.log(pruebaStored);
    return res.status(200).send({prueba:pruebaStored});
  });
},
		
uploadImageproduct(req,res){
		var productoId=req.params.id;
		var idagrego=req.params.idagrego;
		var fileName="Imagen no subida";

		if(req.files){
			var filePath = req.files.imageproducto.path;
			var fileSplit = filePath.split('\.');
			var fileName = fileSplit[0];
			//var extSplit = fileName.split('\.');
			var fileExt = fileSplit[1];
			if(fileExt == 'png' || fileExt == 'jpg'|| fileExt == 'jpeg'|| fileExt=='gif'){
	const sqlSelect = "SELECT iduser,user FROM usuarios WHERE iduser = '"+ idagrego +"'";
	console.log(sqlSelect)

con.query(sqlSelect, [idagrego], function (err, results) {
    if (err) throw err;
    if (!results.length) {
        return res.status(404).send({ error: "usuario no encontrado" });
    }
console.log(results)
console.log(results[0].iduser)
console.log(results[0].user)
console.log(results[0].iduser+"-"+results[0].user)

	  cloudinary.uploader.upload(filePath,{folder:results[0].iduser+"-"+results[0].user+'/'}, (error, result) => {
  				if(error){
    				console.error(error);
  				}else{
  var sql = "UPDATE producto SET imagenproducto = '"+ result.url +"' WHERE  idproducto = '"+ productoId +"'and iduseragrega='"+idagrego+"'";

  con.query(sql, [result.url,productoId,idagrego], function (err, pruebaStored) {
    if (err) throw err;
    console.log("1 record update");
    console.log(pruebaStored);
    return res.status(200).send({prueba:pruebaStored});
  });
  }
});

});
			}else{
					return res.status(200).send({message:'La extension no es valida'})
			}
		}else{
			return res.status(200).send({
				message:fileName
		});
	}
}

};

module.exports=controller;