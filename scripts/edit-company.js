const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="
const JSDELIVR = 'https://cdn.jsdelivr.net/gh/ryanwalker64/talent-engine@main/'

const saveBtns = document.querySelectorAll('[data-btn]')
let timeoutId

const companyNameInput = document.querySelector('[data-name="company-name"]')
const companyLogoInput = document.querySelector('[data-name="company-logo"]')
    const logoImg = document.querySelector('[data-image-preview]')
const companySloganInput = document.querySelector('[data-name="company-slogan"]')
const companyWebsiteInput = document.querySelector('[data-name="company-website"]')
const companySizeInput = document.querySelector('[data-name="company-size"]')
const companyLocationInput = document.querySelector('[data-name="company-location"]')
const companyRemoteFriendlyInput = document.querySelector('[data-name="company-remote"]')
const companyDescriptionInput = document.querySelector('[data-name="company-description"]')
const companyindustriesInput = document.querySelector('[data-name="company-industries"]')


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
let companyLocationSelector
let companyIndustriesSelector
let companySizeSelector = new TomSelect(companySizeInput, {...generalSelectorSettings, maxItems: 1, sortField: {}});

async function fetchData() {
    const [locationsResponse, industriesResponse] = await Promise.all([
        fetch(JSDELIVR + 'locationsArray.json'),
        fetch(JSDELIVR + 'industriesArray.json')])

    const locations = await locationsResponse.json()
    const industries = await industriesResponse.json()
    return [locations, industries]
}

fetchData().then(([locations, industries]) => {
    const industryObj = industries.map(industry => {return {'value': industry, 'text': industry}})
    companyLocationSelector = new TomSelect(companyLocationInput, {...locationSelectorSettings, options: locations, maxItems: null});
    companyIndustriesSelector = new TomSelect(companyindustriesInput, {...generalSelectorSettings,  options: industryObj, maxItems: 3});

}).then(() => {
    MemberStack.onReady.then( async function(member) {
        if (member.loggedIn) {
            const companyId = member["company-airtable-id"]
            fetchCompanyData(companyId)
        } 
})
})

function fetchCompanyData(id) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    };

   return fetch(API + "Companies&id=" + id + '&cacheTime=0', requestOptions)
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



function fillFields(data) {
    companyNameInput.value = data['Name'] ? data['Name'] : ''
    companyLogoInput.value = data['Logo'] ? data['Logo'] : ''
        logoImg.src = data['Logo'] ? data['Logo'] : ''
    companySloganInput.value = data['Slogan'] ? data['Slogan'] : ''
    companyWebsiteInput.value = data['Website URL'] ? data['Website URL'] : ''
    companyLocationSelector.setValue(data['Location'] ? data['Location'] : '')
    companySizeSelector.setValue(data['Company Size'] ? data['Company Size'] : '')
    companyIndustriesSelector.setValue(data['Industry'] ? data['Industry'] : '')
    companyDescriptionInput.value = data['Company Description'] ? data['Company Description'] : ''
    companyRemoteFriendlyInput.checked = data['Remote Friendly'] ? true : false
}

function checkForUpdates(data) {
    
    let companyUpdates = {}
    
    companyNameInput.value !== data['Name'] ? companyUpdates["Name"] = companyNameInput.value : ''
    companyLogoInput.value !== data['Logo'] ? companyUpdates["Logo"] = companyLogoInput.value : ''
    companySloganInput.value !== data['Slogan'] ? companyUpdates["Slogan"] = companySloganInput.value : ''
    companyWebsiteInput.value !== data['Website URL'] ? companyUpdates["Website URL"] = companyWebsiteInput.value : ''
    companyLocationSelector.getValue() !== data['Location'] ? companyUpdates["Location"] = [companyLocationSelector.getValue()] : ''
    companySizeSelector.getValue() !== data['Company Size'] ? companyUpdates['Company Size'] = companySizeSelector.getValue() : ''
    companyIndustriesSelector.getValue() !== data['Industry'] ? companyUpdates['Industry'] = companyIndustriesSelector.getValue() : ''
    companyDescriptionInput.value !== data['Company Description'] ? companyUpdates["Company Description"] = companyDescriptionInput.value : ''
    companyUpdates['Remote Friendly'] = companyRemoteFriendlyInput.checked ? `${companyRemoteFriendlyInput.checked}` : ''

    // console.log(companyUpdates)
    return companyUpdates
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

    fetch(API + "Companies", requestOptions)
    .then(response => response.text())
    .then(result => {
        console.log(result)
        savePopUp()
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
        
    if(!companyNameInput.checkValidity()) {
        errorPopUp('Please enter a company name')
        valid = false }
    if(!companySloganInput.checkValidity()) {
        errorPopUp('Please enter a company slogan')
        valid = false }
    if(!companyDescriptionInput.checkValidity()) {
        errorPopUp('Please enter a company description')
        valid = false }
    // if(!emailInput.checkValidity()) {
    //     errorPopUp('Please enter your email address')
    //     valid = false }
     
        // companyLocationSelector.getValue() ? '' : invalidFields.push(companyLocationSelector)
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



// display open jobs with delete buttons