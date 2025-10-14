function onJoinInstanceButtonClick() {
    console.log (this);
    const confirmed = confirm(`Do you want to join instance: ${this.value}?`);
    
    if (confirmed) {
        console.log('Joining instance ', this.value)
        console.log('joinging instance id ', this.id)
        joinInstance(this.id)
    }
}

async function onCreateInstanceButtonClick() {
    const instanceCreationErrorMessage = document.getElementById("instance-creation-error-message");
    instanceCreationErrorMessage.hidden = true;
    
    alert('Create Instance button clicked!');
    const instanceNameInput = document.getElementById("new-instance-name");
    const instanceName = instanceNameInput.value || "Une super partie !";
    
    createInstance(instanceName, "pvp").then((createdInstance) => { 
        if (createdInstance.message) {
            console.log('# Error creating instance:', createdInstance.message);
            instanceCreationErrorMessage.innerHTML = "Une erreur est survenue lors de la création de l'instance : <b>" + createdInstance.message + "</b>";
            instanceCreationErrorMessage.hidden = false;
            return
        }

        goToGameBoard(createdInstance.id, createdInstance.name);
    });
    
}

function DisplayInstanceList() {
    fetchAllInstancesFromAPI().then((data) => {
        const instanceList = document.getElementById("instance-list");
        if (!instanceList) {
            return;
        }
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

function DisplayPlayerInstanceList() {
    const playerId = getCookie("currentPlayerId");

    fetchPlayerInstancesFromAPI(playerId).then((data) => {
        const instanceList = document.getElementById("player-instance-list");
        if (!instanceList) {
            return;
        }
        instanceList.innerHTML = ""; // Clear existing content

        console.log("#DisplayPlayerInstanceList - data =>", data);

        const instanceErrorComp = document.getElementById("player-instance-list-error");
        if (data.error || data.message) {
            instanceErrorComp.innerHTML = "Une erreur est survenue lors de la récupération des instances : <b>" + data.message + "</b>";
            instanceErrorComp.hidden = false;
            return
        } else {
            instanceErrorComp.hidden = true;
        }

        const instanceEmptyComp = document.getElementById("player-instance-list-empty-message");
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
            button.className = "select-player-instance-button";
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
    if (!createInstanceBtn) {
        return;
    }
    createInstanceBtn.addEventListener('click', onCreateInstanceButtonClick);
}

DisplayInstanceList();
DisplayPlayerInstanceList();
InitCreateInstanceButton();
setDisconnectButtonListener();
DisplayUserInfo();

