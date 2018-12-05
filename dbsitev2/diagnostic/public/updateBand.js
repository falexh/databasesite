function updateBand(id){
    $.ajax({
        url: '/bands/' + id,
        type: 'PUT',
        data: $('#update-band').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
