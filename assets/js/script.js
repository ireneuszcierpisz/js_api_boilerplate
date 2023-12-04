// make an API a GET request:
const API_KEY = "ccQ1Yv7nyCGiNDUILqxw5IPa0-s";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));
document.getElementById("status").addEventListener("click", e => getStatus(e));
// the tasks that getStatus function needs to do: 
// 1. it needs to make a  GET request to the API_URL with the API_KEY.
// 2. it needs to pass this data to a function that will display it.
async function getStatus(e) {
    // use JavaScript’s template literals here
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    // let’s “await” the response
    const response = await fetch(queryString);
    // When the response comes back, we need to convert it to json
    // the json() method also returns a promise, so we need to await that too
    // at this stage in our function, we can assume that we'll have some data back
    const data = await response.json();
    if (response.ok) {   // a property is set on the response object and this property is the “ok” property.
        //if the server returns the HTTP status code of 200 then our request has been successful and the “ok” property will be set to True.
        //if it returns an error code, then the “ok” property will be set to False.
        // the data it will either be our key expiry data, or it will be an error.
        console.log(data.expiry);  // one of the key names in the 'data' json object is the 'expiry' key so the console log will be just the date.
    }   // an error could arise for all sorts of reasons - the API key could have expired, we could have typed in the URL wrongly,  
    // or it could actually be a fault at the API’s end.
}