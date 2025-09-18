// Obtenga el servicio mysql
var mysql = require('mysql2');
var app = require('./app');
var port = 3700;

// Agregue las credenciales para acceder a su base de datos
/*var connection = mysql.createConnection({
    host     : "biosgvc6986ah0fdgsyv-mysql.services.clever-cloud.com",
    user     : "u6ct9w1jqqti0onf",
    password : "Eb6BoFN0xzFQLrsGUaT9",
    database : "biosgvc6986ah0fdgsyv"
});*/

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : null,
    database : 'demonodemysql'
});

// conectarse a mysql
connection.connect(function(err) {
    // en caso de error
    if(err){
        console.log("1-"+err.code);
        console.log("2-"+err.fatal);
    }
    app.listen(port,()=>{
            console.log("Servidor corriendo correctamente en la url localhost:3700");
        });
});

// Realizar una consulta
/*$query = 'SELECT * from mascotas';

connection.query($query, function(err, rows, fields) {
    if(err){
        console.log("An error ocurred performing the query.");
        return;
    }

    console.log("Consulta ejecutada con éxito:", rows);
});
*/
// Cerrar la conexión
/*connection.end(function(){
    // La conexión se ha cerrado
    console.log("conexion se ha cerrado")
});*/
