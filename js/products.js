/* ==================================================
   CROMA DRIP
   CATÁLOGO CENTRAL DE PRODUTOS
================================================== */


/* ==================================================
   CONFIGURAÇÕES GERAIS DA LOJA

   Aqui ficam informações usadas em várias partes
   do site, como WhatsApp, frete grátis e moeda.
================================================== */

const STORE_CONFIG = {

  // Nome da loja
  name: "Croma Drip",

  // Número do WhatsApp com DDI + DDD
  whatsappPhone: "5561991801376",

  // Valor mínimo para liberar frete grátis
  freeShippingGoal: 499,

  // Moeda utilizada pela loja
  currency: "BRL",

  // Formatação brasileira de valores
  locale: "pt-BR"

};


/* ==================================================
   PRODUTOS

   COMO CADASTRAR UM NOVO PRODUTO:

   1. Copie um produto existente.
   2. Troque o ID por um ID único.
   3. Altere nome, preço, imagens e descrição.
   4. Defina active como true para aparecer na loja.
   5. Informe o estoque dentro de "sizes".

   IMPORTANTE:

   NÃO usamos mais:
   available: true
   available: false

   A disponibilidade agora é calculada
   automaticamente através do estoque.

   stock: 0
   = produto/tamanho esgotado

   stock: 1 ou mais
   = produto/tamanho disponível
================================================== */

const PRODUCTS = [


  /* ==================================================
     NØ CAP VOL.01
  ================================================== */

  {
    /* --------------------------------------------------
       IDENTIFICAÇÃO DO PRODUTO

       O ID não deve conter espaços.
       Ele também é utilizado na URL da página.
    -------------------------------------------------- */

    id: "no-cap-vol01",

    name: "Nø Cap Vol.01",

    displayName: "NØ CAP VOL.01",

    category: "CROMA DRIP",


    /* --------------------------------------------------
       PREÇO

       Use apenas números.

       Exemplo:
       112
       129.90
       249.90
    -------------------------------------------------- */

    price: 112,


    /* --------------------------------------------------
       VISIBILIDADE DO PRODUTO

       true
       = aparece na loja

       false
       = produto fica completamente oculto

       IMPORTANTE:
       Para produto esgotado, NÃO coloque false.

       Deixe active: true
       e coloque stock: 0.

       Assim ele continua aparecendo com SOLD.
    -------------------------------------------------- */

    active: true,


    /* --------------------------------------------------
       CONTROLE DE ESTOQUE

       true
       = o produto utiliza controle de estoque.

       Mantemos essa propriedade porque futuramente
       podemos ter produtos sem limite de estoque,
       produtos digitais, pré-venda etc.
    -------------------------------------------------- */

    trackStock: true,


    /* --------------------------------------------------
       IMAGENS DO PRODUTO

       Se alguma imagem não carregar,
       o sistema poderá utilizar o fallback definido
       nas outras partes do site.
    -------------------------------------------------- */

    images: {

      front:
        "assets/produtos/no-cap-vol01/front.png",

      side:
        "assets/produtos/no-cap-vol01/side.png",

      back:
        "assets/produtos/no-cap-vol01/back.png"

    },


    /* --------------------------------------------------
       IMAGENS DO VIEWER DA HOME

       Define a ordem das imagens quando o usuário
       movimenta/troca a visualização do produto.
    -------------------------------------------------- */

    viewerImages: [

      "assets/produtos/no-cap-vol01/side.png",

      "assets/produtos/no-cap-vol01/front.png",

      "assets/produtos/no-cap-vol01/back.png"

    ],


    /* --------------------------------------------------
       DESCRIÇÃO PRINCIPAL
    -------------------------------------------------- */

    description:
      "Nø Cap Vol.01 confeccionado em camurça, com acabamento Croma Drip e fechamento regulável.",


    /* --------------------------------------------------
       INFORMAÇÕES TÉCNICAS DO PRODUTO
    -------------------------------------------------- */

    details: {

      material: "Camurça",

      height: "17 cm",

      circumference: "58 a 62 cm",

      size: "Único ajustável"

    },


    /* --------------------------------------------------
       TAMANHOS + ESTOQUE

       O estoque REAL do produto fica aqui.

       Para bonés:
       normalmente teremos apenas "ÚNICO".

       Para roupas futuramente podemos usar:

       P
       M
       G
       GG

       Exemplo:

       {
         id: "m",
         name: "M",
         stock: 5
       }

       stock: 0
       = tamanho esgotado

       stock: 1
       = uma unidade disponível
    -------------------------------------------------- */

    sizes: [

      {
        id: "unico",
        name: "ÚNICO",

        // ESTOQUE ATUAL DO NØ CAP VOL.01
        stock: 0
      }

    ]

  },


/* ==================================================
   CROMA FURACÃO
================================================== */

{
  id: "croma-furacao",

  name: "Croma Furacão",

  displayName: "CROMA FURACÃO",

  category: "CROMA DRIP",

  price: 299.90,

  active: true,

  trackStock: true,

  images: {
    front:
      "assets/produtos/croma-furacao/front.png",

    side:
      "assets/produtos/croma-furacao/side.png",

    back:
      "assets/produtos/croma-furacao/detail.png"
  },

  viewerImages: [
    "assets/produtos/croma-furacao/front.png",
    "assets/produtos/croma-furacao/side.png",
    "assets/produtos/croma-furacao/detail.png"
  ],

  description:
    "Croma Furacão confeccionada em tecido rico em elastano, proporcionando maior capacidade e flexibilidade. Uma peça autoral com bordado exclusivo e acabamento Croma Drip.",

  details: {
    material: "Tecido com elastano",
    dimensions: "33 × 23 cm",
    internalPockets: "Bolsos internos",
    externalPocket: "Bolso externo com zíper de 20 cm",
    embroidery: "Bordado exclusivo"
  },

  sizes: [
    {
      id: "unico",
      name: "ÚNICO",
      stock: 0
    }
  ]
},


/* ==================================================
   BORO SCARZ
================================================== */

{
  id: "boro-scarz",

  name: "Calça Boro Scarz - Cicatrizes Boro",

  displayName: "CALÇA BORO SCARZ",

  category: "CROMA DRIP",

  price: 790,

  active: true,

  trackStock: true,

  images: {
    front:
      "assets/produtos/boro-scarz/front.png",

    side:
      "assets/produtos/boro-scarz/detail-01.png",

    back:
      "assets/produtos/boro-scarz/detail-02.png"
  },

  viewerImages: [
    "assets/produtos/boro-scarz/front.png",
    "assets/produtos/boro-scarz/detail-01.png",
    "assets/produtos/boro-scarz/detail-02.png",
    "assets/produtos/boro-scarz/detail-03.png",
    "assets/produtos/boro-scarz/detail-04.png",
    "assets/produtos/boro-scarz/detail-05.png"
  ],

  description:
    "Calça Boro Scarz — Cicatrizes Boro. Peça em denim com construção artesanal, recortes, aplicações, rasgos e sobreposições têxteis.",

  details: {
    material: "Denim",
    construction: "Patchwork / Boro",
    finish: "Distressed artesanal",
    size: "A definir"
  },

  sizes: [
    {
      id: "unico",
      name: "ÚNICO",
      stock: 1
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

   Retorna somente produtos com:

   active: true

   Produtos com estoque 0 continuam aparecendo,
   porque SOLD não significa produto oculto.
================================================== */

function getActiveProducts() {

  return PRODUCTS.filter(
    product =>
      product.active
  );

}


/* ==================================================
   FORMATAR MOEDA

   Transforma:

   112

   em:

   R$ 112,00
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

   Gera automaticamente URLs como:

   produto.html?id=no-cap-vol01
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

   Retorna a imagem frontal do produto.
================================================== */

function getProductMainImage(product) {

  if (!product) {
    return "";
  }

  return product.images.front;

}


/* ==================================================
   ESTOQUE TOTAL DO PRODUTO

   Soma o estoque de todos os tamanhos.

   EXEMPLO:

   P  = 2
   M  = 3
   G  = 1

   Total = 6
================================================== */

function getProductStock(product) {

  if (
    !product ||
    !Array.isArray(product.sizes)
  ) {
    return 0;
  }

  return product.sizes.reduce(
    (total, size) => {

      const stock =
        Number(size.stock) || 0;

      return total + stock;

    },
    0
  );

}


/* ==================================================
   BUSCAR TAMANHO PELO ID

   Exemplo:

   getProductSize(product, "unico")

   ou futuramente:

   getProductSize(product, "m")
================================================== */

function getProductSize(
  product,
  sizeId
) {

  if (
    !product ||
    !Array.isArray(product.sizes)
  ) {
    return null;
  }

  return (
    product.sizes.find(
      size =>
        size.id === sizeId
    ) || null
  );

}


/* ==================================================
   ESTOQUE DE UM TAMANHO ESPECÍFICO

   Exemplo:

   getSizeStock(product, "m")

   Retorna quantas unidades daquele tamanho existem.
================================================== */

function getSizeStock(
  product,
  sizeId
) {

  const size =
    getProductSize(
      product,
      sizeId
    );

  if (!size) {
    return 0;
  }

  return Math.max(
    0,
    Number(size.stock) || 0
  );

}


/* ==================================================
   DISPONIBILIDADE DE UM TAMANHO

   Retorna:

   true
   = tamanho disponível

   false
   = tamanho esgotado
================================================== */

function isSizeAvailable(
  product,
  sizeId
) {

  return (
    getSizeStock(
      product,
      sizeId
    ) > 0
  );

}


/* ==================================================
   DISPONIBILIDADE DO PRODUTO

   Essa função substitui o antigo:

   product.available

   Agora o produto é considerado disponível quando:

   1. Existe
   2. Está ativo
   3. Possui estoque

   Se trackStock for false,
   ele será considerado disponível sem limite.
================================================== */

function isProductAvailable(product) {

  if (!product) {
    return false;
  }


  /* Produto oculto */

  if (!product.active) {
    return false;
  }


  /* Produto sem controle de estoque */

  if (product.trackStock === false) {
    return true;
  }


  /* Produto com pelo menos uma unidade */

  return (
    getProductStock(product) > 0
  );

}


/* ==================================================
   QUANTIDADE DISPONÍVEL

   Retorna o máximo que pode ser comprado.

   Se houver tamanho selecionado,
   considera somente aquele tamanho.

   Caso contrário,
   retorna o estoque total.
================================================== */

function getAvailableQuantity(
  product,
  sizeId = null
) {

  if (!product) {
    return 0;
  }


  /* Produto sem controle de estoque */

  if (product.trackStock === false) {

    return Infinity;

  }


  /* Produto com tamanho selecionado */

  if (sizeId) {

    return getSizeStock(
      product,
      sizeId
    );

  }


  /* Estoque total */

  return getProductStock(product);

}


/* ==================================================
   VALIDAR QUANTIDADE DE COMPRA

   Usado pelo carrinho para impedir situações como:

   estoque = 2
   cliente tenta colocar 3

   Retorna true ou false.
================================================== */

function canPurchaseQuantity(
  product,
  quantity,
  sizeId = null
) {

  if (!isProductAvailable(product)) {
    return false;
  }


  const requestedQuantity =
    Number(quantity);


  if (
    !Number.isInteger(
      requestedQuantity
    ) ||
    requestedQuantity <= 0
  ) {
    return false;
  }


  /* Sem limite de estoque */

  if (product.trackStock === false) {
    return true;
  }


  const availableQuantity =
    getAvailableQuantity(
      product,
      sizeId
    );


  return (
    requestedQuantity <=
    availableQuantity
  );

}


/* ==================================================
   STATUS DO ESTOQUE

   Essa função facilita mostrar mensagens diferentes
   no site.

   POSSÍVEIS RETORNOS:

   "sold"
   = estoque zerado

   "last"
   = última unidade

   "low"
   = poucas unidades

   "available"
   = estoque normal

   "unlimited"
   = produto sem controle de estoque
================================================== */

function getStockStatus(product) {

  if (
    !product ||
    !product.active
  ) {
    return "sold";
  }


  if (product.trackStock === false) {

    return "unlimited";

  }


  const stock =
    getProductStock(product);


  if (stock <= 0) {

    return "sold";

  }


  if (stock === 1) {

    return "last";

  }


  if (stock <= 3) {

    return "low";

  }


  return "available";

}


/* ==================================================
   TEXTO DO STATUS DE ESTOQUE

   Retorna um texto pronto para ser usado
   posteriormente na interface.

   Exemplos:

   SOLD
   ÚLTIMA UNIDADE
   ÚLTIMAS 3 UNIDADES
================================================== */

function getStockStatusText(product) {

  const status =
    getStockStatus(product);

  const stock =
    getProductStock(product);


  switch (status) {

    case "sold":

      return "SOLD";


    case "last":

      return "ÚLTIMA UNIDADE";


    case "low":

      return `ÚLTIMAS ${stock} UNIDADES`;


    case "unlimited":

      return "DISPONÍVEL";


    default:

      return "DISPONÍVEL";

  }

}