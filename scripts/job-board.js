

let URL = ""
let jobs = []
let offset
let filter


var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
var requestOptions = {
    method: "get",
    headers: myHeaders,
    redirect: "follow",
    
};

fetch(URL, requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));


// On load grab 20 jobs
    // no expired jobs (past 30 days)
    // Store the jobs in jobs 
    // Store the offset
    // Append the 20 jobs to the DOM
    // Add a loading state whilst retrieving the jobs
    // grab total number of records and update the counts for displaying and total jobs

// At bottom of list add button to show 20 more jobs
    // Add a loading state whilst retrieving the jobs
    // fetch 20 more jobs with the URL + offset ( + filter if set)
    // append the 20 new jobs to jobs
    // update offset
    // Append the 20 jobs to the DOM
    // update the counts for displaying and total jobs

// add an event listener to the sidebar form for changes in the inputs
    // make sure it picks up for each input
    // store filter
    // retrieve the value and fetch the filtered list from the API
    // replace and store the fetched jobs in jobs
    // store offset
        // if less than 20 records, get the remaining to equal 20 from all records (filter by the opposite of the current filters) and append to the end of the array
    // Append the 20 jobs to the DOM

// if there is more than one filter
    // retrieve the filter values
    // store the combined filter
        // make sure to combine by OR || so it grabs all records that match at least one of the filters
    // replace and store the fetched jobs in jobs
    // Map over each record give it a point for each filter it matches in a score variable in the object
    // Sort the records by highest score first
    // store the offset
        // if less than 20 records, get the remaining to equal 20 from all records (filter by the opposite of the current filters) and append to the end of the array
    // Append the records to the DOM




