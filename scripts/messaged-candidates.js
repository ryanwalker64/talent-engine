const directoryContainer = document.querySelector('.directory-container-v2')

const modalContainer = document.querySelector('[data-upgrade="modalbackground"]')
const modalCloseBtn = document.querySelector('[data-upgrade="closebtn"]')
const banner = document.querySelector('[data-upgrade="banner"]')


const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName=Users"
const FIELDS = "?fields%5B%5D=Job+Pref%3A+Working+Locations&fields%5B%5D=Job+Pref%3A+Open+to+remote+work&fields%5B%5D=experience-stage&fields%5B%5D=Job+Pref%3A+Relevant+roles&fields%5B%5D=Job+Pref%3A+Type+of+role&fields%5B%5D=Job+Pref%3A+Industries&fields%5B%5D=Startmate+Program"


let paidMember
let companiesInterestedIn
let userCompanyId
let companyData
let loggedInUserId
let loggedInUserType
let loggedInUserObj
let userbase = []

modalContainer.addEventListener('click', closeModal)
modalCloseBtn.addEventListener('click', closeModal)


function countProfiles(arr) {
    const profileCount = document.querySelector('[data-count="viewing"]')
    profileCount.textContent = arr.length
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
    // console.log(APIURL)
    fetch(APIURL, requestOptions)
        .then(response => response.json())
        .then(result => {
            userbase = result.records
            displayProfiles(userbase)
            countProfiles(userbase)
            // console.log(userbase)
        })
        .catch(error => console.log('error', error));
}

function displayUserHeadline(profile) {
    let headline
    if (paidMember) {
        const fullHeadline = `<div class="candidate-name"><a class="clickable-profile" href="/app/profile?user=${profile.id}" target="_blank">`
        headline = profile.fields["First Job?"]
                    ? `${fullHeadline}${profile.fields["Full Name"]}, ${profile.fields["What do you do?"]}</a></div>` 
                    : profile.fields["Candidate Employer"] 
                        ? `${fullHeadline}${profile.fields["Full Name"]}, ${profile.fields["Job Title"]} @ ${profile.fields["Candidate Employer"]}</a></div>`
                        : `${fullHeadline}${profile.fields["Full Name"]}, ${profile.fields["What do you do?"]}</a></div>`
    } else {
        headline = `<div class="candidate-name" onclick="upgradeModule()"><span class="blur-name">Subscribe Today,</span> ${profile.fields["What do you do?"]}</div>`
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
    // console.log(e.currentTarget)
    if(e.currentTarget === modalContainer) {
        modalContainer.style.display = 'none'
    }
}



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
            const profileAttachedToBtn = btn.closest('.candidate-profile')
            const heartBtn = btn.querySelector('[data-heart="small"]')
            if(heartBtn.classList.contains('liked')) profileAttachedToBtn.remove()
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



function getLoggedInUserData(userId) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    
    };

    fetch(API + "&id=" + userId + '&cacheTime=0', requestOptions)
        .then(response => response.json())
        .then(result => {
            loggedInUserObj = result
            // console.log(loggedInUserObj)
            // get user's profile data
        })
        .then(() => {
            // const companyNameHeading = document.querySelector('[data-company="title"]')
            // companyNameHeading.innerHTML = `${companyData.fields['Interested Candidates'].length} candidate${companyData.fields["Interested Candidates"].length > 1 ? 's are' : ' is'} interested in <span class="company-name-interests">${companyData.fields["Name"]}</span>`
            if (loggedInUserObj.fields["Messaged User Ids"]) {
                 companiesInterestedIn = [loggedInUserObj.fields["Messaged User Ids"]].map(candidate => {
                    return `{Airtable Record ID}="${candidate}"`
                }).join(',')
                const filteredOptions = `IF(OR(${companiesInterestedIn}),"true")`
                
                const filterEncode = "&filterByFormula=" + encodeURI(filteredOptions)  
                // console.log(companiesInterestedIn, filterEncode, filteredOptions)
                    fetchProfiles(filterEncode)
            }
        })
        .catch(error => console.log('error', error));
}

MemberStack.onReady.then(function(member) {
    if (member.loggedIn) {
        // console.log('User is logged in')
        paidMember = member['paying-user']
        userCompanyId = member['company-airtable-id']
        loggedInUserId = member['airtable-id-two']
        loggedInUserType = member['user-type']
        // if (paidMember) banner.style.display = 'none'
        // console.log(userCompanyId)
        getLoggedInUserData(loggedInUserId)
        fetchFilterData()
        
    }
})
