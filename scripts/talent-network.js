const directoryContainer = document.querySelector('.directory-container-v2')
const form = document.querySelector('[data-filter="form"]')
const formInputs = document.querySelectorAll('[data-filter="input"]')


let API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName=Users"
let userbase = []
let offset
let filter
//&cacheTime=5

formInputs.forEach(filter => {
    filter.addEventListener('click', (e) => {
        // console.log()
        getExperienceValues()
        fetchProfiles("IF(%7Bexperience-stage%7D+%3D+%22Expert%22%2C+%22true%22)")

    })
})

function getExperienceValues() {
    const experienceInputs = [...document.querySelectorAll('[data-experience]')]
    const checked = experienceInputs.filter(checkbox => {
        if (checkbox.checked) return checkbox.value }); 
        console.log(checked)
        
}



function fetchProfiles(filter = '') {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
        
    };

    const APIURL = API + filter + "&perPage=20"

    fetch(APIURL, requestOptions)
        .then(response => response.json())
        .then(result => {
            userbase = result.records
            console.log(userbase)
            displayProfiles(userbase)
        })
        .catch(error => console.log('error', error));
}
fetchProfiles()

function displayProfiles(profiles){
    const profilesHTML = profiles.map(profile => {
        return `
        <div class="candidate-profile">
            <img src=${profile.fields["Profile Picture"]} sizes="60px" alt="" class="img" />
            <div class="candidate-info">
                <div class="candidate-name">${profile.fields["Full Name"]}, ${profile.fields["Job Title"]} @ ${profile.fields["Name (from Employer)"][0]}</div>
                <div class="candidate-details-container">
                    <div class="candidate-short-details">
                    ${profile.fields["Years of Work Experience"] === "Junior 1-2 years"
                        ? 'Junior'
                        : profile.fields["Years of Work Experience"] === "Mid-level 3-4 years"
                            ? 'Mid-level'
                            : profile.fields["Years of Work Experience"] === "Senior 5-7 years"
                                ? 'Senior'
                                : 'Expert'} • Lawyer • ${profile.fields["Location"]}</div>
                    ${profile.fields["Stage of Job Hunt"] === "Actively Looking"
                        ? `<div class="candidate-status actively-looking">Actively Looking</div>`
                        : `<div></div>`}
                </div>
            </div>
            <div class="candidate-buttons-container">
                <a href="/profile?user=${profile.id}" class="candidate-button-v2 more-button w-button">See more</a>
                <a href="#" class="candidate-button-v2 contact-btn w-button">Contact</a>
            </div>
        </div> 
        `
    }).join('')

    directoryContainer.innerHTML = profilesHTML
    
}



// On load grab 20 candidates
    // no employers
    // profiles that are visible
    // Store the profiles in userbase ✅
    // Store the offset
    // Append the 20 profiles to the DOM ✅
    // Add a loading state whilst retrieving the profiles
    // grab total number of records and update the counts for displaying and total candidates

// At bottom of list add button to show 20 more candidates
    // Add a loading state whilst retrieving the profiles
    // fetch 20 more candidates with the URL + offset ( + filter if set)
    // append the 20 new candidates to the userbase
    // update offset
    // Append the 20 profiles to the DOM
    // update the counts for displaying and total candidates

// add an event listener to the sidebar form for changes in the inputs
    // make sure it picks up for each input
    // store filter
    // retrieve the value and fetch the filtered list from the API
    // replace and store the fetched profiles in userbase
    // store offset
        // if less than 20 records, get the remaining to equal 20 from all records (filter by the opposite of the current filters) and append to the end of the array
    // Append the 20 profiles to the DOM

// if there is more than one filter
    // retrieve the filter values
    // store the combined filter
        // make sure to combine by OR || so it grabs all records that match at least one of the filters
    // replace and store the fetched profiles in userbase
    // Map over each record give it a point for each filter it matches in a score variable in the object
    // Sort the records by highest score first
    // store the offset
        // if less than 20 records, get the remaining to equal 20 from all records (filter by the opposite of the current filters) and append to the end of the array
    // Append the records to the DOM



// if user hidden companies field matches a company name of the user viewing, hide from DOM?
