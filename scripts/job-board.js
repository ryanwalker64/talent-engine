const directoryContainer = document.querySelector('.directory-container-v2')
const form = document.querySelector('[data-filter="form"]')
const formInputs = document.querySelectorAll('[data-filter="input"]') 
const locationsInput = document.querySelector('[data-input="location"]')
const typeOfJobInput = document.querySelector('[data-input="types-of-jobs"]')
const remoteInput = document.querySelector('[data-input="remote"]')
const rolesInput = document.querySelector('[data-input="roles"]')
const industriesInput = document.querySelector('[data-input="industries"]')
const clearBtn = document.querySelector('[data-filter="clear"]')
const generalSelectorSettings = {
	plugins: ['remove_button'],
    sortField: {field: "text", direction: "asc"}
};

const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="
// const FIELDS = "?fields%5B%5D=Job+Pref%3A+Working+Locations&fields%5B%5D=Job+Pref%3A+Open+to+remote+work&fields%5B%5D=experience-stage&fields%5B%5D=Job+Pref%3A+Relevant+roles&fields%5B%5D=Job+Pref%3A+Type+of+role&fields%5B%5D=Job+Pref%3A+Industries&fields%5B%5D=Startmate+Program"
const JSDELIVR = 'https://cdn.jsdelivr.net/gh/ryanwalker64/talent-engine@v1.3.6.9/'

let userIsLoggedIn 
let loggedInUserObj
// let offset
let userType
let jobsData = []
let filterObj = {
    'workType': [],
    'experience': [],
    'roles': [],
    'location': [],
    'remote': [],
}
let locationSelector
let remoteSelector = new TomSelect(remoteInput, {...generalSelectorSettings});
let typeOfJobSelector = new TomSelect(typeOfJobInput, {...generalSelectorSettings, maxItems: null});
let roleSelector
let industriesSelector
//&cacheTime=5 REMOVE

function handleFilterSelection() {
    let filter = []
    const filterSetting = getFilterSetting()
    if (getExperienceValues()) filter.push(getExperienceValues())
    if (getRoleValues()) filter.push(getRoleValues())
    if (getWorkTypeValues()) filter.push(getWorkTypeValues())
    if (checkRemoteValue()) filter.push(checkRemoteValue())
    if (locationSelector.getValue().length > 0) filter.push(getLocationValues())

     // OLD REMOTE SETUP
    // const remoteSelection = remoteSelector.getValue()
    // if (remoteSelection === "All locations") filter.push(getRemoteValue())

    // console.log("current filters:", filterObj)
    if (checkForEmptyFilters()) {
        clearFilters()
    } else {
        const filteredOptions = `IF(${filterSetting}(${filter.join(',')}),"true")`

        // OLD REMOTE SETUP
        // const filteredOptions = 
        //     remoteSelection === "Based on location"
        //         ? `IF(AND(OR(${filter.join(',')}),${getRemoteValue()}),"true")`
        //         : `IF(OR(${filter.join(',')}),"true")`

        const filterEncode = "&filterByFormula=" + encodeURI(filteredOptions)  
        // console.log(remoteSelector.getValue())      
        // console.log(filteredOptions, filterEncode, filter)
        fetchFilteredJobs(filterEncode)
    }
}

formInputs.forEach(filter => {
    filter.addEventListener('click', handleFilterSelection)
})

clearBtn.addEventListener('click', clearFilters)

// OLD REMOTE SETUP
// function getRemoteValue() {
//     filterObj.remote = []
//     if (remoteSelector.getValue().length === 0) return
//     const selected = remoteSelector.getValue()
//     filterObj.remote = [selected]
//     const value = `{Job Pref: Open to remote work}`
//     return value

// }

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

function getExperienceValues() {
    filterObj.experience = []
    const inputs = [...document.querySelectorAll('[data-experience]')]
    const checked = inputs.filter(checkbox => {if (checkbox.checked) return checkbox });
    if (checked.length === 0) return 
    filterObj.experience = checked.map(checkbox => {return checkbox.dataset.experience})
    const values = checked.map(checkbox => {return `{Level}="${checkbox.dataset.experience}"`}).join(',')
    return values
}
// OLD WORK TYPE
// function getWorkTypeValues() {
//     filterObj.workType = []
//     const inputs = [...document.querySelectorAll('[data-worktype]')]
//     const checked = inputs.filter(checkbox => {if (checkbox.checked) return checkbox }); 
//     if (checked.length === 0) return
//     filterObj.workType = checked.map(checkbox => {return checkbox.dataset.worktype})
//     const values = checked.map(checkbox => {return `FIND("${checkbox.dataset.worktype}",{Job Pref: Type of role})`}).join(',')
//     return values
// }

function getWorkTypeValues() {
    filterObj.workType = []
    if (typeOfJobSelector.getValue().length === 0) return
    const selected = typeOfJobSelector.getValue()
    filterObj.workType = typeOfJobSelector.getValue()
    const values = selected.map(value => {return `FIND("${value}",{Type of Job})`}).join(',')
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

function getRoleValues() {
    filterObj.roles = []
    if (roleSelector.getValue().length === 0) return
    const selected = roleSelector.getValue()
    filterObj.roles = roleSelector.getValue()
    const values = selected.map(value => {return `FIND("${value}",{Similar Roles})`}).join(',')
    return values
}


function checkRemoteValue() {
    filterObj.remote = []
    const input = document.querySelector('[data-remote="remotecheckbox"]')
    if(!input.checked) return
    filterObj.remote = [true]
    const value = `IF({Is this job open to remote candidates?}, TRUE())`
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
        if(filtersToCheck.roles.length > 0) {
            filtersToCheck.roles.forEach(filter => {
                if (profile.fields["Similar Roles"].includes(filter)) {
                    score += 1
                    matchedFilters.push(filter)
                }
            })
        }
        if(filtersToCheck.experience.length > 0) {
            filtersToCheck.experience.forEach(filter => {
                if (profile.fields["Level"].includes(filter)) {
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
        if(filtersToCheck.remote.length > 0) {
            if (profile.fields["Is this job open to remote candidates?"]){
                score += 1
                matchedFilters.push('Open to Remote Work')
            }
        }
        if(filtersToCheck.workType.length > 0) {
            filtersToCheck.workType.forEach(filter => {
                if (profile.fields["Type of Job"].includes(filter)) {
                    score += 1
                    matchedFilters.push(filter)
                }
            })
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
    if (filterObj.workType.length === 0 
        && filterObj.experience.length === 0
        && filterObj.roles.length === 0
        && filterObj.location.length === 0
        && filterObj.remote.length === 0) return true
}

function clearCheckboxes() {
    formInputs.forEach(checkbox => {
        if(!checkbox.name === 'filter-settings') {
        checkbox.checked = false
        const selectedCheckboxes = document.querySelectorAll('.w--redirected-checked')
        selectedCheckboxes.forEach(checkbox => {checkbox.classList.remove('w--redirected-checked')})
        }
    })
}

function clearFilters() {
    filterObj = {
        'workType': [],
        'experience': [],
        'roles': [],
        'location': [],
        'remote': [],
    }
    clearCheckboxes()
    locationSelector.setValue('', 'silent')
    roleSelector.setValue('', 'silent')
    typeOfJobSelector.setValue('', 'silent')
    fetchJobs()
}


function fetchJobs() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    };

    fetch(API + 'Jobs&view=JobsPosted', requestOptions)
        .then(response => response.json())
        .then(result => {
            jobsData = result.records
            displayJobs(jobsData)
            countProfiles(jobsData)
            // console.log(jobsData)
        })
        .catch(error => console.log('error', error));
}

function fetchFilteredJobs(filter) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    };

    const APIURL = API + 'Jobs&view=JobsPosted' + filter
    fetch(APIURL, requestOptions)
        .then(response => response.json())
        .then(result => {
            const TempUserbase = scoreProfiles(filterObj, result.records).sort(function(a, b){return b.score-a.score}).slice(0,50)
            displayJobs(TempUserbase)
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
        } else return ''
    } 

// function translateExperienceLevels(level) {
//     let levelTranslated
//     if (level === "Mid-level (3-4 years)") {
//         levelTranslated = 'Mid-level'

//     } else if (level === "Entry-level") {
//         levelTranslated = 'Entry-level'

//     } else if (level === "Senior (5-7 years)") {
//         levelTranslated = 'Senior'

//     } else if (level === "Expert") {
//         levelTranslated = 'Expert'

//     } else if (level === "Junior (1-2 years)") {
//         levelTranslated = 'Junior'
//     }

//     return levelTranslated
        
// }

function locationTranslate(job) {
    let location
    if (job.fields['Location Type'] === "International") {
        location = `${job.fields['International Location']}, International`
    } else if (job.fields['Location Type'] === "Australia") {
        location = `${job.fields['Location AUS']}, Australia`
    } else if (job.fields['Location Type'] === "New Zealand") {
        location = `${job.fields['Location NZ']}, New Zealand`
    }
    return location
}
// <a data-heart="large" href="#" class="candidate-button-v2 lge-heart like-company-btn w-button">${loggedInUserData.fields['Companies interested in'].findIndex(id => id === company.id) !== -1 ? 'Unfavourite company?' : 'Favourite company?'}</a>

function displayJobs(jobs){
    const jobsHtml = jobs.map(job => {
        const score = !job.score
        ? `<div></div>`
        : job.score === 0 
            ? `<div class="filter-match" data-filter="matches">No filters matched</div>`
            : job.score > 1 && job.score !== countFilters()
                ? `<div class="filter-match some-matches" data-filter="matches">Matches ${job.score} filters</div>`
                : job.score === countFilters()
                    ? `<div class="filter-match all-matched" data-filter="matches">Matches all filters</div>`
                    : `<div class="filter-match some-matches" data-filter="matches">Matches ${job.score} filters</div>`


        const tagline = `${job.fields['Level']} • ${job.fields['Type of Job']} • ${locationTranslate(job)}`

        return `<div class="information-container">
                    <div class="job-posting" data-id="${job.id}" style="border: none;">
                        <div class="sixty">
                            <a href="/app/company?id=${job.fields['Airtable Record ID (from Company)']}" target="_blank">
                                <img src="${job.fields['Logo (from Company)']}" loading="lazy" alt="" class="logo" style="border-radius:15px;object-fit: contain;">
                            </a>
                        </div>
                        <div class="candidate-info job-post-directroy">
                            <div class="job-title"><a class="clickable-profile" data-jobclick href="${job.fields['converted-app-link']}" target="_blank">${job.fields['Job Title']} - ${job.fields['Name (from Company)']}</a></div>
                            <div class="candidate-short-details">${tagline}</div>
                        </div>
                        <div class="seemore-container">
                            <div class="text-block-72">Posted: ${job.fields['Created']}</div>
                            <a data-jobclick href="${job.fields['converted-app-link']}" target="_blank" class="candidate-button-v2 more-button company-more-button w-button">See more</a>
                        </div>
                    </div>
                    ${!job.score
                        ? `<div></div>`
                        : `<div class="div-block-104">
                                <div class="div-block-105">
                                    <div class="candidate-short-details matches-text">Matches:</div>
                                    <div>
                                        ${createCategories(job.matchedFilters, 'outlined')}
                                    </div>
                                </div>
                            </div>`}
                </div>`
    }).join('')
    directoryContainer.innerHTML = jobsHtml
    applyEventListeners()
}

function saveFilterToURL(filters){
    let url = new URL(window.location.href);
    url.searchParams.set('filters', filters)
}


async function fetchFilterData() {
    const [rolesResponse,locationsResponse] = await Promise.all([
        fetch(JSDELIVR + 'rolesArray.json'),
        fetch(JSDELIVR + 'locationsArray.json')])
        
    const locations = await locationsResponse.json()
    const roles = await rolesResponse.json()
    return [locations, roles]
}

fetchFilterData().then(([locations, roles]) => {
    const rolesObj = roles.map(role => {return {'value': role, 'text': role}})

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

    roleSelector = new TomSelect(rolesInput, {...generalSelectorSettings, options: rolesObj, maxItems: null});

    locationSelector.on('change', (e) => {handleFilterSelection()})
    typeOfJobSelector.on('change', (e) => {handleFilterSelection()})
    roleSelector.on('change', (e) => {handleFilterSelection()})
})

function applyEventListeners() {
    const jobLinks = document.querySelectorAll('[data-jobclick]')
    jobLinks.forEach(btn => 
        btn.addEventListener('click', handleJobClick)
    )
}

function handleJobClick(e) {
    const job = e.currentTarget.closest('.job-posting')
    const jobid = job.dataset.id
    console.log(jobid)
    getJobClicks(jobid)
}

function getJobClicks(jobID) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    };

    fetch(API + "Jobs&id=" + jobID + '&cacheTime=0', requestOptions)
        .then(response => response.json())
        .then(result => {
            const newClicks = result.fields.Clicks + 1
            console.log(newClicks)
            updateJobClicks(jobID, newClicks)
        })
        .catch(error => console.log('error', error));
}

function updateJobClicks(jobID, clicks) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "put",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify([{"id": jobID,"fields":{"Clicks": clicks}}])
    };

    fetch(API + "Jobs", requestOptions)
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

    fetch(API + "Users&id=" + userId, requestOptions)
        .then(response => response.json())
        .then(result => {
            // console.log(result)
            loggedInUserObj = result
            console.log(loggedInUserObj)
            fetchJobs()
        })
        .catch(error => console.log('error', error));
}


MemberStack.onReady.then(function(member) {
    if (member.loggedIn) {
        userIsLoggedIn = true
        const loggedInUser = member['airtable-id-two']
        userType = member['user-type']
        
        getUserData(loggedInUser)
        
    } else {
        userIsLoggedIn = false
    }
})

fetchFilterData()

// Grab Jobs
// post jobs
// hook up filters