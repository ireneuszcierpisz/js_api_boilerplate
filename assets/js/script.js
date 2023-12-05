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
        // console.log(data.expiry);
        displayStatus(data);  //call the displayStatus function
    } else {
        throw new Error(data.error);  // uses the built-in JavaScript error handler to throw a new error
    }                           // 'data.error' it's the descriptive  message from the json that's been returned
    // an error could arise for all sorts of reasons - the API key could have expired, we could have typed in the URL wrongly,  
    // or it could actually be a fault at the API’s end.
}


function displayStatus(data) {
    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();  // the element of the id 'resultsModal' is shown
}


/* Making a POST Request */
document.getElementById("submit").addEventListener("click", e => postForm(e));  // adds event listener to the Run Checks button with 'submit' id

async function postForm(e) {  // it needs to be an async function. So that we can await the results of our promise
    // gets the form data (JavaScript provides an interface to do that. It's called the FormData interface.):
    //creates a new formData object
    const form = new FormData(document.getElementById("checksform")); //captures all of the fields in a HTML form and return it as an object
    // the formData object has several default  methods that allow us to manipulate the data -> https://developer.mozilla.org/en-US/docs/Web/API/FormData
    /*
    // the entries method can iterate through to see the form entries.
    for (let entry of form.entries()) {  // iterates through each of the form entries putting it in 'entry'
        console.log(entry);  // when we  click on the Run Checks button, we should see the data logged in the console
    }
    */
    // then give this object to "fetch":
    const response = await fetch(API_URL, {   //  'await fetch' because it  returns a promise
        method: "POST",  //this will make a POST request to the API,authorize it with the API key and attach the form as the body of the request
        headers: {
            "Authorization": API_KEY,
        },
        body: form,  // we send the form  data to the API; thanks to the formData object we add it into the request just after the headers
    });
    // We need to turn the response into json and then call the appropriate function or throw an error if the response doesn't return okay:
    const data = await response.json();
    if (response.ok) {   // the 'ok' property is set on the response object
        //if the server returns the HTTP status code of 200 then our request has been successful and the “ok” property will be set to True.
        //if it returns an error code, then the “ok” property will be set to False.
        // the data it will either be our data, or it will be an error.
        // console.log(data);
        displayErrors(data);      // display the data in a modal by passing the data into the displayErrors() function
    } else {
        throw new Error(data.error);  // uses the built-in JavaScript error handler to throw a new error
    }                           // 'data.error' that's the descriptive  message from the json that's been returned

}

// display the data in a modal
function displayErrors(data) {

    let results = "";

    let heading = `JSHint Results for ${data.file}`;
    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}:</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}



/* 
Instruction from JSHint API https://ci-jshint.herokuapp.com/ 
The API key must be passed in the headers. Here is an example of setting the header for JavaScript:
const response = fetch("https://ci-jshint.herokuapp.com/api", {
    method: "POST",
    headers: {
        "Authorization": API_KEY,
    }
});
*/