/* ==================================================
   CROMA DRIP
   BUSCA GLOBAL
================================================== */


/* ==================================================
   CRIAR OVERLAY
================================================== */

function createSearchOverlay() {

  if (
    document.querySelector(
      "#searchOverlay"
    )
  ) {
    return;
  }


  const overlay =
    document.createElement(
      "div"
    );


  overlay.id =
    "searchOverlay";


  overlay.className =
    "search-overlay";


  overlay.innerHTML = `

    <div class="search-panel">

      <div class="search-header">

        <span class="search-label">
          BUSCA
        </span>


        <button
          class="search-close"
          id="searchClose"
          type="button"
          aria-label="Fechar busca"
        >
          ×
        </button>

      </div>


      <div class="search-input-wrapper">

        <input
          type="search"
          id="searchInput"
          class="search-input"
          placeholder="BUSCAR PRODUTO"
          autocomplete="off"
        >

      </div>


      <div
        class="search-results"
        id="searchResults"
      ></div>

    </div>

  `;


  document.body
    .appendChild(
      overlay
    );

}


/* ==================================================
   ELEMENTOS
================================================== */

createSearchOverlay();


const searchOverlay =
  document.querySelector(
    "#searchOverlay"
  );


const searchInput =
  document.querySelector(
    "#searchInput"
  );


const searchResults =
  document.querySelector(
    "#searchResults"
  );


const searchClose =
  document.querySelector(
    "#searchClose"
  );


const searchButtons =
  document.querySelectorAll(
    "[data-open-search], .search-button"
  );


/* ==================================================
   ABRIR BUSCA
================================================== */

function openSearch() {

  if (!searchOverlay) {
    return;
  }


  searchOverlay
    .classList
    .add(
      "active"
    );


  document.body
    .classList
    .add(
      "search-open"
    );


  setTimeout(
    () => {

      searchInput
        ?.focus();

    },
    100
  );

}


/* ==================================================
   FECHAR BUSCA
================================================== */

function closeSearch() {

  searchOverlay
    ?.classList
    .remove(
      "active"
    );


  document.body
    .classList
    .remove(
      "search-open"
    );


  if (searchInput) {

    searchInput.value =
      "";

  }


  if (searchResults) {

    searchResults.innerHTML =
      "";

  }

}


/* ==================================================
   NORMALIZAR TEXTO
================================================== */

function normalizeSearchText(
  value
) {

  return String(
    value || ""
  )
    .normalize(
      "NFD"
    )
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .trim();

}


/* ==================================================
   RESULTADO
================================================== */

function createSearchResult(
  product
) {

  const result =
    document.createElement(
      "a"
    );


  result.className =
    "search-result";


  result.href =
    getProductUrl(
      product.id
    );


  const available =
    isProductAvailable(
      product
    );


  result.innerHTML = `

    <div class="search-result-image">

      <img
        src="${getProductMainImage(product)}"
        alt="${product.name}"
      >

    </div>


    <div class="search-result-info">

      <div class="search-result-top">

        <h3>
          ${product.displayName || product.name}
        </h3>

        ${
          !available
            ? `
              <span class="search-result-status">
                ESGOTADO
              </span>
            `
            : ""
        }

      </div>


      <p>
        ${formatCurrency(product.price)}
      </p>

    </div>

  `;


  return result;

}


/* ==================================================
   RENDERIZAR RESULTADOS
================================================== */

function renderSearchResults(
  query
) {

  if (!searchResults) {
    return;
  }


  const normalizedQuery =
    normalizeSearchText(
      query
    );


  searchResults.innerHTML =
    "";


  if (!normalizedQuery) {

    return;

  }


  const matches =
    getActiveProducts()
      .filter(
        product => {

          const searchable =
            normalizeSearchText(
              `
                ${product.name}
                ${product.displayName || ""}
                ${product.category || ""}
                ${product.description || ""}
              `
            );


          return searchable
            .includes(
              normalizedQuery
            );

        }
      );


  if (
    matches.length === 0
  ) {

    searchResults.innerHTML = `

      <div class="search-empty">

        <p>
          NENHUM PRODUTO ENCONTRADO.
        </p>

      </div>

    `;


    return;

  }


  matches.forEach(
    product => {

      searchResults
        .appendChild(
          createSearchResult(
            product
          )
        );

    }
  );

}


/* ==================================================
   EVENTOS
================================================== */

searchButtons
  .forEach(
    button => {

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();

          openSearch();

        }
      );

    }
  );


searchClose
  ?.addEventListener(
    "click",
    closeSearch
  );


searchOverlay
  ?.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        searchOverlay
      ) {

        closeSearch();

      }

    }
  );


searchInput
  ?.addEventListener(
    "input",
    event => {

      renderSearchResults(
        event.target.value
      );

    }
  );


document
  .addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Escape" &&
        searchOverlay
          ?.classList
          .contains(
            "active"
          )
      ) {

        closeSearch();

      }

    }
  );