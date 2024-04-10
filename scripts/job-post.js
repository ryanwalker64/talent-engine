const API = "https://v1.nocodeapi.com/startmate/airtable/fVDPLsNPEAUNPlBG?tableName="
// const FIELDS = "?fields%5B%5D=Job+Pref%3A+Working+Locations&fields%5B%5D=Job+Pref%3A+Open+to+remote+work&fields%5B%5D=experience-stage&fields%5B%5D=Job+Pref%3A+Relevant+roles&fields%5B%5D=Job+Pref%3A+Type+of+role&fields%5B%5D=Job+Pref%3A+Industries&fields%5B%5D=Startmate+Program"
const JSDELIVR = 'https://cdn.jsdelivr.net/gh/ryanwalker64/talent-engine@v1.3.9.4/'

let loggedInUser

function extractIdFromUrl(url) {
    // Assuming the ID is always in the same position after a specific pattern ('/job/')
    const parts = url.split('/job/');
    if (parts.length > 1) {
      return parts[1];
    } else {
      return null; // Handle cases where the URL doesn't contain '/job/'
    }
  }

function getJobClicks() {

    const uniqueId = extractIdFromUrl(window.location.href);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    };

    fetch(API + "Jobs&id=" + uniqueId + '&cacheTime=0', requestOptions)
        .then(response => response.json())
        .then(result => {
            const newClicks = result.fields["Page Loads"] + 1
            console.log(newClicks)
            updateJobClicks(uniqueId, newClicks)
        })
        .catch(error => console.log('error', error));
}

function updateJobClicks(jobID, clicks) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "put",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify([{"id": jobID,"fields":{"Page Loads": clicks}}])
    };

    fetch(API + "Jobs", requestOptions)
    .then(response => response.text())
    // .then(result => console.log(result))
    .catch(error => console.log('error', error));
}


function appBtnClicks() {
    const uniqueId = extractIdFromUrl(window.location.href);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
    };

    fetch(API + "Jobs&id=" + uniqueId + '&cacheTime=0', requestOptions)
        .then(response => response.json())
        .then(result => {
            const newClicks = result.fields["Application Button Clicks"] + 1``
            const appBtnClickUsers = result.fields["Users who clicked"]
            console.log(newClicks)
            updateAppBtnClicks(uniqueId, newClicks, appBtnClickUsers)
        })
        .catch(error => console.log('error', error));
}

function updateAppBtnClicks(jobID, clicks, appBtnClickers) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "put",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify([{"id": jobID,"fields":{
            "Application Button Clicks": clicks,
            "Users who clicked":  appBtnClickers 
            ? appBtnClickers.find(rec => rec === loggedInUser)
                ? [...appBtnClickers]
                : loggedInUser 
                    ? [...appBtnClickers, loggedInUser] 
                    : [...appBtnClickers]
            : loggedInUser 
                ? [loggedInUser]
                : []
        }}])
    };

    fetch(API + "Jobs", requestOptions)
    .then(response => response.text())
    // .then(result => console.log(result))
    .catch(error => console.log('error', error));
}


window.addEventListener('load', function() {
    getJobClicks() // track the page load
    const appBtnLinks = document.querySelectorAll('[data-app-btn-link]')
    appBtnLinks.forEach(btn => btn.addEventListener('click', appBtnClicks))
  });
  


  MemberStack.onReady.then(function(member) {
    if (member.loggedIn) {
        loggedInUser = member['airtable-id-two']
    
        
    }  else {
        const userblock = document.querySelector('#userblock')
        userblock.remove()
    }
})