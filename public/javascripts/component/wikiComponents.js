//
// Drawing a wiki header
//
function DrawWikiHeaderComponent(params) {
    const { baseClassName, parentId, title, imgSrc, imgAlt } = params;

    // Parent component
    const parentComponent = document.getElementById(parentId);

    // HEADER CONTAINER
    const headerComponent = document.createElement("div");
    headerComponent.className = baseClassName  + " wiki-item-header";
    headerComponent.id = parentId + "-header";
    headerComponent.title = title;

    // Image
    const headerComponentImg = document.createElement("img");
    headerComponentImg.src = imgSrc;
    headerComponentImg.alt = imgAlt;
    headerComponentImg.className = baseClassName + "-image" + " wiki-item-header-img";
    headerComponent.appendChild(headerComponentImg);

    // Title
    const headerComponentTitle = document.createElement("span");
    headerComponentTitle.className = "wiki-item-header-title";
    headerComponentTitle.innerHTML = title;
    headerComponent.appendChild(headerComponentTitle);

    // Toggle Image
    const headerComponentToggleImg = document.createElement("img");
    headerComponentToggleImg.className = baseClassName + "-toggle" + " wiki-item-header-toggle";
    headerComponentToggleImg.src = "/images/icons/down-arrow.png";
    headerComponent.appendChild(headerComponentToggleImg);

    // Toggle functionality
    headerComponent.addEventListener('click', () => {
        if (parentComponent.classList.contains("collapsed")) {
            parentComponent.classList.remove("collapsed");
            headerComponentToggleImg.src = "/images/icons/up-arrow.png";
        } else {
            parentComponent.classList.add("collapsed");
            headerComponentToggleImg.src = "/images/icons/down-arrow.png";
        }
    });

    parentComponent.appendChild(headerComponent);
}

//
// Drawing a wiki body for a building
//
function DrawWikiBuildingBodyComponent(params) {
    const { baseClassName, parentId, building } = params;

    // Parent component
    const parentComponent = document.getElementById(parentId);

    // BODY CONTAINER
    const bodyComponent = document.createElement("div");
    bodyComponent.className = baseClassName + " wiki-item-body";
    bodyComponent.id = parentId + "-body";

    // Description Container
    const descriptionComponent = document.createElement("div");
    descriptionComponent.className = baseClassName + "-description";

    var html = "";
    html += "<h4 class='wiki-item-description-title'>Niveau Max : </h4> " + building.maxLevel + "<br/>";
    html += "<h4 class='wiki-item-description-title'>Constructible : </h4>" + (!!building.constructible ? "Oui" : "Non") + "<br/>";
    html += "<h4 class='wiki-item-description-title'>Description:</h4>" + building.description;

    descriptionComponent.innerHTML = html;
    bodyComponent.appendChild(descriptionComponent);

    // Effects Container
    const effectsComponent = document.createElement("div");
    effectsComponent.className = baseClassName + "-effects";
    effectsComponent.innerHTML = "<h4 class='wiki-item-description-title'>Effet de fin de tour :</h4><ul class='wiki-item-description-list'>" + Object.entries(building.effects).map(([key, effect]) => {
        return `<li class="${baseClassName}-effect"><img src="/images/resources/${key.toLowerCase()}.png" title="${key}" /> x ${effect}</li>`;
    }).join("") + "</ul>";
    bodyComponent.appendChild(effectsComponent);

    // Costs Container
    const costsComponent = document.createElement("div");
    costsComponent.className = baseClassName + "-costs";
    costsComponent.innerHTML = "<h4 class='wiki-item-description-title'>Coût de construction :</h4><ul class='wiki-item-description-list'>" + Object.entries(building.cost).map(([key, cost]) => {
        return `<li class="${baseClassName}-cost">${cost} : <img src="/images/resources/${key.toLowerCase()}.png" title="${key}" /></li>`;
    }).join("") + "</ul>";
    bodyComponent.appendChild(costsComponent);

    // Upgrade costs
    const upgradeCostsComponent = document.createElement("div");
    upgradeCostsComponent.className = baseClassName + "-upgrade-costs";
    upgradeCostsComponent.innerHTML = "<h4 class='wiki-item-description-title'>Coût d'amélioration :</h4><ul class='wiki-item-description-list'>" + Object.entries(building.upgradeCost).map(([key, cost]) => {
        return `<li class="${baseClassName}-upgrade-cost">${cost} : <img src="/images/resources/${key.toLowerCase()}.png" title="${key}" /></li>`;
    }).join("") + "</ul>";
    bodyComponent.appendChild(upgradeCostsComponent);

    parentComponent.appendChild(bodyComponent);
}

//
// Drawing a wiki item for a building
//
function DrawWikiBuildingComponent(params) {
    const { baseClassName, parentId, componentId, building } = params;
    const itemClassName = baseClassName + "-item";
    const itemId = `${itemClassName}-${componentId}`;

    const buildingItem = document.createElement("div");
    buildingItem.className = itemClassName + " wiki-item collapsed";
    buildingItem.id = itemId;
    document.getElementById(parentId).appendChild(buildingItem);

    const headerParams = {
        baseClassName: baseClassName + "-header",
        parentId: itemId,
        title: building.title,
        imgSrc: "/images/buildings/" + building.name.toLowerCase() + "_1.png",
        imgAlt: building.name
    };

    const bodyParams = {
        baseClassName: baseClassName + "-body",
        parentId: itemId,
        building: building
    };

    DrawWikiHeaderComponent(headerParams);
    DrawWikiBuildingBodyComponent(bodyParams);
}
