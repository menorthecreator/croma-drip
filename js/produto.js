/* ==================================================
   CROMA DRIP
   PÁGINA DINÂMICA DE PRODUTO
================================================== */


/* ==================================================
   IDENTIFICAR PRODUTO PELA URL

   Exemplo:
   produto.html?id=no-cap-vol01
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

   active: false
   = produto não deve ser acessado/exibido.

   IMPORTANTE:
   stock: 0 NÃO entra aqui.
   Produto sem estoque continua existindo,
   porém aparece como SOLD.
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


/* ==================================================
   PRIMEIRO TAMANHO COM ESTOQUE

   Antes utilizávamos:

   size.available

   Agora a disponibilidade vem diretamente
   do estoque:

   stock > 0 = disponível
   stock = 0 = indisponível
================================================== */

const firstAvailableSize =
  product.sizes?.find(
    size =>
      isSizeAvailable(
        product,
        size.id
      )
  );


/*
   Mantemos o NOME do tamanho aqui porque
   o carrinho atual trabalha com valores como:

   "ÚNICO"
   "P"
   "M"
   "G"
*/

let selectedSize =
  firstAvailableSize?.name ||
  null;


/* ==================================================
   TÍTULO DA ABA
================================================== */

document.title =
  `${product.displayName || product.name} | Croma Drip`;


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

  ].filter(
    image =>
      Boolean(image.src)
  );


  if (
    images.length === 0
  ) {
    return;
  }


  /* Imagem principal */

  mainImage.src =
    images[0].src;

  mainImage.alt =
    product.name;


  /* Fallback caso a imagem não exista */

  mainImage.onerror = () => {

    mainImage.onerror = null;

    mainImage.src =
      "assets/logo.png";

  };


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
          onerror="this.onerror=null;this.src='assets/logo.png';"
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

   Cada tamanho possui seu próprio estoque.

   Exemplo:

   {
     id: "m",
     name: "M",
     stock: 4
   }

   stock: 0
   = botão daquele tamanho fica bloqueado.
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


      /* ==============================================
         VERIFICAR ESTOQUE DO TAMANHO
      ============================================== */

      const sizeAvailable =
        isSizeAvailable(
          product,
          size.id
        );


      /*
         stock = 0

         Bloqueamos o tamanho e adicionamos
         a classe visual "unavailable".
      */

      if (!sizeAvailable) {

        button.disabled =
          true;


        button.classList.add(
          "unavailable"
        );

      }


      /* Tamanho selecionado */

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

          /*
             Segurança extra:
             tamanho sem estoque não pode
             ser selecionado.
          */

          if (
            !sizeAvailable
          ) {
            return;
          }


          selectedSize =
            size.name;


          /*
             Quando trocar de tamanho,
             voltamos a quantidade para 1.

             Isso evita:

             M possui 5
             cliente seleciona 5

             depois troca para P
             que possui apenas 2.
          */

          quantity = 1;


          updateSelectedSize();

          updateQuantity();

          updateAvailability();


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
   PEGAR OBJETO DO TAMANHO SELECIONADO

   selectedSize guarda o nome:

   "ÚNICO"

   Mas para consultar estoque precisamos
   encontrar o objeto completo:

   {
     id: "unico",
     name: "ÚNICO",
     stock: 3
   }
================================================== */

function getSelectedSizeObject() {

  if (
    !selectedSize ||
    !Array.isArray(
      product.sizes
    )
  ) {
    return null;
  }


  return (
    product.sizes.find(
      size =>
        size.name ===
        selectedSize
    ) ||
    null
  );

}


/* ==================================================
   ESTOQUE DA SELEÇÃO ATUAL

   Se existir tamanho selecionado:
   retorna estoque daquele tamanho.

   Caso contrário:
   retorna estoque total do produto.

   trackStock: false
   retorna Infinity porque não existe limite.
================================================== */

function getCurrentStock() {

  if (
    product.trackStock === false
  ) {

    return Infinity;

  }


  const selectedSizeObject =
    getSelectedSizeObject();


  if (selectedSizeObject) {

    return getSizeStock(
      product,
      selectedSizeObject.id
    );

  }


  return getProductStock(
    product
  );

}


/* ==================================================
   QUANTIDADE

   A quantidade nunca poderá ultrapassar
   o estoque disponível.
================================================== */

function updateQuantity() {

  const currentStock =
    getCurrentStock();


  /*
     Se o estoque mudou e a quantidade atual
     ficou maior que o disponível,
     corrigimos automaticamente.
  */

  if (
    Number.isFinite(
      currentStock
    ) &&
    currentStock > 0 &&
    quantity > currentStock
  ) {

    quantity =
      currentStock;

  }


  /*
     Quantidade nunca pode ficar abaixo de 1.
  */

  if (quantity < 1) {

    quantity = 1;

  }


  if (quantityValue) {

    quantityValue.textContent =
      quantity;

  }


  /* ==============================================
     BOTÃO MENOS
  ============================================== */

  if (minusButton) {

    minusButton.disabled =
      !isProductAvailable(
        product
      ) ||
      quantity <= 1;

  }


  /* ==============================================
     BOTÃO MAIS

     Quando atingir o estoque máximo,
     o botão + fica bloqueado.
  ============================================== */

  if (plusButton) {

    plusButton.disabled =
      !isProductAvailable(
        product
      ) ||
      (
        Number.isFinite(
          currentStock
        ) &&
        quantity >=
          currentStock
      );

  }

}


/* ==================================================
   DIMINUIR QUANTIDADE
================================================== */

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


/* ==================================================
   AUMENTAR QUANTIDADE
================================================== */

plusButton?.addEventListener(
  "click",
  () => {

    const currentStock =
      getCurrentStock();


    /*
       Impede ultrapassar o estoque.

       Exemplo:

       estoque = 3
       quantidade = 3

       clicar + não faz nada.
    */

    if (
      Number.isFinite(
        currentStock
      ) &&
      quantity >=
        currentStock
    ) {

      return;

    }


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
   ABRIR / FECHAR DESCRIÇÃO
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

   Antes de enviar para o carrinho,
   validamos novamente o estoque.
================================================== */

addToCartProduct?.addEventListener(
  "click",
  () => {

    /* Produto completamente sem estoque */

    if (
      !isProductAvailable(
        product
      )
    ) {
      return;
    }


    /* Produto exige tamanho */

    if (
      product.sizes?.length &&
      !selectedSize
    ) {
      return;
    }


    const selectedSizeObject =
      getSelectedSizeObject();


    const sizeId =
      selectedSizeObject?.id ||
      null;


    /*
       Validação de estoque.

       Exemplo:

       estoque = 2
       quantidade solicitada = 3

       resultado = false
    */

    if (
      !canPurchaseQuantity(
        product,
        quantity,
        sizeId
      )
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

   Compra pelo WhatsApp também respeita
   o estoque atual.
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


    const selectedSizeObject =
      getSelectedSizeObject();


    const sizeId =
      selectedSizeObject?.id ||
      null;


    /*
       Não permite solicitar pelo WhatsApp
       quantidade maior que o estoque.
    */

    if (
      !canPurchaseQuantity(
        product,
        quantity,
        sizeId
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
   DISPONIBILIDADE / ESTOQUE DO PRODUTO

   Essa é uma das funções principais
   do novo sistema.

   NÃO utilizamos mais:

   product.available
   size.available

   Agora tudo é baseado em stock.
================================================== */

function updateAvailability() {

  const hasSizes =
    Array.isArray(
      product.sizes
    ) &&
    product.sizes.length > 0;


  /* ==============================================
     VERIFICAR SE EXISTE TAMANHO COM ESTOQUE
  ============================================== */

  const hasAvailableSize =
    !hasSizes ||
    product.sizes.some(
      size =>
        isSizeAvailable(
          product,
          size.id
        )
    );


  /*
     Produto disponível quando:

     active = true

     E

     existe estoque.
  */

  const available =
    isProductAvailable(
      product
    ) &&
    hasAvailableSize;


  const currentStock =
    getCurrentStock();


  /* ==================================================
     BOTÃO DO CARRINHO

     estoque > 0
     ADICIONAR AO CARRINHO

     estoque = 0
     SOLD
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
     BOTÃO MENOS
  ================================================== */

  if (minusButton) {

    minusButton.disabled =
      !available ||
      quantity <= 1;

  }


  /* ==================================================
     BOTÃO MAIS

     Também bloqueamos quando atingir
     o estoque disponível.

     Exemplo:

     stock: 1
     quantidade: 1
     botão + bloqueado

     stock: 3
     quantidade: 2
     botão + liberado

     stock: 3
     quantidade: 3
     botão + bloqueado
  ================================================== */

  if (plusButton) {

    plusButton.disabled =
      !available ||
      (
        Number.isFinite(
          currentStock
        ) &&
        quantity >=
          currentStock
      );

  }


  /* ==================================================
     WHATSAPP

     Produto disponível:
     botão aparece.

     Produto SOLD:
     botão desaparece.
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


  /*
     Garante que o contador respeite
     o estoque atual.
  */

  updateQuantity();

}


/* ==================================================
   INICIAR PÁGINA
================================================== */

renderGallery();

renderSizes();

renderDescription();

updateQuantity();

updateAvailability();