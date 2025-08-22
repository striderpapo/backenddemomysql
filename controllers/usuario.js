'use strict'

var Usuario=require('../models/usuario');
var fs=require('fs');
var path=require('path');
const cloudinary = require('cloudinary').v2;
var bcrypt=require('bcryptjs');
var jwt=require('jsonwebtoken');
const https = require('https');
var mysql = require('mysql2');
var con = mysql.createConnection({
    host     : "biosgvc6986ah0fdgsyv-mysql.services.clever-cloud.com",//'localhost',
    user     : "u6ct9w1jqqti0onf",//'root',
    password : "Eb6BoFN0xzFQLrsGUaT9",//null,
    database : "biosgvc6986ah0fdgsyv"//'demonodemysql'
});


var controller = {
	saveUsuario:function(req,res){
		console.log("llega aqui")
		var usuario = new Usuario();

		var params=req.body;
		usuario.username = params.username.toLowerCase();
		usuario.facebook_id = null
		//usuario.password = params.password.toLowerCase();
		const encryptedPassword =  bcrypt.hashSync(params.password, 10);
		usuario.password = encryptedPassword;
		const token = jwt.sign(
      {_id: usuario._id,username:usuario.username},
      "Secret_key123",
      {}
    );

   		usuario.token=token;
		
		/*usuario.save((err,usuarioStored)=>{
			if(err) return res.status(500).send({message:"Error al guardar al usuario"});

			if(!usuarioStored) return res.status(404).send({message:"No se ha podido guardar al usuario"});

			return res.status(200).send({usuario:usuarioStored});
		});*/


	/*	usuario.save()
		.then(function (usuarioStored) {
  if(!usuarioStored) return res.status(404).send({message:"No se ha podido guardar al usuario"});
  cloudinary.api.create_folder(usuarioStored._id, (error, result) => {
  if (error) {
    console.error('Error al crear la carpeta en Cloudinary:', error);
  } else {
    return res.status(200).send({usuario:usuarioStored});
  }
});
})
.catch(function (err) {
  if(err) return res.status(500).send({message:"Error al guardar al usuario"});
});*/
console.log("llegua aqui dos")
console.log(usuario)
  //var sql = "INSERT INTO usuarios (user,password,token,facebookid) VALUES ('" + usuario.username + "','" + usuario.password+ "','" + usuario.token + "','" + usuario.facebook_id + "')";
 var sql = "INSERT INTO usuarios (user,password,token,facebookid) VALUES (?, ?, ?, ?)"; 
  con.query(sql, [usuario.username, usuario.password, usuario.token, usuario.facebook_id], function (err, usuarioStored) {
    if (err) throw err;
	const nuevoId = usuarioStored.insertId; // ← Aquí tienes el ID autoincremental
    console.log("1 record inserted, ID:", nuevoId);
    //return res.status(200).send({usuario:usuarioStored});
	cloudinary.api.create_folder(nuevoId.toString()+"-"+usuario.username, (error, result) => {
  if (error) {
        console.error('Error al crear la carpeta en Cloudinary:', error);
        return res.status(500).send({ error: "No se pudo crear carpeta en Cloudinary" });
  } else {
    console.log('Carpeta creada en Cloudinary:', result);
            return res.status(200).send({
                mensaje: "Usuario creado y carpeta en Cloudinary generada",
                usuarioId: nuevoId
            });
  }
});
  });
	},

    
	saveUsuarioFace:function(req,res){
		var usuario = new Usuario();

		const { accessToken }= req.body;
		console.log(req.body)
		console.log(accessToken)
		const url = `https://graph.facebook.com/v12.0/me?access_token=${accessToken}&fields=id,name,picture`;
		//console.log(url)
		https.get(url, (resp) => {
			let data = '';
		
			// Un trozo de datos ha sido recibido.
			resp.on('data', (chunk) => {
			  data += chunk;
			  console.log(typeof data)
			})

			resp.on('end', () => {
				if (resp.statusCode === 200) {
				  const user = JSON.parse(data);
		  
					console.log(user.name)

					usuario.username = user.name.toLowerCase();
					usuario.password = null;
					usuario.facebook_id = accessToken
					const token = jwt.sign(
				  {_id: usuario._id,username:usuario.username},
				  "Secret_key123",
				  {}
				);
			
					usuario.token=token;
				  // Aquí podrías crear una sesión o un token JWT
				  usuario.save()
				  .then(function (usuarioStored) {
			if(!usuarioStored) return res.status(404).send({message:"No se ha podido guardar al usuario"});
			cloudinary.api.create_folder(usuarioStored._id, (error, result) => {
			if (error) {
			  console.error('Error al crear la carpeta en Cloudinary:', error);
			} else {
			  console.log('Carpeta creada exitosamente:', result);
			  return res.status(200).send({usuario:usuarioStored});
			}
		  });
		  })
		  .catch(function (err) {
			if(err) return res.status(500).send({message:"Error al guardar al usuario"});
		  });
				} else {
				  res.status(400).json({ message: 'Token de acceso no válido', error: data });
				}
			  });
		});
/*		usuario.username = params.username.toLowerCase();
		//usuario.password = params.password.toLowerCase();
		const encryptedPassword =  bcrypt.hashSync(params.password, 10);
		usuario.password = encryptedPassword;
		const token = jwt.sign(
      {_id: usuario._id,username:usuario.username},
      "Secret_key123",
      {}
    );

   		usuario.token=token;
		
		/*usuario.save((err,usuarioStored)=>{
			if(err) return res.status(500).send({message:"Error al guardar al usuario"});

			if(!usuarioStored) return res.status(404).send({message:"No se ha podido guardar al usuario"});

			return res.status(200).send({usuario:usuarioStored});
		});


		usuario.save()
		.then(function (usuarioStored) {
  if(!usuarioStored) return res.status(404).send({message:"No se ha podido guardar al usuario"});
  cloudinary.api.create_folder(usuarioStored._id, (error, result) => {
  if (error) {
    console.error('Error al crear la carpeta en Cloudinary:', error);
  } else {
    console.log('Carpeta creada exitosamente:', result);
    return res.status(200).send({usuario:usuarioStored});
  }
});
})
.catch(function (err) {
  if(err) return res.status(500).send({message:"Error al guardar al usuario"});
});*/
	},
	async getUsuario(req,res){
		try {

		var params=req.body;

		var username = params.username.toLowerCase();;
		var userpassword = params.password.toLowerCase();;

			const userapp = await Usuario.findOne({username });

			 if (userapp  && (await bcrypt.compare(userpassword, userapp.password))) {

			 	const token = jwt.sign(
        {_id: userapp._id,username:userapp.username},
        "Secret_key123",
        {}
      );

      // save user token
      userapp.token = token;
      
      await Usuario.findByIdAndUpdate(userapp._id,userapp,{new:true})
      
      return res.status(200).send({token:token});
    }else{
    	return res.status(401).send("Unauthorized");
    }
	
} catch (err) {
    console.log(err);
  }
	},

};

module.exports=controller;