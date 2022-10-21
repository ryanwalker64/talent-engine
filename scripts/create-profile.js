const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="
const JSDELIVR = 'https://cdn.jsdelivr.net/gh/ryanwalker64/talent-engine@main/'

let userProfile = {}
let userId
let userIsLoggedIn
let memberID

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
const startmatePrograms = document.querySelector('[data-name="startmate-programs"]')

async function fetchData() {
    const [rolesResponse, locationsResponse, industriesResponse, programsResponse] = await Promise.all([
        fetch(JSDELIVR + 'rolesArray.json'),
        fetch(JSDELIVR + 'locationsArray.json'),
        fetch(JSDELIVR + 'industriesArray.json'),
        fetch(JSDELIVR + 'programsArray.json')
        // fetch(API + "Companies&fields=Name,Logo&perPage=all", {
        //     method: "get",
        //     headers: new Headers().append("Content-Type", "application/json"),
        //     redirect: "follow" })
        ])

    const roles = await rolesResponse.json()
    const locations = await locationsResponse.json()
    const industries = await industriesResponse.json()
    const programs = await programsResponse.json()
    // const companies = await companiesResponse.json()
    return [roles, locations, industries, programs]
}

fetchData().then(([roles, locations, industries, programs]) => {
    const rolesObj = roles.map(role => {return {'value': role, 'text': role}})
    const industryObj = industries.map(industry => {return {'value': industry, 'text': industry}})
    const programsObj = programs.map(program => {return {'value': program, 'text': program}})
    // const companiesHTML = companies.records.map(company => {
    //     return `<option value="${company.id}" data-src="${company.fields.Logo}">${company.fields.Name}</option>`
    // }).join('')

    // employerInput.insertAdjacentHTML('beforeend', companiesHTML)

    // employerSelector = new TomSelect(employerInput, {
    //     ...generalSelectorSettings,
    //      render: {
    //         option: function (data, escape) {return `<div><img class="me-2" src="${data.src}">${data.text}</div>`;},
    //         item: function (item, escape) {return `<div><img class="me-2" src="${item.src}">${item.text}</div>`;}
    //         }
    //     });

    locatedSelector = new TomSelect(locatedInput, {...locationSelectorSettings, options: locations});
    workingLocationSelector = new TomSelect(workingLocationsInput, {...locationSelectorSettings, options: locations, maxItems: 5});
    roleSelector = new TomSelect(roleSelectorInput, {...generalSelectorSettings, options: rolesObj});
    interestedRolesSelector = new TomSelect(interestedRolesInput, {...generalSelectorSettings, options: rolesObj, maxItems: 5});
    industriesSelector = new TomSelect(industriesInput, {...generalSelectorSettings,  options: industryObj, maxItems: 5});
    programsSelector = new TomSelect(startmatePrograms, {...generalSelectorSettings,  options: programsObj, maxItems: 5});
    
    locatedSelector.on('change', (e) => { workingLocationSelector.setValue(locatedSelector.getValue())})
    roleSelector.on('change', (e) => { interestedRolesSelector.setValue(roleSelector.getValue())})

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
let locatedSelector
let workingLocationSelector
let roleSelector
let interestedRolesSelector
let industriesSelector
// let employerSelector
let programsSelector
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
    const currentWorkContainer = document.querySelector('[data-current-work="container"]')
    if (firstJobInput.checked) {
        jobTitleInput.disabled = firstJobInput.checked
        // employerSelector.disable()
        startDateMonthSelector.disable()
        startDateYearSelector.disable()
        endDateMonthSelector.disable()
        endDateYearSelector.disable()
        currentlyWorkInput.disabled = firstJobInput.checked
        currentWorkContainer.style.display = 'none'

    } else {
        jobTitleInput.disabled = firstJobInput.checked
        // employerSelector.enable()
        startDateMonthSelector.enable()
        startDateYearSelector.enable()
        endDateMonthSelector.enable()
        endDateYearSelector.enable()
        currentlyWorkInput.disabled = firstJobInput.checked
        currentWorkContainer.style.display = 'grid'
    }
})

currentlyWorkInput.addEventListener('change', () => {
    const endDateContainer = document.querySelector('[data-end="container"]')
    if (currentlyWorkInput.checked) {
        endDateMonthSelector.disable()
        endDateYearSelector.disable()
        endDateContainer.style.display = 'none'
        
    } else {
        endDateMonthSelector.enable()
        endDateYearSelector.enable()
        endDateContainer.style.display = 'flex'
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
        // "Employer": [employerSelector.getValue()],
        "Candidate Employer": formProps['company'], 
        "Employment Start Date": formProps['start-date'],
        "Employment End Date": formProps['end-date'],
        "Currently work at employer?": formProps['currently-work-here'],
        "Job Pref: Relevant roles": interestedRolesSelector.getValue(),
        "Job Pref: Industries": industriesSelector.getValue(),
        "Job Pref: Type of role": typeOfJobSelector.getValue(),
        "Job Pref: Company size": companySizeSelector.getValue(),
        "Profile Picture": formProps['profile-pic'],
        "Profile Visibility": formProps['visibility'],
        "Profile hidden from:": formProps['hidden-from'],
        // "Startmate Program": programsSelector.getValue(), 
    }
    console.log(formProps)
    console.log(userData)
    createProfile(userData, userAirtableId)
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
        // "Employer": [employerSelector.getValue()], // fixx
        "Candidate Employer": formProps['company'], 
        "Employment Start Date": formProps['start-date'],
        "Employment End Date": formProps['end-date'],
        "Currently work at employer?": formProps['currently-work-here'],
        "Job Pref: Relevant roles": interestedRolesSelector.getValue(),
        "Job Pref: Industries": industriesSelector.getValue(),
        "Job Pref: Type of role": typeOfJobSelector.getValue(),
        "Job Pref: Company size": companySizeSelector.getValue(),
        "Profile Picture": formProps['profile-pic'],
        "Profile Visibility": formProps['visibility'],
        "Profile hidden from:": formProps['hidden-from'],
        "Account Status": 'COMPLETE',
        "Startmate Program": programsSelector.getValue(),
        "Date Last Edited": `${new Date()}`,
    }
    console.log(formProps)
    console.log(userData)
    createProfile(userData, userAirtableId)
}

function createProfile(userData, userAirtableId) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
    method: "put",
    headers: myHeaders,
    redirect: "follow",
    body: JSON.stringify([{"id": userAirtableId,"fields":userData}])
};

    fetch(API + "Users&typecast=true", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result)
            MemberStack.onReady.then(function(member) {  
                member.updateProfile({
                    "profile-photo": userData["Profile Picture"],
                    "first-name": userData["First Name"],
                    "last-name": userData["Last Name"],
                    "account-status": 'COMPLETE',
                }, false)
                memberID = member['airtable-id-two']
            }).then(()=> {
                window.location.href = `https://talent.startmate.com/app/profile?user=${memberID}`;
            })
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
    // employerSelector.setValue(userData.fields["Employer Airtable Record ID"]) 
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
    document.getElementById("formNxtBtn").innerHTML = "Save and continue";
  } else {
    document.getElementById("formNxtBtn").innerHTML = "Continue";
  }
}

function nextPrev(n) {
  // This function will figure out which tab to display
  let x = document.getElementsByClassName("tab");
  const err = document.querySelector('.errormsg')
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) {
        err.style.display = 'block'
        return false
    } else {
        err.style.display = 'none'
    }; 
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab >= x.length) {
    // ... the form gets submitted:
    x.forEach(tab => {
        tab.style.display = 'none'
    })
    const loader = document.querySelector(".loader")
    const btns = document.querySelector(".flex-middle")
    btns.style.display = 'none'
    loader.style.display = 'flex'
    submitProfile();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
    // This function deals with validation of the form fields
    let x, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = [
      ...x[currentTab].getElementsByTagName("input"),
      ...x[currentTab].getElementsByTagName("select"),
      ...x[currentTab].getElementsByTagName("textarea")];
  
    // A loop that checks every input field in the current tab:
    y.forEach(input => {
      if (firstJobInput.checked) {
          return valid
      }else if(input.tagName === 'SELECT' 
          && typeof input.tomselect === 'object' 
          && input.tomselect.getValue() === '') {
              if (!currentlyWorkInput.checked
                  || !firstJobInput.checked) {
                      
                      return valid = false; 
                  }
  
      }  else if (input.tagName !== 'SELECT' && !input.checkValidity() && !firstJobInput.checked) { 
          console.log(input.tagName + ' false')
          valid = false;
      } 
    })
    return valid; // return the valid status
  }




