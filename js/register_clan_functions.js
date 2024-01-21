var axios = require('axios');
//const db = require('../database-connection.js');


// eval_resquest --> returns 1 for succesful request - 0 in any other case
async function eval_request_async(clan_tag) {   
  try {
 
    const response = await axios.get(`https://aoe-api.worldsedgelink.com/community/clan/getClanInfoFull?title=age2&name=${clan_tag}`);

    if (response.status === 200) {
      const data = response.data;
      // Process the data as needed

      const result_code = data.result.code;    

      if (result_code === 0) {
        return 1;
      } else {
        return 0;
      }
    } else {
      
      return 0;
    }
  } catch (error) {
    
    return 0;
  }
}


// returns clan information
async function get_clan_info(clan_tag)
{   try{
    const response = await axios.get(`https://aoe-api.worldsedgelink.com/community/clan/getClanInfoFull?title=age2&name=${clan_tag}`);
    const data = response.data;
    const aoe_clan_name = data.clan.fullname;
    const aoe_clan_tag = data.clan.name;
    const aoe_clan_description = data.clan.description;

    const clan_data = { clan_name: aoe_clan_name, clan_tag: aoe_clan_tag, clan_description: aoe_clan_description};
    
    return clan_data;

    }
    catch
    {
        return false;
    }


}

module.exports = {eval_request_async, get_clan_info};