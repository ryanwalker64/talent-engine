const directoryContainer = document.querySelector('.directory-container-v2')
const form = document.querySelector('[data-filter="form"]')
const formInputs = document.querySelectorAll('[data-filter="input"]') 
const locationsInput = document.querySelector('[data-input="location"]')
const smProgramInput = document.querySelector('[data-input="smProgram"]')
const typeOfJobInput = document.querySelector('[data-input="types-of-jobs"]')
const remoteInput = document.querySelector('[data-input="remote"]')
const rolesInput = document.querySelector('[data-input="roles"]')
const industriesInput = document.querySelector('[data-input="industries"]')
const clearBtn = document.querySelector('[data-filter="clear"]')
const modalContainer = document.querySelector('[data-upgrade="modalbackground"]')
const modalCloseBtn = document.querySelector('[data-upgrade="closebtn"]')
const banner = document.querySelector('[data-upgrade="banner"]')
const generalSelectorSettings = {
	plugins: ['remove_button'],
    sortField: {field: "text", direction: "asc"},
    maxOptions: 1000,
};

// const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName=Users&view=VisibleProfiles"
const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName=Users&view=VisibleProfiles&fields=Full%2BName%2CAirtable%2BRecord%2BID%2CMemberstack%2BID%2CUser%2BType%2CFirst%2BName%2CLast%2BName%2CBio%2CStage%2Bof%2BJob%2BHunt%2CLinkedin%2CStartmate%2BProgram%2CLocation%2CJob%2BPref%3A%2BWorking%2BLocations%2CJob%2BPref%3A%2BOpen%2Bto%2Bremote%2Bwork%2CNext%2BRole%2CWhat%2Bdo%2Byou%2Bdo%3F%2CWork%2BExperience%2Cexperience-stage%2CFirst%2BJob%3F%2CCandidate%2BEmployer%2CJob%2BTitle%2CEmployment%2BStart%2BDate%2CEmployment%2BEnd%2BDate%2CCurrently%2Bwork%2Bat%2Bemployer%3F%2CJob%2BPref%3A%2BRelevant%2Broles%2CJob%2BPref%3A%2BIndustries%2CJob%2BPref%3A%2BType%20of%20role%2CJob%2BPref%3A%2BCompany%20size%2CProfile%2BPicture%2CProfile%2BVisibility%2CProfile%2Bhidden%2Bfrom%3A%2CCompanies%2Binterested%2Bin%2CAirtable%2BRecord%2BID%2B%28from%2BCompanies%2Binterested%2Bin%29%2CIntroductions%2Bsent%2CIntroductions%2Brecieved%2CDate%2Blast%2Bupdated%2CAccount%2BStatus"
const FIELDS = "&fields%5B%5D=Job+Pref%3A+Working+Locations&fields%5B%5D=Job+Pref%3A+Open+to+remote+work&fields%5B%5D=experience-stage&fields%5B%5D=Job+Pref%3A+Relevant+roles&fields%5B%5D=Job+Pref%3A+Type+of+role&fields%5B%5D=Job+Pref%3A+Industries&fields%5B%5D=Startmate+Program"
const JSDELIVR = 'https://cdn.jsdelivr.net/gh/ryanwalker64/talent-engine@v1.4.0.4/'


// let offset
let paidMember
let userCompanyId
let companyData
let loggedInUserId
let loggedInUserType
let loggedInUserObj
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
let smProgramSelector
let remoteSelector = new TomSelect(remoteInput, {...generalSelectorSettings});
let typeOfJobSelector = new TomSelect(typeOfJobInput, {...generalSelectorSettings, maxItems: null});
let roleSelector
let industriesSelector
//&cacheTime=5

function handleFilterSelection() {
    directoryContainer.innerHTML = `<div data-loader="loading" class="div-block-96"><img src="https://uploads-ssl.webflow.com/6126d5a7894b51b0b6d462f5/62328a278f08ed196ad34cdf_Spinner-1s-200px.gif" loading="lazy" width="194" alt=""></div>`
    let filter = []
    const filterSetting = getFilterSetting()
    if (getExperienceValues()) filter.push(getExperienceValues())
    if (getRoleValues()) filter.push(getRoleValues())
    if (getWorkTypeValues()) filter.push(getWorkTypeValues())
    // if (getSMProgramValues()) filter.push(getSMProgramValues())
    if (getSMProgramsValueExpanded()) filter.push(getSMProgramsValueExpanded())
    if (checkRemoteValue()) filter.push(checkRemoteValue())
    if (industriesSelector.getValue().length > 0) filter.push(getIndustryValues())
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
    const values = checked.map(checkbox => {return `{experience-stage}="${checkbox.dataset.experience}"`}).join(',')
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
    const values = selected.map(value => {return `FIND("${value}",{Job Pref: Type of role})`}).join(',')
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
    // const valuesCurrentRole = selected.map(value => {return `FIND("${value}",{What do you do?})`}).join(',')
    // const values = valuesRolesFuture.concat(valuesCurrentRole)
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

function getSMProgramsValueExpanded() {
    filterObj.SMProgram = []
    if (smProgramSelector.getValue().length === 0) return
    const selected = smProgramSelector.getValue()
    filterObj.SMProgram = smProgramSelector.getValue()
    const values = selected.map(value => {return `FIND("${value}",{Startmate Program})`}).join(',')
    return values
}

// function getSMProgramValues() {
//     filterObj.SMProgram = []
//     const input = document.querySelector('[data-smprogram]')
//     if(!input.checked) return
//     filterObj.SMProgram = [true]
//     const value = `IF({Startmate Program}, TRUE())`
//     return value
// }

function checkRemoteValue() {
    filterObj.remote = []
    const input = document.querySelector('[data-remote="remotecheckbox"]')
    if(!input.checked) return
    filterObj.remote = [true]
    const value = `IF({Job Pref: Open to remote work}, TRUE())`
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
        if(filtersToCheck.roles.length > 0 && profile.fields["Job Pref: Relevant roles"]) {
            filtersToCheck.roles.forEach(filter => {
                if (profile.fields["Job Pref: Relevant roles"].includes(filter)) {
                    score += 1
                    matchedFilters.push(filter)
                }
            })
        }
        if(filtersToCheck.experience.length > 0 && profile.fields["experience-stage"]) {
            filtersToCheck.experience.forEach(filter => {
                if (profile.fields["experience-stage"].includes(filter)) {
                    score += 1
                    matchedFilters.push(filter)
                }
            })
        }
        if(filtersToCheck.location.length > 0 && profile.fields["Job Pref: Working Locations"]) {
            filtersToCheck.location.forEach(filter => {
                if (profile.fields["Job Pref: Working Locations"].includes(filter)) {
                    score += 1
                    matchedFilters.push(filter)
                }
            })
        }
        if(filtersToCheck.remote.length > 0 && profile.fields["Job Pref: Open to remote work"]) {
            if (profile.fields["Job Pref: Open to remote work"]){
                score += 1
                matchedFilters.push('Open to Remote Work')
            }
        }
        if(filtersToCheck.workType.length > 0 && profile.fields["Job Pref: Type of role"]) {
            filtersToCheck.workType.forEach(filter => {
                if (profile.fields["Job Pref: Type of role"].includes(filter)) {
                    score += 1
                    matchedFilters.push(filter)
                }
            })
        }
        // if(filtersToCheck.SMProgram.length > 0) {
        //         if (profile.fields["Startmate Program"]) { 
        //             score += 1
        //             matchedFilters.push('Startmate Fellow')
        //         }
        // }
        if(filtersToCheck.SMProgram.length > 0 && profile.fields["Startmate Program"]) {
            filtersToCheck.SMProgram.forEach(filter => {
                if (profile.fields["Startmate Program"].includes(filter)) {
                    score += 1
                    matchedFilters.push(filter)
                }
            })
        }
        if(filtersToCheck.industry.length > 0 && profile.fields["Job Pref: Industries"]) {
            filtersToCheck.industry.forEach(filter => {
                if (profile.fields["Job Pref: Industries"].includes(filter)) {
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
        && filterObj.remote.length === 0
        && filterObj.industry.length === 0
        && filterObj.SMProgram.length === 0) return true
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
    typeOfJobSelector.setValue('', 'silent')
    smProgramSelector.setValue('', 'silent')
    fetchProfiles()
}


function fetchProfiles() {
    // enableLoader()
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    };

    fetch(API + "&perPage=30", requestOptions)
        .then(response => response.json())
        .then(result => {
            userbase = result.records
            displayProfiles(userbase)
            countProfiles(userbase)
            // enableLoader()
            // console.log(userbase)
        })
        .catch(error => console.log('error', error));
}

function fetchFilteredProfiles(filter) {
    // enableLoader()
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    };

    const APIURL = API + filter + "&perPage=all"
    console.log(APIURL)
    fetch(APIURL, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            const TempUserbase = scoreProfiles(filterObj, result.records).sort(function(a, b){return b.score-a.score}).slice(0,150)
            displayProfiles(TempUserbase)
            countProfiles(TempUserbase)
            // enableLoader()
            console.log(TempUserbase)
        })
        .catch(error => console.log('error', error));
}

function displayUserHeadline(profile) {
    let headline
    // if (paidMember) {
        const fullHeadline = `<div class="candidate-name" style="max-width:600px"><a class="clickable-profile" href="/app/profile?user=${profile.id}" target="_blank">`
        headline = profile.fields["First Job?"]
                    ? `${fullHeadline}${profile.fields["Full Name"]}, ${profile.fields["What do you do?"]}</a></div>` 
                    : profile.fields["Candidate Employer"] 
                        ? `${fullHeadline}${profile.fields["Full Name"]}, ${profile.fields["Job Title"]} @ ${profile.fields["Candidate Employer"]}</a></div>`
                        : `${fullHeadline}${profile.fields["Full Name"]}, ${profile.fields["What do you do?"]}</a></div>`
    // } else {
    //     headline = `<div class="candidate-name" onclick="upgradeModule()"><span class="blur-name">Subscribe Today,</span> ${profile.fields["What do you do?"]}</div>`
    // }

    return headline
}

function profileButtonsContainer(profile) {
    let btns = `<a href="/app/profile?user=${profile.id} target="_blank" class="candidate-button-v2 more-button w-button" >See more</a>
                <a href="/message/send?user=${profile.id}" target="_blank" class="candidate-button-v2 contact-btn w-button tooltip">Contact<span class="tooltiptext">Send a message to connect</span></a>`
    // let btns = `<a ${paidMember ? `href="/app/profile?user=${profile.id}" target="_blank` : 'onclick="upgradeModule()"'}" class="candidate-button-v2 more-button w-button" >See more</a>
    //             <a ${paidMember ? `href="/message/send?user=${profile.id}" target="_blank` : 'onclick="upgradeModule()"'}" class="candidate-button-v2 contact-btn w-button tooltip">Contact<span class="tooltiptext">Send a message to connect</span></a>`
    return btns
}


function upgradeModule() {
    modalContainer.style.display = 'flex'
}

function closeModal(e) {
    // console.log(e.currentTarget)
    if(e.currentTarget === modalContainer) {
        modalContainer.style.display = 'none'
    }
}

//  ${!profile.score
// ? `<div></div>`
// : profile.score === 0 
//     ? `<div class="filter-match" data-filter="matches">No filters matched</div>`
//     :  profile.score === 1 &&  profile.score === countFilters()
//         ?  `<div class="filter-match all-matched" data-filter="matches">${profile.matchedFilters}</div>`
//         :  profile.score > 0 && profile.score < 3 && profile.score !== countFilters()
//             ? `<div class="filter-match some-matches" data-filter="matches">${profile.matchedFilters.join(', ')}</div>`
//             : profile.score > 1 && profile.score !== countFilters()
//                 ? `<div class="filter-match some-matches" data-filter="matches">Matches ${profile.score} filters</div>`
//                 : profile.score === countFilters()
//                     ? `<div class="filter-match all-matched" data-filter="matches">Matches all filters</div>`
//                     : `<div class="filter-match some-matches" data-filter="matches">Matches ${profile.score} filters</div>`}

function createCategories(arr, className) {
    if (arr) {
        return arr.map(category => {
            return `<div class="profile-catg ${className}">${category}</div>`
            }).join('')
        }
    } 

function displayProfiles(profiles){
    const profilesHTML = profiles.map(profile => {
        return `
        <div class="information-container">
            <div class="candidate-profile no-border">
                <div class="sixty">
                    <img src="${profile.fields["Profile Picture"]}-/quality/lightest/" sizes="60px" alt="" class="img" loading="lazy"/>
                </div>
                <div class="candidate-info">
                    ${displayUserHeadline(profile)}
                    <div class="candidate-details-container">
                        <div class="candidate-short-details">
                        ${profile.fields["experience-stage"]} • ${profile.fields["Location"]}</div>
                        ${profile.fields["Stage of Job Hunt"] === "Actively Looking"
                            ? `<div class="candidate-status actively-looking">Actively Looking</div>`
                            : `<div></div>`}
                    </div>
                </div>
                <div class="candidate-buttons-container">
                    ${loggedInUserType === 'EMPLOYER'
                    ? `<div class="heart-container" data-likebtn="${profile.id}">
                        <a data-heart="small" href="#" class="candidate-button-v2 sml-heart w-button ${heartStatus(loggedInUserObj, profile)} tooltip"><span class="tooltiptext">Save this candidate to favourites?</span>❤</a>
                        </div>`
                    : ''
                    }
                    ${profileButtonsContainer(profile)}
                </div>
            </div>
            ${!profile.score
                ? `<div></div>`
                : `<div class="div-block-104">
                        <div class="div-block-105">
                            <div class="candidate-short-details matches-text">Matches:</div>
                            <div>
                                ${createCategories(profile.matchedFilters, 'outlined')}
                            </div>
                        </div>
                    </div>`}
        </div> 
        `
    }).join('')
    directoryContainer.innerHTML = profilesHTML
    if (loggedInUserType === 'EMPLOYER') applyEventListeners()
}

function applyEventListeners() {
    const likeCompanyBtns = document.querySelectorAll('[data-likebtn]')
    likeCompanyBtns.forEach(btn => 
        btn.addEventListener('click', (e) => {
            const btn = e.currentTarget
            // console.log(btn)
            const heartBtn = btn.querySelector('[data-heart="small"]')
            heartBtn.classList.toggle('liked')
            updateLikedCandidates(handleLikedCandidates(loggedInUserObj, btn.dataset.likebtn), loggedInUserObj.id)
            // change hover text to unlike company
        })
    )
}

function updateLikedCandidates(candidatesList, userId) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "put",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify([{"id": userId,"fields":{"Candidates interested in": candidatesList}}])
    };

    fetch(API + "Users", requestOptions)
    .then(response => response.text())
    // .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

function handleLikedCandidates(userObj, candidateId) {
    let likedCandidates = []
    //if the liked list exists
    if (userObj.fields['Candidates interested in']) {
        likedCandidates = userObj.fields['Candidates interested in']
        // console.log('liked Candidates list found')
        // console.log(likedCandidates)
        //if the company is already liked, remove it
        if(likedCandidates.findIndex(id => id === candidateId) !== -1) {
            likedCandidates.splice(likedCandidates.findIndex(id => id === candidateId), 1)
            // console.log('Candidate has been already liked now removed')
            // console.log(likedCandidates)
            return likedCandidates
        } 
    }
    likedCandidates.push(candidateId)
    // console.log('candidate has been liked')
    // console.log(likedCandidates)
    return likedCandidates
}


function heartStatus(loggedInUserData, candidate) {

    if (loggedInUserData.fields['Candidates interested in']) {
        if (loggedInUserData.fields['Candidates interested in'].findIndex(id => id === candidate.id) !== -1) {
            const heartStatus = 'liked' 
            return heartStatus
        }
    }
}


function saveFilterToURL(filters){
    let url = new URL(window.location.href);
    url.searchParams.set('filters', filters)
}


async function fetchFilterData() {
    const [rolesResponse, locationsResponse, industriesResponse, smProgramsResponse] = await Promise.all([
        fetch(JSDELIVR + 'rolesArray.json'),
        fetch(JSDELIVR + 'locationsArray.json'),
        fetch(JSDELIVR + 'industriesArray.json'),
        fetch(JSDELIVR + 'programsArray.json')])
        
    const roles = await rolesResponse.json()
    const locations = await locationsResponse.json()
    const industries = await industriesResponse.json()
    const programs = await smProgramsResponse.json()
    // console.log(roles, locations, industries)
    return [roles, locations, industries, programs]
}

fetchFilterData().then(([roles, locations, industries, programs]) => {
    const rolesObj = roles.map(role => {return {'value': role, 'text': role}})
    const industryObj = industries.map(industry => {return {'value': industry, 'text': industry}})
    const smProgramsObj = programs.map(program => {return {'value': program, 'text': program}})

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
        maxOptions: 1000,
        options: locations});
    roleSelector = new TomSelect(rolesInput, {...generalSelectorSettings, options: rolesObj, maxItems: null});
    industriesSelector = new TomSelect(industriesInput, {...generalSelectorSettings,  options: industryObj, maxItems: null});
    smProgramSelector = new TomSelect(smProgramInput, {...generalSelectorSettings,  options: smProgramsObj, maxItems: null});

    typeOfJobSelector.on('change', (e) => {handleFilterSelection()})
    locationSelector.on('change', (e) => {handleFilterSelection()})
    smProgramSelector.on('change', (e) => {handleFilterSelection()})
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

    fetch(API + "Companies&fields=Interested%20Candidates,Name&id=" + companyId, requestOptions)
        .then(response => response.json())
        .then(result => {
            // console.log(result)
            companyData = result
        })
        .then(() => {
            const interestedCandidatesBanner = document.querySelector('[data-upgrade="interested-candidates"]')
            const interestedCandidatesBannerText = document.querySelector('[data-upgrade="interested-candidates-text"]')
            if (companyData 
                && companyData.fields['Interested Candidates'] 
                && companyData.fields['Interested Candidates'].length > 0 ) {
                // && paidMember) {
                    interestedCandidatesBannerText.innerHTML = `${companyData.fields['Interested Candidates'].length} Candidates are interested in <strong>${companyData.fields['Name']}</strong>`
                    interestedCandidatesBanner.style.display = "flex"
                    interestedCandidatesBanner.insertAdjacentHTML('beforeend', `<a href="/app/candidates-interested-directory" class="button-6 bannerbtn redbutton w-button"><span class="text-span-16">🔥</span> Show me</a>`)
            } else if(companyData 
                && companyData.fields['Interested Candidates'] 
                && companyData.fields['Interested Candidates'].length > 4) {
                    interestedCandidatesBannerText.innerHTML = `${companyData.fields['Interested Candidates'].length} Candidates are interested in <strong>${companyData.fields['Name']}</strong>`
                    interestedCandidatesBanner.style.display = "flex"
                    interestedCandidatesBanner.insertAdjacentHTML('beforeend', `<a onclick="upgradeModule()" class="button-6 bannerbtn redbutton w-button"><span class="text-span-16">🔥</span> Show me</a>`)

            }
        })
        .catch(error => console.log('error', error));
}

function getLoggedInUserData(userId) {

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
            loggedInUserObj = result
            // console.log(loggedInUserObj)
            // get user's profile data
            fetchProfiles()
        })
        .catch(error => console.log('error', error));
}

// function enableLoader() {
//     const loader = document.querySelector('.loader-container')
//     directoryContainer.classList.toggle('hidden')
//     loader.classList.toggle('active-loader')
// }


MemberStack.onReady.then(function(member) {
    if (member.loggedIn) {

        paidMember = member['paying-user']
        userCompanyId = member['company-airtable-id']
        loggedInUserId = member['airtable-id-two']
        loggedInUserType = member['user-type']
        if(userCompanyId) getCompanyData(userCompanyId)
        // if (paidMember) banner.style.display = 'none' FOR SUBSCRIPTION
        banner.style.display = 'none'
    
        getLoggedInUserData(loggedInUserId)
        fetchFilterData()
    }
})



    // if user hidden companies field matches a company name of the user viewing, hide from DOM?

// Airtable+Record+ID,Memberstack+ID,User+Type,First+Name,Last+Name,Bio,Stage+of+Job+Hunt,Linkedin,Startmate+Program,Location,Job+Pref:+Working+Locations,Job+Pref:+Open+to+remote+work,Next+Role,What+do+you+do?,Work+Experience,experience-stage,First+Job?,Candidate+Employer,Job+Title,Employment+Start+Date,Employment+End+Date,Currently+work+at+employer?,Job+Pref:+Relevant+roles,Job+Pref:+Industries,Job+Pref:+Type of role,Job+Pref:+Company size,Profile+Picture,Profile+Visibility,Profile+hidden+from:,Companies+interested+in,Airtable+Record+ID+(from+Companies+interested+in),Introductions+sent,Introductions+recieved,Date+last+updated,Account+Status
//Full%2BName%2CAirtable%2BRecord%2BID%2CMemberstack%2BID%2CUser%2BType%2CFirst%2BName%2CLast%2BName%2CBio%2CStage%2Bof%2BJob%2BHunt%2CLinkedin%2CStartmate%2BProgram%2CLocation%2CJob%2BPref%3A%2BWorking%2BLocations%2CJob%2BPref%3A%2BOpen%2Bto%2Bremote%2Bwork%2CNext%2BRole%2CWhat%2Bdo%2Byou%2Bdo%3F%2CWork%2BExperience%2Cexperience-stage%2CFirst%2BJob%3F%2CCandidate%2BEmployer%2CJob%2BTitle%2CEmployment%2BStart%2BDate%2CEmployment%2BEnd%2BDate%2CCurrently%2Bwork%2Bat%2Bemployer%3F%2CJob%2BPref%3A%2BRelevant%2Broles%2CJob%2BPref%3A%2BIndustries%2CJob%2BPref%3A%2BType%20of%20role%2CJob%2BPref%3A%2BCompany%20size%2CProfile%2BPicture%2CProfile%2BVisibility%2CProfile%2Bhidden%2Bfrom%3A%2CCompanies%2Binterested%2Bin%2CAirtable%2BRecord%2BID%2B%28from%2BCompanies%2Binterested%2Bin%29%2CIntroductions%2Bsent%2CIntroductions%2Brecieved%2CDate%2Blast%2Bupdated%2CAccount%2BStatus