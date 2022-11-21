
const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="

const recieverProfileContainer = document.querySelector('[data-user="receiver"]')
const declineBox = document.querySelector('[data-tab="declineBox"]')
const declineBtn = document.querySelector('[data-btn="decline"]')
const otherTextBox = document.querySelector('[data-input="other-text"]')
const radioBtns = document.querySelectorAll('[name="reason"]')
let recieverUserProfile 
let userIsLoggedIn

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
}


function getMsgId()  {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const id = url.searchParams.get("id");
    console.log(id);
    return id
}

function getSenderType()  {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const typeSender = url.searchParams.get("t");
    
    console.log(typeSender);
    return typeSender
}


declineBtn.addEventListener('click', declineIntroduction)

function declineIntroduction() {
    const feedbackMessage = document.querySelector('[data-message="message"]').value
    if(!feedbackMessage) return console.log('pick an option') // aADDD to this
    const msgID = getMsgId()
    const senderType = getSenderType()
    const typeOfSender = senderType === 's' ?  {"Feedback from Sender": feedbackMessage} : {"Feedback from Reciever": feedbackMessage}
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "put",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify([{
            "id": msgID,
            "fields": typeOfSender 
        }])
    };
    console.log(requestOptions)
    fetch(API + "Introductions", requestOptions)
        .then(response => response.text())
        // .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

MemberStack.onReady.then( async function(member) {
    if (member.loggedIn) {
        userIsLoggedIn = true
        recieverUserProfile = await fetchData(getRecieverUserId())
        
    } else {
        userIsLoggedIn = false
    }
    
}).then(() => {
    initMessage(recieverUserProfile)
    const userRecievingFeedback = document.querySelector('[data-name="username"]')
    userRecievingFeedback.textContent = recieverUserProfile.fields['Full Name']
    declineBox.style.display = 'block'
})

function getRecieverUserId()  {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const id = url.searchParams.get("user");
    // console.log(id);
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
    
}

function sendQuickFeedback() {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const feedbackOption = url.searchParams.get("f");
    console.log(feedbackOption);
    const msgID = getMsgId()
    const senderType = getSenderType()
    const typeOfSender = senderType === 's' ?  {"Feedback Sender": feedbackOption} : {"Feedback Receiver": feedbackOption}
    console.log(typeOfSender)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "put",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify([{
            "id": msgID,
            // "fields": {"Feedback Sender": ['Great']}
            "fields": typeOfSender
        }])
    };
    console.log(requestOptions)

    fetch(API + "Introductions", requestOptions)
        .then(response => response.text())
        // .then(result => console.log(result))
        .catch(error => console.log('error', error));
    

}