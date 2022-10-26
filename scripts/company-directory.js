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
let userType
let companiesUserbase = []
let filterObj = {
    'location': [],
    'employee': [],
    'remote': [],
    'industry': [],
    'SMCompany': [],
    'openroles': [],
}
let locationSelector
let industriesSelector
//&cacheTime=5 REMOVE

function handleFilterSelection() {
    let filter = []
    const filterSetting = getFilterSetting()
    if (getEmployeeValues()) filter.push(getEmployeeValues())
    if (getSMCompanyValues()) filter.push(getSMCompanyValues())
    if (getRemoteValues()) filter.push(getRemoteValues())
    if (getOpenRoleValue()) filter.push(getOpenRoleValue())
    if (industriesSelector.getValue().length > 0) filter.push(getIndustryValues())
    if (locationSelector.getValue().length > 0) filter.push(getLocationValues())
    // console.log("current filters:", filterObj)
    if (checkForEmptyFilters()) {
        clearFilters()
    } else { 
        const filterEncode = "&filterByFormula=" + encodeURI(`IF(${filterSetting}(${filter.join(',')}),"true")`)  
        // console.log(filteredOptions, filterEncode, filter)
        // console.log(filterEncode, filter)
        fetchFilteredProfiles(filterEncode)
    }
}

formInputs.forEach(filter => {
    filter.addEventListener('click', handleFilterSelection)
})

clearBtn.addEventListener('click', clearFilters)

function getFilterSetting() {
    const filterSettingButtons = document.querySelectorAll('[data-input="filter-settings"]')
    let setFilterValue 
    for (let i = 0; i < filterSettingButtons.length; i++) {
        if(filterSettingButtons[i].checked === true) {
            setFilterValue = filterSettingButtons[i].value 
        }
    }
    return setFilterValue
}

function getEmployeeValues() {
    filterObj.employee = []
    const inputs = [...document.querySelectorAll('[data-employees]')]
    const checked = inputs.filter(checkbox => {if (checkbox.checked) return checkbox });
    if (checked.length === 0) return 
    filterObj.employee = checked.map(checkbox => {return checkbox.dataset.employees})
    const values = checked.map(checkbox => {return `IF({Company Size}="${checkbox.dataset.employees}", TRUE())`}).join(',')
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
function getOpenRoleValue() {
    filterObj.openroles = []
    const input = document.querySelector('[data-openroles]')
    if(!input.checked) return
    filterObj.openroles = [true]
    const value = `IF({Airtable Record ID (from Jobs)}, TRUE())`
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
        let matchedFilters = []
        if(filtersToCheck.employee.length > 0) {
            filtersToCheck.employee.forEach(filter => {
                if (profile.fields["Company Size"].includes(filter)) {
                    score += 1
                    matchedFilters.push(filter)
                }
            })
        }
        if(filtersToCheck.location.length > 0) {
            filtersToCheck.location.forEach(filter => {
                if (profile.fields["Location"].includes(filter)) {
                    score += 1
                    matchedFilters.push(filter)
                }
            })
        }
        if(filtersToCheck.industry.length > 0) {
            filtersToCheck.industry.forEach(filter => {
                if (profile.fields["Industry"].includes(filter)) {
                    score += 1
                    matchedFilters.push(filter)
                }
            })
        }
        if(filtersToCheck.SMCompany.length > 0) {
            if (profile.fields["Startmate Company"]){
                score += 1
                matchedFilters.push('Startmate Company')
            }
        }
        if(filtersToCheck.remote.length > 0) {
            if (profile.fields["Remote Friendly"]){
                score += 1
                matchedFilters.push('Remote Friendly')
            }
        }
        if(filtersToCheck.openroles.length > 0) {
            if (profile.fields["Airtable Record ID (from Jobs)"]){
                score += 1
            }
        }
        profile.score = score
        profile.matchedFilters = matchedFilters
        // console.log(matchedFilters)
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
        && filterObj.openroles.length === 0
        && filterObj.SMCompany.length === 0) return true
}

function clearCheckboxes() {
    formInputs.forEach(checkbox => {
        if(checkbox.name !== 'filter-settings') {
        checkbox.checked = false
        const selectedCheckboxes = document.querySelectorAll('.w--redirected-checked')
        selectedCheckboxes.forEach(checkbox => {checkbox.classList.remove('w--redirected-checked')})
        }
    })
}

function clearFilters() {
    filterObj = {
        'location': [],
        'employee': [],
        'remote': [],
        'industry': [],
        'SMCompany': [],
        'openroles': [],
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

    fetch(API + 'Companies&view=PublicView' + "&perPage=30", requestOptions)
        .then(response => response.json())
        .then(result => {
            companiesUserbase = result.records
            displayCompanies(companiesUserbase)
            countProfiles(companiesUserbase)
            // console.log(companiesUserbase)
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

    const APIURL = API + 'Companies&view=PublicView&perPage=all' + filter
    fetch(APIURL, requestOptions)
        .then(response => response.json())
        .then(result => {
            const TempUserbase = scoreProfiles(filterObj, result.records).sort(function(a, b){return b.score-a.score}) //.slice(0,50)
            displayCompanies(TempUserbase)
            countProfiles(TempUserbase)
            // console.log(TempUserbase)
        })
        .catch(error => console.log('error', error));
}

function createCategories(arr, className) {
    if (arr) {
        return arr.map(category => {
            return `<div class="profile-catg ${className}">${category}</div>`
            }).join('')
        }
    } 

function heartStatus(loggedInUserData, company) {

    if (loggedInUserData.fields['Companies interested in']) {
        if (loggedInUserData.fields['Companies interested in'].findIndex(id => id === company.id) !== -1) {
            const heartStatus = 'liked' 
            return heartStatus
        }
    }
}

function openRoles(company) {
    const roles = company.fields['Airtable Record ID (from Jobs)'] ? company.fields['Airtable Record ID (from Jobs)'] : ''
    if(roles) {
        // console.log(roles)
        if(roles.length > 1) {
            return `<div class="company-category">${roles.length} Open Roles</div>`
        } else if (roles.length === 1) {
            return `<div class="company-category">1 Open Role</div>`
        }
    } else {
        return ''
    }
}

// <a data-heart="large" href="#" class="candidate-button-v2 lge-heart like-company-btn w-button">${loggedInUserData.fields['Companies interested in'].findIndex(id => id === company.id) !== -1 ? 'Unfavourite company?' : 'Favourite company?'}</a>

function displayCompanies(companies){
    const companiesHTML = companies.map(company => {
        // const score = !company.score
        // ? `<div></div>`
        // : company.score === 0 
        //     ? `<div class="filter-match" data-filter="matches">No filters matched</div>`
        //     : company.score > 1 && company.score !== countFilters()
        //         ? `<div class="filter-match some-matches" data-filter="matches">Matches ${company.score} filters</div>`
        //         : company.score === countFilters()
        //             ? `<div class="filter-match all-matched" data-filter="matches">Matches all filters</div>`
        //             : `<div class="filter-match some-matches" data-filter="matches">Matches ${company.score} filters</div>`


        return `
        <div class="information-container"> 
            <div class="company-profile no-border">
                <div class="sixty">
                    <a href="/app/company?id=${company.id}" target="_blank">
                        <img src="${company.fields['Logo']}" loading="lazy" alt="" class="logo" style="border-radius:15px;object-fit: contain;">
                    </a>
                </div>
                <div class="candidate-info">
                    <div class="company-name"><a class="clickable-profile" href="/app/company?id=${company.id}" target="_blank">${company.fields['Name']}</a></div>
                    <div class="company-slogan" style="max-width: 500px;">${company.fields['Slogan']}</div>
                    <div class="company-categories">
                        ${company.fields['Startmate Company?']
                            ? '<div class="company-category orange-catg">Startmate Company</div>'
                            : ''}
                        ${openRoles(company)}
                    </div>
                </div>
                <div class="div-block-75">
                    
                    ${userType === 'CANDIDATE'
                    ? `<div class="heart-container" data-likebtn="${company.id}">
                        <a data-heart="small" href="#" class="candidate-button-v2 sml-heart w-button ${heartStatus(loggedInUserObj, company)} tooltip"><span class="tooltiptext">Interested to work for this company? Favourite this company to get notified about new jobs!</span>❤</a>
                        </div>`
                    : ''
                    }
                    <a href="/app/company?id=${company.id}" target="_blank" class="candidate-button-v2 more-button company-more-button w-button">See more</a>
                </div>
            </div>
            ${!company.score
                ? `<div></div>`
                : `<div class="div-block-104">
                        <div class="div-block-105">
                            <div class="candidate-short-details matches-text">Matches:</div>
                            <div>
                                ${createCategories(company.matchedFilters, 'outlined')}
                            </div>
                        </div>
                    </div>`}
        </div>`
    }).join('')
    directoryContainer.innerHTML = companiesHTML
    if (userType === 'CANDIDATE') applyEventListeners()
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
            // console.log(btn)
            const heartBtn = btn.querySelector('[data-heart="small"]')
            heartBtn.classList.toggle('liked')
            if (heartBtn.classList.contains('liked')) {
                
                // heartBtnText.style.background = "black"
            } else {
                
                // heartBtnText.style.background = "red"
                
            }
            updateLikedCandidates(handleLikedCandidates(loggedInUserObj, btn.dataset.likebtn), loggedInUserObj.id)
            // change hover text to unlike company
        })
    )
}

function updateLikedCandidates(companiesList, userId) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "put",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify([{"id": userId,"fields":{"Companies interested in": companiesList}}])
    };

    fetch(API + "Users", requestOptions)
    .then(response => response.text())
    // .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

function getUserData(userId) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    };

    fetch(API + "Users&id=" + userId + '&cacheTime=0', requestOptions)
        .then(response => response.json())
        .then(result => {
            // console.log(result)
            loggedInUserObj = result
            // console.log(loggedInUserObj)
            fetchCompanies()
        })
        .catch(error => console.log('error', error));
}

function handleLikedCandidates(userObj, companyid) {
    let likedCompanies = []
    //if the liked list exists
    if (userObj.fields['Companies interested in']) {
        likedCompanies = userObj.fields['Companies interested in']
        // console.log('liked companies list found')
        // console.log(likedCompanies)
        //if the company is already liked, remove it
        if(likedCompanies.findIndex(id => id === companyid) !== -1) {
            likedCompanies.splice(likedCompanies.findIndex(id => id === companyid), 1)
            // console.log('company has been already liked now removed')
            // console.log(likedCompanies)
            return likedCompanies
        } 
    }
    likedCompanies.push(companyid)
    // console.log('company has been liked')
    // console.log(likedCompanies)
    return likedCompanies
}

MemberStack.onReady.then(function(member) {
    if (member.loggedIn) {
        // console.log('User is viewing their own profile')
        userIsLoggedIn = true
        const loggedInUser = member['airtable-id-two']
        userType = member['user-type']
        
        getUserData(loggedInUser)
        
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




