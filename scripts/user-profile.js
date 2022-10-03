
const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="

let userProfile = {}
let userId
let userIsLoggedIn

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


function displayProfile() {

    const employerLogo = userProfile.fields['User Type'] === 'CANDIDATE' ? '' : `<img src="${userProfile.fields["Logo (from Employer)"]}" loading="lazy" alt="" class="logo">`
    const handleFirstJob = userProfile.fields['First Job?'] 
                            ? `<div class="short-company-name newtext">Looking for first job</div>`
                            : `<div class="short-company-name newtext">${userProfile.fields["Job Title"]} @ ${userProfile.fields["Candidate Employer"]}</div>
                                </div>
                                <div class="short-company-date">
                                    ${userProfile.fields["Employment Start Date"]} - 
                                    ${userProfile.fields['Currently work at employer?'] !== "on" 
                                    ? userProfile.fields["Employment End Date"]
                                    : "Present"}`
                            

    const profileHTML = `
        <div class="directory-container-v2" data-id="${userProfile.id}">
            <div class="userprofile-container">
                <div class="div-block-73">
                    <img src="${userProfile.fields["Profile Picture"]}" loading="lazy" sizes="60px" alt="" class="img">
                    <div class="candidate-info">
                        <div class="candidate-name">${userProfile.fields["Full Name"]}</div>
                        <div class="candidate-details-container">
                            <div class="candidate-short-details">${userProfile.fields["Job Title"]} @ ${userProfile.fields["Name (from Employer)"]}</div>
                            <div class="candidate-status actively-looking">${userProfile.fields["Stage of Job Hunt"]}</div>
                        </div>
                    </div>
                    <div class="candidate-buttons-container">
                        ${userIsLoggedIn 
                            ? `<a href="#" class="candidate-button-v2 more-button w-button">Edit Profile</a>`
                            : ''
                        }
                        <a href="https://talent.startmate.com/message/send?user=${userProfile.id}" class="candidate-button-v2 contact-btn w-button">Contact</a>
                    </div>
                </div>
                <div class="user-information">
                <div class="user-bio">${userProfile.fields["Bio"]}</div>
                <div class="user-experience-container">
                    <div id="w-node-d1b484be-b039-f163-f2bd-141e8ff68677-89aee008" class="user-experience">
                        <div class="label-v2">Experience</div>
                        <div class="short-company">
                            ${employerLogo}
                            <div class="company-desc-profile new">
                                ${handleFirstJob}
                            </div>
                        </div>
                    </div>
                    <div id="w-node-b33f916e-25ad-a1b2-2a99-d341be5d4074-89aee008" class="user-sm-programs">
                        <div class="label-v2">Startmate Programs</div>
                            ${createCategories()}
                    </div>
                </div>
                <div class="label-v2">Looking for in next role</div>
                <div class="user-next-role">${userProfile.fields["Next Role"]}</div>
                <div class="job-prefs-container">
                    <div id="w-node-a8b530b8-b509-4f4e-9e49-f72b76d74fcd-89aee008" class="job-pref-indiv">
                        <div class="label-v2">Roles</div>
                            ${createCategories(userProfile.fields["Job Pref: Relevant roles"])}
                    </div>
                    <div id="w-node-_9f50e0b2-ba60-88ce-2b64-f5921d73dfc1-89aee008" class="job-pref-indiv">
                        <div class="label-v2">Locations willing to work</div>
                            ${createCategories(userProfile.fields["Job Pref: Working Locations"])}
                    </div>
                    <div id="w-node-bcc88d47-3343-e695-3b39-811722584789-89aee008" class="job-pref-indiv">
                        <div class="label-v2">Experience Level</div>
                            ${getExperienceLevel(userProfile.fields["Work Experience"])}
                    </div>
                    <div id="w-node-_9dad6d86-99ab-a024-6f12-a81d2e150539-89aee008" class="job-pref-indiv">
                        <div class="label-v2">Type of Job</div>
                            ${createCategories(userProfile.fields["Job Pref: Type of role"])}
                    </div>
                    <div id="w-node-b867e61b-f8e7-1552-8487-2d485b3595db-89aee008" class="job-pref-indiv">
                        <div class="label-v2">Industries</div>
                            ${createCategories(userProfile.fields["Job Pref: Industries"])}
                    </div>
                    <div id="w-node-a39a8a14-8153-332f-ee8f-cc469567ca1d-89aee008" class="job-pref-indiv">
                        <div class="label-v2">Company Size</div>
                            ${createCategories(userProfile.fields["Job Pref: Company size"])}
                    </div>
                </div>
            </div>
        </div>
        </div>
        `
        profileContainer.innerHTML = profileHTML
}

function getUserData(userId) {
    userId = getUserId()

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
            userProfile = result
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
        console.log('User is viewing their own profile')
        userIsLoggedIn = true
    } else {
        userIsLoggedIn = false
    }
    getUserData(userId)
})

