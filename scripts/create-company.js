const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="
const JSDELIVR = 'https://cdn.jsdelivr.net/gh/ryanwalker64/talent-engine@main/'

// Form inputs
const form = document.querySelector('[data-form="create-company"]') 
const employerInput = document.querySelector('[data-input="employer2"]') 
const locatedInput = document.querySelector('[data-input="working-locations"]') 
const industriesInput = document.querySelector('[data-input="industries"]') 
const companySizeInput = document.querySelector('[data-input="company-size"]') 
const selectedCompanyBtn = document.querySelector('[data-btn="select-company"]') 



async function fetchData() {
    const [locationsResponse, industriesResponse, companiesResponse] = await Promise.all([
        fetch(JSDELIVR + 'locationsArray.json'),
        fetch(JSDELIVR + 'industriesArray.json'),
        fetch(API + "Companies&fields=Name,Logo&perPage=all", {
            method: "get",
            headers: new Headers().append("Content-Type", "application/json"),
            redirect: "follow" })
        ])

    const locations = await locationsResponse.json()
    const industries = await industriesResponse.json()
    const companies = await companiesResponse.json()
    return [locations, industries, companies]
}

fetchData().then(([locations, industries, companies]) => {
    const industryObj = industries.map(industry => {return {'value': industry, 'text': industry}})
   
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

    locatedSelector = new TomSelect(locatedInput, {...locationSelectorSettings, options: locations, maxItems: 5});
    industriesSelector = new TomSelect(industriesInput, {...generalSelectorSettings,  options: industryObj, maxItems: 5});

    
    // MemberStack.onReady.then(function(member) {
    //     if (member.loggedIn) {
    //         console.log('User is editing their own profile')
    //         const userEmail = member["email"]
    //         // getUserData()
            
    //     } else {
    //     }
    // })
})

const locationSelectorSettings = {
	plugins: ['remove_button'],
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

// HTML Inputs >> Tom Selectors
let locationSelector
let industriesSelector
let employerSelector
let companySizeSelector = new TomSelect(companySizeInput, {...generalSelectorSettings, sortField: {}});

//input listneners
function submitProfile() {
    const formData = new FormData(form);
    const formProps = Object.fromEntries(formData);
    const userAirtableId = formProps['airtable-id']
    const userData = {
        "Linkedin": formProps['linkedin'],
        "Location": [locatedSelector.getValue()],
    }
    console.log(formProps)
    console.log(userData)
    // postUserInfo(userData, userAirtableId) THIS NEEDS TO CREATE A COMPANY
}

// function postUserInfo(userData, userAirtableId) {
//     var myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");
//     var requestOptions = {
//     method: "put",
//     headers: myHeaders,
//     redirect: "follow",
//     body: JSON.stringify([{"id": userAirtableId,"fields":userData}])
// };

//     fetch(API + "Users", requestOptions)
//         .then(response => response.text())
//         .then(result => {
//             console.log(result)
//             MemberStack.onReady.then(function(member) {  
//                 member.updateProfile({
//                     "profile-photo": userData["Profile Picture"],
//                     "first-name": userData["First Name"],
//                     "last-name": userData["Last Name"],
//                     "account-status": 'COMPLETE',
//                 }, false)
//             })
//             location.replace('dashboard')
//         })
//         .catch(error => console.log('error', error));
// }



// MULTI-STEP FORM AND VALIDATION
let currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form...
  let x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("formBackBtn").style.display = "none";
  } else {
    document.getElementById("formBackBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("formNxtBtn").innerHTML = "Save and continue";
  } else {
    document.getElementById("formNxtBtn").innerHTML = "Manually add your company";
  }
}

function nextPrev(n) {
  // This function will figure out which tab to display
  let x = document.getElementsByClassName("tab");
  const err = document.querySelector('.errormsg')
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) {
        err.style.display = 'block'
        return false
    } else {
        err.style.display = 'none'
    }; 
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab >= x.length) {
    // ... the form gets submitted:
    x.forEach(tab => {
        tab.style.display = 'none'
    })
    const loader = document.querySelector(".loader")
    const btns = document.querySelector(".flex-middle")
    btns.style.display = 'none'
    loader.style.display = 'flex'
    submitProfile();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  let x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = [
    ...x[currentTab].getElementsByTagName("input"),
    ...x[currentTab].getElementsByTagName("select"),
    ...x[currentTab].getElementsByTagName("textarea")];

  // A loop that checks every input field in the current tab:
  y.forEach(input => {
    if (input.tagName === 'SELECT' 
        && typeof input.tomselect === 'object' 
        && input.tomselect.getValue() === '') {
        console.log('tomselector false')
        valid = false; 

    }  else if (input.tagName !== 'SELECT' && !input.checkValidity()) { 
        console.log(input.tagName + ' false')
        valid = false;
    } 
  })
  return valid; // return the valid status
}




