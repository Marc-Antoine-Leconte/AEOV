function onJoinInstanceButtonClick() {
    console.log (this);
    const confirmed = confirm(`Do you want to join instance: ${this.value}?`);
    
    if (confirmed) {
        console.log('Joining instance ', this.value)
        joinInstance(this.id)
    }
}

function onCreateInstanceButtonClick() {
    alert('Create Instance button clicked!');
    const instanceNameInput = document.getElementById("new-instance-name");
    const instanceName = instanceNameInput.value || "Une super partie !";
    createInstance(instanceName, "pvp");
}

function DisplayInstanceList() {
    fetchAllInstancesFromAPI().then((data) => {
        const instanceList = document.getElementById("instance-list");
        instanceList.innerHTML = ""; // Clear existing content

        console.log("#DisplayInstanceList - data =>", data);

        const instanceErrorComp = document.getElementById("instance-list-error");
        if (data.error || data.message) {
            instanceErrorComp.innerHTML = "Une erreur est survenue lors de la récupération des instances : <b>" + data.message + "</b>";
            instanceErrorComp.hidden = false;
            return
        } else {
            instanceErrorComp.hidden = true;
        }

        const instanceEmptyComp = document.getElementById("instance-list-empty-message");
        if (data.length == 0 || !data) {
            instanceEmptyComp.hidden = false;
            return;
        } else {
            instanceEmptyComp.hidden = true;
        }

        data.forEach((instance) => {
            const listItem = document.createElement("li");
            const button = document.createElement("button");
            button.type = "button";
            button.className = "select-instance-button";
            button.id = instance.id;
            button.value = instance.name;
            button.textContent = instance.name;
            button.addEventListener('click', onJoinInstanceButtonClick);

            listItem.appendChild(button);
            instanceList.appendChild(listItem);
        });
    });
}

function InitCreateInstanceButton() {
    const createInstanceBtn = document.getElementById("create-instance-button");
    createInstanceBtn.addEventListener('click', onCreateInstanceButtonClick);
}

DisplayInstanceList();
InitCreateInstanceButton();