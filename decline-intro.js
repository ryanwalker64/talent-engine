
const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName=Introductions"
const declineBtn = document.querySelector('[data-btn="decline"]')
const otherTextBox = document.querySelector('[data-input="other-text"]')
const radioBtns = document.querySelectorAll('[name="reason"]')

radioBtns.forEach(btn => {
    btn.addEventListener('change', (e) => {
        const value = e.target.value

        if (value === "Other") {
            otherTextBox.classList.remove('hidden')
        } else {
            otherTextBox.classList.add('hidden')
        }
    })
})


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

declineBtn.addEventListener('click', declineIntroduction)

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

    fetch(API, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}