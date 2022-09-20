
const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName=Introductions"
const acceptBtn = document.querySelector('[data-btn="accept"]')


function getMsgId()  {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const id = url.searchParams.get("id");
    console.log(id);
    return id
}

acceptBtn.addEventListener('click', declineIntroduction)

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

    fetch(API, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}