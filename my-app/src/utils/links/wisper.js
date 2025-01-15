
const WISPERDOMMEN = 'http://localhost:8081/';

const wisper = {
    loadAgain: 'get-summary/'
};

Object.keys(wisper).forEach((key) => {
    wisper[key] = WISPERDOMMEN + wisper[key];
});

export default wisper;