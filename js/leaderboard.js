
document.addEventListener('DOMContentLoaded', function() {
    // Obtén el ID de la URL
    var urlParams = new URLSearchParams(window.location.search);
    var idFromUrl = urlParams.get('id');

    // Si hay un ID en la URL, llénalo en el campo de entrada y realiza la búsqueda
    if (idFromUrl) {
        document.getElementById('numero').value = idFromUrl;
        buscarPorId();
    }
    else {
        // Si no se proporciona un ID en la URL, muestra un mensaje
        document.getElementById('mensaje').innerHTML = "Enter Server ID";
    }
});

var formulario = document.getElementById("miFormulario");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();
    buscarPorId();
});

function buscarPorId() {
    var obj = document.getElementById('numero').value;
    var url = `http://localhost:3000/server?id=${encodeURIComponent(obj)}`;

    

    var btn1 = document.querySelector('#btn_rank1');
    var btn2 = document.querySelector('#btn_rank2');
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
            throw new Error(`Server ${obj} not found`);
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
        const server_name = data.server_name[0].server_name;


        //console.log(rank_single);

        document.getElementById('server_name').innerHTML = "Server: " +server_name;


        

        // Recorre el JSON y agrega filas a la tabla

        // Filling Elo Single leaderboard
        rank_single.forEach(function(item) {
            var fila = tbody.insertRow();
            var rank_cell = fila.insertCell(0);
            var elo_cell = fila.insertCell(1);
            var name_cell = fila.insertCell(2);
            

            // Llena las celdas con los valores del JSON
            const ver_status = item.verify;
            let status_simbol = "❌";

            if(ver_status == 1){ status_simbol = "☑️";}

            name_cell.innerHTML = item.aoe_name + status_simbol;
            
            elo_cell.innerHTML = item.elo_single;
            rank_cell.innerHTML = item.rank_single;
        });

        // Filling Elo Team leaderboard
        rank_team.forEach(function(item) {
            var fila = tbody2.insertRow();
            var rank_cell = fila.insertCell(0);
            var elo_cell = fila.insertCell(1);
            var name_cell = fila.insertCell(2);
            

            // Llena las celdas con los valores del JSON
            const ver_status = item.verify;
            let status_simbol = "❌";

            if(ver_status == 1){ status_simbol = "☑️";} 

            name_cell.innerHTML = item.aoe_name + status_simbol;
            
            elo_cell.innerHTML = item.elo_team;
            rank_cell.innerHTML = item.rank_team;
        });

        // Show Rank_single as default
        Show_rank_single();

        // Después de completar la solicitud AJAX, actualiza el URL sin recargar la página
        history.pushState({}, '', `/?id=${obj}`);
    })
    .catch(error => {
        // Muestra un mensaje si ocurre un error
        document.getElementById('mensaje').innerHTML = error.message;
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


