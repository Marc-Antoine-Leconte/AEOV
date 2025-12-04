function onGoToSubscribePageButtonClick() {
    redirectToUrl("/subscribe");
}

function onGoToConnectionPageButtonClick() {
    redirectToUrl("/connection");
}

function hideHeader() {
    const headerComp = document.getElementById("navigation-bar");
    if (headerComp) {
        headerComp.style.display = "none";
    }
}

function InitIndexPage() {
    const currentId = getCookie("currentPlayerId");
    if (currentId && currentId != "" && !isNaN(currentId)) {
        console.log('Player is already connected, redirecting to home page...');
        redirectToUrl("/home");
        return;
    }

    hideHeader();
    console.log('Player is not connected, staying on menu page...');

    const connectionBtn = document.getElementById("go-to-connection-page-button");
    console.log('# connectionBtn =>', connectionBtn);
    connectionBtn.addEventListener('click', onGoToConnectionPageButtonClick);

    const subscribeBtn = document.getElementById("go-to-subscribe-page-button");
    subscribeBtn.addEventListener('click', onGoToSubscribePageButtonClick);
}

InitIndexPage();