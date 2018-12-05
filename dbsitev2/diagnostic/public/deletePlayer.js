function deletePlayer(id){
    $.ajax({
        url: '/gp/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deletePlayersBands(pid,bid){
  $.ajax({
      url: '/players_bands/pid/' + pid + '/bands/' + bid,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          }
      }
  })
};
