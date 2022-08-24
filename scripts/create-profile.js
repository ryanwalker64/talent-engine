const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="


const fetchRoles = () => fetch('https://cdn.jsdelivr.net/gh/ryanwalker64/talent-engine@main/rolesArray.json')
  .then((response) => response.json())
  .then((data) => console.log(data));

let companies = []
let retrievedCompany = {}
let userProfile = {}
let userId
let userIsLoggedIn

const locations = [
    {"country": "AUS", "value": "New South Wales"},
    {"country": "AUS", "value": "Victoria"},
    {"country": "AUS", "value": "South Australia"},
    {"country": "AUS", "value": "Western Australia"},
    {"country": "AUS", "value": "Australia Capital Territory"},
    {"country": "AUS", "value": "Tasmania"},
    {"country": "AUS", "value": "Queensland"},
    {"country": "AUS", "value": "Northern Territory"},
    {"country": "NZ", "value": "Northland"},
    {"country": "NZ", "value": "Auckland"},
    {"country": "NZ", "value": "Waikato"},
    {"country": "NZ", "value": "Gisborne"},
    {"country": "NZ", "value": "Hawke's Bay"},
    {"country": "NZ", "value":  "Taranaki"},
    {"country": "NZ", "value":  "Manawatu"},
    {"country": "NZ", "value":  "Wellington"},
    {"country": "NZ", "value":  "Nelson"},
    {"country": "NZ", "value":  "West Coast"},
    {"country": "NZ", "value":  "Marlborough"},
    {"country": "NZ", "value":  "Canterbury"},
    {"country": "NZ", "value":  "Otago"},
    {"country": "NZ", "value":  "Southland"},
    {"country": "OTHER", "value": "International"},
]

// const roles = [
//     "Chief of Staff",
//     "Executive Assistant",
//     "Logistics & Supply Chain Management",
//     "Management Consulting",
//     "Project Management",
//     "Strategy and Ops",
//     "Animator",
//     "Audio Production",
//     "Brand Strategy",
//     "Copywriter",
//     "Creative Director",
//     "Editorial & Writing",
//     "Illustrator",
//     "Photo Production",
//     "Video Production",
//     "Analytics Engineering",
//     "Data Engineering",
//     "Data & General Analytics",
//     "Data Leadership & Management",
//     "Data Science",
//     "Machine Learning Engineering",
//     "3D & Motion Design",
//     "Brand Design",
//     "Content Design",
//     "Design Management",
//     "Graphic Design",
//     "Industrial Design",
//     "Interaction Design",
//     "Product Design (UI/UX)",
//     "Service Design",
//     "User Research",
//     "Web Design",
//     "Headmaster/Principal",
//     "Higher Education",
//     "Non-Teacher Support",
//     "School Administrator",
//     "Special Education",
//     "Teacher - Nursery",
//     "Teacher - Primary",
//     "Teacher - Secondary",
//     "Accounting & Financial Planning",
//     "Corporate Development",
//     "Corporate Finance",
//     "Payroll & Accounts",
//     "Asset Management",
//     "Investment Banking",
//     "Private Equity",
//     "Quant",
//     "Sales and Trading",
//     "Venture Capital",
//     "Wealth Management",
//     "Care Manager",
//     "Clinical Operations",
//     "Clinician",
//     "Clinician Manager",
//     "Medical Content",
//     "Medical Director",
//     "Mental Health Coach",
//     "Primary Care Physician",
//     "Psychiatrist",
//     "Research Scientist",
//     "Therapist",
//     "Fraud",
//     "Legal",
//     "Policy",
//     "Risk & Compliance",
//     "Brand Marketing",
//     "Comms & PR",
//     "Community",
//     "Content Marketing",
//     "Email Marketing",
//     "Growth Marketing",
//     "Marketing Management",
//     "Marketing Ops",
//     "Performance Marketing",
//     "Product Marketing",
//     "SEO Marketing",
//     "Social Media Management",
//     "Musician",
//     "Producer",
//     "Recording Engineer",
//     "Electrical Engineering",
//     "Embedded Systems Engineering",
//     "Hardware Engineering",
//     "IT",
//     "Mechanical Engineering",
//     "No-Code Developer",
//     "Corporate Social Responsibility",
//     "Diversity & Inclusion",
//     "Human Resources",
//     "Learning & Development",
//     "People Operations",
//     "Recruiting",
//     "Technical Recruiting",
//     "Product Analyst",
//     "Product Leadership",
//     "Product Manager",
//     "Product Operations",
//     "Technical Product Manager",
//     "Account Executive",
// ]

// const industries = [,
//     "Adtech",
//     "Aerospace",
//     "Agriculture",
//     "AI",
//     "Analytics",
//     "Augmented Reality / Virtual Reality",
//     "Biotech",
//     "Blockchain",
//     "Carbon reduction technology",
//     "Community",
//     "Construction",
//     "Consumer products",
//     "Dev tools",
//     "E-commerce",
//     "Education",
//     "Energy",
//     "Enterprise Software",
//     "Entertainment",
//     "Environment/Sustainability",
//     "Fintech",
//     "Fitness/Wellness/Mental Health",
//     "Food",
//     "Freight/Logistics",
//     "Gaming",
//     "Hardware",
//     "Investment",
//     "Media",
//     "Medtech",
//     "Mental Health",
//     "Mobility",
//     "Robotics",
// ]

const form = document.querySelector('[data-form="create-profile"]') 
const locatedInput = document.querySelector('[data-input="located"]')
const workingLocationsInput = document.querySelector('[data-input="working-locations"]')
const roleSelectorInput = document.querySelector('[data-input="role-selector"]')
const interestedRolesInput = document.querySelector('[data-input="interested-roles"]')
//Work Experience Inputs
const firstJobInput = document.querySelector('[data-input="first-job"]')
const jobTitleInput = document.querySelector('[data-input="job-title"]')
const employerInput = document.querySelector('[data-input="employer"]')
const startDateInput = document.querySelector('[data-input="start-date"]')
    const startDateMonthInput = document.querySelector('[data-input="start-month"]')
    const startDateYearInput = document.querySelector('[data-input="start-year"]')
const endDateInput = document.querySelector('[data-input="end-date"]')
    const endDateMonthInput = document.querySelector('[data-input="end-month"]')
    const endDateYearInput = document.querySelector('[data-input="end-year"]')
const currentlyWorkInput = document.querySelector('[data-input="currently-work-here"]')
//Job Preference Inputs
const typeOfJobInput = document.querySelector('[data-input="types-of-jobs"]')
const companySizeInput = document.querySelector('[data-input="company-size"]')
const industriesInput = document.querySelector('[data-input="industries"]')

const rolesHTML = roles.map(role => {
    return `<option value="${role}">${role}</option>`
}).join('')

const industriesHTML = industries.map(industry => {
    return `<option value="${industry}">${industry}</option>`
}).join('')

roleSelectorInput.insertAdjacentHTML('beforeend', rolesHTML)
interestedRolesInput.insertAdjacentHTML('beforeend', rolesHTML)
industriesInput.insertAdjacentHTML('beforeend', industriesHTML)


const locationSelectorSettings = {
	plugins: ['remove_button'],
    options: locations,
	optgroups: [
		{value: 'AUS', label: 'Australia'},
		{value: 'NZ', label: 'New Zealand'},
		{value: 'OTHER', label: 'Other'}
	],
	optgroupField: 'country',
	labelField: 'value',
	searchField: ['value'],
    maxItems: 1,
};

const generalSelectorSettings = {
	plugins: ['remove_button'],
    maxItems: 1,
    sortField: {
		field: "text",
		direction: "asc"
	}
};

// Located Input Select Input
const locatedSelector = new TomSelect(locatedInput, {...locationSelectorSettings});

// Working locations Select Input
const workingLocationSelector = new TomSelect(workingLocationsInput, {...locationSelectorSettings, maxItems: 3});

// role selector Input
const roleSelector = new TomSelect(roleSelectorInput, {...generalSelectorSettings});

// Interested Roles Input
const interestedRolesSelector = new TomSelect(interestedRolesInput, {...generalSelectorSettings, maxItems: 3});

// type of Job Input
const typeOfJobSelector = new TomSelect(typeOfJobInput, {...generalSelectorSettings, maxItems: null});

// company Size Input
const companySizeSelector = new TomSelect(companySizeInput, {...generalSelectorSettings, maxItems: null, sortField: {}});

// start date Inputs
const startDateMonthSelector = new TomSelect(startDateMonthInput, {...generalSelectorSettings,  sortField: {}});
const startDateYearSelector = new TomSelect(startDateYearInput, {...generalSelectorSettings, sortField: {direction: "desc"}});

// End date Inputs
const endDateMonthSelector = new TomSelect(endDateMonthInput, {...generalSelectorSettings,  sortField: {}});
const endDateYearSelector = new TomSelect(endDateYearInput, {...generalSelectorSettings, sortField: {direction: "desc"}});

// Industries Input
const industriesSelector = new TomSelect(industriesInput, {...generalSelectorSettings, maxItems: 5});

//input listneners
const grabMonthYearInputs = (monthInput, yearInput, monthYearInput) => {
    monthYearInput.value = `${monthInput.value} ${yearInput.value}`
}
startDateMonthSelector.on('change', () => grabMonthYearInputs(startDateMonthInput, startDateYearInput, startDateInput))
startDateYearSelector.on('change', () => grabMonthYearInputs(startDateMonthInput, startDateYearInput, startDateInput))
endDateMonthSelector.on('change', () => grabMonthYearInputs(endDateMonthInput, endDateYearInput, endDateInput))
endDateYearSelector.on('change', () => grabMonthYearInputs(endDateMonthInput, endDateYearInput, endDateInput))


locatedSelector.on('change', (e) => { workingLocationSelector.setValue(locatedSelector.getValue())})

firstJobInput.addEventListener('change', () => {
    if (firstJobInput.checked) {
        jobTitleInput.disabled = firstJobInput.checked
        employerSelector.disable()
        startDateMonthSelector.disable()
        startDateYearSelector.disable()
        endDateMonthSelector.disable()
        endDateYearSelector.disable()
        currentlyWorkInput.disabled = firstJobInput.checked
    } else {
        jobTitleInput.disabled = firstJobInput.checked
        employerSelector.enable()
        startDateMonthSelector.enable()
        startDateYearSelector.enable()
        endDateMonthSelector.enable()
        endDateYearSelector.enable()
        currentlyWorkInput.disabled = firstJobInput.checked
    }
})

currentlyWorkInput.addEventListener('change', () => {
    if (currentlyWorkInput.checked) {
        endDateMonthSelector.disable()
        endDateYearSelector.disable()
    } else {
        endDateMonthSelector.enable()
        endDateYearSelector.enable()
    }
})


form.addEventListener('submit', (e) => {
    e.preventDefault
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    
    const userAirtableId = formProps['airtable-id']
    const userData = {
        "First Name": formProps['first-name'],
        "Last Name": formProps['last-name'],
        "Bio": formProps['bio'],
        "Stage of Job Hunt": formProps['job-hunt'],
        "Linkedin": formProps['linkedin'],
        "Location": [locatedSelector.getValue()],
        "Job Pref: Working Locations": workingLocationSelector.getValue(),
        "Job Pref: Open to remote work": formProps['remote-work'],
        "Next Role": formProps['next-role'],
        "What do you do?": [roleSelector.getValue()],
        "Work Experience": formProps['work-experience'],
        "First Job?": formProps['first-job'],
        "Job Title": formProps['job-title'],
        "Employer": [employerSelector.getValue()],
        "Employment Start Date": formProps['start-date'],
        "Employment End Date": formProps['end-date'],
        "Currently work at employer?": formProps['currently-work-here'],
        "Job Pref: Relevant roles": interestedRolesSelector.getValue(),
        "Job Pref: Industries": industriesSelector.getValue(),
        "Job Pref: Type of role": typeOfJobSelector.getValue(),
        "Job Pref: Company size": companySizeSelector.getValue(),
        "Profile Picture": formProps['profile-pic'],
        "Profile Visibility": formProps['visbility'],
        "Profile hidden from:": formProps['hidden-from'],
    }
    console.log(formProps)
    console.log(userData)
    postUserInfo(userData, userAirtableId)
})


function postUserInfo(userData, userAirtableId) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
    method: "put",
    headers: myHeaders,
    redirect: "follow",
    body: JSON.stringify([{"id": userAirtableId,"fields":userData}])
};

    fetch(API + "Users", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

}
let employerSelector;

function fetchCompaniesList()  {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    };

    fetch(API + "Companies&fields=Name,Logo&perPage=all", requestOptions)
        .then(response => response.json())
        .then(result => { 
            console.log(result)
            companies = result.records;
            const companiesHTML = companies.map(company => {
                return `<option value="${company.id}" data-src="${company.fields.Logo}">${company.fields.Name}</option>`
            }).join('')
            employerInput.insertAdjacentHTML('beforeend', companiesHTML)

            employerSelector = new TomSelect(employerInput, {
                ...generalSelectorSettings,
                 maxItems: 1,
                 render: {
                    option: function (data, escape) {
                        return `<div><img class="me-2" src="${data.src}">${data.text}</div>`;
                    },
                    item: function (item, escape) {
                        return `<div><img class="me-2" src="${item.src}">${item.text}</div>`;
                    }
                }
                });
        })
        .catch(error => console.log('error', error));
}

fetchCompaniesList()

// function setProfileInfo(userData) {
//     document.querySelector('[data-name="first-name"]').value = userData.fields["First Name"]
//     document.querySelector('[data-name="last-name"]').value = userData.fields["Last Name"]
//     document.querySelector('[data-name="bio"]').value = userData.fields["Bio"]
//     document.querySelector('[data-name="job-hunt"]').value = userData.fields["Stage of Job Hunt"]
//     document.querySelector('[data-name="linkedin"]').value = userData.fields["Linkedin"]
//     document.querySelector('[data-name="remote-work"]').value = userData.fields["Job Pref: Open to remote work"]
//     document.querySelector('[data-name="next-role"]').value = userData.fields["Next Role"]
//     document.querySelector('[data-name="work-experience"]').value = userData.fields["Work Experience"]
//     firstJobInput.value = userData.fields["first-job"]
//     document.querySelector('[data-name="job-title"]').value = userData.fields["Job Title"]
//     employerSelector.setValue(userData.fields["Employer Airtable Record ID"])
//     currentlyWorkInput.value = userData.fields["Currently work at employer?"]
//     document.querySelector('[data-name="profile-pic"]').value = userData.fields["Profile Picture"]
//     profileVisibility = document.querySelector('[data-name="visibility"]').value = userData.fields["Profile Visibility"]
//     locatedSelector.setValue(userData.fields["Location"])
//     workingLocationSelector.setValue(userData.fields["Job Pref: Working Locations"])
//     roleSelector.setValue(userData.fields["What do you do?"])
//     interestedRolesSelector.setValue(userData.fields["Job Pref: Relevant roles"])
//     typeOfJobSelector.setValue(userData.fields["Job Pref: Type of role"])
//     companySizeSelector.setValue(userData.fields["Job Pref: Company size"])
//     startDateMonthSelector.setValue(userData.fields["Employment Start Date"].split(' ')[0])
//     startDateYearSelector.setValue(userData.fields["Employment Start Date"].split(' ')[1])
//     endDateMonthSelector.setValue(userData.fields["Employment End Date"].split(' ')[0])
//     endDateYearSelector.setValue(userData.fields["Employment End Date"].split(' ')[1])
//     industriesSelector.setValue(userData.fields["Job Pref: Industries"])
// }

// MemberStack.onReady.then(function(member) {
//     if (member.loggedIn) {
//         console.log('User is editing their own profile')
//         getUserData('recLKqQ95j0IsSiw0')
        
//     } else {
//     }
// })

// function getUserData(userId) {
//     // userId = getUserId()

//     var myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");
//     var requestOptions = {
//         method: "get",
//         headers: myHeaders,
//         redirect: "follow",
    
//     };

//     fetch(API + "Users&id=" + userId, requestOptions)
//         .then(response => response.json())
//         .then(result => {
//             console.log(result)
//             setProfileInfo(result)
//         })
//         .catch(error => console.log('error', error));
// }



// Onload, fetch user airtable ID from memberstack ✅
    // fetch names of companies and record ids from companies table in airtable ✅
    // store companies list in companies  ✅
    // append list of companies to select field ✅
    // if company airtable id exists 
        // fetch company information and store in retrievedCompany
        // prefill company in experience field
    // on continue, if candidate update airtable user with company record id 

// if company doesn't exist
    // display create company form (minified) 
    // on form submission, create company in airtable companies table (as shallow company)
    // attach user's airtable id to it
    // show saved state

// on continue load job preferences ✅
// on continue load profile visibility ✅

// save info to airtable ✅
