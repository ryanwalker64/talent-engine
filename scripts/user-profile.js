
const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="

let userProfile = {}
let loggedInUserObj
let userId
let loggedInUserId
let loggedInUserType
let userType
let loggedInUsersProfile

const profileContainer = document.querySelector('[data-profile="container"]')

function createCategories(arr) {
    if (arr) {
        return arr.map(category => {
            return `<div class="profile-catg">${category}</div>`
            }).join('')
        }
    } 

function getExperienceLevel(level) {
    if (level < 1) {
        return '<div class="profile-catg">Entry-level</div>'
    } else if (level >= 1 && level < 3) {
        return '<div class="profile-catg">Junior 1-2 years</div>'
    } else if (level >= 3 && level < 5) {
        return '<div class="profile-catg">Mid-level 3-4 years</div>'
    } else if (level >= 5 && level < 8) {
        return '<div class="profile-catg">Senior 5-7 years</div>'
    } else if (level >= 8) {
        return '<div class="profile-catg">Expert</div>'
    }
}

function getEditedStatus(dateString) {
    let date = new Date(dateString);
    let now = new Date();

    // Calculate the difference in milliseconds between now and the provided date
    let differenceInMs = now - date;

    // Convert milliseconds to days
    let differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

    // Check conditions
    if (differenceInDays <= 7) {
        return "This week";
    } else if (differenceInDays <= 30) {
        return "This month";
    } else if (differenceInDays <= 30 * 6) {
        let months = Math.floor(differenceInDays / 30);
        return `Over ${months} month${months > 1 ? 's' : ''} ago`;
    } else if (differenceInDays <= 365) {
        return "Over 6 months ago";
    } else {
        return "Over a year ago";
    }
}




function displayProfile() {

    const employerLogo = userProfile.fields['User Type'] === 'CANDIDATE' ? '' : `<img src="${userProfile.fields["Logo (from Employer)"]}" loading="lazy" alt="" class="logo">`
    const handleExperienceContainer = userProfile.fields['First Job?'] 
                            ? `<div class="short-company-name newtext">Looking for first job</div>`
                            : `<div class="short-company-name newtext">${userProfile.fields["Job Title"]} @ ${userProfile.fields["Candidate Employer"]}</div>
                                </div>
                                <div class="short-company-date">
                                    ${userProfile.fields["Employment Start Date"]} - 
                                    ${!userProfile.fields['Currently work at employer?'] 
                                    ? userProfile.fields["Employment End Date"]
                                    : "Present"}`

    const handleHeadline = userProfile.fields['First Job?'] 
                            ? `<div class="candidate-short-details">${userProfile.fields["Location"]}</div>`
                            : userProfile.fields["User Type"] === 'EMPLOYER'
                               ? `<div class="candidate-short-details">${userProfile.fields["Job Title"]} @ ${userProfile.fields["Name (from Employer)"]}, ${userProfile.fields["Location"]}</div>`
                               : userProfile.fields["Candidate Employer"]
                                    ? `<div class="candidate-short-details">${userProfile.fields["Job Title"]} @ ${userProfile.fields["Candidate Employer"]}, ${userProfile.fields["Location"]}</div>`
                                    : `<div class="candidate-short-details">${userProfile.fields["Job Title"]}, ${userProfile.fields["Location"]}</div>`


    const stageOfJobHunt = userProfile.fields["Stage of Job Hunt"] === 'Actively Looking'
                                ? `<div class="candidate-status actively-looking">Actively Looking</div>`
                                : userProfile.fields["Stage of Job Hunt"] === 'Open to Offers'
                                    ? `<div class="candidate-status actively-looking open-to-offers">Open to Offers</div>`
                                    : ''
                            

    const profileHTML = `
        ${loggedInUserType === 'EMPLOYER' && userId !== loggedInUserId ? `<a href="/app/talent-directory" class="link-11">← Back to Talent Network</a>` : ''}
        <div class="directory-container-v2" data-id="${userProfile.id}">
            <div class="userprofile-container">
                <div class="div-block-73">
                    <div class="sixty">
                        <img src="${userProfile.fields["Profile Picture"]}-/quality/lightest/" sizes="60px" alt="" class="img" loading="lazy"/>
                    </div>
                    <div class="candidate-info">
                        <div class="candidate-name">${userProfile.fields["Full Name"]}</div>
                        <div class="candidate-details-container">
                            ${handleHeadline}
                            ${stageOfJobHunt}
                        </div>
                        ${userProfile.fields["Linkedin"] && userProfile.fields["Linkedin"].indexOf("linkedin") !== -1 &&
                        `<div class="candidate-details-container">
                            <div class="candidate-short-details">
                            <a href="${userProfile.fields["Linkedin"]}" target="_BLANK">Linkedin</a>
                            </div>
                        </div>`
                        }
                    </div>
                    <div class="candidate-buttons-container">
                    
                        ${loggedInUsersProfile 
                            ? `<a href="/app/edit-profile" class="candidate-button-v2 more-button w-button">Edit Profile</a>`
                            : ''}
                        ${loggedInUserType === 'EMPLOYER' && userId !== loggedInUserId
                        ?   `<div class="heart-container" data-likebtn="${userProfile.id}">
                            <a data-heart="small" href="#" class="candidate-button-v2 sml-heart w-button ${heartStatus(loggedInUserObj, userProfile)} tooltip"><span class="tooltiptext">Save this candidate?</span>❤</a>
                            </div>`
                        :   ''}
                        ${!loggedInUsersProfile 
                            ? `<a href="https://talent.startmate.com/message/send?user=${userProfile.id}" class="candidate-button-v2 contact-btn w-button">Contact</a>`
                            : ''}
                    </div>
                </div>
                ${userType === "CANDIDATE" 
                ? `<div class="user-information">
                    <div class="label-v2" style="margin-top:10px">Profile edited</div>
                    <div class="user-bio">${getEditedStatus(userProfile.fields["Date Last Edited"] || userProfile.fields["Account created date"])}</div>
                    <div class="user-bio">${userProfile.fields["Bio"]}</div>
                    <div class="user-experience-container">
                        <div id="w-node-d1b484be-b039-f163-f2bd-141e8ff68677-89aee008" class="user-experience">
                            <div class="label-v2">Experience</div>
                            <div class="" style="
                                border: 1px solid #eee;
                                border-radius: 15px;
                                padding: 5px 10px;
                                display: inline-block;">
                                ${employerLogo}
                                <div class="">
                                    ${handleExperienceContainer}
                                </div>
                            </div>
                        </div>
                        ${userProfile.fields["Startmate Program"] 
                            ? `<div id="w-node-b33f916e-25ad-a1b2-2a99-d341be5d4074-89aee008" class="user-sm-programs">
                                    <div class="label-v2">Startmate Programs</div>
                                        ${createCategories(userProfile.fields["Startmate Program"])} 
                                </div>`
                        : ''}
                    </div>
                    <div class="label-v2">Looking for in next role</div>
                    <div class="user-next-role">${userProfile.fields["Next Role"]}</div>
                    <div class="job-prefs-container">
                        ${userProfile.fields["Job Pref: Relevant roles"]
                            ?   `<div id="w-node-a8b530b8-b509-4f4e-9e49-f72b76d74fcd-89aee008" class="job-pref-indiv">
                                    <div class="label-v2">Roles</div>
                                    ${createCategories(userProfile.fields["Job Pref: Relevant roles"])}
                                </div>`
                            :   ''}

                        ${userProfile.fields["Job Pref: Working Locations"]
                            ?   `<div id="w-node-_9f50e0b2-ba60-88ce-2b64-f5921d73dfc1-89aee008" class="job-pref-indiv">
                                    <div class="label-v2">Locations willing to work</div>
                                    ${createCategories(userProfile.fields["Job Pref: Working Locations"])}
                                </div>`
                            :   ''}

                        ${userProfile.fields["Work Experience"]
                            ?    `<div id="w-node-bcc88d47-3343-e695-3b39-811722584789-89aee008" class="job-pref-indiv">
                                    <div class="label-v2">Experience Level</div>
                                    ${getExperienceLevel(userProfile.fields["Work Experience"])}
                                </div>`
                            :   ''}


                        ${userProfile.fields["Job Pref: Type of role"]
                            ?    `<div id="w-node-_9dad6d86-99ab-a024-6f12-a81d2e150539-89aee008" class="job-pref-indiv">
                                    <div class="label-v2">Type of Job</div>
                                    ${createCategories(userProfile.fields["Job Pref: Type of role"])}
                                </div>`
                            :   ''}


                        ${userProfile.fields["Job Pref: Industries"]
                            ?    `<div id="w-node-b867e61b-f8e7-1552-8487-2d485b3595db-89aee008" class="job-pref-indiv">
                                    <div class="label-v2">Industries</div>
                                    ${createCategories(userProfile.fields["Job Pref: Industries"])}
                                 </div>`
                            :   ''}

                        ${userProfile.fields["Job Pref: Company size"]
                            ?    `<div id="w-node-a39a8a14-8153-332f-ee8f-cc469567ca1d-89aee008" class="job-pref-indiv">
                                    <div class="label-v2">Company Size</div>
                                    ${createCategories(userProfile.fields["Job Pref: Company size"])}
                                 </div>`
                            :   ''}
                    </div>
                </div>` : ''}
        </div>
        </div>
        `
        profileContainer.innerHTML = profileHTML
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
            getUserData()
        })
        .catch(error => console.log('error', error));
}

function getUserData() {
    userId = getUserId()
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
            userProfile = result
            userType = userProfile.fields['User Type']
            displayProfile()
            document.title = userProfile.fields["Full Name"]
        })
        .catch(error => console.log('error', error));
}

function getUserId()  {
    const pageURL = window.location.href
    const idStartIndex = (pageURL.search("user") + 5)
    return [...pageURL].slice(idStartIndex, idStartIndex + 17).join('')
}

MemberStack.onReady.then(function(member) {
    if (member.loggedIn) {
        loggedInUserId = member['airtable-id-two']
        loggedInUserType = member['user-type']
        
        loggedInUsersProfile = getUserId() === loggedInUserId ? true : false
        // console.log(loggedInUserId)
        // Get loggedin User Data
        getLoggedInUserData(loggedInUserId)
    } 
})

