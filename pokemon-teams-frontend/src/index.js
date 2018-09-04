const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

// when user loads page, fetch and display all trainers with their pokemon

document.addEventListener('DOMContentLoaded', init)

function init() {
  fetchTrainersAndPokemons()
}

function fetchTrainersAndPokemons() {
  fetch(`${TRAINERS_URL}`)
  .then(response => response.json())
  .then(trainersData => trainersData.forEach(trainer => {
    renderTrainer(trainer)
  }))
}

function renderTrainer(trainerData) {
  let mainDiv = document.querySelector('main')

  let trainerCard = document.createElement('div')
  trainerCard.className = 'card'
  trainerCard.dataset.id = trainerData.id
  trainerCard.id = `trainer-${trainerData.id}`

  let cardName = document.createElement('p')
  cardName.innerText = `${trainerData.name}`

  let addButton = document.createElement('button')
  addButton.innerText = 'Add Pokemon'
  addButton.dataset.trainerId = trainerData.id
  addButton.dataset.pokemonCount = trainerData.pokemons.length

  addButton.addEventListener('click', addPokemon)

  mainDiv.appendChild(trainerCard)
  trainerCard.appendChild(cardName)
  trainerCard.appendChild(addButton)

  let pokemonList = document.createElement('ul')
  pokemonList.id = `trainer-list-${trainerData.id}`

  trainerCard.appendChild(pokemonList)

  trainerData.pokemons.forEach(pokemon => {
    renderPokemon(pokemon, pokemonList)
  })

}

function renderPokemon(pokemon) {

  let pokeListItem = document.createElement('li')
  pokeListItem.id = `pokemon-${pokemon.id}`
  pokeListItem.innerText = `${pokemon.nickname}`

  let currentList = document.getElementById(`trainer-list-${pokemon.trainer_id}`)
  let releaseButton = document.createElement('button')
  releaseButton.className = 'release'
  releaseButton.dataset.pokemonId = pokemon.id
  releaseButton.innerText = 'Release'
  releaseButton.addEventListener('click', releasePokemon)

  pokeListItem.appendChild(releaseButton)
  currentList.appendChild(pokeListItem)

}

function addPokemon() {
  let trainerId = event.target.dataset.trainerId
  let trainerPokemonCount = event.target.dataset.pokemonCount
  if (trainerPokemonCount < 6) {
    fetch(`${POKEMONS_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'trainer_id': `${trainerId}`
      })
    }).then(response => response.json())
    .then(jsonData => {
      let newPokemon = jsonData
      renderPokemon(newPokemon)
    })
  }


}

function releasePokemon() {
  let thisPokemonId = event.target.dataset.pokemonId
  let trainerPokemonCount = event.target.dataset.pokemonCount

  fetch(`${POKEMONS_URL}/${thisPokemonId}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(jsonData => {
    pokemonElement = document.getElementById(`pokemon-${thisPokemonId}`)
    pokemonElement.remove()
    trainerPokemonCount -= 1
  })
}
