/* ==================================================
   CROMA DRIP
   HOME / CATÁLOGO
================================================== */


/* ==================================================
   ELEMENTOS
================================================== */

const productsGrid =
  document.querySelector(
    ".products-grid"
  );


/* ==================================================
   RENDERIZAR CATÁLOGO
================================================== */

function renderProductsCatalog() {

  if (!productsGrid) {
    return;
  }


  productsGrid.innerHTML = "";


  const products =
    getActiveProducts();


  products.forEach(
    product => {

      const card =
        document.createElement(
          "article"
        );


      card.className =
  isProductAvailable(product)
    ? "product-card"
    : "product-card is-sold-out";


      const productUrl =
        getProductUrl(
          product.id
        );


      const viewerImages =
        product.viewerImages
          .join(",");


      const availabilityLabel =
  isProductAvailable(product)
    ? ""
    : `
      <span class="sold-out-label">
        SOLD
      </span>
    `;


      card.innerHTML = `

        <a
          href="${productUrl}"
          class="product-card-link"
          aria-label="Ver ${product.name}"
        >

          <div class="product-image-container">

            <div
              class="product-viewer"
              data-images="${viewerImages}"
            >

              <img
                src="${getProductMainImage(product)}"
                alt="${product.name}"
                class="product-image"
                data-front-image="${product.images.front}"
              >


              ${availabilityLabel}


              <div class="viewer-helper">

                <span>←</span>

                MOVA PARA VER

                <span>→</span>

              </div>

            </div>

          </div>

        </a>


        <div class="product-info">


          <a
            href="${productUrl}"
            class="product-text product-text-link"
          >

            <h3>
              ${product.displayName || product.name}
            </h3>

            <p>
              ${formatCurrency(product.price)}
            </p>

          </a>


          <button
            class="add-product"
            type="button"
            data-product-id="${product.id}"
            aria-label="Adicionar ${product.name} ao carrinho"
            ${isProductAvailable(product) ? "" : "disabled"}
          >

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >

              <path
                d="M5 8h14l-1 12H6L5 8Z"
              ></path>

              <path
                d="M9 8V6a3 3 0 0 1 6 0v2"
              ></path>

              <path
                d="M12 11v6"
              ></path>

              <path
                d="M9 14h6"
              ></path>

            </svg>

          </button>

        </div>

      `;


      productsGrid.appendChild(
        card
      );

    }
  );


  bindProductViewers();

  bindAddProductButtons();

}


/* ==================================================
   VIEWER DOS PRODUTOS
   DESKTOP APENAS
================================================== */

function bindProductViewers() {

  const productViewers =
    document.querySelectorAll(
      ".product-viewer"
    );


  productViewers.forEach(
    viewer => {

      const productImage =
        viewer.querySelector(
          ".product-image"
        );


      const images =
        viewer.dataset.images
          .split(",")
          .map(
            image =>
              image.trim()
          );


      if (
        !productImage ||
        images.length === 0
      ) {
        return;
      }


      let currentImage =
        Math.min(
          1,
          images.length - 1
        );


      /* PRELOAD */

      images.forEach(
        src => {

          const preload =
            new Image();

          preload.src = src;

        }
      );


      /* TROCAR */

      function changeImage(index) {

        if (
          !images[index] ||
          index === currentImage
        ) {
          return;
        }


        currentImage =
          index;


        const soldOut =
  viewer.closest(".product-card")
    ?.classList
    .contains("is-sold-out");


          productImage
            .style
            .opacity =
              soldOut
                ? "0.55"
                : "0.88";


          setTimeout(
            () => {

              productImage.src =
                images[index];

              productImage
                .style
                .opacity =
                  soldOut
                    ? "0.62"
                    : "1";

            },
            70
          );

      }


      /* MOVIMENTO DO MOUSE */

      viewer.addEventListener(
        "mousemove",
        event => {

          const desktop =
            window.matchMedia(
              "(hover: hover) and (pointer: fine)"
            ).matches;


          if (!desktop) {
            return;
          }


          const rect =
            viewer
              .getBoundingClientRect();


          const mouseX =
            event.clientX -
            rect.left;


          const percentage =
            mouseX /
            rect.width;


          if (
            images.length === 1
          ) {

            changeImage(0);

            return;
          }


          if (
            images.length === 2
          ) {

            if (
              percentage < 0.5
            ) {

              changeImage(0);

            }

            else {

              changeImage(1);

            }

            return;
          }


          if (
            percentage < 0.33
          ) {

            changeImage(0);

          }

          else if (
            percentage < 0.66
          ) {

            changeImage(1);

          }

          else {

            changeImage(2);

          }

        }
      );


      /* VOLTA PRA FOTO PRINCIPAL */

      viewer.addEventListener(
        "mouseleave",
        () => {

          const desktop =
            window.matchMedia(
              "(hover: hover) and (pointer: fine)"
            ).matches;


          if (!desktop) {
            return;
          }


          const frontIndex =
            images.indexOf(
              productImage.dataset
                .frontImage
            );


          if (
            frontIndex >= 0
          ) {

            changeImage(
              frontIndex
            );

          }

          else {

            changeImage(
              Math.min(
                1,
                images.length - 1
              )
            );

          }

        }
      );

    }
  );

}


/* ==================================================
   ADICIONAR PRODUTOS
================================================== */

function bindAddProductButtons() {

  const buttons =
    document.querySelectorAll(
      ".add-product"
    );


  buttons.forEach(
    button => {

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();

          event.stopPropagation();


          const productId =
            button.dataset.productId;


          const product =
            getProductById(
              productId
            );


          if (
            !isProductAvailable(
              product
            )
          ) {
            return;
          }


          const defaultSize =
            product.sizes?.find(
              size =>
                size.available
            )?.name || null;


          const added =
            addToCart(
              productId,
              1,
              defaultSize
            );


          if (added) {

            openCart();

          }

        }
      );

    }
  );

}


/* ==================================================
   INICIAR HOME
================================================== */

renderProductsCatalog();