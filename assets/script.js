// EH notes: the user's previous search is automatically retrieved from localstorage
var previousSearch = localStorage.getItem("previousSearch");
var newSearchObj = {
    keywords:"",
    categories: "",
    countries: "",
    languages:"",
    hasSearched: false,
    // EH Notes: we set the default number of results to 9
    numResults: 9
}
var limit = 25;


var noResults = false;

var searchButton = document.querySelector("#searchBtn");
var container = document.querySelector("#cardContainer");
var numResultsSelector = document.querySelector("#num-results-selector");
// EH notes: if the user has a previous search in localstorage, it is automatically rendered to the page
if (previousSearch != null) {
    var mediaData = JSON.parse(previousSearch);
    renderSearchDatatoPage()
} else {
    var mediaData = "";
}

getWeatherApi();

var searchOnClick = function(event) {
    // EH notes: reset the search object if user has done a previous search
    if (newSearchObj.hasSearched) {
        newSearchObj.keywords = "";
        newSearchObj.categories= "";
        newSearchObj.countries = "";
        newSearchObj.languages = "";
    } else {
        newSearchObj.hasSearched = true;
    }



    // EH notes: reset the card container classes if they previously got no results
    if (container.className == "") {
        container.setAttribute("class","columns is-multiline is-3");
    }
    
    event.preventDefault();
    newSearchObj.keywords = document.querySelector("#keyword").value;

    var categoriesOptions = document.querySelector("#categories").options;
    var categoriesSelected = [];
    var index = 0;
    // EH notes: allow support to select multiple options
    for (var i = 0; i < categoriesOptions.length; i++) {
        // EH notes: add the selected options for categories
        // EH notes: exclude the placeholder disabled option
        if(categoriesOptions[i].selected && categoriesOptions[i].value != "") {
            categoriesSelected[index] = categoriesOptions[i].value;
            index++;
        } 
    }
    for (var j = 0; j < categoriesSelected.length; j++) {
        newSearchObj.categories += categoriesSelected[j];
        /* EH notes: add a comma between the options
           make sure to avoid putting an option at the end */
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
            if (data.data.length > 0) {
                noResults = false;
                // EH notes: save search to localstorage
                localStorage.setItem("previousSearch", JSON.stringify(mediaData));
                renderSearchDatatoPage();
            } else {
                noResults = true;
                renderNoResultHero("warning");
            }
        })
        .catch(error => {
            noResults = true;
            renderNoResultHero("danger");
        });
}
/* EH Notes: displays a yellow "no result" hero to the page if the query 
returns an empty array. Displays a red "Error: Failed to get search result"
hero to the page if the query gets an error*/
function renderNoResultHero(type) {
    var main = document.querySelector("container");
    var errorMessage = document.createElement("p");
    errorMessage.setAttribute("class", "title");
    container.textContent="";
    var warningHero = document.createElement("section");
    if (type == "warning") {
        warningHero.setAttribute("class", "hero is-medium is-warning");
        errorMessage.textContent = "No Results";
    } else if (type == "danger") {
        warningHero.setAttribute("class", "hero is-medium is-danger");
        errorMessage.textContent = "Error: Failed to get search result.";
    }
    var heroBody = document.createElement("div");
    heroBody.setAttribute("class", "has-text-centered hero-body");
    heroBody.appendChild(errorMessage);
    warningHero.appendChild(heroBody);
    container.className = "";
    container.appendChild(warningHero);
}

function getSearchResults() {
    var requestUrl = 'http://api.mediastack.com/v1/news?access_key=5217234f00ee82a8f21234381297455e';
    // EH notes: check if a limit has been specified. If not, the default is 25 according to media stack
    if (limit > 25) {
        requestUrl = requestUrl + "&limit=" + limit;
    }
    if (newSearchObj.keywords != null || newSearchObj.keywords == "") {
        // EH notes: use encodeURIComponent in case the user types a space
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
    // EH notes: News Crawler sorts by popularity
    requestUrl = requestUrl + "&sort=" + "popularity";
    console.log(requestUrl);
    getMediaApi(requestUrl);
}

function renderSearchDatatoPage() {
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

        // EH notes: make the number of results selector appear after the search button has been clicked
        document.querySelector("#num-results").classList.remove("is-hidden");
    }
}

var changeNumResults = function(event) {
    newSearchObj.numResults = numResultsSelector.value;
    // EH notes: if the user wants more results than the default limit of 25
    if (newSearchObj.numResults > 25) {
        limit = newSearchObj.numResults;
    }
    if (noResults) {
        return;
    }
    if (newSearchObj.numResults <= 25) {
        renderSearchDatatoPage();
    
    } else {
        getSearchResults();
    }
} 

function getWeatherApi() {
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            renderWeather(lat, lon);
        });
    }
    else
    {
        var weatherError = document.querySelector("#local-weather");
        weatherError.textContent = "Failed to get current location";
    }
}

function renderWeather(lat, lon) {
    var temp = document.querySelector("#temp");
    var feel = document.querySelector("#feel");
    var wind = document.querySelector("#wind");
    var humid = document.querySelector("#humid");

    const apiKey = '95827148da73fc51bf98de54195cc14e';
    var url = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat="+ lat + "&lon=" + lon + "&appid=" + apiKey;

    fetch(url).then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
              feel.textContent += data.current.feels_like;
              temp.textContent += data.current.temp + " °F";
              wind.textContent +=data.current.wind_speed + " mph";
              humid.textContent += data.current.humidity + " %";
          });
        } else {
          return 'Error: ' + response.statusText;
        }
      });
}



searchButton.addEventListener('click', searchOnClick);
numResultsSelector.addEventListener('change', changeNumResults);