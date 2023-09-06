const url = "https://rickandmortyapi.com/api/";
const characterList = document.getElementById("characterList");
const footerInfoContainer = document.getElementById("footerInfo");
const statusView = document.querySelector(".statusView");
const previousBtn = document.querySelector("#previousBtn");
const nextBtn = document.querySelector("#nextBtn");

// let randomPage = Math.floor(Math.random() * 42) + 1;
let currentPage = 1;
let totalOfPages = "";
let characters = [];

async function renderCharacters() {
  try {
    const response = await axios.get(url + `character/?page=${currentPage}`);
    characters = response.data.results;
    totalOfPages = response.data.info.pages;

    let characterHTML = "";
    characters.forEach((character) => {
      let statusStyle = "";
      if (character.status === "Alive") {
        statusStyle = "background-color: green";
      } else if (character.status === "Dead") {
        statusStyle = "background-color: red";
      } else {
        statusStyle = "background-color: gray";
      }
      console.log(character.id);
      characterHTML += `
      <div
      class="col-md-6 col-lg-4 col-xl-3 d-flex justify-content-center mt-3"
      data-bs-toggle="modal" data-bs-target="#characterModal"
       onclick="openModal(${character.id - 1})">
      <div
        class="card text-center bg-dark text-secondary border-0"
        style="width: 18rem"
        >
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
    console.clear();
    return;
  }
  updateFooterInfo();
  previousBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalOfPages;
}

async function updateFooterInfo() {
  try {
    const characterResponse = await axios.get(url + "character");
    const locationResponse = await axios.get(
      "https://rickandmortyapi.com/api/location"
    );

    const characterCount = characterResponse.data.info.count;
    const totalPages = characterResponse.data.info.pages;
    const locationCount = locationResponse.data.info.count;

    footerInfoContainer.innerHTML = `
        <section class="row justify-content-center py-5">
          <p class="col-md-3 col-sm-5">CHARACTERS: ${characterCount}</p>
          <p class="col-md-3 col-sm-5">LOCATIONS: ${totalPages}</p>
          <p class="col-md-3 col-sm-5">EPISODES: ${locationCount}</p>
        </section> `;
  } catch (err) {
    console.error("Error updating footer info:", err);
  }
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
updateFooterInfo();

function openModal(id) {
  const character = characters[id]
  let charModalHTML = "";
  charModalHTML = `<div class="modal-content bg-dark text-secondary border-0">
  <img src="${character.image}" alt="test" class="rounded-top border-0" />
  <div class="modal-header border-0">
    <h5 class="modal-title text-warning">${character.name}</h5>
    <p class="modal-title text-secondary">ID: ${character.id}</p>
  </div>
  <div class="modal-body border-0">
    <div class="modal-title text-secondary">
      <h5 class="">Origin: ${character.origin.name}</h5>
      <p class="fw-bold">Last seen: ${character.location.name}</p>
      <p class="fw-bold">Gender: ${character.gender}</p>
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