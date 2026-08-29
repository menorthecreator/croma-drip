/* ==================================================
   CROMA DRIP
   PÁGINA DINÂMICA DE PRODUTO
================================================== */


/* ==================================================
   IDENTIFICAR PRODUTO PELA URL
================================================== */

const params =
  new URLSearchParams(
    window.location.search
  );


const productId =
  params.get("id");


const product =
  getProductById(productId);


/* ==================================================
   VALIDAR PRODUTO
================================================== */

if (
  !product ||
  !product.active
) {

  document.body.innerHTML = `
    <main
      style="
        min-height:100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:40px;
        font-family:Montserrat,sans-serif;
        background:#f5f5f3;
        color:#111;
        text-align:center;
      "
    >
      <div>

        <p
          style="
            font-size:10px;
            letter-spacing:2px;
            color:#777;
            margin-bottom:15px;
          "
        >
          CROMA DRIP
        </p>

        <h1
          style="
            font-size:34px;
            margin-bottom:20px;
          "
        >
          PRODUTO NÃO ENCONTRADO
        </h1>

        <a
          href="index.html"
          style="
            color:#111;
            font-size:11px;
            font-weight:600;
            text-decoration:none;
            border-bottom:1px solid #111;
            padding-bottom:4px;
          "
        >
          VOLTAR PARA O CATÁLOGO
        </a>

      </div>
    </main>
  `;

  throw new Error(
    "Produto não encontrado."
  );

}


/* ==================================================
   ELEMENTOS DA PÁGINA
================================================== */

const mainImage =
  document.querySelector(
    "#mainProductImage"
  );


const thumbnailsContainer =
  document.querySelector(
    "#productThumbnails"
  );


const productCategory =
  document.querySelector(
    "#productCategory"
  );


const productName =
  document.querySelector(
    "#productName"
  );


const productPrice =
  document.querySelector(
    "#productPrice"
  );


const sizesContainer =
  document.querySelector(
    "#productSizes"
  );


const selectedSizeElement =
  document.querySelector(
    "#selectedSize"
  );


const minusButton =
  document.querySelector(
    "#minusButton"
  );


const plusButton =
  document.querySelector(
    "#plusButton"
  );


const quantityValue =
  document.querySelector(
    "#quantityValue"
  );


const addToCartProduct =
  document.querySelector(
    "#addToCartProduct"
  );


const whatsappButton =
  document.querySelector(
    "#whatsappButton"
  );


const description =
  document.querySelector(
    ".product-description"
  );


const descriptionToggle =
  document.querySelector(
    ".description-toggle"
  );


const descriptionContent =
  document.querySelector(
    "#descriptionContent"
  );


/* ==================================================
   ESTADO DA PÁGINA
================================================== */

let quantity = 1;


const firstAvailableSize =
  product.sizes?.find(
    size =>
      size.available
  );


let selectedSize =
  firstAvailableSize?.name ||
  null;


/* ==================================================
   TÍTULO DA ABA
================================================== */

document.title =
  `${product.displayName || product.name} | ${STORE_CONFIG.name}`;


/* ==================================================
   CONTEÚDO PRINCIPAL
================================================== */

if (productCategory) {

  productCategory.textContent =
    product.category;

}


if (productName) {

  productName.textContent =
    product.displayName ||
    product.name;

}


if (productPrice) {

  productPrice.textContent =
    formatCurrency(
      product.price
    );

}


/* ==================================================
   GALERIA
================================================== */

function renderGallery() {

  if (
    !mainImage ||
    !thumbnailsContainer
  ) {
    return;
  }


  const images = [
    {
      src:
        product.images.front,
      label:
        "Frente"
    },

    {
      src:
        product.images.side,
      label:
        "Lateral"
    },

    {
      src:
        product.images.back,
      label:
        "Traseira"
    }
  ]
  .filter(
    image =>
      Boolean(image.src)
  );


  if (
    images.length === 0
  ) {
    return;
  }


  mainImage.src =
    images[0].src;

  mainImage.alt =
    product.name;


  thumbnailsContainer.innerHTML =
    "";


  images.forEach(
    (image, index) => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        index === 0
          ? "thumbnail active"
          : "thumbnail";


      button.dataset.image =
        image.src;


      button.setAttribute(
        "aria-label",
        `${image.label} de ${product.name}`
      );


      button.innerHTML = `
        <img
          src="${image.src}"
          alt="${image.label}"
        >
      `;


      button.addEventListener(
        "click",
        () => {

          changeMainImage(
            image.src,
            button
          );

        }
      );


      thumbnailsContainer
        .appendChild(
          button
        );

    }
  );

}


/* ==================================================
   TROCAR IMAGEM
================================================== */

function changeMainImage(
  imageSrc,
  activeButton
) {

  if (!mainImage) {
    return;
  }


  if (
    mainImage.src
      .endsWith(imageSrc)
  ) {
    return;
  }


  mainImage.style.opacity =
    "0";


  setTimeout(
    () => {

      mainImage.src =
        imageSrc;

      mainImage.style.opacity =
        "1";

    },
    120
  );


  thumbnailsContainer
    ?.querySelectorAll(
      ".thumbnail"
    )
    .forEach(
      thumbnail => {

        thumbnail
          .classList
          .remove("active");

      }
    );


  activeButton
    ?.classList
    .add("active");

}


/* ==================================================
   TAMANHOS
================================================== */

function renderSizes() {

  if (!sizesContainer) {
    return;
  }


  sizesContainer.innerHTML =
    "";


  const sizes =
    product.sizes || [];


  sizes.forEach(
    size => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "size-button";


      button.dataset.size =
        size.name;


      button.textContent =
        size.name;


      if (!size.available) {

        button.disabled =
          true;

        button.classList.add(
          "unavailable"
        );

      }


      if (
        size.name ===
        selectedSize
      ) {

        button.classList.add(
          "active"
        );

      }


      button.addEventListener(
        "click",
        () => {

          if (
            !size.available
          ) {
            return;
          }


          selectedSize =
            size.name;


          updateSelectedSize();


          sizesContainer
            .querySelectorAll(
              ".size-button"
            )
            .forEach(
              item => {

                item.classList.remove(
                  "active"
                );

              }
            );


          button.classList.add(
            "active"
          );

        }
      );


      sizesContainer
        .appendChild(
          button
        );

    }
  );


  updateSelectedSize();

}


/* ==================================================
   TAMANHO SELECIONADO
================================================== */

function updateSelectedSize() {

  if (!selectedSizeElement) {
    return;
  }


  selectedSizeElement
    .textContent =
      selectedSize ||
      "INDISPONÍVEL";

}


/* ==================================================
   QUANTIDADE
================================================== */

function updateQuantity() {

  if (!quantityValue) {
    return;
  }


  quantityValue.textContent =
    quantity;

}


minusButton?.addEventListener(
  "click",
  () => {

    if (
      quantity <= 1
    ) {
      return;
    }


    quantity--;

    updateQuantity();

  }
);


plusButton?.addEventListener(
  "click",
  () => {

    quantity++;

    updateQuantity();

  }
);


/* ==================================================
   DESCRIÇÃO
================================================== */

function renderDescription() {

  if (!descriptionContent) {
    return;
  }


  const details =
    product.details || {};


  const detailItems = [];


  if (details.material) {

    detailItems.push(
      `<li>Material: ${details.material}</li>`
    );

  }


  if (details.height) {

    detailItems.push(
      `<li>Altura: ${details.height}</li>`
    );

  }


  if (
    details.circumference
  ) {

    detailItems.push(
      `<li>Circunferência: ${details.circumference}</li>`
    );

  }


  if (details.size) {

    detailItems.push(
      `<li>Tamanho: ${details.size}</li>`
    );

  }


  descriptionContent.innerHTML = `

    <p>
      ${product.description || ""}
    </p>

    ${
      detailItems.length > 0
        ? `
          <ul>
            ${detailItems.join("")}
          </ul>
        `
        : ""
    }

  `;

}


/* ==================================================
   ABRIR DESCRIÇÃO
================================================== */

descriptionToggle?.addEventListener(
  "click",
  () => {

    description
      ?.classList
      .toggle("open");

  }
);


/* ==================================================
   ADICIONAR AO CARRINHO
================================================== */

addToCartProduct?.addEventListener(
  "click",
  () => {

    if (
      !isProductAvailable(
        product
      )
    ) {
      return;
    }


    if (
      product.sizes?.length &&
      !selectedSize
    ) {
      return;
    }


    const added =
      addToCart(
        product.id,
        quantity,
        selectedSize
      );


    if (added) {

      openCart();

    }

  }
);


/* ==================================================
   WHATSAPP DIRETO DO PRODUTO
================================================== */

whatsappButton?.addEventListener(
  "click",
  event => {

    event.preventDefault();


    if (
      !isProductAvailable(
        product
      )
    ) {
      return;
    }


    const total =
      product.price *
      quantity;


    let message =
`Olá! Tenho interesse no ${product.name}.

Quantidade: ${quantity}`;


    if (selectedSize) {

      message +=
`
Tamanho: ${selectedSize}`;

    }


    if (
      product.details
        ?.circumference
    ) {

      message +=
`
Circunferência: ${product.details.circumference}`;

    }


    message +=
`
Valor unitário: ${formatCurrency(product.price)}
Total: ${formatCurrency(total)}`;


    const url =
      `https://wa.me/${STORE_CONFIG.whatsappPhone}?text=${encodeURIComponent(
        message
      )}`;


    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

  }
);


/* ==================================================
   PRODUTO INDISPONÍVEL
================================================== */

function updateAvailability() {

  const hasSizes =
    Array.isArray(
      product.sizes
    ) &&
    product.sizes.length > 0;


  const hasAvailableSize =
    !hasSizes ||
    product.sizes.some(
      size =>
        size.available
    );


  const available =
    isProductAvailable(
      product
    ) &&
    hasAvailableSize;


  /* ==================================================
     BOTÃO DO CARRINHO
  ================================================== */

  if (
    addToCartProduct
  ) {

    addToCartProduct.disabled =
      !available;


    addToCartProduct.textContent =
      available
        ? "ADICIONAR AO CARRINHO"
        : "SOLD";

  }


  /* ==================================================
     QUANTIDADE
  ================================================== */

  if (minusButton) {

    minusButton.disabled =
      !available;

  }


  if (plusButton) {

    plusButton.disabled =
      !available;

  }


  /* ==================================================
     WHATSAPP
  ================================================== */

  if (
    whatsappButton
  ) {

    if (available) {

      whatsappButton.style.display =
        "";

      whatsappButton
        .classList
        .remove(
          "disabled"
        );

      whatsappButton
        .removeAttribute(
          "aria-disabled"
        );

    } else {

      whatsappButton.style.display =
        "none";

      whatsappButton
        .classList
        .add(
          "disabled"
        );

      whatsappButton
        .setAttribute(
          "aria-disabled",
          "true"
        );

    }

  }

}
/* ==================================================
   INICIAR
================================================== */

renderGallery();
renderSizes();
renderDescription();
updateQuantity();
updateAvailability();