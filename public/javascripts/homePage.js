var selectedInstance = null;

function onSelectInstanceButtonClick(instance) {
    if (selectedInstance) {
        const oldPlayerSelectedInstance = document.getElementById("player-list-instance-"+selectedInstance);
        if (oldPlayerSelectedInstance) {
            oldPlayerSelectedInstance.classList.remove("selected-instance");
        }
        const oldSelectedInstance = document.getElementById("list-instance-"+selectedInstance);
        if (oldSelectedInstance) {
            oldSelectedInstance.classList.remove("selected-instance");
        }
    }

    if (selectedInstance === instance) {
        selectedInstance = null;
        const joinInstanceBtn = document.getElementById("join-selected-instance-button");
        joinInstanceBtn.disabled = true;
        return;
    }

    selectedInstance = instance;
    const newPlayerSelectedInstance = document.getElementById("player-list-instance-"+selectedInstance);
    if (newPlayerSelectedInstance) {
        newPlayerSelectedInstance.classList.add("selected-instance");
    }

    const newSelectedInstance = document.getElementById("list-instance-"+selectedInstance);
    if (newSelectedInstance) {
        newSelectedInstance.classList.add("selected-instance");
    }

    const joinInstanceBtn = document.getElementById("join-selected-instance-button");
    if (joinInstanceBtn) {
        joinInstanceBtn.disabled = false;
    }
}

function onJoinInstanceButtonClick() {
    console.log('joining instance id ', selectedInstance)
    joinInstance(selectedInstance);
}

async function onDeleteInstanceButtonClick(selectedInstance) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette instance ? Cette action est irréversible.")) {
        return;
    }

    console.log('deleting instance id ', selectedInstance)
    deleteInstance(selectedInstance, () => {
        DisplayInstanceList();
        DisplayPlayerInstanceList();
    });
}

async function onCreateInstanceButtonClick() {
    const instanceCreationErrorMessage = document.getElementById("instance-creation-error-message");
    instanceCreationErrorMessage.hidden = true;
    
    const instanceNameInput = document.getElementById("new-instance-name");
    const instanceName = instanceNameInput.value;

    if (!instanceName || instanceName.trim() == "") {
        console.log('# Invalid instance name');
        instanceCreationErrorMessage.innerHTML = "Le nom de l'instance ne peut pas être vide.";
        instanceCreationErrorMessage.hidden = false;
        return;
    }
    
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
            const listItem = document.createElement("div");
            listItem.className = "instance-list-item";

            const button = document.createElement("button");
            button.type = "button";
            button.className = "select-instance-button";
            button.id = "list-instance-"+instance.id;
            button.value = instance.name;
            button.textContent = instance.name + "#" + instance.id;
            button.addEventListener('click', () => onSelectInstanceButtonClick(instance.id));

            const optionsContainer = document.createElement("div");
            optionsContainer.className = "instance-options-container";

            if (instance.isOwnedByPlayer) {
                const deleteButton = document.createElement("img");
                deleteButton.type = "button";
                deleteButton.className = "delete-instance-button";
                deleteButton.id = "delete-instance-"+instance.id;
                deleteButton.src = "/images/icons/trash.png";
                deleteButton.alt = "Supprimer";
                deleteButton.addEventListener('click', () => onDeleteInstanceButtonClick(instance.id));
                optionsContainer.appendChild(deleteButton);
            }

            listItem.appendChild(button);
            listItem.appendChild(optionsContainer);
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
            const listItem = document.createElement("div");
            listItem.className = "instance-list-item";

            const button = document.createElement("button");
            button.type = "button";
            button.className = "select-player-instance-button select-instance-button";
            button.id = "player-list-instance-"+instance.id;
            button.value = instance.name;
            button.textContent = instance.name + "#" + instance.id;
            button.addEventListener('click', () => onSelectInstanceButtonClick(instance.id));

            const optionsContainer = document.createElement("div");
            optionsContainer.className = "instance-options-container";

            if (instance.isOwnedByPlayer) {
                const deleteButton = document.createElement("img");
                deleteButton.type = "button";
                deleteButton.className = "delete-instance-button";
                deleteButton.id = "delete-instance-"+instance.id;
                deleteButton.src = "/images/icons/trash.png";
                deleteButton.alt = "Supprimer";
                deleteButton.addEventListener('click', () => onDeleteInstanceButtonClick(instance.id));
                optionsContainer.appendChild(deleteButton);
            }

            listItem.appendChild(button);
            listItem.appendChild(optionsContainer);
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

function InitJoinInstanceButton() {
    const joinInstanceBtn = document.getElementById("join-selected-instance-button");
    if (!joinInstanceBtn) {
        return;
    }
    joinInstanceBtn.disabled = true;
    joinInstanceBtn.addEventListener('click', onJoinInstanceButtonClick);
}

DisplayInstanceList();
DisplayPlayerInstanceList();
InitCreateInstanceButton();
InitJoinInstanceButton();
setDisconnectButtonListener();
DisplayUserInfo();

