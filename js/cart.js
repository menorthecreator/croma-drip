/* ==================================================
   CROMA DRIP
   CARRINHO COMPARTILHADO
   CONTROLE DE ESTOQUE
================================================== */


/* ==================================================
   CHAVE DO LOCALSTORAGE

   O carrinho continua armazenando somente:

   productId
   quantity
   size

   O estoque e o preço são sempre consultados
   novamente no catálogo PRODUCTS.
================================================== */

const CART_STORAGE_KEY =
  "cromaCart";


/* ==================================================
   CARREGAR CARRINHO

   Recupera o carrinho salvo no navegador.

   Também limpa estruturas inválidas para evitar
   erros caso o localStorage esteja corrompido.
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

      .filter(
        item => {

          return (
            item &&
            item.productId &&
            Number(item.quantity) > 0
          );

        }
      )

      .map(
        item => {

          return {

            productId:
              item.productId,

            quantity:
              Math.max(
                1,
                Math.floor(
                  Number(
                    item.quantity
                  ) || 1
                )
              ),

            size:
              item.size ||
              null

          };

        }
      );


  } catch (error) {

    console.error(
      "Erro ao carregar carrinho:",
      error
    );


    return [];

  }

}


/* ==================================================
   ESTADO DO CARRINHO
================================================== */

let cart =
  loadCart();


/* ==================================================
   ELEMENTOS DO CARRINHO
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
   SALVAR CARRINHO
================================================== */

function saveCart() {

  try {

    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(
        cart
      )
    );


    /* AVISA O RESTANTE DO SITE
       QUE O CARRINHO MUDOU */

    window.dispatchEvent(
      new CustomEvent(
        "croma:cart-updated",
        {
          detail: {
            cart
          }
        }
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
   PRODUTO DO ITEM

   Recebe um item do carrinho e encontra
   o produto correspondente no PRODUCTS.
================================================== */

function getCartProduct(
  item
) {

  if (!item) {
    return null;
  }


  return (
    getProductById(
      item.productId
    ) ||
    null
  );

}


/* ==================================================
   TAMANHO DO ITEM

   O carrinho atualmente salva o NOME:

   "ÚNICO"
   "P"
   "M"
   "G"

   Esta função encontra o objeto completo
   correspondente dentro do produto.
================================================== */

function getCartItemSize(
  product,
  sizeName
) {

  if (
    !product ||
    !Array.isArray(
      product.sizes
    ) ||
    !sizeName
  ) {

    return null;

  }


  return (
    product.sizes.find(
      size =>
        size.name ===
        sizeName
    ) ||
    null
  );

}


/* ==================================================
   ESTOQUE DISPONÍVEL PARA UM ITEM

   Se o produto possui tamanho:

   consulta o estoque daquele tamanho.

   Exemplo:

   M → stock: 3

   retorna 3.

   Para produtos sem tamanho,
   utiliza o estoque total.

   trackStock: false
   significa estoque ilimitado.
================================================== */

function getCartItemStock(
  product,
  sizeName = null
) {

  if (!product) {
    return 0;
  }


  if (
    product.trackStock === false
  ) {

    return Infinity;

  }


  const sizeObject =
    getCartItemSize(
      product,
      sizeName
    );


  if (sizeObject) {

    return getSizeStock(
      product,
      sizeObject.id
    );

  }


  /*
     Se o produto possui tamanhos,
     mas nenhum tamanho válido foi encontrado,
     não permitimos assumir o estoque total.

     Isso evita uma inconsistência como:

     tamanho antigo/inexistente no localStorage.
  */

  if (
    Array.isArray(
      product.sizes
    ) &&
    product.sizes.length > 0
  ) {

    return 0;

  }


  return getProductStock(
    product
  );

}


/* ==================================================
   VALIDAR ITEM DO CARRINHO

   Um item só é válido quando:

   - produto existe;
   - produto está ativo;
   - possui estoque;
   - tamanho ainda existe;
   - tamanho possui estoque;
   - quantidade não ultrapassa estoque.

   IMPORTANTE:

   Esta função NÃO diminui estoque.
   Ela apenas verifica.
================================================== */

function isCartItemValid(
  item
) {

  const product =
    getCartProduct(
      item
    );


  if (
    !product ||
    !product.active ||
    !isProductAvailable(
      product
    )
  ) {

    return false;

  }


  const stock =
    getCartItemStock(
      product,
      item.size
    );


  if (stock <= 0) {

    return false;

  }


  const quantity =
    Number(
      item.quantity
    );


  if (
    !Number.isInteger(
      quantity
    ) ||
    quantity <= 0
  ) {

    return false;

  }


  if (
    Number.isFinite(
      stock
    ) &&
    quantity > stock
  ) {

    return false;

  }


  return true;

}


/* ==================================================
   SINCRONIZAR CARRINHO COM ESTOQUE

   Esta função é importante.

   Imagine:

   ontem:
   estoque = 5
   cliente colocou 5 no carrinho

   hoje:
   estoque foi alterado para 2

   O carrinho antigo ainda poderia conter 5.

   Aqui corrigimos automaticamente:

   carrinho 5 → carrinho 2

   Se estoque chegar a 0:
   o item é removido do carrinho.

   Isso é apenas sincronização LOCAL.

   Futuramente o backend fará a validação oficial.
================================================== */

function syncCartWithStock() {

  let changed =
    false;


  const synchronizedCart =
    [];


  cart.forEach(
    item => {

      const product =
        getCartProduct(
          item
        );


      /*
         Produto removido ou ocultado.
      */

      if (
        !product ||
        !product.active
      ) {

        changed =
          true;

        return;

      }


      /*
         Produto completamente SOLD.
      */

      if (
        !isProductAvailable(
          product
        )
      ) {

        changed =
          true;

        return;

      }


      const stock =
        getCartItemStock(
          product,
          item.size
        );


      /*
         Tamanho sem estoque ou inválido.
      */

      if (stock <= 0) {

        changed =
          true;

        return;

      }


      let quantity =
        Math.max(
          1,
          Math.floor(
            Number(
              item.quantity
            ) || 1
          )
        );


      /*
         Carrinho maior que o estoque?

         Reduz automaticamente para
         o máximo disponível.
      */

      if (
        Number.isFinite(
          stock
        ) &&
        quantity > stock
      ) {

        quantity =
          stock;

        changed =
          true;

      }


      synchronizedCart.push({

        productId:
          item.productId,

        quantity:
          quantity,

        size:
          item.size ||
          null

      });

    }
  );


  cart =
    synchronizedCart;


  if (changed) {

    saveCart();

  }


  return changed;

}


/* ==================================================
   ABRIR CARRINHO
================================================== */

function openCart() {

  /*
     Antes de abrir, sincroniza com o estoque.

     Assim o usuário não vê uma quantidade
     antiga que já não existe mais.
  */

  syncCartWithStock();


  cartDrawer
    ?.classList
    .add(
      "active"
    );


  cartOverlay
    ?.classList
    .add(
      "active"
    );


  document.body
    .classList
    .add(
      "cart-open"
    );


  renderCart();

}


/* ==================================================
   FECHAR CARRINHO
================================================== */

function closeCart() {

  cartDrawer
    ?.classList
    .remove(
      "active"
    );


  cartOverlay
    ?.classList
    .remove(
      "active"
    );


  document.body
    .classList
    .remove(
      "cart-open"
    );

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


/* ESC fecha o carrinho */

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

   Esta função agora consulta estoque ANTES
   de adicionar qualquer quantidade.

   IMPORTANTE:

   adicionar ao carrinho NÃO reduz stock.

   O stock representa estoque físico disponível
   na fonte atual de dados.
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


  /* Produto inexistente / oculto / SOLD */

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
      Math.floor(
        Number(
          quantity
        ) || 1
      )
    );


  /*
     Descobre o estoque específico
     daquela variação/tamanho.
  */

  const stock =
    getCartItemStock(
      product,
      size
    );


  if (stock <= 0) {

    return false;

  }


  const existingItem =
    cart.find(
      item => {

        return (
          item.productId ===
            productId &&
          item.size ===
            size
        );

      }
    );


  /*
     Se o item já existe:

     precisamos considerar:

     quantidade no carrinho
     +
     nova quantidade

     Exemplo:

     estoque = 3

     carrinho já possui 2

     usuário tenta adicionar +2

     2 + 2 = 4

     NÃO permitimos.
  */

  const currentQuantity =
    existingItem
      ? Number(
          existingItem.quantity
        ) || 0
      : 0;


  const finalQuantity =
    currentQuantity +
    quantityToAdd;


  if (
    Number.isFinite(
      stock
    ) &&
    finalQuantity > stock
  ) {

    return false;

  }


  /* ==============================================
     ITEM JÁ EXISTE
  ============================================== */

  if (existingItem) {

    existingItem.quantity =
      finalQuantity;

  }


  /* ==============================================
     ITEM NOVO
  ============================================== */

  else {

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
    cart.filter(
      item => {

        return !(
          item.productId ===
            productId &&
          item.size ===
            size
        );

      }
    );


  saveCart();

  renderCart();

}


/* ==================================================
   AUMENTAR QUANTIDADE

   O botão + agora respeita o estoque.

   Exemplo:

   estoque = 3
   carrinho = 3

   clicar + não faz nada.
================================================== */

function increaseCartItem(
  productId,
  size
) {

  const item =
    cart.find(
      item => {

        return (
          item.productId ===
            productId &&
          item.size ===
            size
        );

      }
    );


  if (!item) {
    return false;
  }


  const product =
    getCartProduct(
      item
    );


  if (
    !product ||
    !isProductAvailable(
      product
    )
  ) {

    syncCartWithStock();

    renderCart();

    return false;

  }


  const stock =
    getCartItemStock(
      product,
      size
    );


  const nextQuantity =
    item.quantity + 1;


  /*
     Chegou no limite?

     Não aumenta.
  */

  if (
    Number.isFinite(
      stock
    ) &&
    nextQuantity > stock
  ) {

    return false;

  }


  item.quantity =
    nextQuantity;


  saveCart();

  renderCart();


  return true;

}


/* ==================================================
   DIMINUIR QUANTIDADE

   Se chegar em zero,
   remove completamente o item.
================================================== */

function decreaseCartItem(
  productId,
  size
) {

  const item =
    cart.find(
      item => {

        return (
          item.productId ===
            productId &&
          item.size ===
            size
        );

      }
    );


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
   ITENS VÁLIDOS

   Antes de calcular preço ou finalizar,
   utilizamos somente itens que continuam
   compatíveis com o estoque atual.
================================================== */

function getValidCartItems() {

  return cart.filter(
    item =>
      isCartItemValid(
        item
      )
  );

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

   Controla também o número exibido
   no ícone do carrinho.
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

   Aqui mostramos apenas itens que ainda
   continuam válidos de acordo com:

   produto ativo
   tamanho existente
   estoque disponível
   quantidade válida
================================================== */

function renderCart() {

  if (!cartItems) {
    return;
  }


  /*
     Antes de renderizar, conferimos se o
     estoque mudou desde a última interação.
  */

  syncCartWithStock();


  const validItems =
    getValidCartItems();


  cartItems.innerHTML =
    "";


  /* ==================================================
     CARRINHO VAZIO
  ================================================== */

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

  }


  /* ==================================================
     ITENS DO CARRINHO
  ================================================== */

  else {

    validItems.forEach(
      item => {

        const product =
          getCartProduct(
            item
          );


        if (!product) {
          return;
        }


        const size =
          item.size ||
          product.sizes?.[0]?.name ||
          "ÚNICO";


        /*
           Estoque atual da variação.
        */

        const stock =
          getCartItemStock(
            product,
            item.size
          );


        const itemTotal =
          product.price *
          item.quantity;


        /*
           Descobre se já chegou no limite.

           Se:
           estoque = 3
           quantidade = 3

           botão + fica desativado.
        */

        const reachedStockLimit =
          Number.isFinite(
            stock
          ) &&
          item.quantity >= stock;


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
              onerror="this.onerror=null;this.src='assets/logo.png';"
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
                  ${
                    reachedStockLimit
                      ? "disabled"
                      : ""
                  }
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


        /* ==================================================
           REMOVER
        ================================================== */

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


        /* ==================================================
           DIMINUIR
        ================================================== */

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


        /* ==================================================
           AUMENTAR

           A função increaseCartItem()
           faz a validação novamente.

           Portanto mesmo que alguém remova
           o atributo disabled pelo DevTools,
           o JavaScript continua bloqueando
           quantidade acima do estoque.
        ================================================== */

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


  /* ==================================================
     SUBTOTAL
  ================================================== */

  const subtotal =
    calculateCartSubtotal();


  /* ==================================================
     QUANTIDADE TOTAL
  ================================================== */

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


  /* ==================================================
     CONTADOR NO ÍCONE
  ================================================== */

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


  /* ==================================================
     BOTÃO WHATSAPP

     Só habilitamos se houver pelo menos
     um item válido no carrinho.
  ================================================== */

  if (
    cartWhatsapp
  ) {

    cartWhatsapp.disabled =
      validItems.length === 0;

  }


  /* ==================================================
     FRETE
  ================================================== */

  updateShippingGoal(
    subtotal
  );

}


/* ==================================================
   VALIDAR CARRINHO ANTES DO WHATSAPP

   Esta é uma segunda barreira.

   Mesmo que o usuário tenha deixado o carrinho
   aberto por algum tempo, antes de mandar o pedido
   conferimos o estoque mais uma vez.

   IMPORTANTE:

   ainda NÃO reduz estoque.
================================================== */

function validateCartBeforeCheckout() {

  /*
     Atualiza quantidades antigas.

     Exemplo:

     carrinho tinha 5
     estoque agora é 2

     vira 2.
  */

  syncCartWithStock();


  const validItems =
    getValidCartItems();


  if (
    validItems.length === 0
  ) {

    renderCart();

    return false;

  }


  /*
     Confirma item por item.
  */

  const allItemsValid =
    validItems.every(
      item => {

        const product =
          getCartProduct(
            item
          );


        if (
          !product ||
          !isProductAvailable(
            product
          )
        ) {

          return false;

        }


        const stock =
          getCartItemStock(
            product,
            item.size
          );


        if (stock <= 0) {

          return false;

        }


        if (
          Number.isFinite(
            stock
          ) &&
          item.quantity > stock
        ) {

          return false;

        }


        return true;

      }
    );


  if (!allItemsValid) {

    syncCartWithStock();

    renderCart();

    return false;

  }


  return true;

}


/* ==================================================
   MENSAGEM DO WHATSAPP

   Gera somente o texto do pedido.

   NÃO altera estoque.
   NÃO cria venda.
   NÃO reserva produto.

   Na arquitetura futura:

   pagamento confirmado
          ↓
   backend
          ↓
   baixa de estoque
================================================== */

function buildWhatsappMessage() {

  if (
    !validateCartBeforeCheckout()
  ) {

    return null;

  }


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


      if (!product) {
        return;
      }


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
`Subtotal: ${formatCurrency(
  subtotal
)}`;


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

   ATENÇÃO:

   clicar aqui NÃO reduz estoque.

   WhatsApp representa somente intenção
   de finalizar o pedido.

   A baixa real será responsabilidade
   do backend/admin no futuro.
================================================== */

cartWhatsapp
  ?.addEventListener(
    "click",
    () => {

      /*
         Última conferência antes
         de abrir o WhatsApp.
      */

      if (
        !validateCartBeforeCheckout()
      ) {

        return;

      }


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

   Exemplo:

   Loja aberta em duas abas.

   Se o carrinho mudar em uma,
   a outra recebe a atualização.

   Também fazemos nova verificação
   de estoque.
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


      syncCartWithStock();

      renderCart();

    }
  );


/* ==================================================
   ATUALIZAR QUANDO A ABA VOLTA AO FOCO

   Isso ajuda quando o usuário:

   abre outra aba
   ↓
   volta para a loja
   ↓
   carrinho é revalidado

   No futuro, com API, este ponto poderá
   consultar novamente o servidor.
================================================== */

window
  .addEventListener(
    "focus",
    () => {

      syncCartWithStock();

      renderCart();

    }
  );


/* ==================================================
   ATUALIZAR QUANDO A PÁGINA VOLTA A FICAR VISÍVEL

   Útil principalmente em celular.

   Exemplo:

   site
   ↓
   WhatsApp
   ↓
   volta para o navegador

   Revalidamos o carrinho.

   Novamente:

   NÃO damos baixa no estoque.
================================================== */

document
  .addEventListener(
    "visibilitychange",
    () => {

      if (
        document.visibilityState ===
        "visible"
      ) {

        syncCartWithStock();

        renderCart();

      }

    }
  );


/* ==================================================
   INICIALIZAR

   Assim que cart.js carrega:

   1. lê localStorage
   2. confere estoque
   3. corrige carrinho antigo
   4. renderiza
================================================== */

syncCartWithStock();

renderCart();