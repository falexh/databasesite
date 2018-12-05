function deleteBand(id){
    $.ajax({
        url: '/bands/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
