const cardsContainer = document.getElementById('cards-container');
const prevBtn = document.getElementById('arrow-left');
const nextBtn = document.getElementById('arrow-right');
const inputs = document.querySelectorAll('input[name=status]');
const filterInput = document.getElementById('filter-by-name');
let currentPage = 1;

const displayImage = (parent, src) => {
	const img = document.createElement('img');
	img.setAttribute('src', `${src}`);
	parent.appendChild(img);
};

const filterByName = () => {
	const characterName = filterInput.value.trim();
	return characterName;
};

const findStatus = () => {
	let characterStatus = 'alive';
	inputs.forEach((input) => {
		if (input.checked) {
			characterStatus = input.value;
		}
	});
	return characterStatus;
};

const showNoResultInfo = () => {
	const noResultInfo = document.createElement('p');
	noResultInfo.classList.add('no-result-info');
	noResultInfo.textContent = 'no search results found';
	cardsContainer.innerHTML = '';
	cardsContainer.appendChild(noResultInfo);
};

const assignParamsToCharacter = (parent, name, status, species) => {
	const charName = document.createElement('p');
	const charStatus = document.createElement('p');
	const charSpecies = document.createElement('p');
	charName.innerHTML = `${name}`;
	charStatus.innerHTML = `Status: ${status}`;
	charSpecies.innerHTML = `Species: ${species}`;
	parent.append(charName, charStatus, charSpecies);
};

const createCard = (image, name, status, species) => {
	const card = document.createElement('div');
	card.classList.add('card');
	displayImage(card, image);
	assignParamsToCharacter(card, name, status, species);
	cardsContainer.append(card);
};

const updateCards = async (currentPage = 1) => {
	try {
		const characterName = filterByName();
		const characterStatus = findStatus();

		const response = await fetch(
			`https://rickandmortyapi.com/api/character?page=${currentPage}&status=${characterStatus}&name=${characterName}`
		);
		const data = await response.json();
		cardsContainer.innerHTML = '';
		if (data.results && data.results.length > 0) {
			data.results.forEach(({ image, name, status, species }) => {
				createCard(image, name, status, species);
			});
		} else {
			showNoResultInfo();
		}
	} catch (error) {
		console.error('ERROR: ', error);
	}
};

const nextPage = async () => {
	try {
		const response = await fetch(`https://rickandmortyapi.com/api/character`);
		const data = await response.json();
		const amountOfPages = data.info.pages;
		if (currentPage < amountOfPages) currentPage++;
	} catch (error) {
		console.error('ERROR: ', error);
	}
	updateCards(currentPage);
};
const prevPage = () => {
	if (currentPage > 1) currentPage--;
	updateCards(currentPage);
};

filterInput.addEventListener('input', () => updateCards(1));
inputs.forEach((input) => {
	input.addEventListener('change', () => updateCards(1));
});
nextBtn.addEventListener('click', nextPage);
prevBtn.addEventListener('click', prevPage);
document.addEventListener('DOMContentLoaded', updateCards(1));
