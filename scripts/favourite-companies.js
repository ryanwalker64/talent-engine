const directoryContainer = document.querySelector('.directory-container-v2')

const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="

let userIsLoggedIn 
let loggedInUserObj
// let offset
let userType
let companiesUserbase = []
let companiesInterestedIn


function fetchCompanies(filter) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    };

    fetch(API + 'Companies' + filter + '&cacheTime=0', requestOptions)
        .then(response => response.json())
        .then(result => {
            companiesUserbase = result.records
            displayCompanies(companiesUserbase)
            console.log(companiesUserbase)
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

function heartStatus(loggedInUserData, company) {

    if (loggedInUserData.fields['Companies interested in']) {
        if (loggedInUserData.fields['Companies interested in'].findIndex(id => id === company.id) !== -1) {
            const heartStatus = 'liked' 
            return heartStatus
        }
    }
}

// <a data-heart="large" href="#" class="candidate-button-v2 lge-heart like-company-btn w-button">${loggedInUserData.fields['Companies interested in'].findIndex(id => id === company.id) !== -1 ? 'Unfavourite company?' : 'Favourite company?'}</a>

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
                <div class="company-name"><a class="clickable-profile" href="/app/company?id=${company.id}" target="_blank">${company.fields['Name']}</a></div>
                <div class="company-slogan">${company.fields['Slogan']}</div>
                <div class="company-categories">
                    ${company.fields['Startmate Company?']
                        ? '<div class="company-category orange-catg">Startmate Company</div>'
                        : ''}
                </div>
            </div>
            <div class="div-block-75">
                ${score}
                ${userType === 'CANDIDATE'
                ? `<div class="heart-container" data-likebtn="${company.id}">
                    <a data-heart="small" href="#" class="candidate-button-v2 sml-heart w-button ${heartStatus(loggedInUserObj, company)} tooltip"><span class="tooltiptext">Remove this company from favourites?</span>❤</a>
                    </div>`
                : ''
                }
                <a href="/app/company?id=${company.id}" target="_blank" class="candidate-button-v2 more-button company-more-button w-button">See more</a>
            </div>
        </div>`
    }).join('')
    directoryContainer.innerHTML = companiesHTML
    if (userType === 'CANDIDATE') applyEventListeners()
}




function applyEventListeners() {
    const likeCompanyBtns = document.querySelectorAll('[data-likebtn]')
    likeCompanyBtns.forEach(btn => 
        btn.addEventListener('click', (e) => {
            const btn = e.currentTarget
            const profileAttachedToBtn = btn.closest('.company-profile')
            const heartBtn = btn.querySelector('[data-heart="small"]')
            if(heartBtn.classList.contains('liked')) profileAttachedToBtn.remove()
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
    .then(result => console.log(result))
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
            
        }).then(() => {
            // const companyNameHeading = document.querySelector('[data-company="title"]')
            // companyNameHeading.innerHTML = `${companyData.fields['Interested Candidates'].length} candidate${companyData.fields["Interested Candidates"].length > 1 ? 's are' : ' is'} interested in <span class="company-name-interests">${companyData.fields["Name"]}</span>`
            if (loggedInUserObj.fields["Companies interested in"]) {
                 companiesInterestedIn = loggedInUserObj.fields["Companies interested in"].map(company => {
                    return `{Airtable Record ID}="${company}"`
                }).join(',')
            }
            const filteredOptions = `IF(OR(${companiesInterestedIn}),"true")`
            
            const filterEncode = "&filterByFormula=" + encodeURI(filteredOptions)  
            console.log(companiesInterestedIn, filterEncode, filteredOptions)
                fetchCompanies(filterEncode)
        })
        .catch(error => console.log('error', error));
}

function handleLikedCandidates(userObj, companyid) {
    let likedCompanies = []
    //if the liked list exists
    if (userObj.fields['Companies interested in']) {
        likedCompanies = userObj.fields['Companies interested in']
        console.log('liked companies list found')
        console.log(likedCompanies)
        //if the company is already liked, remove it
        if(likedCompanies.findIndex(id => id === companyid) !== -1) {
            likedCompanies.splice(likedCompanies.findIndex(id => id === companyid), 1)
            console.log('company has been already liked now removed')
            console.log(likedCompanies)
            return likedCompanies
        } 
    }
    likedCompanies.push(companyid)
    console.log('company has been liked')
    console.log(likedCompanies)
    return likedCompanies
}

MemberStack.onReady.then(function(member) {
    if (member.loggedIn) {
        console.log('User is viewing their own profile')
        userIsLoggedIn = true
        const loggedInUser = member['airtable-id-two']
        userType = member['user-type']
        
        getUserData(loggedInUser)
        
    } else {
        userIsLoggedIn = false
    }
})



