// https://pokeapi.co/ --Max of 1118
'use strict'

/* selectors left screen */
const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');

/* right screen selectors */
const pokeListItems = document.querySelectorAll('.list-item');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');

/* Vars */
let tempColor = 'hide'; /* left screen background color */
let prevURL = null;
let nextURL = null;

/* Functions */
const capitalize = (str) => str[0].toUpperCase() + str.substr(1);
const handleRightButtonClick = () => {
    if (nextURL) {
        fetchPokeList(nextURL);
    }
};
const handleLeftButtonClick = () => {
    if (prevURL) {
        fetchPokeList(prevURL);
    }
};
const handleListItemClick = (e) => {
    if (!e.target) { return; }

    const listItem = e.target;
    if (!listItem.textContent) { return };

    const id = listItem.textContent.split('.')[0];
    fetchPokeData(id);
}

/* Event listeners */
leftButton.addEventListener('click', handleLeftButtonClick);
rightButton.addEventListener('click', handleRightButtonClick);
for (const pokeListItem of pokeListItems) {
    pokeListItem.addEventListener('click', handleListItemClick);
}

/* api call left screen */
const fetchPokeData = id => {

    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => res.json())
        .then(data => {

            const dataTypes = data['types'];
            const dataFirstType = dataTypes['0'];
            const dataSecondType = dataTypes['1'];

            /* type 1 text */
            pokeTypeOne.textContent = capitalize(dataFirstType['type']['name']);
            /* type 2 text if it exists */
            if (dataSecondType) {
                pokeTypeTwo.classList.remove('hide');
                pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name']);
            } else {
                pokeTypeTwo.classList.add('hide');
                pokeTypeTwo.textContent = '';
            }

            /* Sets left main screen background color */
            let backgroundColor = dataFirstType['type']['name'];
            if (backgroundColor !== tempColor) {
                mainScreen.classList.remove(tempColor);
                mainScreen.classList.add(backgroundColor);
                tempColor = backgroundColor;
            }

            /* Left Screen  */
            pokeName.textContent = capitalize(data['name']);
            pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');
            pokeWeight.textContent = data['weight'];
            pokeHeight.textContent = data['height'];
            pokeFrontImage.src = data['sprites']['front_default'] || '';
            pokeBackImage.src = data['sprites']['back_default'] || '';

        })
};

/* api call right screen */
const fetchPokeList = URL => {

    fetch(URL)
        .then(res => res.json())
        .then(data => {
            const { results, previous, next } = data;
            prevURL = previous;
            nextURL = next;

            /* for loop */
            for (let i = 0; i < pokeListItems.length; i++) {
                const pokeListItem = pokeListItems[i];
                const resultData = results[i];

                if (resultData) {
                    const { name, url } = resultData;
                    const urlArray = url.split('/');
                    const id = urlArray[6]
                    pokeListItem.textContent = id + '. ' + capitalize(name);
                } else {
                    pokeListItem.textContent = '';
                }
            }
            /* ALT */
            // function iterate(item, index) {
            //     // console.log(`${item} has index ${index}`);
            //     const resultData = results[index];

            //     if (resultData) {
            //         const { name, url } = resultData;
            //         const urlArray = url.split('/');
            //         item.textContent = urlArray[6] + ' ' + capitalize(name);
            //     } else {
            //         item.textContent = '';
            //     }
            // }
            /* load poke names into right screen */
            // pokeListItems.forEach(iterate);
        });
}

/* init app */
fetchPokeList('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');

//@56.06
