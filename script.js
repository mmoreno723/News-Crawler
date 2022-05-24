var newSearchObj = {
    keywords:"",
    categories: "",
    countries: "",
    languages:"",
}

var searchButton = document.querySelector("#searchBtn");


var searchOnClick = function(event) {
    console.log("Search Button event listener");
    event.preventDefault();
    newSearchObj.keywords = document.querySelector("#keyword").value;

    console.log(newSearchObj);


}

function getSearchResults(keyword) {
    
    // start here
    var requestUrl = 'http://api.mediastack.com/v1/news?access_key=c230246a63bce12a7b4bde1321f236d3&languages=en&categories=sports';
function getCurrentApi() {
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}

}


// getSearchResults();

searchButton.addEventListener('click', searchOnClick);