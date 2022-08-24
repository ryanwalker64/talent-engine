
let userProfile = {}

// Onload and Memberstack ready, get Airtable ID
    // fetch airtable record of ID
    // store profile information in userProfile
    // display profile information in editing form fields
    // Loading state

// add event listener to form submit
    // update record in airtable
    // show save complete state when completed


async function fetchSelection(selection) {
     fetch(`https://cdn.jsdelivr.net/gh/ryanwalker64/talent-engine@main/${selection}.json`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
        return data
    });
 }


const roles = await fetchSelection(rolesArray)
const industries = await fetchSelection(industriesArray)
const locations = await fetchSelection(locationsArray)

