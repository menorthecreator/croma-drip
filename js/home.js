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
   QUANTIDADE DO PRODUTO NO CARRINHO

   Soma quantas unidades daquele produto
   já estão no carrinho local do usuário.
================================================== */

function getProductQuantityInCart(
  productId
) {

  if (
    !Array.isArray(cart)
  ) {

    return 0;

  }


  return cart
    .filter(
      item =>
        item.productId ===
        productId
    )
    .reduce(
      (
        total,
        item
      ) => {

        return (
          total +
          (
            Number(
              item.quantity
            ) || 0
          )
        );

      },
      0
    );

}


/* ==================================================
   VERIFICAR SE TODO O ESTOQUE JÁ ESTÁ NO CARRINHO

   IMPORTANTE:

   isso NÃO significa SOLD.

   Significa apenas que aquele usuário
   já colocou no carrinho todas as unidades
   disponíveis para ele.
================================================== */

function isProductFullyInCart(
  product
) {

  if (
    !product ||
    !isProductAvailable(
      product
    )
  ) {

    return false;

  }


  /*
     Produtos sem controle de estoque
     nunca ficam "NO CARRINHO".
  */

  if (
    product.trackStock === false
  ) {

    return false;

  }


  const stock =
    getProductStock(
      product
    );


  const quantityInCart =
    getProductQuantityInCart(
      product.id
    );


  return (
    stock > 0 &&
    quantityInCart >= stock
  );

}

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


      const productAvailable =
  isProductAvailable(
    product
  );


const fullyInCart =
  isProductFullyInCart(
    product
  );


card.className =
  !productAvailable
    ? "product-card is-sold-out"
    : fullyInCart
      ? "product-card is-in-cart"
      : "product-card";


      const productUrl =
        getProductUrl(
          product.id
        );


      const viewerImages =
        product.viewerImages
          .join(",");


      let availabilityLabel =
  "";


if (!productAvailable) {

  availabilityLabel = `

    <span class="sold-out-label">
      SOLD
    </span>

  `;

}

else if (fullyInCart) {

  availabilityLabel = `

    <span class="in-cart-label">
      NO CARRINHO
    </span>

  `;

}


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
                onerror="this.onerror=null;this.src='assets/logo.png';"
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
           ${productAvailable && !fullyInCart ? "" : "disabled"}
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


          /* Produto inexistente ou SOLD */

          if (
            !product ||
            !isProductAvailable(
              product
            )
          ) {

            return;

          }


          /* ==========================================
             PRIMEIRO TAMANHO COM ESTOQUE
          ========================================== */

          const defaultSize =
            product.sizes?.find(
              size =>
                isSizeAvailable(
                  product,
                  size.id
                )
            )?.name || null;


          /*
             Se possui tamanhos,
             mas nenhum possui estoque,
             não permite adicionar.
          */

          if (
            Array.isArray(
              product.sizes
            ) &&
            product.sizes.length > 0 &&
            !defaultSize
          ) {

            return;

          }


          /* ==========================================
             ADICIONAR AO CARRINHO
          ========================================== */

          const added =
            addToCart(
              productId,
              1,
              defaultSize
            );


          /* ==========================================
             FEEDBACK VISUAL
          ========================================== */

          if (added) {

            const originalHTML =
              button.innerHTML;


            button.classList.add(
              "is-added"
            );


            button.innerHTML = `

              <span class="added-check">
                ✓
              </span>

            `;


            setTimeout(
              () => {

                button.innerHTML =
                  originalHTML;


                button.classList.remove(
                  "is-added"
                );


                openCart();

              },
              450
            );

          }

        }
      );

    }
  );

}

/* ==================================================
   SINCRONIZAR HOME COM CARRINHO

   cart.js dispara este evento sempre que
   o carrinho muda.
================================================== */

window.addEventListener(
  "croma:cart-updated",
  () => {

    renderProductsCatalog();

  }
);


/* ==================================================
   INICIAR HOME
================================================== */

renderProductsCatalog();