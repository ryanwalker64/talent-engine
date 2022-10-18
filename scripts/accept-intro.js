
const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="
const acceptBtn = document.querySelector('[data-btn="accept"]')
const recieverProfileContainer = document.querySelector('[data-user="receiver"]')

const container = document.querySelector('[data-container="container"]')
const acceptMsgContainer = document.querySelector('[data-container="acceptmsg"]')
const loader = document.querySelector('[data-loader="loading"]')


let recieverUserProfile
let senderUserProfile
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

acceptBtn.addEventListener('click', () => {
    acceptIntroduction()
    acceptMsgContainer.style.display = 'none'
    loader.style.display = 'flex'
})

function acceptIntroduction() {
    const msgID = getMsgId()

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "put",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify([{
            "id": msgID,
            "fields":{
                "Status":"ACCEPTED",
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
    if (member.loggedIn) {
        userIsLoggedIn = true
        recieverUserProfile = await fetchData(getRecieverUserId())
        
    } else {
        userIsLoggedIn = false
    }
    
}).then(() => {
    initMessage(recieverUserProfile)
    acceptBtn.classList.remove('hidden') 
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

   return fetch(API + "Users&fields=Full%20Name,Job%20Title,Candidate%20Employer,Employer,Name+(from+Employer),Profile%20Picture&id=" + id, requestOptions)
    .then(response => response.json())
    
}


function setSuccessMessageScreen() {
    container.innerHTML = `
        <div class="userprofile-container middeligned">
                <div class="text-block-89">Introduction accepted!</div>
                <div class="divider-v2 _100"></div>
                <div class="text-block-88">What happens now?</div>
                <div class="div-block-102">
                    <h1 class="emojishome">📩</h1>
                    <div class="text-block-87">In the next 5-10 minutes we will connect you both together via your email addresses. </div>
                </div>
                <div class="div-block-102">
                    <h1 class="emojishome">👋</h1>
                    <div class="text-block-87">We’ll check in after 14 days to see how the conversation is progressing.</div>
                </div>
                <a href="/app/company-directory" class="button-7 w-button">Return to the Talent Engine</a></div>`
 
}