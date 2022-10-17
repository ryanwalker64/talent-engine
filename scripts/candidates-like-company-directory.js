const directoryContainer = document.querySelector('.directory-container-v2')
const form = document.querySelector('[data-filter="form"]')
const formInputs = document.querySelectorAll('[data-filter="input"]') 
const locationsInput = document.querySelector('[data-input="location"]')
const remoteInput = document.querySelector('[data-input="remote"]')
const rolesInput = document.querySelector('[data-input="roles"]')
const industriesInput = document.querySelector('[data-input="industries"]')
const clearBtn = document.querySelector('[data-filter="clear"]')
const modalContainer = document.querySelector('[data-upgrade="modalbackground"]')
const modalCloseBtn = document.querySelector('[data-upgrade="closebtn"]')
const banner = document.querySelector('[data-upgrade="banner"]')
const generalSelectorSettings = {
	plugins: ['remove_button'],
    sortField: {field: "text", direction: "asc"}
};

const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName=Users&view=VisibleProfiles"
const FIELDS = "?fields%5B%5D=Job+Pref%3A+Working+Locations&fields%5B%5D=Job+Pref%3A+Open+to+remote+work&fields%5B%5D=experience-stage&fields%5B%5D=Job+Pref%3A+Relevant+roles&fields%5B%5D=Job+Pref%3A+Type+of+role&fields%5B%5D=Job+Pref%3A+Industries&fields%5B%5D=Startmate+Program"
const JSDELIVR = 'https://cdn.jsdelivr.net/gh/ryanwalker64/talent-engine@main/'


// let offset
let paidMember
let userCompanyId
let companyData
let userbase = []
let filterObj = {
    'workType': [],
    'experience': [],
    'roles': [],
    'location': [],
    'remote': [],
    'industry': [],
    'SMProgram': [],
}
let locationSelector
let remoteSelector = new TomSelect(remoteInput, {...generalSelectorSettings});
let roleSelector
let industriesSelector
//&cacheTime=5

function handleFilterSelection() {
    let filter = []
    let interestedCandidates
    if (getExperienceValues()) filter.push(getExperienceValues())
    if (getRoleValues()) filter.push(getRoleValues())
    if (getWorkTypeValues()) filter.push(getWorkTypeValues())
    if (getSMProgramValues()) filter.push(getSMProgramValues())
    if (industriesSelector.getValue().length > 0) filter.push(getIndustryValues())
    if (locationSelector.getValue().length > 0) filter.push(getLocationValues())
    const remoteSelection = remoteSelector.getValue()
    if (remoteSelection === "All locations") filter.push(getRemoteValue())
    // if (remoteSelector.getValue() === "All locations") filter.push(getRemoteValue())
    console.log("current filters:", filterObj)
    if (companyData.fields["Interested Candidates"]) {
        interestedCandidates = companyData.fields["Interested Candidates"].map(candidate => {
            return `{Airtable Record ID}="${candidate}"`
        }).join(',')
        console.log(interestedCandidates)

    }

    if (checkForEmptyFilters()) {
        clearFilters()
    } else {
        const filteredOptions = 
            remoteSelection === "Based on location"
                ? `IF(AND(OR(${interestedCandidates}),OR(${filter.join(',')}),${getRemoteValue()}),"true")`
                : `IF(AND(OR(${interestedCandidates}),OR(${filter.join(',')})),"true")`

        const filterEncode = "&filterByFormula=" + encodeURI(filteredOptions)  
        console.log(remoteSelector.getValue())      
        console.log(filteredOptions, filterEncode, filter)
        fetchFilteredProfiles(filterEncode)
    }
}

formInputs.forEach(filter => {
    filter.addEventListener('click', handleFilterSelection)
})

clearBtn.addEventListener('click', clearFilters)
modalContainer.addEventListener('click', closeModal)
modalCloseBtn.addEventListener('click', closeModal)



function getRemoteValue() {
    filterObj.remote = []
    if (remoteSelector.getValue().length === 0) return
    const selected = remoteSelector.getValue()
    filterObj.remote = [selected]
    const value = `{Job Pref: Open to remote work}`
    return value

}

function getExperienceValues() {
    filterObj.experience = []
    const inputs = [...document.querySelectorAll('[data-experience]')]
    const checked = inputs.filter(checkbox => {if (checkbox.checked) return checkbox });
    if (checked.length === 0) return 
    filterObj.experience = checked.map(checkbox => {return checkbox.dataset.experience})
    const values = checked.map(checkbox => {return `{experience-stage}="${checkbox.dataset.experience}"`}).join(',')
    return values
}

function getWorkTypeValues() {
    filterObj.workType = []
    const inputs = [...document.querySelectorAll('[data-worktype]')]
    const checked = inputs.filter(checkbox => {if (checkbox.checked) return checkbox }); 
    if (checked.length === 0) return
    filterObj.workType = checked.map(checkbox => {return checkbox.dataset.worktype})
    const values = checked.map(checkbox => {return `FIND("${checkbox.dataset.worktype}",{Job Pref: Type of role})`}).join(',')
    return values
}

function getLocationValues() {
    filterObj.location = []
    if (locationSelector.getValue().length === 0) return
    const selected = locationSelector.getValue()
    filterObj.location = locationSelector.getValue()
    const values = selected.map(value => {return `FIND("${value}",{Job Pref: Working Locations})`}).join(',')
    return values
}

function getRoleValues() {
    filterObj.roles = []
    if (roleSelector.getValue().length === 0) return
    const selected = roleSelector.getValue()
    filterObj.roles = roleSelector.getValue()
    const values = selected.map(value => {return `FIND("${value}",{Job Pref: Relevant roles})`}).join(',')
    return values
}

function getIndustryValues() {
    filterObj.industry = []
    if (industriesSelector.getValue().length === 0) return
    const selected = industriesSelector.getValue()
    filterObj.industry = industriesSelector.getValue()
    const values = selected.map(value => {return `FIND("${value}",{Job Pref: Industries})`}).join(',')
    return values
}

function getSMProgramValues() {
    filterObj.SMProgram = []
    const input = document.querySelector('[data-smprogram]')
    if(!input.checked) return
    filterObj.SMProgram = [true]
    const value = `IF({Startmate Program}, TRUE())`
    return value
}

function countProfiles(arr) {
    const profileCount = document.querySelector('[data-count="viewing"]')
    profileCount.textContent = arr.length
}

function scoreProfiles(filtersToCheck, fetchedUsers) {
    const scoredProfiles = fetchedUsers.map(profile => {
        let score = 0
        if(filtersToCheck.workType.length > 0) {
            filtersToCheck.workType.forEach(filter => {
                if (profile.fields["Job Pref: Type of role"].includes(filter)) score += 1
            })
        }
        if(filtersToCheck.experience.length > 0) {
            filtersToCheck.experience.forEach(filter => {
                if (profile.fields["experience-stage"].includes(filter)) score += 1
            })
        }
        if(filtersToCheck.SMProgram.length > 0) {
                if (profile.fields["Startmate Program"]) score += 1
        }
        if(filtersToCheck.location.length > 0) {
            filtersToCheck.location.forEach(filter => {
                if (profile.fields["Job Pref: Working Locations"].includes(filter)) score += 1
            })
        }
        if(filtersToCheck.industry.length > 0) {
            filtersToCheck.industry.forEach(filter => {
                if (profile.fields["Job Pref: Industries"].includes(filter)) score += 1
            })
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
    if (filterObj.workType.length === 0 
        && filterObj.experience.length === 0
        && filterObj.roles.length === 0
        && filterObj.location.length === 0
        && filterObj.remote.length === 0
        && filterObj.industry.length === 0
        && filterObj.SMProgram.length === 0) return true
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
        'workType': [],
        'experience': [],
        'roles': [],
        'location': [],
        'remote': [],
        'industry': [],
        'SMProgram': [],
    }
    clearCheckboxes()
    industriesSelector.setValue('', 'silent')
    locationSelector.setValue('', 'silent')
    remoteSelector.setValue('', 'silent')
    roleSelector.setValue('', 'silent')
    fetchProfiles(companyId)
}


function fetchProfiles(filter) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    };

    const APIURL = filter ? API + filter : API
    fetch(APIURL, requestOptions)
        .then(response => response.json())
        .then(result => {
            userbase = result.records
            displayProfiles(userbase)
            countProfiles(userbase)
            console.log(userbase)
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

    const APIURL = filter ? API + filter : API
    fetch(APIURL, requestOptions)
        .then(response => response.json())
        .then(result => {
            const TempUserbase = scoreProfiles(filterObj, result.records).sort(function(a, b){return b.score-a.score}).slice(0,50)
            displayProfiles(TempUserbase)
            countProfiles(TempUserbase)
            console.log(TempUserbase)
        })
        .catch(error => console.log('error', error));
}

function displayUserHeadline(profile) {
    let headline
    if (paidMember) {
        headline = profile.fields["First Job?"]
                    ? `${profile.fields["Full Name"]}, ${profile.fields["What do you do?"]}`
                    : profile.fields["Candidate Employer"] 
                        ? `${profile.fields["Full Name"]}, ${profile.fields["Job Title"]} @ ${profile.fields["Candidate Employer"]}`
                        : `${profile.fields["Full Name"]}, ${profile.fields["What do you do?"]}`
    } else {
        headline = `${profile.fields["What do you do?"]}`
    }

    return headline
}

function profileButtonsContainer(profile) {
    let btns = `<a ${paidMember ? `href="/app/profile?user=${profile.id}" target="_blank` : 'onclick="upgradeModule()"'}" class="candidate-button-v2 more-button w-button" >See more</a>
                <a ${paidMember ? `href="/message/send?user=${profile.id}" target="_blank` : 'onclick="upgradeModule()"'}" class="candidate-button-v2 contact-btn w-button tooltip">Contact<span class="tooltiptext">Send a message to connect</span></a>`
    return btns
}


function upgradeModule() {
    modalContainer.style.display = 'flex'
}

function closeModal(e) {
    console.log(e.currentTarget)
    if(e.currentTarget === modalContainer) {
        modalContainer.style.display = 'none'
    }
}


function displayProfiles(profiles){
    const profilesHTML = profiles.map(profile => {
        
        return `
        <div class="candidate-profile">
            <img src="${profile.fields["Profile Picture"]}-/quality/lightest/" sizes="60px" alt="" class="img" loading="lazy"/>
            <div class="candidate-info">
                <div class="candidate-name">${displayUserHeadline(profile)}</div>
                <div class="candidate-details-container">
                    <div class="candidate-short-details">
                    ${profile.fields["experience-stage"]} • ${profile.fields["Location"]}</div>
                    ${profile.fields["Stage of Job Hunt"] === "Actively Looking"
                        ? `<div class="candidate-status actively-looking">Actively Looking</div>`
                        : `<div></div>`}
                </div>
            </div>
            <div class="candidate-buttons-container">
                ${!profile.score
                    ? `<div></div>`
                    : profile.score === 0 
                        ? `<div class="filter-match" data-filter="matches">No filters matched</div>`
                        : profile.score > 1 && profile.score !== countFilters()
                            ? `<div class="filter-match some-matches" data-filter="matches">Matches ${profile.score} filters</div>`
                            : profile.score === countFilters()
                                ? `<div class="filter-match all-matched" data-filter="matches">Matches all filters</div>`
                                : `<div class="filter-match some-matches" data-filter="matches">Matches ${profile.score} filters</div>`}
                ${profileButtonsContainer(profile)}
            </div>
        </div> 
        `
    }).join('')
    directoryContainer.innerHTML = profilesHTML
}

function saveFilterToURL(filters){
    let url = new URL(window.location.href);
    url.searchParams.set('filters', filters)
}


async function fetchFilterData() {
    const [rolesResponse, locationsResponse, industriesResponse] = await Promise.all([
        fetch(JSDELIVR + 'rolesArray.json'),
        fetch(JSDELIVR + 'locationsArray.json'),
        fetch(JSDELIVR + 'industriesArray.json')])
        
    const roles = await rolesResponse.json()
    const locations = await locationsResponse.json()
    const industries = await industriesResponse.json()
    // console.log(roles, locations, industries)
    return [roles, locations, industries]
}

fetchFilterData().then(([roles, locations, industries]) => {
    const rolesObj = roles.map(role => {return {'value': role, 'text': role}})
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
    roleSelector = new TomSelect(rolesInput, {...generalSelectorSettings, options: rolesObj, maxItems: 5});
    industriesSelector = new TomSelect(industriesInput, {...generalSelectorSettings,  options: industryObj, maxItems: 5});

    locationSelector.on('change', (e) => {handleFilterSelection()})
    industriesSelector.on('change', (e) => {handleFilterSelection()})
    roleSelector.on('change', (e) => {handleFilterSelection()})
    remoteSelector.on('change', (e) => {handleFilterSelection()})
})


function getCompanyData(companyId) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    
    };

    fetch(API + "Companies&id=" + companyId, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            companyData = result
            const companyNameHeading = document.querySelector('[data-company="name"]')
            const totalCandidatesHeading = document.querySelector('[data-company="total-candidates"]')
            companyNameHeading.textContent = companyData.fields.name
            totalCandidatesHeading.textContent = companyData.fields["Interested Candidates"].length
        })
        .then(() => {
            if (companyData.fields["Interested Candidates"]) {
                interestedCandidates = companyData.fields["Interested Candidates"].map(candidate => {
                    return `{Airtable Record ID}="${candidate}"`
                }).join(',')
                console.log(interestedCandidates)
            }
                const filteredOptions = `IF(OR(${interestedCandidates}),"true")`
        
                const filterEncode = "&filterByFormula=" + encodeURI(filteredOptions)  
                fetchProfiles(filterEncode)
        })
        .catch(error => console.log('error', error));
}

MemberStack.onReady.then(function(member) {
    if (member.loggedIn) {
        console.log('User is logged in')
        paidMember = member['paying-user']
        userCompanyId = member['company-airtable-id']
        // if (paidMember) banner.style.display = 'none'
        console.log(userCompanyId)
        getCompanyData(userCompanyId)
        fetchFilterData()
        
    }
})



// grab the list of users (recIDs) that like the company
// create filter by appending OR(REC id = "id")