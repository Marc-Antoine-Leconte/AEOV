const container = document.querySelector('.game-container')
const img = document.querySelector('.game-map')
const plusButton = document.querySelector('#zoom-in-button')
const minusButton = document.querySelector('#zoom-out-button')

function onChangeZoomButtonClick(zoomChange) {
    img.style.transformOrigin = `top left`

    let zoom = currentInstance.screen.zoom;
    zoom += zoomChange
    zoom = Math.min(Math.max(1, zoom), 5)

    if (zoom == 1) {
        img.style.left = '0px'
        img.style.top = '0px'
    }

    img.style.transform = `scale(${zoom})`
    currentInstance.screen.zoom = zoom;
    checkSize();
};

plusButton.addEventListener('click', () => onChangeZoomButtonClick(1));
minusButton.addEventListener('click', () => onChangeZoomButtonClick(-1));

let clicked = false
let xAxis;
let x;
let yAxis;
let y;

container.addEventListener('mouseup', () => {
    if (currentInstance.screen.layout != null) {
        return;
    }

    clicked = false;
    container.style.cursor = 'auto'
})

container.addEventListener('mousedown', e => {
    if (currentInstance.screen.layout != null) {
        return;
    }

    e.preventDefault()
    clicked = true;
    
    xAxis = e.offsetX - parseInt(img.style.left) || 0;
    yAxis = e.offsetY - parseInt(img.style.top) || 0;

    container.style.cursor = 'grabbing'
})

window.addEventListener('mouseup', () => {
    if (currentInstance.screen.layout != null) {
        return;
    }

    clicked = false;    
    checkSize();
})

container.addEventListener('mousemove', e => {
    if (currentInstance.screen.layout != null || !clicked) {
        return
    }
    e.preventDefault()

    x = e.offsetX 
    y = e.offsetY

    img.style.left = `${x - xAxis}px`
    img.style.top = `${y - yAxis}px`
})

function checkSize () {
    if (currentInstance.screen.layout != null) {
        return;
    }

    let containerOut = container.getBoundingClientRect()
    let imgIn = img.getBoundingClientRect()

    let currentX = parseInt(img.style.left) || 0;
    let currentY = parseInt(img.style.top) || 0;

    const maxX = (Math.round(imgIn.width) - Math.round(containerOut.width)) * -1;
    const maxY = (Math.round(imgIn.height) - Math.round(containerOut.height)) * -1;
    const minX = 0;
    const minY = 0;

    if (currentX < maxX) {
        currentX = maxX
    } else if(currentX > minX) {
        currentX = minX
    }

    if (currentY < maxY) {
        currentY = maxY
    } else if (currentY > minY) {   
        currentY = minY
    }

    img.style.left = `${currentX}px`
    img.style.top = `${currentY}px`
}