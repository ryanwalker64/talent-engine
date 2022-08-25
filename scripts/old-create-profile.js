const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="
const JSDELIVR = 'https://cdn.jsdelivr.net/gh/ryanwalker64/talent-engine@main/'


let companies = []
let retrievedCompany = {}
let userProfile = {}

let userId
let roles

//Get MS Airtable ID
// MemberStack.onReady.then(function(member) {
//         if (member.loggedIn) {
//             console.log('User is editing their own profile')
//             userId = member["id"]
            
//         } else {
//             console.log('user is not logged in')
//         }
//     })
    
//Fetch roles
//Fetch industries
//Fetch locations
//Fetch companies
async function fetchData() {
    const [rolesResponse, locationsResponse, industriesResponse, companiesResponse] = await Promise.all([
        fetch(JSDELIVR + 'rolesArray.json'),
        fetch(JSDELIVR + 'locationsArray.json'),
        fetch(JSDELIVR + 'industriesArray.json'),
        fetch(API + "Companies&fields=Name,Logo&perPage=all", {
            method: "get",
            headers: new Headers().append("Content-Type", "application/json"),
            redirect: "follow" })
        ])

    const roles = await rolesResponse.json()
    const locations = await locationsResponse.json()
    const industries = await industriesResponse.json()
    const companies = await companiesResponse.json()
    return [roles, locations, industries, companies]
}

fetchData().then(([roles, locations, industries, companies]) => {
    // console.log(roles, locations, industries, companies.records); 
    body.insertAdjacentHTML('beforeend', createForm(roles, locations, industries, companies.records))
    document.querySelectorAll('.select').forEach((el)=>{
        let settings = {};
         new TomSelect(el,{...generalSelectorSettings});
    });
})

const generalSelectorSettings = {
	plugins: ['remove_button'],
    maxItems: 1,
    sortField: {
		field: "text",
		direction: "asc"
	}
};


//make form elements
function createInput(name, placeholder, type, addtionalSettings) {
    const newInput = `
    <input 
    type="${type}"
    required 
    placeholder="${placeholder}"  
    class='text-field w-input' 
    name="${name}" 
    data-input="${name}"
    ${addtionalSettings}/>
    `
    return newInput
}

function createSelect(name, placeholder, options = []) {
    const optionsMapped = options.map(option => {
        return `<option value="${option}">${option}</option>`
    }).join('optionsMapped')
    
    const newSelect = `
        <select
        class="select"
        data-input="${name}" 
        placeholder="${placeholder}" 
        name="${name}" 
        autocomplete="off"
        required>
            ${optionsMapped}
        </select>
    `
    return newSelect
}

function createForm(roles, locations, industries, companies) {
    const html = `
        <div class="text-block-66">airtableid</div>
        ${createInput('airtableid', ' ', 'text', "maxlength='256'")}

        <div class="text-block-66">First Name</div>
        ${createInput('first-name', ' ', 'text', "maxlength='256'")}

        <div class="text-block-66">Last Name</div>
        ${createInput('last-name', ' ', 'text', "maxlength='256'")}

        <div class="text-block-66">Bio</div>
        ${createInput('first-name', ' ', 'text', "maxlength='256'")}

        <div class="text-block-66">What stage in your job hunt are you?</div>
        ${createInput('first-name', ' ', 'text', "maxlength='256'")}

        <div class="text-block-66">Where are you located?</div>
        ${createSelect('located', ' ')}

        <div class="text-block-66">Where are you interested in working?</div>
        ${createSelect('working-locations', ' ')}

        <div class="text-block-66">What are you looking for in your next role?  (max 500 char)</div>
        ${createInput('next-role', ' ', 'text', "maxlength='256'")}

        <div class="text-block-66">What do you do? (similar role)</div>
        ${createSelect('role-selector', ' ', roles)}

        <div class="text-block-66">What stage in your job hunt are you?</div>
        ${createInput('first-name', ' ', 'number')}

        <div class="divider-v2 biggerdivide"></div>

        <div class="text-block-66">Work Experience</div>

        <div class="_2col-form">
            <div>
                <div class="text-block-66">Job title</div>
                ${createInput('job-title', ' ', 'text')}
            </div>
            <div>
                <div class="text-block-66">Company or last employer</div>
                ${createSelect('employer', ' ', companies)}
            </div>
            <div>
                <div class="text-block-66">Start Date</div>
                <div class="month-year">
                    ${createSelect('start-month', ' ', ['Chief of Staff', 'Executive Assistant'])}
                    ${createSelect('start-year', ' ', ['Chief of Staff', 'Executive Assistant'])}
                </div>
                ${createInput('start-date', ' ', 'text')}
            </div>
            <div>
                <div class="text-block-66">End Date</div>
                <div class="month-year">
                    ${createSelect('end-month', ' ', ['Chief of Staff', 'Executive Assistant'])}
                    ${createSelect('end-year', ' ', ['Chief of Staff', 'Executive Assistant'])}
                </div>
                ${createInput('end-date', ' ', 'text')}
            </div>

        <div class="divider-v2 biggerdivide"></div>

        <div class="text-block-66">Job preferences</div>

        <div class="text-block-66">What roles are you interested in?</div>
        ${createSelect('interested-roles', ' ', ['Chief of Staff', 'Executive Assistant'])}

        <div class="text-block-66">Industries you’re interested in</div>
        ${createSelect('industries', ' ', industries)}
        
        <div class="text-block-66">What type of jobs?</div>
        ${createSelect('type-of-jobs', ' ', roles)}

        <div class="text-block-66">Company size</div>
        ${createSelect('company-size', ' ', ['Chief of Staff', 'Executive Assistant'])}

        <div class="text-block-66">Profile picture</div>
        ${createInput('profile-pic', ' ', 'text', "role='uploadcare-uploader'")}

        <div class="divider-v2 biggerdivide"></div>

        <div class="text-block-66">How would you like your profile viewed?</div>
        ${createSelect('visibility', ' ', ['Chief of Staff', 'Executive Assistant'])}
    `
    return html
} 
//Fetch Airtable record (if avaliable set values)
//create form
// const form = document.querySelector('[data-form="create-profile"]') 
const body = document.querySelector('body') 




//append form to page
//add form submit event




