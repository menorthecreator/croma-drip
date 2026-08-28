/* ==================================================
   CROMA DRIP
   MENU GLOBAL
================================================== */


/* ==================================================
   CRIAR MENU
================================================== */

function createMenuDrawer() {

  if (
    document.querySelector(
      "#menuDrawer"
    )
  ) {
    return;
  }


  const overlay =
    document.createElement(
      "div"
    );


  overlay.id =
    "menuOverlay";


  overlay.className =
    "menu-overlay";


  const drawer =
    document.createElement(
      "aside"
    );


  drawer.id =
    "menuDrawer";


  drawer.className =
    "menu-drawer";


  drawer.innerHTML = `

    <div class="menu-drawer-header">

      <span class="menu-drawer-label">
        MENU
      </span>


      <button
        class="menu-close"
        id="menuClose"
        type="button"
        aria-label="Fechar menu"
      >
        ×
      </button>

    </div>


    <nav class="menu-navigation">


      <a
         href="https://www.instagram.com/croma.drip/"
        class="menu-link"
        id="menuInstagram"
        target="_blank"
        rel="noopener noreferrer"
      >
        INSTAGRAM

        <span>
          ↗
        </span>
      </a>


      <a
        href="index.html#sobre"
        class="menu-link"
      >
        SOBRE A CROMA
      </a>

    </nav>


    <div class="menu-footer">

      <span>
        CROMA DRIP © 2026
      </span>

    </div>

  `;


  document.body
    .appendChild(
      overlay
    );


  document.body
    .appendChild(
      drawer
    );

}


/* ==================================================
   ELEMENTOS
================================================== */

createMenuDrawer();


const menuDrawer =
  document.querySelector(
    "#menuDrawer"
  );


const menuOverlay =
  document.querySelector(
    "#menuOverlay"
  );


const menuClose =
  document.querySelector(
    "#menuClose"
  );


const menuButtons =
  document.querySelectorAll(
    "[data-open-menu], .menu-button"
  );


/* ==================================================
   ABRIR
================================================== */

function openMenu() {

  menuDrawer
    ?.classList
    .add(
      "active"
    );


  menuOverlay
    ?.classList
    .add(
      "active"
    );


  document.body
    .classList
    .add(
      "menu-open"
    );

}


/* ==================================================
   FECHAR
================================================== */

function closeMenu() {

  menuDrawer
    ?.classList
    .remove(
      "active"
    );


  menuOverlay
    ?.classList
    .remove(
      "active"
    );


  document.body
    .classList
    .remove(
      "menu-open"
    );

}


/* ==================================================
   EVENTOS
================================================== */

menuButtons
  .forEach(
    button => {

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();

          openMenu();

        }
      );

    }
  );


menuClose
  ?.addEventListener(
    "click",
    closeMenu
  );


menuOverlay
  ?.addEventListener(
    "click",
    closeMenu
  );


document
  .addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Escape" &&
        menuDrawer
          ?.classList
          .contains(
            "active"
          )
      ) {

        closeMenu();

      }

    }
  );


/* ==================================================
   FECHAR AO CLICAR EM LINK
================================================== */

document
  .querySelectorAll(
    ".menu-link"
  )
  .forEach(
    link => {

      link.addEventListener(
        "click",
        () => {

          closeMenu();

        }
      );

    }
  );