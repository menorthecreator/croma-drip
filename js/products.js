/* ==================================================
   CROMA DRIP
   CATÁLOGO CENTRAL DE PRODUTOS
================================================== */

const STORE_CONFIG = {
  name: "Croma Drip",
  whatsappPhone: "5561991801376",
  freeShippingGoal: 499,
  currency: "BRL",
  locale: "pt-BR"
};


/* ==================================================
   PRODUTOS
================================================== */

const PRODUCTS = [

  /* ==================================================
     NØ CAP VOL.01
  ================================================== */

  {
    id: "no-cap-vol01",

    name: "Nø Cap Vol.01",
    displayName: "NØ CAP VOL.01",

    category: "CROMA DRIP",

    price: 112,

    active: true,
    available: true,

    images: {
      front:
        "assets/produtos/no-cap-vol01/front.png",

      side:
        "assets/produtos/no-cap-vol01/side.png",

      back:
        "assets/produtos/no-cap-vol01/back.png"
    },

    viewerImages: [
      "assets/produtos/no-cap-vol01/side.png",
      "assets/produtos/no-cap-vol01/front.png",
      "assets/produtos/no-cap-vol01/back.png"
    ],

    description:
      "Nø Cap Vol.01 confeccionado em camurça, com acabamento Croma Drip e fechamento regulável.",

    details: {
      material: "Camurça",
      height: "17 cm",
      circumference: "58 a 62 cm",
      size: "Único ajustável"
    },

    sizes: [
      {
        id: "unico",
        name: "ÚNICO",
        available: true
      }
    ]
  },


  /* ==================================================
     NØ CAP VOL.02
  ================================================== */

  {
    id: "no-cap-vol02",

    name: "Nø Cap Vol.02",
    displayName: "NØ CAP VOL.02",

    category: "CROMA DRIP",

    price: 129.90,

    active: true,
    available: false,

    images: {
      front:
        "assets/produtos/no-cap-vol02/front.png",

      side:
        "assets/produtos/no-cap-vol02/side.png",

      back:
        "assets/produtos/no-cap-vol02/back.png"
    },

    viewerImages: [
      "assets/produtos/no-cap-vol02/side.png",
      "assets/produtos/no-cap-vol02/front.png",
      "assets/produtos/no-cap-vol02/back.png"
    ],

    description:
      "Nø Cap Vol.02 com construção premium, acabamento Croma Drip e fechamento regulável.",

    details: {
      material: "Sarja premium",
      height: "17 cm",
      circumference: "58 a 62 cm",
      size: "Único ajustável"
    },

    sizes: [
      {
        id: "unico",
        name: "ÚNICO",
        available: false
      }
    ]
  }

];


/* ==================================================
   BUSCAR PRODUTO PELO ID
================================================== */

function getProductById(productId) {

  return PRODUCTS.find(
    product =>
      product.id === productId
  );

}


/* ==================================================
   PRODUTOS ATIVOS
================================================== */

function getActiveProducts() {

  return PRODUCTS.filter(
    product =>
      product.active
  );

}


/* ==================================================
   FORMATAR MOEDA
================================================== */

function formatCurrency(value) {

  return Number(value)
    .toLocaleString(
      STORE_CONFIG.locale,
      {
        style: "currency",
        currency:
          STORE_CONFIG.currency
      }
    );

}


/* ==================================================
   LINK DO PRODUTO
================================================== */

function getProductUrl(productId) {

  return (
    `produto.html?id=${encodeURIComponent(
      productId
    )}`
  );

}


/* ==================================================
   IMAGEM PRINCIPAL
================================================== */

function getProductMainImage(product) {

  if (!product) {
    return "";
  }

  return product.images.front;

}


/* ==================================================
   DISPONIBILIDADE
================================================== */

function isProductAvailable(product) {

  return Boolean(
    product &&
    product.active &&
    product.available
  );

}