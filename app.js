const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const puerto = 3000;
require('dotenv').config();
const {eval_request_async, get_clan_info} = require('./js/register_clan_functions');
const {sort_clan_members} = require('./js/sort_functions');


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



// Ruta de la pagina principal aoebots
app.get('/', (req, res) => {

  res.sendFile(__dirname + '/public/index.html');
});


// Ruta para servir la página de ELOBOT
app.get('/elobot', (req, res) => {

    res.sendFile(__dirname + '/public/elobot.html');
  });


// Ruta de la pagina de comandos elobot
app.get('/elobot/commands', (req, res) => {

    res.sendFile(__dirname + '/public/elobot_commands.html');
  });


// Ruta de la pagina de rankings de ELOBOT
app.get('/elobot/ranks', (req, res) => {

    res.sendFile(__dirname + '/public/elobot_ranks.html');
  });



//-------------------------------------------------


// Ruta de la seccion de clanbot - Main Page
app.get('/clanbot', (req, res) => {

  res.sendFile(__dirname + '/public/clanbot.html');
});

// Ruta de la seccion ranking de clanbot
app.get('/clanbot/ranks', (req, res) => {

  res.sendFile(__dirname + '/public/clan_ranks.html');
});




// Ruta para manejar el formulario de busqueda server ( elobot)
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

   // console.log(single_rank);



    leaderboards = { rank_single: single_rank, rank_team:team_rank, server_name: server_name};

        // Mostrar resultados
        res.json(leaderboards);
  }
  catch(err)
  {
    console.error('Error al ejecutar la consulta:', err.message);
    res.status(500).send('Error al obtener datos de MySQL');
  }


});


// Ruta para manejar el formulario de busqueda clan ( clanbot)
app.get('/clansearch', async (req, res) => {

try
{ 
 

  const clan_tag = req.query.tag;

  var eval_request = await eval_request_async(clan_tag);

  if(eval_request !=1)
  {
    res.status(500).send('Error, Your clan do not exist');
    console.log('ClanSearch: Invalid ClanTag, please try again');
    return;
  }

  // Retrieving Clan information
  const clan_info = await get_clan_info(clan_tag);

  if(!clan_info)
  {
    res.status(500).send('Error, Your clan do not exist');
    console.log('ClanSearch: Invalid ClanTag, please try again');
    return;
  }

  const clan_name = clan_info.clan_name;
  const clantag = clan_info.clan_tag;
  const clan_description = clan_info.clan_description;

  const top_users = await sort_clan_members(clan_tag);

  //console.log(top_users);


  const clan_data = { rank_single: top_users[0], rank_team: top_users[1], clan_name: clan_name, clan_tag: clantag, clan_description: clan_description};

  // Mostrar resultados
  res.json(clan_data);

}
catch(err)
{
  console.error('Error al ejecutar la consulta:', err);
  res.status(500).send('ClanSearch: Invalid ClanTag, please try again');
}


});







// Iniciar el servidor
app.listen(puerto, () => {
    console.log(`Servidor en ejecución en http://localhost:${puerto}`);
  });