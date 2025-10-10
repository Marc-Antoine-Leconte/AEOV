function setConnectionErrorMessage(message) {
    const errorMessageComp = document.getElementById("player-connect-error-message");
    if (!errorMessageComp) {
        console.log('# Missing errorMessageComp');
        return;
    }
    errorMessageComp.innerHTML = message;
    errorMessageComp.hidden = false;
}

function onConnectionButtonClick() {
    console.log('Connection button clicked');
    const userNameInput = document.getElementById("player-name-input");
    const userPwdInput = document.getElementById("password-name-input");

    if (!userNameInput || userNameInput.value == "") {
        console.log('# Missing userNameInput');
        setConnectionErrorMessage("Vous devez renseigner un nom d'utilisateur");
        return;
    }
    if (!userPwdInput || userPwdInput.value == "") {
        console.log('# Missing userPwdInput');
        setConnectionErrorMessage("Vous devez renseigner un mot de passe");
        return;
    }

    authenticatePlayer(userNameInput.value, userPwdInput.value).then((data) => {
        if (data && !data.error && data.id) {
            alert("Connexion en tant que : " + data.name);
            setCookie("currentPlayerName", data.name, 1);
            setCookie("currentPlayerId", data.id, 1);
            redirectToUrl("/home");
            return
        } else {
            const errorMessage = "Nous ne parvenons pas à trouver cet utilisateur";
            setConnectionErrorMessage(errorMessage);
            return
        }
    });
}

function InitConnectionPage() {
    const currentId = getCookie("currentPlayerId");
    if (currentId && currentId != "" && !isNaN(currentId)) {
        console.log('Player is already connected, redirecting to home page...');
        redirectToUrl("/home");
        return;
    }
    console.log('Player is not connected, staying on connection page...');
    
    setGoBackToMenuButtonListener();

    const connectionBtn = document.getElementById("connect-user-button");
    connectionBtn.addEventListener('click', onConnectionButtonClick);
}

InitConnectionPage();