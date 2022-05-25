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
    newSearchObj.categories = document.querySelector("#categories").value;
    newSearchObj.countries = document.querySelector("#countries").value;
    newSearchObj.languages = document.querySelector("#languages").value;

    console.log(newSearchObj);

    getSearchResults();


}

function getMediaApi(requestUrl) {
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            renderSearchDatatoPage();
        });
}

function getSearchResults(keyword) {
    
    // start here
    var requestUrl = 'http://api.mediastack.com/v1/news?access_key=c230246a63bce12a7b4bde1321f236d3';

    if (newSearchObj.keywords != null) {
        requestUrl = requestUrl + "&keywords=" + newSearchObj.keywords;
    }
    if (newSearchObj.categories != "") {
        requestUrl = requestUrl + "&languages=" + newSearchObj.languages;
    }
    if (newSearchObj.countries != "") {
        requestUrl = requestUrl + "&countries=" + newSearchObj.countries;
    }
    if (newSearchObj.languages != "") {
        requestUrl = requestUrl + "&languages=" + newSearchObj.languages;
    }

    console.log(requestUrl);
    getMediaApi(requestUrl);

}

function renderSearchDatatoPage() {
    console.log("renderSearchDatatoPage()");
}


searchButton.addEventListener('click', searchOnClick);

var requestUrl = 'http://api.mediastack.com/v1/news?access_key=c230246a63bce12a7b4bde1321f236d3&languages=en&categories=sports';