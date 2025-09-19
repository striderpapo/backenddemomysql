// Obtenga el servicio mysql
/*var mysql = require('mysql2');
var app = require('./app');
var port = 3700;
*/
// Agregue las credenciales para acceder a su base de datos
/*var connection = mysql.createConnection({
    host     : "biosgvc6986ah0fdgsyv-mysql.services.clever-cloud.com",
    user     : "u6ct9w1jqqti0onf",
    password : "Eb6BoFN0xzFQLrsGUaT9",
    database : "biosgvc6986ah0fdgsyv"
});

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : null,
    database : 'demonodemysql'
});*/

// conectarse a mysql
/*connection.connect(function(err) {
    // en caso de error
    if(err){
        console.log("1-"+err.code);
        console.log("2-"+err.fatal);
    }
    app.listen(port,()=>{
            console.log("Servidor corriendo correctamente en la url localhost:3700");
        });
});*/

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

const app = require('./app');
const pool = require('./db');  // importamos pool
const port = process.env.PORT || 3700;

// Probamos conexión a MySQL al iniciar
pool.getConnection()
  .then((connection) => {
    console.log('Conexión a MySQL exitosa ✅');
    connection.release(); // liberamos conexión
    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar con MySQL:', err);
    process.exit(1); // cerramos el proceso si no hay conexión
  });

