/* ==================================================
   CROMA DRIP
   CARRINHO COMPARTILHADO
================================================== */

const CART_STORAGE_KEY =
  "cromaCart";


/* ==================================================
   CARREGAR CARRINHO
================================================== */

function loadCart() {

  try {

    const savedCart =
      JSON.parse(
        localStorage.getItem(
          CART_STORAGE_KEY
        )
      );


    if (
      !Array.isArray(
        savedCart
      )
    ) {
      return [];
    }


    return savedCart
      .filter(item => {

        return (
          item &&
          item.productId &&
          Number(item.quantity) > 0
        );

      })
      .map(item => {

        return {

          productId:
            item.productId,

          quantity:
            Number(
              item.quantity
            ),

          size:
            item.size ||
            null

        };

      });

  } catch (error) {

    console.error(
      "Erro ao carregar carrinho:",
      error
    );

    return [];

  }

}


let cart =
  loadCart();


/* ==================================================
   ELEMENTOS
================================================== */

const cartDrawer =
  document.querySelector(
    "#cartDrawer"
  );


const cartOverlay =
  document.querySelector(
    "#cartOverlay"
  );


const openCartButton =
  document.querySelector(
    "#openCart"
  );


const closeCartButton =
  document.querySelector(
    "#closeCart"
  );


const continueShopping =
  document.querySelector(
    "#continueShopping"
  );


const continueShoppingFooter =
  document.querySelector(
    "#continueShoppingFooter"
  );


const cartItems =
  document.querySelector(
    "#cartItems"
  );


const emptyCart =
  document.querySelector(
    "#emptyCart"
  );


const cartSubtotal =
  document.querySelector(
    "#cartSubtotal"
  );


const cartCount =
  document.querySelector(
    "#cartCount"
  );


const shippingMessage =
  document.querySelector(
    "#shippingMessage"
  );


const shippingProgressBar =
  document.querySelector(
    "#shippingProgressBar"
  );


const cartWhatsapp =
  document.querySelector(
    "#cartWhatsapp"
  );


const freeShippingGoalValue =
  document.querySelector(
    "#freeShippingGoalValue"
  );


/* ==================================================
   SALVAR
================================================== */

function saveCart() {

  try {

    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(
        cart
      )
    );

  } catch (error) {

    console.error(
      "Erro ao salvar carrinho:",
      error
    );

  }

}


/* ==================================================
   ABRIR CARRINHO
================================================== */

function openCart() {

  cartDrawer
    ?.classList
    .add("active");


  cartOverlay
    ?.classList
    .add("active");


  document.body
    .classList
    .add("cart-open");

}


/* ==================================================
   FECHAR CARRINHO
================================================== */

function closeCart() {

  cartDrawer
    ?.classList
    .remove("active");


  cartOverlay
    ?.classList
    .remove("active");


  document.body
    .classList
    .remove("cart-open");

}


/* ==================================================
   EVENTOS DO DRAWER
================================================== */

openCartButton
  ?.addEventListener(
    "click",
    openCart
  );


closeCartButton
  ?.addEventListener(
    "click",
    closeCart
  );


cartOverlay
  ?.addEventListener(
    "click",
    closeCart
  );


continueShopping
  ?.addEventListener(
    "click",
    closeCart
  );


continueShoppingFooter
  ?.addEventListener(
    "click",
    closeCart
  );


document
  .addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Escape"
      ) {

        closeCart();

      }

    }
  );


/* ==================================================
   ADICIONAR AO CARRINHO
================================================== */

function addToCart(
  productId,
  quantity = 1,
  size = null
) {

  const product =
    getProductById(
      productId
    );


  if (
    !product ||
    !isProductAvailable(
      product
    )
  ) {

    return false;

  }


  const quantityToAdd =
    Math.max(
      1,
      Number(quantity) || 1
    );


  const existingItem =
    cart.find(item => {

      return (
        item.productId ===
          productId &&
        item.size ===
          size
      );

    });


  if (existingItem) {

    existingItem.quantity +=
      quantityToAdd;

  } else {

    cart.push({

      productId:
        productId,

      quantity:
        quantityToAdd,

      size:
        size

    });

  }


  saveCart();

  renderCart();

  return true;

}


/* ==================================================
   REMOVER ITEM
================================================== */

function removeCartItem(
  productId,
  size
) {

  cart =
    cart.filter(item => {

      return !(
        item.productId ===
          productId &&
        item.size ===
          size
      );

    });


  saveCart();

  renderCart();

}


/* ==================================================
   AUMENTAR QUANTIDADE
================================================== */

function increaseCartItem(
  productId,
  size
) {

  const item =
    cart.find(item => {

      return (
        item.productId ===
          productId &&
        item.size ===
          size
      );

    });


  if (!item) {
    return;
  }


  item.quantity++;


  saveCart();

  renderCart();

}


/* ==================================================
   DIMINUIR QUANTIDADE
================================================== */

function decreaseCartItem(
  productId,
  size
) {

  const item =
    cart.find(item => {

      return (
        item.productId ===
          productId &&
        item.size ===
          size
      );

    });


  if (!item) {
    return;
  }


  item.quantity--;


  if (
    item.quantity <= 0
  ) {

    removeCartItem(
      productId,
      size
    );

    return;

  }


  saveCart();

  renderCart();

}


/* ==================================================
   PRODUTO DO ITEM
================================================== */

function getCartProduct(
  item
) {

  return getProductById(
    item.productId
  );

}


/* ==================================================
   ITENS VÁLIDOS
================================================== */

function getValidCartItems() {

  return cart.filter(item => {

    const product =
      getCartProduct(
        item
      );


    return (
      product &&
      product.active
    );

  });

}


/* ==================================================
   SUBTOTAL
================================================== */

function calculateCartSubtotal() {

  return getValidCartItems()
    .reduce(
      (
        total,
        item
      ) => {

        const product =
          getCartProduct(
            item
          );


        return (
          total +
          product.price *
          item.quantity
        );

      },
      0
    );

}


/* ==================================================
   QUANTIDADE TOTAL
================================================== */

function calculateCartQuantity() {

  return getValidCartItems()
    .reduce(
      (
        total,
        item
      ) => {

        return (
          total +
          item.quantity
        );

      },
      0
    );

}


/* ==================================================
   FRETE GRÁTIS
================================================== */

function updateShippingGoal(
  subtotal
) {

  const goal =
    STORE_CONFIG
      .freeShippingGoal;


  if (
    freeShippingGoalValue
  ) {

    freeShippingGoalValue
      .textContent =
        formatCurrency(
          goal
        );

  }


  if (
    !shippingMessage ||
    !shippingProgressBar
  ) {
    return;
  }


  const progress =
    Math.min(
      (
        subtotal /
        goal
      ) * 100,
      100
    );


  shippingProgressBar
    .style
    .width =
      `${progress}%`;


  if (
    subtotal >=
    goal
  ) {

    shippingMessage
      .textContent =
        "Você ganhou frete grátis!";


    shippingMessage
      .classList
      .add(
        "achieved"
      );

    return;

  }


  const missing =
    goal -
    subtotal;


  shippingMessage
    .textContent =
      `Faltam ${formatCurrency(
        missing
      )} para frete grátis`;


  shippingMessage
    .classList
    .remove(
      "achieved"
    );

}


/* ==================================================
   RENDERIZAR CARRINHO
================================================== */

function renderCart() {

  if (!cartItems) {
    return;
  }


  const validItems =
    getValidCartItems();


  cartItems.innerHTML =
    "";


  if (
    validItems.length === 0
  ) {

    cartItems.innerHTML = `

      <div
        class="empty-cart"
        id="emptyCart"
      >

        <p>
          Seu carrinho está vazio.
        </p>

        <button
          class="continue-shopping"
          id="continueShopping"
          type="button"
        >
          CONTINUAR COMPRANDO
        </button>

      </div>

    `;


    document
      .querySelector(
        "#continueShopping"
      )
      ?.addEventListener(
        "click",
        closeCart
      );

  } else {

    validItems.forEach(
      item => {

        const product =
          getCartProduct(
            item
          );


        const size =
          item.size ||
          product.sizes?.[0]?.name ||
          "ÚNICO";


        const itemTotal =
          product.price *
          item.quantity;


        const element =
          document.createElement(
            "article"
          );


        element.className =
          "cart-item";


        element.innerHTML = `

          <div
            class="cart-item-image"
          >

            <img
              src="${getProductMainImage(
                product
              )}"
              alt="${product.name}"
            >

          </div>


          <div
            class="cart-item-info"
          >


            <div
              class="cart-item-top"
            >

              <div>

                <h3>
                  ${product.displayName || product.name}
                </h3>

                <span>
                  TAMANHO: ${size}
                </span>

              </div>


              <button
                class="remove-cart-item"
                type="button"
                aria-label="Remover ${product.name}"
              >
                ×
              </button>

            </div>


            <div
              class="cart-item-bottom"
            >


              <div
                class="cart-item-quantity"
              >

                <button
                  class="cart-minus"
                  type="button"
                  aria-label="Diminuir quantidade"
                >
                  −
                </button>


                <span>
                  ${item.quantity}
                </span>


                <button
                  class="cart-plus"
                  type="button"
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>

              </div>


              <strong>
                ${formatCurrency(
                  itemTotal
                )}
              </strong>

            </div>


          </div>

        `;


        element
          .querySelector(
            ".remove-cart-item"
          )
          ?.addEventListener(
            "click",
            () => {

              removeCartItem(
                item.productId,
                item.size
              );

            }
          );


        element
          .querySelector(
            ".cart-minus"
          )
          ?.addEventListener(
            "click",
            () => {

              decreaseCartItem(
                item.productId,
                item.size
              );

            }
          );


        element
          .querySelector(
            ".cart-plus"
          )
          ?.addEventListener(
            "click",
            () => {

              increaseCartItem(
                item.productId,
                item.size
              );

            }
          );


        cartItems
          .appendChild(
            element
          );

      }
    );

  }


  const subtotal =
    calculateCartSubtotal();


  const totalQuantity =
    calculateCartQuantity();


  if (
    cartSubtotal
  ) {

    cartSubtotal
      .textContent =
        formatCurrency(
          subtotal
        );

  }


  if (
    cartCount
  ) {

    cartCount.textContent =
      totalQuantity;


    cartCount
      .classList
      .toggle(
        "active",
        totalQuantity > 0
      );

  }


  if (
    cartWhatsapp
  ) {

    cartWhatsapp.disabled =
      validItems.length === 0;

  }


  updateShippingGoal(
    subtotal
  );

}


/* ==================================================
   WHATSAPP
================================================== */

function buildWhatsappMessage() {

  const validItems =
    getValidCartItems();


  if (
    validItems.length === 0
  ) {

    return null;

  }


  let message =
`Olá! Quero finalizar este pedido na ${STORE_CONFIG.name}:

`;


  validItems.forEach(
    (
      item,
      index
    ) => {

      const product =
        getCartProduct(
          item
        );


      const size =
        item.size ||
        product.sizes?.[0]?.name ||
        "ÚNICO";


      const total =
        product.price *
        item.quantity;


      message +=
`${index + 1}. ${product.name}
Tamanho: ${size}
Quantidade: ${item.quantity}
Valor: ${formatCurrency(total)}

`;

    }
  );


  const subtotal =
    calculateCartSubtotal();


  message +=
`Subtotal: ${formatCurrency(subtotal)}`;


  if (
    subtotal >=
    STORE_CONFIG
      .freeShippingGoal
  ) {

    message +=
`

Frete grátis atingido.`;

  }


  return message;

}


/* ==================================================
   FINALIZAR PELO WHATSAPP
================================================== */

cartWhatsapp
  ?.addEventListener(
    "click",
    () => {

      const message =
        buildWhatsappMessage();


      if (!message) {
        return;
      }


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
   SINCRONIZAR ENTRE ABAS
================================================== */

window
  .addEventListener(
    "storage",
    event => {

      if (
        event.key !==
        CART_STORAGE_KEY
      ) {
        return;
      }


      cart =
        loadCart();


      renderCart();

    }
  );


/* ==================================================
   INICIALIZAR
================================================== */

renderCart();