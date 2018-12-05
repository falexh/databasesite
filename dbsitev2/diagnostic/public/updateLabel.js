function updateLabel(id){
    $.ajax({
        url: '/labels/' + id,
        type: 'PUT',
        data: $('#update-label').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
