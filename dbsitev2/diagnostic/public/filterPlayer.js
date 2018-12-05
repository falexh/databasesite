function filterPlayersByVenue() {
    //get the id of the selected homeworld from the filter dropdown
    var venue_id = document.getElementById('venue_filter').value
    //construct the URL and redirect to it
    window.location = '/gp/filter/' + parseInt(venue_id)
}

function filterDefault() {
    window.location = '/gp'
}
