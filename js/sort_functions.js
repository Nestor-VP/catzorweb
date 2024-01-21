var axios = require('axios');

async function sort_clan_members(clan_tag)
{

try
{
const response = await axios.get(`https://aoe-api.worldsedgelink.com/community/clan/getClanInfoFull?title=age2&name=${clan_tag}`);
const clan_data = response.data;
const members_list = clan_data.clan.members;
//console.log(typeof members_list);

const users_aoe_id = members_list.map((item) => { return item.avatar.profile_id });
//console.log(users_aoe_id);

const jsonString = JSON.stringify(users_aoe_id);
const ids_array = jsonString.replace(/ /g, "%");
//console.log(ids_array);

const response1 = await axios.get(`https://aoe-api.worldsedgelink.com/community/leaderboard/GetPersonalStat?title=age2&profile_ids=${ids_array}`);
const data = response1.data;

const users_info = data.statGroups;
const elos_info = data.leaderboardStats;

let users_object =[]
for ( let user of users_info)
{   
    //console.log(user);
    let aoe_id = user.members[0].profile_id;
    //console.log(aoe_id);
    let aoe_name = user.members[0].alias;
    let aoe_group = user.members[0].personal_statgroup_id;
    let country = user.members[0].country;

    users_object.push({"aoe_name": aoe_name , "stat_group" : aoe_group, "elo_single" : 0 , "elo_team":0, "country": country});   
    
}

for (let element of users_object)
{
    let stat_group = element["stat_group"];
    for(let elo_data of elos_info)
    {
        const statgroup_id = elo_data["statgroup_id"];

        if(stat_group == statgroup_id)
        {
            const leaderboard_id = elo_data["leaderboard_id"];
            const elo = elo_data["rating"];
            if( leaderboard_id == 3)
            {
                element["elo_single"]= elo;
            }
            else if (leaderboard_id == 4)
            {
                element["elo_team"]=elo;
            }
        }
    }

}

// SORTING BY ELO SINGLE

const top_single = sort_leaderboard(users_object,"elo_single");
const top_team = sort_leaderboard(users_object,"elo_team");


return [top_single, top_team];


}
catch(err)
{
    console.log(`CLANBOT: ERROR SORTING CLAN [${clan_tag}]\n ${err}`);
}


}


function sort_leaderboard(array_object, elo_type)
{
    let sorted_array =  array_object.sort(function(a, b) {
        return b[elo_type] - a[elo_type]; 
      });

    let top_users = sorted_array; //.slice(0,20); // desde el indice 0 -> los primeros 20 elementos

    
    // filtering which key is need to be deleted
    let key_to_delete = "elo_team";

    if(elo_type == "elo_team")
    {
    key_to_delete= "elo_single";
    }

    let sorted_users = top_users.map((obj, index) => {
        // Crear una copia del objeto actual
        let newObj = { ...obj };
        
        // Eliminar la clave stat_group del objeto
        delete newObj.stat_group;
        delete newObj[key_to_delete];
        
        // Agregar la propiedad posicion al objeto
        newObj.position = index + 1;
        
        // Devolver el nuevo objeto con la propiedad posicion
        return newObj;
      });

    // Converting sorted_users (array-object) into an bidimensional array
   let top_users_array = sorted_users.map(obj =>[obj.position,obj[elo_type],obj.aoe_name, obj.country]);


//Returning only the top 20 users

//console.log(top_users_array);
return top_users_array;
// top_users_array[0]  --> ELO SINGLE RANKS
// top_users_array[1]  --> ELO TEAM RANKS

}


module.exports = {sort_clan_members};