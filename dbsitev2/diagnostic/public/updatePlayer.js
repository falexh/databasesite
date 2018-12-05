function updatePlayer(id){
    $.ajax({
        url: '/gp/' + id,
        type: 'PUT',
        data: $('#update-player').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
