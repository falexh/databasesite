function deleteLabel(id){
    $.ajax({
        url: '/labels/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
