document.addEventListener('DOMContentLoaded', function() {
    // Obtén el ID de la URL
    var urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    var idFromUrl = urlParams.get('tag');
    console.log(idFromUrl);

    // Si hay un ID en la URL, llénalo en el campo de entrada y realiza la búsqueda
    if (idFromUrl) {
        document.getElementById('clan_tag').value = idFromUrl;
        buscarPorTag();
    }

});

var formulario = document.getElementById("miFormulario");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();
    buscarPorTag();
});

function buscarPorTag() {
    var obj = document.getElementById('clan_tag').value;
    var load_Symbol = document.getElementById('loadingSymbol');
    var url = `/clansearch?tag=${encodeURIComponent(obj)}`;

    // Muestra el símbolo de carga
    load_Symbol.style.display = "block";

    
    var buttons = document.querySelector('#buttons');

    var tabla = document.getElementById("ranking_single");
    var tbody = tabla.getElementsByTagName("tbody")[0];

    var tabla = document.getElementById("ranking_team");
    var tbody2 = tabla.getElementsByTagName("tbody")[0];

    fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json"},
    })
    .then(response => {
        if (!response.ok) {
            document.getElementById('server_name').innerHTML = "";
            tbody.innerHTML = "";
            tbody2.innerHTML = "";
            load_Symbol.style.display = "none";
            throw new Error(`Clan ${obj} not found`);
        }

        buttons.style.display = 'flex';

        return response.json();
    })
    .then(data => {

       // console.log(data);

        // Limpia el contenido actual de la tabla
        tbody.innerHTML = "";
        tbody2.innerHTML = "";
        document.getElementById('mensaje').innerHTML = "";
        document.getElementById('server_name').innerHTML = "";

        const rank_single = data.rank_single;
        const rank_team = data.rank_team;
        const clan_name = data.clan_name;
        const clan_tag = data.clan_tag;
        


        //console.log(rank_single);

        document.getElementById('server_name').innerHTML = `Clan: ${clan_name}  -- Tag: ${clan_tag}`;

        // Recorre el JSON y agrega filas a la tabla

        // Filling Elo Single leaderboard
        rank_single.forEach(function(item) {
            var fila = tbody.insertRow();
            var rank_cell = fila.insertCell(0);
            var elo_cell = fila.insertCell(1);
            var name_cell = fila.insertCell(2);
            var country_cell = fila.insertCell(3);

            // Llena las celdas con los valores del JSON
            
            rank_cell.innerHTML = item[0];
            elo_cell.innerHTML = item[1];
            name_cell.innerHTML = item[2];            
            country_cell.innerHTML = item[3];
        });

        // Filling Elo Team leaderboard
        rank_team.forEach(function(item) {
            var fila = tbody2.insertRow();
            var rank_cell = fila.insertCell(0);
            var elo_cell = fila.insertCell(1);
            var name_cell = fila.insertCell(2);
            var country_cell = fila.insertCell(3);
            

            // Llena las celdas con los valores del JSON

            rank_cell.innerHTML = item[0];
            elo_cell.innerHTML = item[1];
            name_cell.innerHTML = item[2];            
            country_cell.innerHTML = item[3];
        });

        // Show Rank_single as default
        Show_rank_single();
        load_Symbol.style.display = "none";

        // Después de completar la solicitud AJAX, actualiza el URL sin recargar la página
        history.pushState({}, '', `/clanbot/ranks?tag=${obj}`);
    })
    .catch(error => {
        // Muestra un mensaje si ocurre un error
        document.getElementById('mensaje').innerHTML = error.message;
        load_Symbol.style.display = "none";
        console.error('Error al realizar la operación:', error);
    });
}

function Show_rank_single()
{
   var ranking_single = document.querySelector('#ranking_single');
   var ranking_team = document.querySelector('#ranking_team');
   var message = document.getElementById('mensaje');

   message.innerHTML = "Random map 1vs1 - Leaderboard";
   ranking_single.style.display = 'table';
   ranking_team.style.display = 'none';

}


function Show_rank_team()
{
   var ranking_single = document.querySelector('#ranking_single');
   var ranking_team = document.querySelector('#ranking_team');

   var message = document.getElementById('mensaje');

   message.innerHTML = "Random map Team - Leaderboard";
   ranking_single.style.display = 'none';
   ranking_team.style.display = 'table';

}