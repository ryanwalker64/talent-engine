
const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="
const directory = document.querySelector('')


directory.addEventListener('click', handleLike)

function handleLike(e) {
    console.log(e.target);
}



let recieverUserProfile
let senderUserProfile
let userIsLoggedIn


function declineIntroduction() {
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
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}


MemberStack.onReady.then(async function(member) {
    if (member.loggedIn) {
        userIsLoggedIn = true
        recieverUserProfile
        
    } else {
        userIsLoggedIn = false
    }
    
}).then(() => {
    
})

