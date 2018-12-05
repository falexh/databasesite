function searchPlayersByFirstName() {
    //get the first name
    var fnameStr  = document.getElementById('fnameStr').value
    //construct the URL and redirect to it
    window.location = '/gp/search/' + encodeURI(fnameStr)
}
