var newSearchObj = {
    keywords:"",
    categories: "",
    countries: "",
    languages:"",

}

var searchButton = document.querySelector("#searchBtn");
var container = document.querySelector("#cardContainer");


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

function renderSearchDatatoPage(data) {
    console.log(data);
    console.log("renderSearchDatatoPage()");
    
    container.textContent="";

    articles = data.data;

    for(let i = 0; i < articles.length; i++)
    {
        var card = document.createElement("div");
        card.setAttribute("class", "card column is-multiline is-one-third");
        
        if(articles[i].image != null)
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
        link.textContent = "See full article";
        cardContent.appendChild(link);

        var date = document.createElement("time");
        date.setAttribute("datetime", articles[i].published_at);
        cardContent.appendChild(date);

        card.appendChild(cardContent);
        container.appendChild(card);
    }
    
}

searchButton.addEventListener('click', searchOnClick);
