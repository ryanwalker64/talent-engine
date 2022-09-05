const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="
const JSDELIVR = 'https://cdn.jsdelivr.net/gh/ryanwalker64/talent-engine@main/'

// let companies = []
// let retrievedCompany = {}
let userProfile = {}
let userId
let userIsLoggedIn

// Form inputs
const form = document.querySelector('[data-form="create-profile"]') 
const locatedInput = document.querySelector('[data-input="located"]')
const workingLocationsInput = document.querySelector('[data-input="working-locations"]')
const roleSelectorInput = document.querySelector('[data-input="role-selector"]')
const interestedRolesInput = document.querySelector('[data-input="interested-roles"]')
const firstJobInput = document.querySelector('[data-input="first-job"]')
const jobTitleInput = document.querySelector('[data-input="job-title"]')
const employerInput = document.querySelector('[data-input="employer"]')
const startDateInput = document.querySelector('[data-input="start-date"]')
    const startDateMonthInput = document.querySelector('[data-input="start-month"]')
    const startDateYearInput = document.querySelector('[data-input="start-year"]')
const endDateInput = document.querySelector('[data-input="end-date"]')
    const endDateMonthInput = document.querySelector('[data-input="end-month"]')
    const endDateYearInput = document.querySelector('[data-input="end-year"]')
const currentlyWorkInput = document.querySelector('[data-input="currently-work-here"]')
const typeOfJobInput = document.querySelector('[data-input="types-of-jobs"]')
const companySizeInput = document.querySelector('[data-input="company-size"]')
const industriesInput = document.querySelector('[data-input="industries"]')

async function fetchData() {
    const [rolesResponse, locationsResponse, industriesResponse, companiesResponse] = await Promise.all([
        fetch(JSDELIVR + 'rolesArray.json'),
        fetch(JSDELIVR + 'locationsArray.json'),
        fetch(JSDELIVR + 'industriesArray.json'),
        fetch(API + "Companies&fields=Name,Logo&perPage=all", {
            method: "get",
            headers: new Headers().append("Content-Type", "application/json"),
            redirect: "follow" })
        ])

    const roles = await rolesResponse.json()
    const locations = await locationsResponse.json()
    const industries = await industriesResponse.json()
    const companies = await companiesResponse.json()
    return [roles, locations, industries, companies]
}

fetchData().then(([roles, locations, industries, companies]) => {
    // console.log(roles, locations, industries, companies.records);
    const rolesObj = roles.map(role => {return {'value': role, 'text': role}})
    const industryObj = industries.map(industry => {return {'value': industry, 'text': industry}})
    const companiesHTML = companies.records.map(company => {
        return `<option value="${company.id}" data-src="${company.fields.Logo}">${company.fields.Name}</option>`
    }).join('')

    employerInput.insertAdjacentHTML('beforeend', companiesHTML)

    employerSelector = new TomSelect(employerInput, {
        ...generalSelectorSettings,
         render: {
            option: function (data, escape) {return `<div><img class="me-2" src="${data.src}">${data.text}</div>`;},
            item: function (item, escape) {return `<div><img class="me-2" src="${item.src}">${item.text}</div>`;}
            }
        });

    locatedSelector = new TomSelect(locatedInput, {...locationSelectorSettings, options: locations});
    workingLocationSelector = new TomSelect(workingLocationsInput, {...locationSelectorSettings, options: locations, maxItems: 3});
    roleSelector = new TomSelect(roleSelectorInput, {...generalSelectorSettings, options: rolesObj});
    interestedRolesSelector = new TomSelect(interestedRolesInput, {...generalSelectorSettings, options: rolesObj, maxItems: 3});
    industriesSelector = new TomSelect(industriesInput, {...generalSelectorSettings,  options: industryObj, maxItems: 5});
    
    locatedSelector.on('change', (e) => { workingLocationSelector.setValue(locatedSelector.getValue())})

    MemberStack.onReady.then(function(member) {
        if (member.loggedIn) {
            console.log('User is editing their own profile')
            const userEmail = member["email"]
            // getUserData()
            
        } else {
        }
    })
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
let locatedSelector
let workingLocationSelector
let roleSelector
let interestedRolesSelector
let industriesSelector
let employerSelector
let typeOfJobSelector = new TomSelect(typeOfJobInput, {...generalSelectorSettings, maxItems: null});
let companySizeSelector = new TomSelect(companySizeInput, {...generalSelectorSettings, maxItems: null, sortField: {}});
let startDateMonthSelector = new TomSelect(startDateMonthInput, {...generalSelectorSettings,  sortField: {}});
let startDateYearSelector = new TomSelect(startDateYearInput, {...generalSelectorSettings, sortField: {direction: "desc"}});
let endDateMonthSelector = new TomSelect(endDateMonthInput, {...generalSelectorSettings,  sortField: {}});
let endDateYearSelector = new TomSelect(endDateYearInput, {...generalSelectorSettings, sortField: {direction: "desc"}});

//input listneners
const grabMonthYearInputs = (monthInput, yearInput, monthYearInput) => {
    monthYearInput.value = `${monthInput.value} ${yearInput.value}`
}
startDateMonthSelector.on('change', () => grabMonthYearInputs(startDateMonthInput, startDateYearInput, startDateInput))
startDateYearSelector.on('change', () => grabMonthYearInputs(startDateMonthInput, startDateYearInput, startDateInput))
endDateMonthSelector.on('change', () => grabMonthYearInputs(endDateMonthInput, endDateYearInput, endDateInput))
endDateYearSelector.on('change', () => grabMonthYearInputs(endDateMonthInput, endDateYearInput, endDateInput))

firstJobInput.addEventListener('change', () => {
    if (firstJobInput.checked) {
        jobTitleInput.disabled = firstJobInput.checked
        employerSelector.disable()
        startDateMonthSelector.disable()
        startDateYearSelector.disable()
        endDateMonthSelector.disable()
        endDateYearSelector.disable()
        currentlyWorkInput.disabled = firstJobInput.checked
    } else {
        jobTitleInput.disabled = firstJobInput.checked
        employerSelector.enable()
        startDateMonthSelector.enable()
        startDateYearSelector.enable()
        endDateMonthSelector.enable()
        endDateYearSelector.enable()
        currentlyWorkInput.disabled = firstJobInput.checked
    }
})

currentlyWorkInput.addEventListener('change', () => {
    if (currentlyWorkInput.checked) {
        endDateMonthSelector.disable()
        endDateYearSelector.disable()
    } else {
        endDateMonthSelector.enable()
        endDateYearSelector.enable()
    }
})

form.addEventListener('submit', (e) => {
    e.preventDefault
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    const userAirtableId = formProps['airtable-id']
    const userData = {
        "First Name": formProps['first-name'],
        "Last Name": formProps['last-name'],
        "Bio": formProps['bio'],
        "Stage of Job Hunt": formProps['job-hunt'],
        "Linkedin": formProps['linkedin'],
        "Location": [locatedSelector.getValue()],
        "Job Pref: Working Locations": workingLocationSelector.getValue(),
        "Job Pref: Open to remote work": formProps['remote-work'],
        "Next Role": formProps['next-role'],
        "What do you do?": [roleSelector.getValue()],
        "Work Experience": formProps['work-experience'],
        "First Job?": formProps['first-job'],
        "Job Title": formProps['job-title'],
        "Employer": [employerSelector.getValue()],
        "Employment Start Date": formProps['start-date'],
        "Employment End Date": formProps['end-date'],
        "Currently work at employer?": formProps['currently-work-here'],
        "Job Pref: Relevant roles": interestedRolesSelector.getValue(),
        "Job Pref: Industries": industriesSelector.getValue(),
        "Job Pref: Type of role": typeOfJobSelector.getValue(),
        "Job Pref: Company size": companySizeSelector.getValue(),
        "Profile Picture": formProps['profile-pic'],
        "Profile Visibility": formProps['visbility'],
        "Profile hidden from:": formProps['hidden-from'],
    }
    console.log(formProps)
    console.log(userData)
    postUserInfo(userData, userAirtableId)
})

function submitProfile() {
    const formData = new FormData(form);
    const formProps = Object.fromEntries(formData);
    const userAirtableId = formProps['airtable-id']
    const userData = {
        "First Name": formProps['first-name'],
        "Last Name": formProps['last-name'],
        "Bio": formProps['bio'],
        "Stage of Job Hunt": formProps['job-hunt'],
        "Linkedin": formProps['linkedin'],
        "Location": [locatedSelector.getValue()],
        "Job Pref: Working Locations": workingLocationSelector.getValue(),
        "Job Pref: Open to remote work": formProps['remote-work'],
        "Next Role": formProps['next-role'],
        "What do you do?": [roleSelector.getValue()],
        "Work Experience": formProps['work-experience'],
        "First Job?": formProps['first-job'],
        "Job Title": formProps['job-title'],
        "Employer": [employerSelector.getValue()],
        "Employment Start Date": formProps['start-date'],
        "Employment End Date": formProps['end-date'],
        "Currently work at employer?": formProps['currently-work-here'],
        "Job Pref: Relevant roles": interestedRolesSelector.getValue(),
        "Job Pref: Industries": industriesSelector.getValue(),
        "Job Pref: Type of role": typeOfJobSelector.getValue(),
        "Job Pref: Company size": companySizeSelector.getValue(),
        "Profile Picture": formProps['profile-pic'],
        "Profile Visibility": formProps['visbility'],
        "Profile hidden from:": formProps['hidden-from'],
    }
    console.log(formProps)
    console.log(userData)
    postUserInfo(userData, userAirtableId)
}

function postUserInfo(userData, userAirtableId) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
    method: "put",
    headers: myHeaders,
    redirect: "follow",
    body: JSON.stringify([{"id": userAirtableId,"fields":userData}])
};

    fetch(API + "Users", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result)
            location.replace('test.com')
        })
        .catch(error => console.log('error', error));

}

function setProfileInfo(userData) {
    document.querySelector('[data-name="first-name"]').value = userData.fields["First Name"]
    document.querySelector('[data-name="last-name"]').value = userData.fields["Last Name"]
    document.querySelector('[data-name="bio"]').value = userData.fields["Bio"]
    document.querySelector('[data-name="job-hunt"]').value = userData.fields["Stage of Job Hunt"]
    document.querySelector('[data-name="linkedin"]').value = userData.fields["Linkedin"]
    document.querySelector('[data-name="remote-work"]').value = userData.fields["Job Pref: Open to remote work"]
    document.querySelector('[data-name="next-role"]').value = userData.fields["Next Role"]
    document.querySelector('[data-name="work-experience"]').value = userData.fields["Work Experience"]
    firstJobInput.value = userData.fields["first-job"]
    document.querySelector('[data-name="job-title"]').value = userData.fields["Job Title"]
    employerSelector.setValue(userData.fields["Employer Airtable Record ID"])
    currentlyWorkInput.value = userData.fields["Currently work at employer?"]
    document.querySelector('[data-name="profile-pic"]').value = userData.fields["Profile Picture"]
    profileVisibility = document.querySelector('[data-name="visibility"]').value = userData.fields["Profile Visibility"]
    locatedSelector.setValue(userData.fields["Location"])
    workingLocationSelector.setValue(userData.fields["Job Pref: Working Locations"])
    roleSelector.setValue(userData.fields["What do you do?"])
    interestedRolesSelector.setValue(userData.fields["Job Pref: Relevant roles"])
    typeOfJobSelector.setValue(userData.fields["Job Pref: Type of role"])
    companySizeSelector.setValue(userData.fields["Job Pref: Company size"])
    startDateMonthSelector.setValue(userData.fields["Employment Start Date"].split(' ')[0])
    startDateYearSelector.setValue(userData.fields["Employment Start Date"].split(' ')[1])
    endDateMonthSelector.setValue(userData.fields["Employment End Date"].split(' ')[0])
    endDateYearSelector.setValue(userData.fields["Employment End Date"].split(' ')[1])
    industriesSelector.setValue(userData.fields["Job Pref: Industries"])
}



function getUserData(userId) {
    // userId = getUserId()

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    
    };

    fetch(API + "Users&id=" + userId, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            setProfileInfo(result)
        })
        .catch(error => console.log('error', error));
}

// MULTI-STEP FORM AND VALIDATION


let currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form...
  let x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("formBackBtn").style.display = "none";
  } else {
    document.getElementById("formBackBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("formNxtBtn").innerHTML = "Submit";
  } else {
    document.getElementById("formNxtBtn").innerHTML = "Continue";
  }
  //... and run a function that will display the correct step indicator:
//   fixStepIndicator(n)
}

function nextPrev(n) {
  // This function will figure out which tab to display
  let x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
//   if (n == 1 && !validateForm()) return false; 
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab >= x.length) {
    // ... the form gets submitted:
    submitProfile()
    form.submit();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  let x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
//   if (valid) {
//     document.getElementsByClassName("step")[currentTab].className += " finish";
//   }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}



// Onload, fetch user airtable ID from memberstack ✅
    // fetch names of companies and record ids from companies table in airtable ✅
    // store companies list in companies  ✅
    // append list of companies to select field ✅
    // if company airtable id exists 
        // fetch company information and store in retrievedCompany
        // prefill company in experience field
    // on continue, if candidate update airtable user with company record id 

// if company doesn't exist
    // display create company form (minified) 
    // on form submission, create company in airtable companies table (as shallow company)
    // attach user's airtable id to it
    // show saved state

// on continue load job preferences ✅
// on continue load profile visibility ✅

// save info to airtable ✅
