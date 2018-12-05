function updateVenue(id){
    $.ajax({
        url: '/venues/' + id,
        type: 'PUT',
        data: $('#update-venue').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
