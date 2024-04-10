const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="

let recieverUserProfile
let senderUserProfile
let userIsLoggedIn
let senderUserId

const container = document.querySelector('[data-container="container"]')
const sendMsgContainer = document.querySelector('[data-container="sendmsg"]')
const loader = document.querySelector('[data-loader="loading"]')
// Write Message Tab
const recieverProfileContainer = document.querySelector('[data-user="receiver"]')
const messageTab = document.querySelector('.message-hide')
const previewBtn = document.querySelector('[data-btn="preview"]')
const messageTextBox = document.querySelector('[data-message="message"]')
// const msgContainer = document.querySelector('.message-input-container')

// Preview Message Tab
const previewTab = document.querySelector('[data-tab="preview"]')
const previewedMessage = document.querySelector('[data-message="preview"]')
// const previewContainer = document.querySelector('.preview-message')
const editBtn = document.querySelector('[data-btn="edit"]')
const sendBtn = document.querySelector('[data-btn="send"]')

previewBtn.addEventListener('click', () => {
    const errMsg = document.querySelector('.errormsg')
    if(messageTextBox.value === '') {
        errMsg.style.display = 'block'
        return
    } else {
        errMsg.style.display = 'none'
    }

    previewMsg(messageTextBox.value)
    messageTab.style.display = 'none'
    previewTab.style.display = 'block'
})

editBtn.addEventListener('click', () => {
    messageTab.style.display = 'block'
    previewTab.style.display = 'none'
})

sendBtn.addEventListener('click', () => {
    handleMessage()
    sendMsgContainer.style.display = 'none'
    loader.style.display = 'flex'
})

function setSuccessMessageScreen() {
    const firstName = recieverUserProfile.fields['Full Name'].split(' ')[0]
    container.innerHTML = `
        <div class="userprofile-container middeligned">
            <img src="${recieverUserProfile.fields['Profile Picture'] ? recieverUserProfile.fields['Profile Picture'] : ''}" loading="lazy" alt="" class="img placeholder">
                <div class="text-block-89">Message sent to ${firstName}!</div>
                <div class="divider-v2 _100"></div>
                <div class="text-block-88">What happens now?</div>
                <div class="div-block-102">
                    <h1 class="emojishome">📩</h1>
                    <div class="text-block-87">If ${firstName} wishes to accept the message we will connect you both together via email.</div>
                </div>
                <div class="div-block-102">
                    <h1 class="emojishome">👋</h1>
                    <div class="text-block-87">We’ll check in after 14 days to see how the conversation is progressing.</div>
                </div>
                <a href="/app/talent-directory" class="button-7 w-button">Return to the Talent Network</a></div>`
 
}

MemberStack.onReady.then( async function(member) {
    if (member.loggedIn) {
        userIsLoggedIn = true
        const receiverUserId =  getRecieverUserId()
        senderUserId = member["airtable-id-two"]
        fetchData(getRecieverUserId(), 'reciever')
        
    } else {
        userIsLoggedIn = false
    }
    
})

function getRecieverUserId()  {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const id = url.searchParams.get("user");
    // console.log(id);
    return id
}

function fetchData(id, type) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    
    };

   return fetch(API + "Users&fields=Full%20Name,Job%20Title,Candidate%20Employer,Employer,Name+(from+Employer),Profile%20Picture&id=" + id, requestOptions)
    .then(response => response.json())
    .then(result => {
        if(type === "reciever") {
            recieverUserProfile = result
            fetchData(senderUserId, 'sender')
        } else if (type === "sender") {
            senderUserProfile = result
            initMessage(recieverUserProfile)
            messageTab.style.display = 'block'
        }
    })
    
}

function handleMessage() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "post",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify([{
                "Status":"REQUESTED",
                "Message": messageTextBox.value,
                "Sender": [senderUserProfile.id],
                "Receiver": [recieverUserProfile.id],
        }])
    };

    fetch(API + 'Introductions', requestOptions)
        .then(response => response.text())
        .then(result => {
            // console.log(result)
            loader.style.display = 'none'
            setSuccessMessageScreen()
        })
        .catch(error => console.log('error', error));
}

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
                    <div class="candidate-short-details">${reciever.fields['Job Title']} @ ${reciever.fields['Candidate Employer'] ? reciever.fields['Candidate Employer'] : reciever.fields['Name (from Employer)']  }</div>
                </div>
            </div>
        </div>`

    recieverProfileContainer.innerHTML = html


}

function previewMsg(msg) {
    const messageHtml = `
            <label for="email" class="label-v2">Preview message to ${recieverUserProfile.fields['Full Name']}</label>
            <div data-message="preview" class="div-block-79">
                <label for="email" class="label-v2">Subject</label>
                <div class="text-block-74">${senderUserProfile.fields['Full Name']} would like to connect via the Talent Engine</div>
                <div class="divider"></div>
                <div class="text-block-73 above">
                    Hi ${recieverUserProfile.fields['Full Name']},
                    <br>‍
                    <br>
                    ${senderUserProfile.fields['Full Name']} would like to connect with you.
                    <br>
                    <br>
                    <strong>Their message:</strong>
                    <br>
                    </div>
                <div class="text-block-73 message-preview">
                    ${msg}
                </div>
                <div class="div-block-81">
                    <div data-user="sender" class="div-block-80">
                        <img src="${senderUserProfile.fields["Profile Picture"]}-/quality/lightest/" loading="lazy" sizes="40px" alt="" class="img sml">
                        <div class="candidate-info sender">
                            <div class="text-block-75">${senderUserProfile.fields['Full Name']}</div>
                            <div class="candidate-details-container">
                                <div class="candidate-short-details">${senderUserProfile.fields['Job Title']} @ ${senderUserProfile.fields['Name (from Employer)']}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="div-block-88">
                    <a href="#" class="button-5 w-button">Reply to ${recieverUserProfile.fields['Full Name']}</a>
                    <a href="#">No thanks</a>
                    <div class="div-block-89"></div>
                </div>
                <div class="text-block-73">
                        Sent via the <a href="#">Startmate Talent Engine</a>
                </div>
                </div>
            </div>`

            previewedMessage.innerHTML = messageHtml
}