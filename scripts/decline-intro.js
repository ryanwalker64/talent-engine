
const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="

const recieverProfileContainer = document.querySelector('[data-user="receiver"]')
const declineBox = document.querySelector('[data-tab="declineBox"]')
const declineBtn = document.querySelector('[data-btn="decline"]')
const otherTextBox = document.querySelector('[data-input="other-text"]')
const radioBtns = document.querySelectorAll('[name="reason"]')
let recieverUserProfile 
let userIsLoggedIn

const container = document.querySelector('[data-container="container"]')
const declineMsgContainer = document.querySelector('[data-container="declinemsg"]')
const loader = document.querySelector('[data-loader="loading"]')


function initMessage(reciever) {
    const profilePic = 
    reciever.fields["Profile Picture"] 
    ? `${reciever.fields["Profile Picture"]}-/quality/lightest/`
    :  "https://uploads-ssl.webflow.com/6126d5a7894b51b0b6d462f5/61a001151c9a5b5c9bbdb1f4_blank-profile-picture-973460_1280.png"
    
    
    const html = `
    <div class="message-container">
        <img src="${profilePic}" loading="lazy" sizes="60px" alt="" class="img">
            <div class="candidate-info margin-right">
                <div class="candidate-name">${reciever.fields['Full Name']}</div>
                <div class="candidate-details-container">
                    <div class="candidate-short-details">${reciever.fields['Job Title']} @ ${reciever.fields['Name (from Employer)']}</div>
                </div>
            </div>
        </div>`

    recieverProfileContainer.innerHTML = html

    radioBtns.forEach(btn => {
        btn.addEventListener('change', (e) => {
            const value = e.target.value
    
            // if (value === "Other") {
                otherTextBox.classList.remove('hidden')
            // } else {
            //     otherTextBox.classList.add('hidden')
            // }
        })
    })
}


function getMsgId()  {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const id = url.searchParams.get("id");
    console.log(id);
    return id
}

function checkRadioBtns() {
    let valid
    radioBtns.forEach(btn => {
        if(btn.checked) valid = true
    })
    return valid
}

declineBtn.addEventListener('click', () => {
    declineIntroduction()
    declineMsgContainer.style.display = 'none'
    loader.style.display = 'flex'
})

function declineIntroduction() {
    if(!checkRadioBtns()) return console.log('pick an option') // aADDD to this
    const msgID = getMsgId()
    const declineReason = document.querySelector('[name="reason"]:checked').value

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "put",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify([{
            "id": msgID,
            "fields":{
                "Status":"DECLINED",
                "Declined Reason": declineReason,
                "Declined Message": otherTextBox.value,
            }
        }])
    };

    fetch(API + "Introductions", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result)
            loader.style.display = 'none'
            setSuccessMessageScreen()  
        })
        .catch(error => console.log('error', error));
}

MemberStack.onReady.then( async function(member) {
    fetchData(getRecieverUserId())
    
})
function getRecieverUserId()  {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const id = url.searchParams.get("user");
    console.log(id);
    return id
}

function fetchData(id) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    
    };

   return fetch(API + "Users&fields=Full%20Name,Job%20Title,Candidate%20Employer,Employer,Profile%20Picture&id=" + id, requestOptions)
    .then(response => response.json())
    .then(result => {
        recieverUserProfile = result
        initMessage(recieverUserProfile)
        declineBox.style.display = 'block'
    })
    
}

function setSuccessMessageScreen() {
    container.innerHTML = `
        <div class="userprofile-container middeligned">
                <div class="text-block-89">Thank you for closing the loop</div>
                <a href="/app/company-directory" class="button-7 w-button">Return to the Talent Engine</a>
        </div>`
 
}