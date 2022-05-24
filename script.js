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

getCurrentApi();