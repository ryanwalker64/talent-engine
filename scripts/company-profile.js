

// On load, get record id from URL param
    // fetch company information 
    // store company information in companyProfile
    // display company information in DOM
    // Loading state

// display open jobs


const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="

let companyProfile = {}
let companyJobs = []
let userMatchesCompany
let loggedInUserObj
let userType

const profileContainer = document.querySelector('[data-profile="container"]')

function createCategories(arr) {
    if (arr) {
        return arr.map(category => {
            return `<div class="profile-catg">${category}</div>`
            }).join('')
        }
    } 

function displayProfile(companyProfile) {

    const profileHTML = `
    <a href="/app/company-directory" class="link-11">← Back to Companies</a>
    <div class="directory-container-v2" data-id="${companyProfile.id}">
        <div class="userprofile-container">
            <div class="div-block-73">
                <img src="${companyProfile.fields['Logo']}" loading="lazy" alt="" class="logo" style="border-radius:15px;object-fit: contain;">
                <div class="candidate-info">
                    <div class="company-name">${companyProfile.fields['Name']}</div>
                    <div class="candidate-details-container">
                        <div class="company-slogan" style="max-width: 500px;">${companyProfile.fields['Slogan']}</div>
                    </div>
                    <div class="company-categories">
                        ${companyProfile.fields['Startmate Company?'] 
                        ? '<div class="company-category orange-catg">Startmate Company</div>'
                        : ''}
                    </div>
                </div>
                <div class="candidate-buttons-container">
                    ${userMatchesCompany === true
                        ?   '<a href="#" class="candidate-button-v2 more-button w-button">Edit Company</a>'
                        :   ''}
                    ${userType === 'CANDIDATE'
                        ?   `<div class="heart-container" data-likebtn="${companyProfile.id}">
                            <a data-heart="small" href="#" class="candidate-button-v2 sml-heart w-button ${heartStatus(loggedInUserObj, companyProfile)} tooltip"><span class="tooltiptext">Interested to work for this company? Favourite this company to get notified about new jobs</span>❤</a>
                            </div>`
                        :   ''}
                    ${companyProfile.fields['Open to conversations']
                        ? '<a href="#" class="candidate-button-v2 contact-btn w-button">Open to conversations</a>'
                        : ''}
                </div>
            </div>
            <div class="user-information">
                <div class="user-bio">${companyProfile.fields['Company Description']}</div>
                <div class="job-prefs-container">
                    <div id="w-node-b867e61b-f8e7-1552-8487-2d485b3595db-503cba7a" class="job-pref-indiv">
                        <div class="label-v2">Industries</div>
                        ${createCategories(companyProfile.fields['Industry'])}
                    </div>
                    <div id="w-node-_9f50e0b2-ba60-88ce-2b64-f5921d73dfc1-503cba7a" class="job-pref-indiv">
                        <div class="label-v2">Location</div>
                        ${createCategories(companyProfile.fields['Location'])}
                        ${companyProfile.fields['Remote Friendly'] 
                            ? '<div class="profile-catg">Remote Friendly</div>'
                            : ''}
                    </div>
                    <div id="w-node-a39a8a14-8153-332f-ee8f-cc469567ca1d-503cba7a" class="job-pref-indiv">
                        <div class="label-v2">Company Size</div>
                        <div class="profile-catg">${companyProfile.fields['Company Size']} employees</div>
                    </div>
                    <div id="w-node-a39a8a14-8153-332f-ee8f-cc469567ca1d-503cba7a" class="job-pref-indiv">
                        <div class="label-v2">Company Website</div>
                        <div class="profile-catg"><a href="${companyProfile.fields['Website URL']}" target="_blank">${companyProfile.fields['Website URL']}</a></div>
                    </div>
                </div>
                <div class="div-block-74">
                    <div class="label-v2">Job openings</div>
                    <div class="job-listings" data-container="jobs">
                        ${!companyProfile.fields['Jobs'] 
                            ? `<span style="margin: 20px;display: block;">Currently there are no job openings at <strong>${companyProfile.fields['Name']}</strong><br>Add this company to your favourites to be notified about new roles</span>` 
                            : ''}
                    </div>
                </div>
            </div>
        </div>
        </div>    
        `
        profileContainer.innerHTML = profileHTML
        if (userType === 'CANDIDATE') applyEventListeners()
}

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

function createJobListing(jobData) {
    const tagline = `${jobData.fields['Level']} • ${jobData.fields['Type of Job']} • ${locationTranslate(jobData)}`
    const job =   `
                    <div class="job-posting company-page">
                    <div class="sixty">
                        <img src="${jobData.fields['Logo (from Company)']}" loading="lazy" alt="" class="logo" style="border-radius:15px;object-fit: contain;">
                    </div>
                    <div class="candidate-info job-post-directroy">
                        <div class="job-title"><a class="clickable-profile" href="${jobData.fields['converted-app-link']}" target="_blank">${jobData.fields['Job Title']}</a></div>
                        <div class="candidate-short-details">${tagline}</div>
                    </div>
                    <div class="seemore-container">
                        <div class="text-block-72">Posted: ${jobData.fields['Created']}</div>
                        <a href="${jobData.fields['converted-app-link']}" target="_blank" class="candidate-button-v2 more-button company-more-button w-button">See more</a>
                    </div>
                </div>`

     return job
}


function getCompanyData() {
    const companyId = getCompanyId()

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    
    };

    fetch(API + "Companies&id=" + companyId + '&cacheTime=0', requestOptions)
        .then(response => response.json())
        .then(result => {
            // console.log(result)
            companyProfile = result
            displayProfile(companyProfile)
            document.title = companyProfile.fields["Name"]
            
        })
        .then(() => {
            // if(companyProfile.fields.Jobs) {
            if(companyProfile.fields['Live Job Records']) {
                // companyProfile.fields['Jobs'].forEach(jobId => {
                companyProfile.fields['Live Job Records'].forEach(jobId => {
                    fetch(API + "Jobs&view=JobsPosted&id=" + jobId, requestOptions)
                    .then(response => response.json())
                    .then(jobData => {
                        // console.log(jobData)
                        companyJobs.push(jobData)
                        const jobContainer = document.querySelector('[data-container="jobs"]') 
                        jobContainer.insertAdjacentHTML('beforeend', createJobListing(jobData))
                    })
                    .catch(error => console.log('error', error));
                }) 
            }
        })
        .catch(error => console.log('error', error));
}

function getCompanyId()  {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const id = url.searchParams.get("id");
    // console.log(id);
    return id
}

function heartStatus(loggedInUserData, company) {

    if (loggedInUserData.fields['Companies interested in']) {
        if (loggedInUserData.fields['Companies interested in'].findIndex(id => id === company.id) !== -1) {
            const heartStatus = 'liked' 
            return heartStatus
        }
    }
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
            getCompanyData()
        })
        .catch(error => console.log('error', error));
}


MemberStack.onReady.then(function(member) {
    if (member.loggedIn && member["company-airtable-id"] === getCompanyId()) {
        userMatchesCompany = true
    } 
        const loggedInUser = member['airtable-id-two']
        getUserData(loggedInUser)
        userType = member['user-type']
        userMatchesCompany = false
    
    
})





// On load, get record id from URL param
    // fetch profile information 
    // store profile information in userProfile
    // display profile information in DOM
    // Loading state
    // recLKqQ95j0IsSiw0