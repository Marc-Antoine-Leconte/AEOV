function setSubscribeErrorMessage(message) {
    const errorMessageComp = document.getElementById("player-subscribe-error-message");
    if (!errorMessageComp) {
        console.log('# Missing errorMessageComp');
        return;
    }
    errorMessageComp.innerHTML = message;
    errorMessageComp.hidden = false;
}

function onSubscribeButtonClick() {
    console.log('Subscribe button clicked');
    const userNameInput = document.getElementById("player-name-input");
    const userPwdInput = document.getElementById("password-name-input");

    if (!userNameInput || userNameInput.value == "") {
        console.log('# Missing userNameInput');
        setSubscribeErrorMessage("Vous devez renseigner un nom d'utilisateur");
        return;
    }
    if (!userPwdInput || userPwdInput.value == "") {
        console.log('# Missing userPwdInput');
        setSubscribeErrorMessage("Vous devez renseigner un mot de passe");
        return;
    }
    if (userNameInput.value.length < 5) {
        console.log('# Bad userNameInput length');
        setSubscribeErrorMessage("Votre nom doit contenir au moins 5 caractères");
        return;
    }
    if (userPwdInput.value.length < 8) {
        console.log('# Bad userPwdInput length');
        setSubscribeErrorMessage("Votre mot de passe doit contenir au moins 8 caractères");
        return;
    }

    subscribePlayer(userNameInput.value, userPwdInput.value).then((data) => {
        if (data && !data.errors && !data.error && data.id) {
            setCookie("currentPlayerName", data.name, 1);
            setCookie("currentPlayerId", data.id, 1);
            redirectToUrl("/home");
            return
        } else {
            const { error, errors, message} = data;
            
            var errorString = message
            if (errors)
                errorString = errors[0];
            else if (error)
                errorString = error;

            const errorMessage = "Une erreur est survenue lors de l'inscription : " + errorString;
            setSubscribeErrorMessage(errorMessage);
            return
        }
    });
}

function hideHeader() {
    const headerComp = document.getElementById("navigation-bar");
    if (headerComp) {
        headerComp.style.display = "none";
    }
}

function InitSubscribePage() {
    const currentId = getCookie("currentPlayerId");
    if (currentId && currentId != "" && !isNaN(currentId)) {
        console.log('Player is already connected, redirecting to home page...');
        redirectToUrl("/home");
        return;
    }
    console.log('Player is not connected, staying on subscribe page...');
    
    hideHeader();

    setGoBackToMenuButtonListener();

    const subscribeBtn = document.getElementById("subscribe-user-button");
    subscribeBtn.addEventListener('click', onSubscribeButtonClick);
}

InitSubscribePage();