const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="
const JSDELIVR = 'https://cdn.jsdelivr.net/gh/ryanwalker64/talent-engine@main/'

const saveBtns = document.querySelectorAll('[data-btn]')
let timeoutId
let userType

const fNameInput = document.querySelector('[data-name="first-name"]')
const lNameInput = document.querySelector('[data-name="last-name"]')
const emailInput = document.querySelector('[data-name="email"]')
const linkedinInput = document.querySelector('[data-name="linkedin"]')
const profilePicInput = document.querySelector('[data-name="profile-pic"]')
    const profileImg = document.querySelector('[data-image-preview]')
const locatedInput = document.querySelector('[data-name="located"]')
const bioInput = document.querySelector('[data-name="bio"]')
const startmatePrograms = document.querySelector('[data-name="startmate-programs"]')

// Work Experience Fields
const currentRoleInput = document.querySelector('[data-name="current-role"]')
const workExperienceInput = document.querySelector('[data-name="work-experience"]')
const firstJobInput = document.querySelector('[data-name="first-job"]')
const currentEmployerInput = document.querySelector('[data-name="employer"]')
const jobTitleInput = document.querySelector('[data-name="job-title"]')
const currentEmploymentStartMonthInput = document.querySelector('[data-name="start-month"]')
const currentEmploymentStartYearInput = document.querySelector('[data-name="start-year"]')
const currentEmploymentEndMonthInput = document.querySelector('[data-name="end-month"]')
const currentEmploymentEndYearInput = document.querySelector('[data-name="end-year"]')
const currentlyWorkingAtEmployerInput = document.querySelector('[data-name="currently-work-here"]')

// Job Preferences Fields
const stageOfJobHuntInput = document.querySelectorAll('[data-name="job-hunt"]')
const prefRemoteWorkInput = document.querySelector('[data-name="remote-friendly"]')
const prefLocationsInput = document.querySelector('[data-name="pref-locations"]')
const prefRolesInput = document.querySelector('[data-name="pref-roles"]')
const prefTypeOfWorkInput = document.querySelector('[data-name="pref-type-of-job"]')
const prefCompanySize = document.querySelector('[data-name="pref-company-size"]')
const prefRoleBioInput = document.querySelector('[data-name="pref-next-role"]')
const prefIndustriesInput = document.querySelector('[data-name="pref-industries"]')
const profileVisibilityInput = document.querySelectorAll('[data-name="visibility"]')

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

let companyData

let locatedSelector
let workingLocationSelector
let roleSelector
let interestedRolesSelector
let industriesSelector
let programsSelector
let typeOfJobSelector = new TomSelect(prefTypeOfWorkInput, {...generalSelectorSettings, maxItems: null});
let companySizeSelector = new TomSelect(prefCompanySize, {...generalSelectorSettings, maxItems: null, sortField: {}});
let startDateMonthSelector = new TomSelect(currentEmploymentStartMonthInput, {...generalSelectorSettings,  sortField: {}});
let startDateYearSelector = new TomSelect(currentEmploymentStartYearInput, {...generalSelectorSettings, sortField: {direction: "desc"}});
let endDateMonthSelector = new TomSelect(currentEmploymentEndMonthInput, {...generalSelectorSettings,  sortField: {}});
let endDateYearSelector = new TomSelect(currentEmploymentEndYearInput, {...generalSelectorSettings, sortField: {direction: "desc"}});


async function fetchData() {
    const [rolesResponse, locationsResponse, industriesResponse, programsResponse] = await Promise.all([
        fetch(JSDELIVR + 'rolesArray.json'),
        fetch(JSDELIVR + 'locationsArray.json'),
        fetch(JSDELIVR + 'industriesArray.json'),
        fetch(JSDELIVR + 'programsArray.json') ])

    const roles = await rolesResponse.json()
    const locations = await locationsResponse.json()
    const industries = await industriesResponse.json()
    const programs = await programsResponse.json()
    return [roles, locations, industries, programs]
}

fetchData().then(([roles, locations, industries, programs]) => {
    const rolesObj = roles.map(role => {return {'value': role, 'text': role}})
    const industryObj = industries.map(industry => {return {'value': industry, 'text': industry}})
    const programsObj = programs.map(program => {return {'value': program, 'text': program}})
 
    locatedSelector = new TomSelect(locatedInput, {...locationSelectorSettings, options: locations});
    workingLocationSelector = new TomSelect(prefLocationsInput, {...locationSelectorSettings, options: locations, maxItems: 3});
    roleSelector = new TomSelect(currentRoleInput, {...generalSelectorSettings, options: rolesObj});
    interestedRolesSelector = new TomSelect(prefRolesInput, {...generalSelectorSettings, options: rolesObj, maxItems: 3});
    industriesSelector = new TomSelect(prefIndustriesInput, {...generalSelectorSettings,  options: industryObj, maxItems: 5});
    programsSelector = new TomSelect(startmatePrograms, {...generalSelectorSettings,  options: programsObj, maxItems: 5});


}).then(() => {
    MemberStack.onReady.then( async function(member) {
        if (member.loggedIn) {
            const userID = member["airtable-id-two"]
            userType = member["user-type"]
            fetchUserData(userID)
        } 
})
})

function fetchUserData(id) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    };

   return fetch(API + "Users&id=" + id, requestOptions)
    .then(response => response.json())
    .then(result => companyData = result)
    .then(() => {
        fillFields(companyData.fields)
        const loadingContainer = document.querySelector('[data-loader]')
        const container = document.querySelector('[data-profile="container"]')
        loadingContainer.style.display = 'none'
        container.style.display = 'block'
    })
}


function handleFirstJob() {
    const currentWorkContainer = document.querySelector('[data-current-work="container"]')
    if (firstJobInput.checked) {
        jobTitleInput.disabled = firstJobInput.checked
        startDateMonthSelector.disable()
        startDateYearSelector.disable()
        endDateMonthSelector.disable()
        endDateYearSelector.disable()
        currentlyWorkingAtEmployerInput.disabled = firstJobInput.checked
        currentWorkContainer.style.display = 'none'
    } else {
        jobTitleInput.disabled = firstJobInput.checked
        startDateMonthSelector.enable()
        startDateYearSelector.enable()
        endDateMonthSelector.enable()
        endDateYearSelector.enable()
        currentlyWorkingAtEmployerInput.disabled = firstJobInput.checked
        currentWorkContainer.style.display = 'grid'
    }
}

function handleCurrentlyWorking() {
    const endDateContainer = document.querySelector('[data-end="container"]')
    if (currentlyWorkingAtEmployerInput.checked) {
        endDateMonthSelector.disable()
        endDateYearSelector.disable()
        endDateContainer.style.display = 'none'
    } else {
        endDateMonthSelector.enable()
        endDateYearSelector.enable()
        endDateContainer.style.display = 'flex'
    }
}

firstJobInput.addEventListener('change', handleFirstJob)
currentlyWorkingAtEmployerInput.addEventListener('change', handleCurrentlyWorking)


function fillFields(data) {
    fNameInput.value = data['First Name'] ? data['First Name'] : ''
    lNameInput.value = data['Last Name'] ? data['Last Name'] : ''
    emailInput.value = data['Email'] ? data['Email'] : ''
    linkedinInput.value = data['Linkedin'] ? data['Linkedin'] : ''
    profilePicInput.value = data['Profile Picture'] ? data['Profile Picture'] : ''
        profileImg.src = data['Profile Picture'] ? data['Profile Picture'] : ''
    locatedSelector.setValue(data['Location'] ? data['Location'] : '')
    bioInput.value = data['Bio'] ? data['Bio'] : ''
    programsSelector.setValue(data['Startmate Program'] ? data['Startmate Program'] : '')

    // Work Experience Fields
    roleSelector.setValue(data['What do you do?'] ? data['What do you do?'] : '')
    workExperienceInput.value = data['Work Experience'] ? data['Work Experience'] : ''
    if(data['First Job?']) {
        firstJobInput.checked = true
        handleFirstJob()
    } 
    currentEmployerInput.value = data['Candidate Employer'] ? data['Candidate Employer'] : ''
    jobTitleInput.value = data['Job Title'] ? data['Job Title'] : ''
    startDateMonthSelector.setValue(data['Employment Start Date'] ? data['Employment Start Date'].split(' ')[0] : '')
    startDateYearSelector.setValue(data['Employment Start Date'] ? data['Employment Start Date'].split(' ')[1] : '')
    endDateMonthSelector.setValue(data['Employment End Date'] ? data['Employment End Date'].split(' ')[0] : '') 
    endDateYearSelector.setValue(data['Employment End Date'] ? data['Employment End Date'].split(' ')[1] : '')
    if(data['Currently work at employer?']) {
        currentlyWorkingAtEmployerInput.checked = true
        handleCurrentlyWorking()
    } 

    // Job Preferences Fields
    if(data['Stage of Job Hunt']) {
        const radiobtn = document.getElementById(data['Stage of Job Hunt']);
        radiobtn.checked = true
    } 
    interestedRolesSelector.setValue(data['Job Pref: Relevant roles'] ? data['Job Pref: Relevant roles'] : '')
    typeOfJobSelector.setValue(data['Job Pref: Type of role'] ? data['Job Pref: Type of role'] : '')
    companySizeSelector.setValue(data['Job Pref: Company size'] ? data['Job Pref: Company size'] : '')
    industriesSelector.setValue(data['Job Pref: Industries'] ? data['Job Pref: Industries'] : '')
    workingLocationSelector.setValue(data['Job Pref: Working Locations'] ? data['Job Pref: Working Locations'] : '')
    prefRemoteWorkInput.checked = data['Job Pref: Open to remote work'] ? true : false
    prefRoleBioInput.value = data['Next Role'] ? data['Next Role'] : ''
    if(data['Profile Visibility']) {
        const radiobtn = document.getElementById(data['Profile Visibility']);
        radiobtn.checked = true
    } 

}

function checkForUpdates(data) {
    
    let profileUpdates = {}
    
    profileUpdates["Date Last Edited"] = `${new Date()}`,
    fNameInput.value !== data['First Name'] ? profileUpdates["First Name"] = fNameInput.value : ''
    lNameInput.value !== data['Last Name'] ? profileUpdates["Last Name"] = lNameInput.value : ''
    emailInput.value !== data['Email'] ? profileUpdates["Email"] = emailInput.value : ''
    linkedinInput.value !== data['Linkedin'] ? profileUpdates["Linkedin"] = linkedinInput.value : ''
    profilePicInput.value !== data['Profile Picture'] ? profileUpdates["Profile Picture"] = profilePicInput.value : ''
    locatedSelector.getValue() !== data['Location'] ? profileUpdates["Location"] = [locatedSelector.getValue()] : ''
    if(userType === 'EMPLOYER') { jobTitleInput.value !== data['Job Title'] ? profileUpdates['Job Title'] = jobTitleInput.value : '' }

    if(userType === 'CANDIDATE') {
        bio.value !== data['Bio'] ? profileUpdates["Bio"] = bio.value : ''
        programsSelector.getValue() !== data['Startmate Program'] ? profileUpdates["Startmate Program"] = programsSelector.getValue() : ''

        roleSelector.getValue() !== data['What do you do?'] ? profileUpdates['What do you do?'] = [roleSelector.getValue()] : ''
        workExperienceInput.value !== data['Work Experience'] ? profileUpdates["Work Experience"] = workExperienceInput.value : ''
        profileUpdates['First Job?'] = firstJobInput.checked ? `${firstJobInput.checked}` : ''
        currentEmployerInput.value !== data['Candidate Employer'] ? profileUpdates['Candidate Employer'] = currentEmployerInput.value : ''
        jobTitleInput.value !== data['Job Title'] ? profileUpdates['Job Title'] = jobTitleInput.value : ''
        if (`${startDateMonthSelector.getValue()} ${startDateYearSelector.getValue()}` !== data['Employment Start Date']) profileUpdates['Employment Start Date'] = `${startDateMonthSelector.getValue()} ${startDateYearSelector.getValue()}`
        if (`${endDateMonthSelector.getValue()} ${endDateYearSelector.getValue()}` !== data['Employment End Date']) profileUpdates['Employment End Date'] = `${endDateMonthSelector.getValue()} ${endDateYearSelector.getValue()}`
        profileUpdates['Currently work at employer?'] = currentlyWorkingAtEmployerInput.checked ? `${currentlyWorkingAtEmployerInput.checked}` : ''


        for (let i = 0; i < stageOfJobHuntInput.length; i++) {
            if(stageOfJobHuntInput[i].checked === true) {
                stageOfJobHuntInput[i].value !== data["Stage of Job Hunt"] ? profileUpdates["Stage of Job Hunt"] = stageOfJobHuntInput.value : ''
            }
        }
        interestedRolesSelector.getValue() !== data['Job Pref: Relevant roles'] ? profileUpdates['Job Pref: Relevant roles'] = interestedRolesSelector.getValue() : ''
        typeOfJobSelector.getValue() !== data['Job Pref: Type of role'] ? profileUpdates['Job Pref: Type of role'] = typeOfJobSelector.getValue() : ''
        companySizeSelector.getValue() !== data['Job Pref: Company size'] ? profileUpdates['Job Pref: Company size'] = companySizeSelector.getValue() : ''
        industriesSelector.getValue() !== data['Job Pref: Industries'] ? profileUpdates['Job Pref: Industries'] = industriesSelector.getValue() : ''
        workingLocationSelector.getValue() !== data['Job Pref: Working Locations'] ? profileUpdates['Job Pref: Working Locations'] = workingLocationSelector.getValue() : ''
        profileUpdates['Job Pref: Open to remote work'] = prefRemoteWorkInput.checked ? `${prefRemoteWorkInput.checked}` : ''
        prefRoleBioInput.value !== data['Next Role'] ? profileUpdates['Next Role'] = prefRoleBioInput.value : ''
        for (let i = 0; i < profileVisibilityInput.length; i++) {
            if(profileVisibilityInput[i].checked === true) {
                profileVisibilityInput[i].value !== data['Profile Visibility'] ? profileUpdates['Profile Visibility'] = profileVisibilityInput.value : ''
            }
        }
    }

    console.log(profileUpdates)
    return profileUpdates
}

function updateProfile(data, userId) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "put",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify([{"id": userId,"fields":data}])
    };

    fetch(API + "Users", requestOptions)
    .then(response => response.text())
    .then(result => {
        console.log(result)
        savePopUp()
        MemberStack.onReady.then(function(member) {  
            member.updateProfile({
                "profile-photo": data["Profile Picture"],
                "first-name": data["First Name"],
                "last-name": data["Last Name"],
                "email": data["Email"],
            }, false)
        })
    })
    .catch(error => console.log('error', error));
}


saveBtns.forEach(btn => btn.addEventListener('click', () => {
    closePopUp()
    if (!checkRequiredFields()) return false
    const data = checkForUpdates(companyData.fields) 
    updateProfile(data, companyData.id) 
    })
    )
    
function checkRequiredFields() {
   let valid = true
        
    if(!fNameInput.checkValidity()) {
        errorPopUp('Please enter your first name')
        valid = false }
    if(!lNameInput.checkValidity()) {
        errorPopUp('Please enter your last name')
        valid = false }
    if(!emailInput.checkValidity()) {
        errorPopUp('Please enter your email address')
        valid = false }

    if(userType === 'CANDIDATE') {
        if(!bioInput.checkValidity()) {
            errorPopUp('Please enter a bio')
            valid = false }
    }
     
        // locatedSelector.getValue() ? '' : invalidFields.push(locatedSelector)
    return valid
}
    
    
function errorPopUp(message) {
    window.clearTimeout(timeoutId)
    const errContainer = document.querySelector('[data-error="container"]')
    const errMsg = document.querySelector('[data-error="message"]')
    errMsg.textContent = message
    errContainer.style.backgroundColor = '#ff6969'
    errContainer.style.display = 'flex'
    timeoutId = setTimeout(() => errContainer.style.display = 'none', 15000);
}

function savePopUp() {
    window.clearTimeout(timeoutId)
    const errContainer = document.querySelector('[data-error="container"]')
    const errMsg = document.querySelector('[data-error="message"]')
    errMsg.textContent = 'Changes Saved'
    errContainer.style.backgroundColor = '#008764'
    errContainer.style.display = 'flex'
    timeoutId = setTimeout(() => errContainer.style.display = 'none', 5000);
}

function closePopUp() {
    const errContainer = document.querySelector('[data-error="container"]')
    errContainer.style.display = 'none'
}
//#

// check for blanks on must have fields
