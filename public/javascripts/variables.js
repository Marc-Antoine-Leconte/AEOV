let currentInstance = {
    currentPlayer: {},
    data: {},
    playerList: {},
    actions: {},
    currentPlayerTurn: [],
    screen: {
        zoom: 1,
        layout: null,
        selectedCity: null
    },
    locations: {}
};

const twoPlayersMap = [{x:18, y:6}, {x:75, y:42}];
const threePlayersMap = [{x:18, y:6}, {x:75, y:6}, {x:43, y:42}];
const fourPlayersMap = [{x:18, y:6}, {x:5, y:42}, {x:75, y:6}, {x:75, y:42}];
const fivePlayersMap = [{x:15, y:15}, {x:5, y:42}, {x:43, y:6}, {x:70, y:25}, {x:43, y:42}];
const sixPlayersMap = [{x:28, y:6}, {x:10, y:25}, {x:25, y:42}, {x:60, y:6}, {x:70, y:25}, {x:60, y:42}];
const sevenPlayersMap = [{x:18, y:6}, {x:8, y:25}, {x:5, y:42}, {x:43, y:42}, {x:75, y:6}, {x:70, y:25}, {x:75, y:42}];
const eightPlayersMap = [{x:18, y:6}, {x:8, y:25}, {x:5, y:42}, {x:43, y:42}, {x:43, y:6}, {x:75, y:6}, {x:70, y:25}, {x:75, y:42}];

const pinPointsMap = [{x:43, y:25}, {x:43, y:35}, {x:43, y:10}, {x:25, y:25}, {x:55, y:25}, {x:25, y:35}, {x:25, y:10}, {x:55, y:10}, {x:55, y:35}];
