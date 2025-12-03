function stringToMap(str) {
    const newMap = str.split(",").reduce((map, item) => {
            const trimmedItem = item.trim().replace("[", "").replace("]", "").replace(" ", "");
            const [key, value] = trimmedItem.split(":");
            if (key) {
                map[key.trim()] = value?.trim();
            }
            return map;
        }, {});

    return newMap;
}
