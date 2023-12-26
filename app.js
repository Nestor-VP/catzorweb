const express = require('express');
const app = express();
const puerto = 3000;



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

app.use('/js',express.static('js'));

app.use('/css',express.static('css'));

app.use('/img',express.static('img'));





// Iniciar el servidor
app.listen(puerto, () => {
    console.log(`Servidor en ejecución en http://localhost:${puerto}`);
  });