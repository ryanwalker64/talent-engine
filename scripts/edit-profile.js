


function setEditProfileForm(userData) {
    // Basic Information Fields
    const fNameInput = document.querySelector('[data-name="first-name"]').value = userData.fields["First Name"]
    const lNameInput = document.querySelector('[data-name="last-name"]').value = userData.fields["Last Name"]
    const emailInput = document.querySelector('[data-name="last-name"]').value = userData.fields["Last Name"]
    const linkedinInput = document.querySelector('[data-name="linkedin"]').value = userData.fields["Linkedin"]
    const profilePicInput = document.querySelector('[data-name="profile-pic"]').value = userData.fields["Profile Picture"]
    const LocatedInput = locatedSelector.setValue(userData.fields["Location"])
    const bioInput = document.querySelector('[data-name="bio"]').value = userData.fields["Bio"]

    // Work Experience Fields
    const currentRoleInput = roleSelector.setValue(userData.fields["What do you do?"])
    const workExperienceInput = document.querySelector('[data-name="work-experience"]').value = userData.fields["Work Experience"]
    const firstJobInput = firstJobInput.value = userData.fields["first-job"]
    const currentEmployerInput = []
    const jobTitleInput = document.querySelector('[data-name="job-title"]').value = userData.fields["Job Title"]
    const currentEmploymentStartMonthInput = startDateMonthSelector.setValue(userData.fields["Employment Start Date"].split(' ')[0])
    const currentEmploymentStartYearInput = startDateYearSelector.setValue(userData.fields["Employment Start Date"].split(' ')[1])
    const currentEmploymentEndMonthInput = endDateMonthSelector.setValue(userData.fields["Employment End Date"].split(' ')[0])
    const currentEmploymentEndYearInput = endDateYearSelector.setValue(userData.fields["Employment End Date"].split(' ')[1])
    const currentlyWorkingAtEmployerInput = currentlyWorkInput.value = userData.fields["Currently work at employer?"]

    // Job Preferences Fields
    const stageOfJobHuntInput = document.querySelector('[data-name="job-hunt"]').value = userData.fields["Stage of Job Hunt"]
    const prefRemoteWorkInput = document.querySelector('[data-name="remote-work"]').value = userData.fields["Job Pref: Open to remote work"]
    const prefLocationsInput = workingLocationSelector.setValue(userData.fields["Job Pref: Working Locations"])
    const prefRolesInput= interestedRolesSelector.setValue(userData.fields["Job Pref: Relevant roles"])
    const prefTypeOfWorkInput = typeOfJobSelector.setValue(userData.fields["Job Pref: Type of role"])
    const prefCompanySize = companySizeSelector.setValue(userData.fields["Job Pref: Company size"])
    const prefRoleBioInput = document.querySelector('[data-name="next-role"]').value = userData.fields["Next Role"]
    const prefIndustriesInput = industriesSelector.setValue(userData.fields["Job Pref: Industries"])
    const profileVisibilityInput = document.querySelector('[data-name="visibility"]').value = userData.fields["Profile Visibility"]
}