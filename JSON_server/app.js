const cardsContainer = document.getElementById('cards-container');
const prevBtn = document.getElementById('arrow-left');
const nextBtn = document.getElementById('arrow-right');
const inputs = document.querySelectorAll('input[name=status]');
const filterInput = document.getElementById('filter-by-name');
const creatingForm = document.getElementById('creating-form');
let currentPage = 1;
let limit = 5;

const filterByName = () => {
	const characterName = filterInput.value.trim();
	return characterName;
};

const findStatus = () => {
	let characterStatus = 'Alive';
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

const displayImage = (parent, src) => {
	const img = document.createElement('img');
	img.setAttribute('src', `${src}`);
	parent.appendChild(img);
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

const createDeleteBtn = (parent) => {
	const deleteBtn = document.createElement('button');
	deleteBtn.textContent = 'Delete';
	deleteBtn.id = 'deleteBtn';
	deleteBtn.classList.add('delete-btn');
	parent.append(deleteBtn);
	deleteBtn.addEventListener('click', (event) => {
		deleteCharacter(event.target.parentNode.id);
	});
};

const createCard = (image, name, status, species, id) => {
	const card = document.createElement('div');
	card.classList.add('card');
	card.id = id;
	displayImage(card, image);
	assignParamsToCharacter(card, name, status, species);
	createDeleteBtn(card);
	cardsContainer.append(card);
};

const updateCards = async (currentPage) => {
	const characterName = filterByName();
	const characterStatus = findStatus();
	try {
		const response = await fetch(
			`http://localhost:3000/results?status=${characterStatus}&name_like=${characterName}&_page=${currentPage}&_limit=${limit}`
		);
		const data = await response.json();

		cardsContainer.innerHTML = '';
		if (data && data.length > 0) {
			data.forEach(({ image, name, status, species, id }) => {
				createCard(image, name, status, species, id);
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
		const characterName = filterByName();
		const characterStatus = findStatus();
		const response = await fetch(
			`http://localhost:3000/results?status=${characterStatus}&name_like=${characterName}`
		);
		const data = await response.json();
		const amountOfPages = (await data.length) / limit;
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

const createNewCharacter = async (event) => {
	event.preventDefault();
	const newName = document.getElementById('new-character-name').value;
	const newStatus = document.getElementById('new-character-status').value;
	const newSpecies = document.getElementById('new-character-species').value;
	const newImage = 'https://rickandmortyapi.com/api/character/avatar/3.jpeg';
	const newCharacter = {
		name: newName,
		status: newStatus,
		species: newSpecies,
		image: newImage,
	};
	try {
		const response = await fetch(`http://localhost:3000/results`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newCharacter),
		});
		updateCards(currentPage);
	} catch (error) {
		console.error('ERROR:', error);
	}
	creatingForm.reset();
};

const deleteCharacter = async (id) => {
	try {
		const response = await fetch(`http://localhost:3000/results/${id}`, {
			method: 'DELETE',
		});
		updateCards(1);
	} catch (error) {
		console.error('Error:', error);
	}
};

filterInput.addEventListener('input', () => updateCards(1));
inputs.forEach((input) => {
	input.addEventListener('change', () => updateCards(1));
});
nextBtn.addEventListener('click', nextPage);
prevBtn.addEventListener('click', prevPage);
creatingForm.addEventListener('submit', (event) => {
	createNewCharacter(event);
});
document.addEventListener('DOMContentLoaded', () => updateCards(1));
