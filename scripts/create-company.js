const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="
const JSDELIVR = 'https://cdn.jsdelivr.net/gh/ryanwalker64/talent-engine@main/'

// Form inputs
const form = document.querySelector('[data-form="create-company"]') 
const employerInput = document.querySelector('[data-input="employer2"]') 
const locatedInput = document.querySelector('[data-input="working-locations"]') 
const industriesInput = document.querySelector('[data-input="industries"]') 
const companySizeInput = document.querySelector('[data-input="company-size"]') 
const selectedCompanyBtn = document.querySelector('[data-btn="select-company"]') 

selectedCompanyBtn.addEventListener('click', () => {
    if (!validateForm()) {
        const errormsg = document.querySelector('.errormsg')
        errormsg.style.display = 'block'
    } else {
        const loader = document.querySelector(".loader")
        const btns = document.querySelector(".btncontainer")
        const tab = document.querySelector(".tab")
        btns.style.display = 'none'
        tab.style.display = 'none'
        loader.style.display = 'flex'
        submitProfile()
    }
})


async function fetchData() {
    const [locationsResponse, industriesResponse, companiesResponse] = await Promise.all([
        fetch(JSDELIVR + 'locationsArray.json'),
        fetch(JSDELIVR + 'industriesArray.json')
     ])

    const locations = await locationsResponse.json()
    const industries = await industriesResponse.json()
    return [locations, industries]
}

fetchData().then(([locations, industries]) => {
    const industryObj = industries.map(industry => {return {'value': industry, 'text': industry}})

    locatedSelector = new TomSelect(locatedInput, {...locationSelectorSettings, options: locations, maxItems: 5});
    industriesSelector = new TomSelect(industriesInput, {...generalSelectorSettings,  options: industryObj, maxItems: 5});

    
    // MemberStack.onReady.then(function(member) {
    //     if (member.loggedIn) {
    //         console.log('User is editing their own profile')
    //         const userEmail = member["email"]
    //         // getUserData()
            
    //     } else {
    //     }
    // })
})

const locationSelectorSettings = {
	plugins: ['remove_button'],
	optgroups: [
		{value: 'AUS', label: 'Australia'},
		{value: 'NZ', label: 'New Zealand'},
		{value: 'OTHER', label: 'Other'}
	],
	optgroupField: 'country',
	labelField: 'value',
	searchField: ['value'],
    maxItems: 1,
};

const generalSelectorSettings = {
	plugins: ['remove_button'],
    maxItems: 1,
    sortField: {
		field: "text",
		direction: "asc"
	}
};

// HTML Inputs >> Tom Selectors
let locationSelector
let industriesSelector
let companySizeSelector = new TomSelect(companySizeInput, {...generalSelectorSettings, sortField: {}});

//input listneners
function submitProfile() {
    const formData = new FormData(form);
    const formProps = Object.fromEntries(formData);
    const companyData = {
        "Name": formProps['company-name'],
        "Website URL": formProps['company-website'],
        "Company Description": formProps['company-description'],
        "Slogan": formProps['company-slogan'],
        "Logo": formProps['logo'],
        "Remote Friendly": formProps['remote-friendly'],
        "Location": [...locatedSelector.getValue()],
        "Industry": [...industriesSelector.getValue()],
        "Company Size": [companySizeSelector.getValue()],
        "Employees": formProps['airtable-id'],
    }
    console.log(formProps)
    console.log(companyData)
    createCompany(companyData)
}

function createCompany(companyData) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
    method: "post",
    headers: myHeaders,
    redirect: "follow",
    body: JSON.stringify([companyData])
};

    fetch(API + "Companies", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result)
            // MemberStack.onReady.then(function(member) {  
            //     member.updateProfile({
            //         "profile-photo": userData["Profile Picture"],
            //         "first-name": userData["First Name"],
            //         "last-name": userData["Last Name"],
            //         "account-status": 'COMPLETE',
            //     }, false)
            // })
            // location.replace('dashboard')
        })
        .catch(error => console.log('error', error));
}



// MULTI-STEP FORM AND VALIDATION

function validateForm() {
  // This function deals with validation of the form fields
  let x, y, i, valid = true;
  x = document.querySelector(".tab");
  y = [
    ...x.getElementsByTagName("input"),
    ...x.getElementsByTagName("select"),
    ...x.getElementsByTagName("textarea")];

  // A loop that checks every input field in the current tab:
  y.forEach(input => {
    if (input.tagName === 'SELECT' 
        && typeof input.tomselect === 'object' 
        && input.tomselect.getValue() === '') {
        console.log('tomselector false')
        valid = false; 

    }  else if (input.tagName !== 'SELECT' && !input.checkValidity()) { 
        console.log(input.tagName + ' false')
        valid = false;
    } 
  })
  return valid; // return the valid status
}




