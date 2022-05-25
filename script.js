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

    var categoriesOptions = document.querySelector("#categories").options;
    var categoriesSelected = [];
    var index = 0;
    // allow support to select multiple options
    for (var i = 0; i < categoriesOptions.length; i++) {
        // add the selected options for categories
        // exclude the placeholder disabled option
        if(categoriesOptions[i].selected && categoriesOptions[i].value != "") {
            categoriesSelected[index] = categoriesOptions[i].value;
            index++;
        } 
    }
    for (var j = 0; j < categoriesSelected.length; j++) {
        newSearchObj.categories += categoriesSelected[j];
        if (j < categoriesSelected.length-1) {
            // add a comma between the options
            // make sure to avoid putting an option at the end
            newSearchObj.categories += ",";
        }
    }
    var countriesOptions = document.querySelector("#countries").value;
    var countriesSelected = [];
    var index = 0;
    

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
            renderSearchDatatoPage(data);
        });
}

function getSearchResults(keyword) {
    
    // start here
    var requestUrl = 'http://api.mediastack.com/v1/news?access_key=c230246a63bce12a7b4bde1321f236d3';

    if (newSearchObj.keywords != null) {
        requestUrl = requestUrl + "&keywords=" + newSearchObj.keywords;
    }
    if (newSearchObj.categories != "") {
        requestUrl = requestUrl + "&categories=" + newSearchObj.categories;
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

function renderSearchDatatoPage(data) {
    console.log(data);
    console.log("renderSearchDatatoPage()");
}

searchButton.addEventListener('click', searchOnClick);
