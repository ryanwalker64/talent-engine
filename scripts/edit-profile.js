const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="
const JSDELIVR = 'https://cdn.jsdelivr.net/gh/ryanwalker64/talent-engine@main/'

const fNameInput = document.querySelector('[data-name="first-name"]')
const lNameInput = document.querySelector('[data-name="last-name"]')
const emailInput = document.querySelector('[data-name="email"]')
const linkedinInput = document.querySelector('[data-name="linkedin"]')
const profilePicInput = document.querySelector('[data-name="profile-pic"]')
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
const stageOfJobHuntInput = document.querySelector('[data-name="job-hunt"]')
const prefRemoteWorkInput = document.querySelector('[data-name="remote-friendly"]')
const prefLocationsInput = document.querySelector('[data-name="pref-locations"]')
const prefRolesInput = document.querySelector('[data-name="pref-roles"]')
const prefTypeOfWorkInput = document.querySelector('[data-name="pref-type-of-job"]')
const prefCompanySize = document.querySelector('[data-name="pref-company-size"]')
const prefRoleBioInput = document.querySelector('[data-name="pref-next-role"]')
const prefIndustriesInput = document.querySelector('[data-name="pref-industries"]')
const profileVisibilityInput = document.querySelector('[data-name="visibility"]')

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

let locatedSelector
let workingLocationSelector
let roleSelector
let interestedRolesSelector
let industriesSelector
let typeOfJobSelector = new TomSelect(prefTypeOfWorkInput, {...generalSelectorSettings, maxItems: null});
let companySizeSelector = new TomSelect(prefCompanySize, {...generalSelectorSettings, maxItems: null, sortField: {}});
let startDateMonthSelector = new TomSelect(currentEmploymentStartMonthInput, {...generalSelectorSettings,  sortField: {}});
let startDateYearSelector = new TomSelect(currentEmploymentStartYearInput, {...generalSelectorSettings, sortField: {direction: "desc"}});
let endDateMonthSelector = new TomSelect(currentEmploymentEndMonthInput, {...generalSelectorSettings,  sortField: {}});
let endDateYearSelector = new TomSelect(currentEmploymentEndYearInput, {...generalSelectorSettings, sortField: {direction: "desc"}});


async function fetchData() {
    const [rolesResponse, locationsResponse, industriesResponse] = await Promise.all([
        fetch(JSDELIVR + 'rolesArray.json'),
        fetch(JSDELIVR + 'locationsArray.json'),
        fetch(JSDELIVR + 'industriesArray.json') ])

    const roles = await rolesResponse.json()
    const locations = await locationsResponse.json()
    const industries = await industriesResponse.json()
    return [roles, locations, industries]
}

fetchData().then(([roles, locations, industries]) => {
    const rolesObj = roles.map(role => {return {'value': role, 'text': role}})
    const industryObj = industries.map(industry => {return {'value': industry, 'text': industry}})
 
    locatedSelector = new TomSelect(locatedInput, {...locationSelectorSettings, options: locations});
    workingLocationSelector = new TomSelect(prefLocationsInput, {...locationSelectorSettings, options: locations, maxItems: 3});
    roleSelector = new TomSelect(currentRoleInput, {...generalSelectorSettings, options: rolesObj});
    interestedRolesSelector = new TomSelect(prefRolesInput, {...generalSelectorSettings, options: rolesObj, maxItems: 3});
    industriesSelector = new TomSelect(prefIndustriesInput, {...generalSelectorSettings,  options: industryObj, maxItems: 5});
    
    // locatedSelector.on('change', (e) => { workingLocationSelector.setValue(locatedSelector.getValue())})

})

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
        startDateMonthSelector.disable()
        startDateYearSelector.disable()
        endDateMonthSelector.disable()
        endDateYearSelector.disable()
        currentlyWorkingAtEmployerInput.disabled = firstJobInput.checked
    } else {
        jobTitleInput.disabled = firstJobInput.checked
        startDateMonthSelector.enable()
        startDateYearSelector.enable()
        endDateMonthSelector.enable()
        endDateYearSelector.enable()
        currentlyWorkingAtEmployerInput.disabled = firstJobInput.checked
    }
})

currentlyWorkingAtEmployerInput.addEventListener('change', () => {
    if (currentlyWorkingAtEmployerInput.checked) {
        endDateMonthSelector.disable()
        endDateYearSelector.disable()
    } else {
        endDateMonthSelector.enable()
        endDateYearSelector.enable()
    }
})