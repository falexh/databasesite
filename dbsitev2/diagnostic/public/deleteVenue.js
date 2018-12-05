function deleteVenue(id){
    $.ajax({
        url: '/venues/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
