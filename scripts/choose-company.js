const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="
const JSDELIVR = 'https://cdn.jsdelivr.net/gh/ryanwalker64/talent-engine@main/'

// Form inputs
const form = document.querySelector('[data-form="create-company"]') 
const employerInput = document.querySelector('[data-input="employer2"]') 
const selectedCompanyBtn = document.querySelector('[data-btn="select-company"]') 
const userAirtableId = document.querySelector('[data-ms-member="airtable-id-two"]') 

// HTML Inputs >> Tom Selectors
let employerSelector

async function fetchData() {
    const companiesResponse = await fetch(API + "Companies&fields=Name,Logo&perPage=all", {
            method: "get",
            headers: new Headers().append("Content-Type", "application/json"),
            redirect: "follow" })
        

    const companies = await companiesResponse.json()
    return companies
}

fetchData().then((companies) => {
   
    const companiesHTML = companies.records.map(company => {
        return `<option value="${company.id}" data-src="${company.fields.Logo}">${company.fields.Name}</option>`
    }).join('')

    employerInput.insertAdjacentHTML('beforeend', companiesHTML)

    employerSelector = new TomSelect(employerInput, {
        ...generalSelectorSettings,
         render: {
            option: function (data, escape) {return `<div><img class="me-2" src="${data.src}">${data.text}</div>`;},
            item: function (item, escape) {return `<div><img class="me-2" src="${item.src}">${item.text}</div>`;}
            }
        });

        employerSelector.on('change', (e) => {
            if(employerSelector.getValue() !== ''){
            selectedCompanyBtn.style.display = 'block'
            } else {
                selectedCompanyBtn.style.display = 'none'
            }
        })


}).then(() => {
    const loadingContainer = document.querySelector('[data-loader]')
    const container = document.querySelector('[data-company-select]')
    loadingContainer.style.display = 'none'
    container.style.display = 'block'
})



const generalSelectorSettings = {
	plugins: ['remove_button'],
    maxItems: 1,
    sortField: {
		field: "text",
		direction: "asc"
	}
};

selectedCompanyBtn.addEventListener('click', () => {
    createCompany([employerSelector.getValue()], userAirtableId.value)
})


function createCompany(companyAirtableID, userAirtableId) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
    method: "put",
    headers: myHeaders,
    redirect: "follow",
    body: JSON.stringify([{
        "id": userAirtableId,
        "fields": {
            "Employer": companyAirtableID
        }
    }])
};


    fetch(API + "Users", requestOptions)
        .then(response => response.text())
        .then(result => {
            // console.log(result)
            MemberStack.onReady.then(function(member) {  
                member.updateProfile({
                    "company-airtable-id": companyAirtableID,
                }, false)
            })
            window.location.href = "/setup/create-employer-profile"
        })
        .catch(error => console.log('error', error));
}





