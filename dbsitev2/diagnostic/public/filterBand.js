function filterBandsByLabel() {
    //get the id from dropdown
    var label_id = document.getElementById('label_filter').value
    //construct the URL and redirect to it
    window.location = '/bands/filter/' + parseInt(label_id)
}

function filterDefault() {
    window.location = '/bands'
}
