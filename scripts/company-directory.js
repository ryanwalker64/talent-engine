const directoryContainer = document.querySelector('.directory-container-v2')
const form = document.querySelector('[data-filter="form"]')
const formInputs = document.querySelectorAll('[data-filter="input"]') 
const locationsInput = document.querySelector('[data-input="location"]')
const industriesInput = document.querySelector('[data-input="industries"]')
const clearBtn = document.querySelector('[data-filter="clear"]')
const generalSelectorSettings = {
	plugins: ['remove_button'],
    sortField: {field: "text", direction: "asc"}
};

const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="
// const FIELDS = "?fields%5B%5D=Job+Pref%3A+Working+Locations&fields%5B%5D=Job+Pref%3A+Open+to+remote+work&fields%5B%5D=experience-stage&fields%5B%5D=Job+Pref%3A+Relevant+roles&fields%5B%5D=Job+Pref%3A+Type+of+role&fields%5B%5D=Job+Pref%3A+Industries&fields%5B%5D=Startmate+Program"
const JSDELIVR = 'https://cdn.jsdelivr.net/gh/ryanwalker64/talent-engine@main/'

let userIsLoggedIn 
let loggedInUserObj
// let offset
let companiesUserbase = []
let filterObj = {
    'location': [],
    'employee': [],
    'remote': [],
    'industry': [],
    'SMCompany': [],
}
let locationSelector
let industriesSelector
//&cacheTime=5 REMOVE

function handleFilterSelection() {
    let filter = []
    if (getEmployeeValues()) filter.push(getEmployeeValues())
    if (getSMCompanyValues()) filter.push(getSMCompanyValues())
    if (getRemoteValues()) filter.push(getRemoteValues())
    if (industriesSelector.getValue().length > 0) filter.push(getIndustryValues())
    if (locationSelector.getValue().length > 0) filter.push(getLocationValues())
    console.log("current filters:", filterObj)
    if (checkForEmptyFilters()) {
        clearFilters()
    } else { 
        const filterEncode = "&filterByFormula=" + encodeURI(`IF(OR(${filter.join(',')}),"true")`)  
        // console.log(filteredOptions, filterEncode, filter)
        console.log(filterEncode, filter)
        fetchFilteredProfiles(filterEncode)
    }
}

formInputs.forEach(filter => {
    filter.addEventListener('click', handleFilterSelection)
})

clearBtn.addEventListener('click', clearFilters)



function getEmployeeValues() {
    filterObj.employee = []
    const inputs = [...document.querySelectorAll('[data-employees]')]
    const checked = inputs.filter(checkbox => {if (checkbox.checked) return checkbox });
    if (checked.length === 0) return 
    filterObj.employee = checked.map(checkbox => {return checkbox.dataset.employees})
    const values = checked.map(checkbox => {return `{Company Size}="${checkbox.dataset.employees}"`}).join(',')
    return values
}


function getLocationValues() {
    filterObj.location = []
    if (locationSelector.getValue().length === 0) return
    const selected = locationSelector.getValue()
    filterObj.location = locationSelector.getValue()
    const values = selected.map(value => {return `FIND("${value}",{Location})`}).join(',')
    return values
}

function getIndustryValues() {
    filterObj.industry = []
    if (industriesSelector.getValue().length === 0) return
    const selected = industriesSelector.getValue()
    filterObj.industry = industriesSelector.getValue()
    const values = selected.map(value => {return `FIND("${value}",{Industry})`}).join(',')
    return values
}

function getSMCompanyValues() {
    filterObj.SMCompany = []
    const input = document.querySelector('[data-SMCompany]')
    if(!input.checked) return
    filterObj.SMCompany = [true]
    const value = `IF({Startmate Company?}, TRUE())`
    return value
}

function getRemoteValues() {
    filterObj.remote = []
    const input = document.querySelector('[data-remote]')
    if(!input.checked) return
    filterObj.remote = [true]
    const value = `IF({Remote Friendly}, TRUE())`
    return value
}

function countProfiles(arr) {
    const profileCount = document.querySelector('[data-count="viewing"]')
    profileCount.textContent = arr.length
}

function scoreProfiles(filtersToCheck, fetchedUsers) {
    const scoredProfiles = fetchedUsers.map(profile => {
        let score = 0
        if(filtersToCheck.employee.length > 0) {
            filtersToCheck.employee.forEach(filter => {
                if (profile.fields["Company Size"].includes(filter)) score += 1
            })
        }
        if(filtersToCheck.location.length > 0) {
            filtersToCheck.location.forEach(filter => {
                if (profile.fields["Location"].includes(filter)) score += 1
            })
        }
        if(filtersToCheck.industry.length > 0) {
            filtersToCheck.industry.forEach(filter => {
                if (profile.fields["Industry"].includes(filter)) score += 1
            })
        }
        if(filtersToCheck.SMCompany.length > 0) {
            if (profile.fields["Startmate Company?"]) score += 1
        }
        if(filtersToCheck.remote.length > 0) {
            if (profile.fields["Remote Friendly"]) score += 1
        }
        profile.score = score
        return profile
    })
    return scoredProfiles
}

function countFilters() {
    let totalScore = 0;
    Object.keys(filterObj).forEach(key => { totalScore += filterObj[key].length})
    return totalScore
}

function checkForEmptyFilters() {
    if (filterObj.employee.length === 0
        && filterObj.location.length === 0
        && filterObj.remote.length === 0
        && filterObj.industry.length === 0
        && filterObj.SMCompany.length === 0) return true
}

function clearCheckboxes() {
    formInputs.forEach(checkbox => {
        checkbox.checked = false
        const selectedCheckboxes = document.querySelectorAll('.w--redirected-checked')
        selectedCheckboxes.forEach(checkbox => {checkbox.classList.remove('w--redirected-checked')})
    })
}

function clearFilters() {
    filterObj = {
        'location': [],
        'employee': [],
        'remote': [],
        'industry': [],
        'SMCompany': [],
    }
    clearCheckboxes()
    industriesSelector.setValue('', 'silent')
    locationSelector.setValue('', 'silent')
    fetchCompanies()
}


function fetchCompanies() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    };

    fetch(API + 'Companies' + "&perPage=30", requestOptions)
        .then(response => response.json())
        .then(result => {
            companiesUserbase = result.records
            displayCompanies(companiesUserbase)
            countProfiles(companiesUserbase)
            console.log(companiesUserbase)
        })
        .catch(error => console.log('error', error));
}

function fetchFilteredProfiles(filter) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    };

    const APIURL = API + 'Companies' + filter
    fetch(APIURL, requestOptions)
        .then(response => response.json())
        .then(result => {
            const TempUserbase = scoreProfiles(filterObj, result.records).sort(function(a, b){return b.score-a.score}).slice(0,50)
            displayCompanies(TempUserbase)
            countProfiles(TempUserbase)
            console.log(TempUserbase)
        })
        .catch(error => console.log('error', error));
}

function createCategories(arr) {
    if (arr) {
        return arr.map(category => {
            return `<div class="profile-catg">${category}</div>`
            }).join('')
        } else return ''
    } 

function displayCompanies(companies){
    const companiesHTML = companies.map(company => {
        const score = !company.score
        ? `<div></div>`
        : company.score === 0 
            ? `<div class="filter-match" data-filter="matches">No filters matched</div>`
            : company.score > 1 && company.score !== countFilters()
                ? `<div class="filter-match some-matches" data-filter="matches">Matches ${company.score} filters</div>`
                : company.score === countFilters()
                    ? `<div class="filter-match all-matched" data-filter="matches">Matches all filters</div>`
                    : `<div class="filter-match some-matches" data-filter="matches">Matches ${company.score} filters</div>`


        return ` 
        <div class="company-profile">
            <img src="${company.fields['Logo']}" loading="lazy" alt="" class="logo">
            <div class="candidate-info">
                <div class="company-name">${company.fields['Name']}</div>
                <div class="company-slogan">${company.fields['Slogan']}</div>
                <div class="company-categories">
                    ${company.fields['Startmate Company?']
                        ? '<div class="company-category orange-catg">Startmate Company</div>'
                        : ''}
                </div>
            </div>
            <div class="div-block-75">
                ${score}
                <div class="heart-container" data-likebtn="${company.id}">
                    <a data-heart="small" href="#" class="candidate-button-v2 sml-heart w-button">❤</a>
                    <a data-heart="large" href="#" class="candidate-button-v2 lge-heart like-company-btn w-button">Like this company?</a>
                </div>
                <a href="/app/company?id=${company.id}" target="_blank" class="candidate-button-v2 more-button company-more-button w-button">See more</a>
            </div>
        </div>`
    }).join('')
    directoryContainer.innerHTML = companiesHTML
    applyEventListeners()
}

function saveFilterToURL(filters){
    let url = new URL(window.location.href);
    url.searchParams.set('filters', filters)
}


async function fetchFilterData() {
    const [locationsResponse, industriesResponse] = await Promise.all([
        fetch(JSDELIVR + 'locationsArray.json'),
        fetch(JSDELIVR + 'industriesArray.json')])
        
    const locations = await locationsResponse.json()
    const industries = await industriesResponse.json()
    // console.log(locations, industries)
    return [locations, industries]
}

fetchFilterData().then(([locations, industries]) => {
    const industryObj = industries.map(industry => {return {'value': industry, 'text': industry}})

    locationSelector = new TomSelect(locationsInput, {
        plugins: ['remove_button'],
        optgroups: [
            {value: 'AUS', label: 'Australia'},
            {value: 'NZ', label: 'New Zealand'},
            {value: 'OTHER', label: 'Other'}
        ],
        optgroupField: 'country',
        labelField: 'value',
        searchField: ['value'],
        maxItems: 5,
        options: locations});
    industriesSelector = new TomSelect(industriesInput, {...generalSelectorSettings,  options: industryObj, maxItems: 5});
    locationSelector.on('change', (e) => {handleFilterSelection()})
    industriesSelector.on('change', (e) => {handleFilterSelection()})
})

function applyEventListeners() {
    const likeCompanyBtns = document.querySelectorAll('[data-likebtn]')
    likeCompanyBtns.forEach(btn => 
        btn.addEventListener('click', (e) => {
            const btn = e.currentTarget
            const heartBtn = btn.querySelector('[data-heart="small"]')
            heartBtn.classList.toggle('liked')

            // push to airtable
            // change hover text to unlike company
        })
    )
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
            loggedInUserObj = result
            console.log(loggedInUserObj)
        })
        .catch(error => console.log('error', error));
}

MemberStack.onReady.then(function(member) {
    if (member.loggedIn) {
        console.log('User is viewing their own profile')
        userIsLoggedIn = true
        const loggedInUser = member['airtable-id-two']
        
        getUserData(loggedInUser)
        fetchCompanies()
    } else {
        userIsLoggedIn = false
    }
})

fetchFilterData()

    // Setup Tom Select for industires, roles, locaiton, remote
    // Make sure they all work to filter
    // store filters in URL
    // if filters in URL fetch those profiles
    // if more than 20 profiles, store the offset
    // if less than 20 get 20 more profiles, remove any who's id's match the existing number, then push them to USERBASE till it hits 20
// show what filters a user is matching
    // clear button or no filters restores 20

    // On load grab 20 candidates, no employers, only profiles that are visible
    // Store the offset 
    // Add a loading state whilst retrieving the profiles 
    // grab total number of records and update the counts for displaying and total candidates

    // At bottom of list add button to show 20 more candidates
    // Add a loading state whilst retrieving the profiles
    // fetch 20 more candidates with the URL + offset ( + filter if set)
    // append the 20 new candidates to the userbase
    // update offset
    // Append the 20 profiles to the DOM
    // update the counts for displaying and total candidates

    // if user hidden companies field matches a company name of the user viewing, hide from DOM?

// On load grab 20 companies
    // no expired companies (past 30 days)
    // Store the companies in companies 
    // Store the offset
    // Append the 20 companies to the DOM
    // Add a loading state whilst retrieving the companies
    // grab total number of records and update the counts for displaying and total companies

// At bottom of list add button to show 20 more companies
    // Add a loading state whilst retrieving the companies
    // fetch 20 more companies with the URL + offset ( + filter if set)
    // append the 20 new companies to companies
    // update offset
    // Append the 20 companies to the DOM
    // update the counts for displaying and total companies

// add an event listener to the sidebar form for changes in the inputs
    // make sure it picks up for each input
    // store filter
    // retrieve the value and fetch the filtered list from the API
    // replace and store the fetched companies in companies
    // store offset
        // if less than 20 records, get the remaining to equal 20 from all records (filter by the opposite of the current filters) and append to the end of the array
    // Append the 20 companies to the DOM

// if there is more than one filter
    // retrieve the filter values
    // store the combined filter
        // make sure to combine by OR || so it grabs all records that match at least one of the filters
    // replace and store the fetched companies in companies
    // Map over each record give it a point for each filter it matches in a score variable in the object
    // Sort the records by highest score first
    // store the offset
        // if less than 20 records, get the remaining to equal 20 from all records (filter by the opposite of the current filters) and append to the end of the array
    // Append the records to the DOM




