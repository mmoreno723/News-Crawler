var newSearchObj = {
    keywords:"",
    categories: "",
    countries: "",
    languages:"",
    hasSearched: false,
    numResults: 9
}

var mediaData = "";
var searchFailed = false;

var searchButton = document.querySelector("#searchBtn");
var container = document.querySelector("#cardContainer");
var numResultsSelector = document.querySelector("#num-results-selector");

var searchOnClick = function(event) {
    // reset the search object if user has done a previous search
    if (newSearchObj.hasSearched) {
        newSearchObj.keywords = "";
        newSearchObj.categories= "";
        newSearchObj.countries = "";
        newSearchObj.languages = "";
    } else {
        newSearchObj.hasSearched = true;
    }
    
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
        // add a comma between the options
        // make sure to avoid putting an option at the end
        if (j < categoriesSelected.length-1) {
            newSearchObj.categories += ",";
        }
    }
    var countriesOptions = document.querySelector("#countries").options;
    var countriesSelected = [];
    index = 0;

    for (i=0; i < countriesOptions.length; i++) {
        if(countriesOptions[i].selected && countriesOptions[i].value != "") {
            countriesSelected[index] = countriesOptions[i].value;
            index++;
        }
    }
    for (j=0; j < countriesSelected.length; j++) {
        newSearchObj.countries += countriesSelected[j];
        if (j < countriesSelected.length-1) {
            newSearchObj.countries += ",";
        }
    }
    
    var languagesOptions = document.querySelector("#languages").options;
    var languagesSelected = [];
    index = 0;

    for (i=0; i < languagesOptions.length; i++) {
        if(languagesOptions[i].selected && countriesOptions[i].value != "") {
            languagesSelected[index] = languagesOptions[i].value;
            index++;
        }
    }
    for (j=0; j < languagesSelected.length; j++) {
        newSearchObj.languages += languagesSelected[j];
        if (j < languagesSelected.length-1) {
            newSearchObj.languages += ",";
        }
    }
    
    getSearchResults();
}

function getMediaApi(requestUrl) {
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // EH notes: I changed the query data to a global variable
            mediaData = data;
            console.log(data);
            if (data.data.length > 0) {
                renderSearchDatatoPage();
            } else {
                var errorMessage = document.createElement("h2");
                errorMessage.textContent = "No Results";
                container.textContent="";
                container.setAttribute("style", "margin: 20px");
                container.appendChild(errorMessage);
            }
        })
        .catch(error => {
            searchFailed = true;
            var errorMessage = document.createElement("h2");
            errorMessage.textContent = "Error: Failed to get search result.";
            container.textContent="";
            container.setAttribute("style", "margin: 20px");
            container.appendChild(errorMessage);
        });
}

function getSearchResults(limit) {
    var requestUrl = 'http://api.mediastack.com/v1/news?access_key=c230246a63bce12a7b4bde1321f236d3';
    // check if a limit has been specified. If not, the default is 25 according to media stack
    if (limit !== undefined) {
        requestUrl = requestUrl + "&limit=" + limit;
    }
    if (newSearchObj.keywords != null || newSearchObj.keywords == "") {
        // use encodeURIComponent in case the user types a space
        requestUrl = requestUrl + "&keywords=" + encodeURIComponent(newSearchObj.keywords);
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
    // News Crawler sorts by popularity
    requestUrl = requestUrl + "&sort=" + "popularity";
    console.log(requestUrl);
    getMediaApi(requestUrl);
}

function renderSearchDatatoPage() {
    console.log("renderSearchDatatoPage()");

    container.textContent="";
    articles = mediaData.data;
    
    // EH Notes: changed so that we only render the number of articles that the user wants. The default is 9.
    for(let i = 0; i < newSearchObj.numResults; i++)
    {
        var column = document.createElement("div");
        column.setAttribute("class", "column is-multiline is-one-third");
        var card = document.createElement("div");
        card.setAttribute("class", "card");
        column.appendChild(card);
        
        if(articles[i].image !== undefined || articles[i].image != null)
        {
            var cardImg = document.createElement("div");
            cardImg.setAttribute("class", "card-image");
            var imgFigure = document.createElement("figure");
            imgFigure.setAttribute("class", "image is-4by3");

            var img = document.createElement("img");
            img.setAttribute("src", articles[i].image);
            img.setAttribute("onerror", "this.onerror=null; this.src='https://bulma.io/images/placeholders/1280x960.png'");

            imgFigure.appendChild(img);
            cardImg.appendChild(imgFigure);
            card.appendChild(cardImg);
        }
        
        var cardContent = document.createElement("div");
        cardContent.setAttribute("class", "card-content");  

        var title = document.createElement("p");
        title.setAttribute("class", "title is-4");
        title.textContent = articles[i].title;
        cardContent.appendChild(title);
        
        var description = document.createElement("p");
        description.textContent = articles[i].description;
        cardContent.appendChild(description);

        var link = document.createElement("a");
        link.setAttribute("href", articles[i].url);
        link.setAttribute("target", "_blank");
        link.textContent = "See full article";
        link.setAttribute("class", "button is-primary");
        link.setAttribute("style", "margin-top: 10px");

        cardContent.appendChild(link);

        var date = document.createElement("time");
        date.setAttribute("datetime", articles[i].published_at);
        cardContent.appendChild(date);

        card.appendChild(cardContent);
        container.appendChild(column);

        // make the number of results selector appear after the search button has been clicked
        document.querySelector("#num-results").classList.remove("is-hidden");
    }
}

var changeNumResults = function(event) {
    if (searchFailed) {
        return;
    }
    newSearchObj.numResults = numResultsSelector.value;
    if (newSearchObj.numResults <= 25) {
        renderSearchDatatoPage()
    // if the user wants more results than the default limit of 25, run the query again with a higher limit
    } else {
        getSearchResults(newSearchObj.numResults)
    }
} 

searchButton.addEventListener('click', searchOnClick);
numResultsSelector.addEventListener('change', changeNumResults);