const stringListToMap = (str) => {
    return str.replace('[', '').replace(']', '').split(',').reduce((map, item) => {
        const trimmedItem = item.trim();
        const [key, value] = trimmedItem.split(":");
        map[key] = value;
        return map;
    }, {});
}

const mapToString = (map) => {
    const str = JSON.stringify(map);
    return str.replace("{", "[").replace("}", "]").replace(/["']/g, "");
}