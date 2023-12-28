const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const puerto = 3000;
require('dotenv').config();

// Habilita CORS para todas las rutas
app.use(cors());

// Configuración de la conexión a MySQL
const connection = mysql.createPool({
    host: process.env.HOSTNAME_DB,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE,
    connectionLimit: 20,
  });

const db = connection.promise();

// verify connection
// Verify if the connection is established successfully
db.query('SELECT 1')
  .then(() => {
    console.log('Connected to the Catzor-BOT database!');
  })
  .catch((error) => {
    console.error('Failed to establish a connection to the database:', error);
  
});




  // declarando variable para los rankings ( single y team)
  let leaderboards;

  app.use(express.json());

app.use('/js',express.static('js'));

app.use('/css',express.static('css'));

app.use('/img',express.static('img'));

// Ruta para servir la página HTML
app.get('/', (req, res) => {

    res.sendFile(__dirname + '/public/index.html');
  });

// Ruta de la pagina de comandos
app.get('/commands', (req, res) => {

    res.sendFile(__dirname + '/public/commands.html');
  });


// Ruta de la pagina de rankings
app.get('/ranks', (req, res) => {

    res.sendFile(__dirname + '/public/ranks.html');
  });


// Ruta para manejar el formulario de busqueda server
app.get('/server', async (req, res) => {

    const numero = req.query.id;

    const league = "league_" + numero;

    query1 = `SELECT aoe_name, country, elo_single, rank_single, verify FROM ${league} ORDER BY rank_single`;

    query2 = `SELECT aoe_name, country, elo_team, rank_team, verify FROM ${league} ORDER BY rank_team`;
  
    query3 = `SELECT server_name FROM servers_list WHERE server_id =  ${numero}`;

    try
  { 
    const [single_rank,fields1] = await db.query(query1);

    const [team_rank,fields2] = await db.query(query2);

    const [server_name,fields3] = await db.query(query3);



    leaderboards = { rank_single: single_rank, rank_team:team_rank, server_name: server_name};

        // Mostrar resultados
        res.json(leaderboards);
  }
  catch(err)
  {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).send('Error al obtener datos de MySQL');
  }


});







// Iniciar el servidor
app.listen(puerto, () => {
    console.log(`Servidor en ejecución en http://localhost:${puerto}`);
  });