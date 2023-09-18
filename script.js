const url = "https://rickandmortyapi.com/api/";
const characterList = document.getElementById("characterList");
const footerInfoContainer = document.getElementById("footerInfo");
const statusView = document.querySelector(".statusView");
const previousBtn = document.querySelector("#previousBtn");
const nextBtn = document.querySelector("#nextBtn");

let currentPage = 1;
let totalOfPages = "";
let characters = "";
let statusStyle = "";

async function renderCharacters() {
  try {
    const response = await axios.get(url + `character/?page=${currentPage}`);
    characters = response.data.results;
    totalOfPages = response.data.info.pages;

    let characterHTML = "";
    characters.forEach((character) => {
      if (character.status === "Alive") {
        statusStyle = "background-color: green";
      } else if (character.status === "Dead") {
        statusStyle = "background-color: red";
      } else {
        statusStyle = "background-color: gray";
      }
      characterHTML += `
      <div
      class="col-md-6 col-lg-4 col-xl-3 d-flex justify-content-center mt-3"
      data-bs-toggle="modal" data-bs-target="#characterModal"
       onclick="openModal(${characters.indexOf(character)})">
      <div
        class="card text-center bg-dark text-secondary border-0">
        <img
          src="${character.image}"
          alt="${character.name}"
          class="card-img-top rounded-top"/>
        <div class="card-body">
          <p class="h5 card-title text-warning">${character.name}</p>
          <div class="d-flex justify-content-center gap-2">
            <p class="card-text statusView" style="${statusStyle}"></p>
            <p class="card-text fw-bold">
              ${character.status} - ${character.species}
            </p>
          </div>
          <p class="fw-bold">
            Last seen:<br />
            ${character.location.name}
          </p>
        </div>
      </div>
    </div>`;
    });
    characterList.innerHTML = characterHTML;
  } catch (err) {
    window.alert(
      `An issue occurred: ${err.response.status} ${err.response.data.error}`
    );
    return;
  }
  previousBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalOfPages;
}

function openModal(index) {
  let statusModal = document.querySelector('.statusModal')
  const character = characters[index];
  let typeText = character.type === "" ? "Its a secret..." : character.type;
  let charModalHTML = "";
  if (character.status === "Alive") {
    statusStyle = "background-color: green";
  } else if (character.status === "Dead") {
    statusStyle = "background-color: red";
  } else {
    statusStyle = "background-color: gray";
  }
  charModalHTML = `<div class="modal-content bg-dark text-secondary border-0">
  <div class="statusModal rounded-circle mx-2 my-2" style="${statusStyle}"></div>
  <img src="${character.image}" alt="${character.name}" class="rounded-top border-0" />
  <div class="modal-header border-0">
    <h5 class="modal-title text-warning">${character.name}</h5>
    <p class="modal-title text-secondary mt-1 fw-bold">ID: ${character.id}</p>
  </div>
  <div class="modal-body border-0">
  <p class="text-secondary">Character info:</p>
    <div class="modal-title text-secondary">
      <p class="">Origin: ${character.origin.name}</p>
      <p class="">Last seen: ${character.location.name}</p>
      <p class="">Gender: ${character.gender} | Specie: ${character.species}</p>
      <p class=""></p>
      <p class="">Type: ${typeText} | Episodes: ${character.episode.length}</p>
      <p class=""></p>
    </div>
  </div>
  <div class="modal-footer border-0">
    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
      Close
    </button>
  </div>
</div>
`;
  charModal.innerHTML = charModalHTML;
}
function nextPage() {
  currentPage++;
  renderCharacters();
}
function previousPage() {
  currentPage--;
  renderCharacters();
}
renderCharacters();
