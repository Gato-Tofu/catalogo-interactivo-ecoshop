(function () {

/*
ESTADO GLOBAL
*/
let stockMap   = Storage.cargar();
let catActiva  = "todos";
let busqueda   = "";
let selectedId = null;
let tema       = Storage.getTema();

/*
LÓGICA DE FILTRADO (Desarrollador de Lógica)
*/

function filtrar() {
  const q = _norm(busqueda);
  return inventarioBase.filter(p => {
    const enCategoria = catActiva === "todos" || p.categoria === catActiva;
    const enBusqueda  = q === "" ||
      _norm(p.nombre).includes(q) ||
      _norm(p.categoria).includes(q) ||
      _norm(p.descripcion).includes(q);
    return enCategoria && enBusqueda;
  });
}

  
function conteosPorCategoria() {
  return inventarioBase.reduce((acc, p) => {
    acc[p.categoria] = (acc[p.categoria] || 0) + 1;
    return acc;
  }, {});
}

/** Calcula las estadísticas del panel lateral. */
function calcularStats() {
  return {
    total:   inventarioBase.length,
    valor:   inventarioBase.reduce((s, p) => s + p.precio * (stockMap[p.id] ?? 0), 0),
    cats:    new Set(inventarioBase.map(p => p.categoria)).size,
    compras: Storage.getCompras(),
  };
}

/** Normaliza string: minúsculas + quita tildes. */
function _norm(s) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/*
LÓGICA DE COMPRA (Desarrollador de Lógica + QA)
*/

function comprar(id) {
    const producto = inventarioBase.find(p => p.id === id);
    if (!producto) return;

    const stockActual = stockMap[id] ?? 0;

    // QA: evitar stock negativo
    if (stockActual <= 0) {
      UI.shakeCard(id);
      UI.toast(`"${producto.nombre}" está agotado.`, "error");
      return;
    }

    const nuevoStock = Math.max(0, stockActual - 1); // guarda extra anti-negativo
    stockMap[id] = nuevoStock;

    Storage.guardar(stockMap);
    Storage.addCompra();

    UI.patchCard(producto, nuevoStock);
    UI.animateBuy(id);

    // Actualizar detalle si el producto está seleccionado
    if (selectedId === id) UI.showDetail(producto, nuevoStock);

    // Notificación según nivel de stock
    if (nuevoStock === 0) {
      UI.toast(`¡Último "${producto.nombre}" comprado! Ahora agotado.`, "warn");
    } else if (nuevoStock <= 3) {
      UI.toast(`"${producto.nombre}" comprado. ¡Solo ${nuevoStock} restante${nuevoStock !== 1 ? "s" : ""}!`, "warn");
    } else {
      UI.toast(`"${producto.nombre}" añadido. Stock: ${nuevoStock}`, "success");
    }

    UI.updateStats(calcularStats());
    renderFilters();
  }

/*
RENDERIZADO COMPLETO
*/

function render() {
  const productos = filtrar();
  UI.renderGrid(productos, stockMap, selectedId);
  UI.updateCatalogHeader(catActiva, productos.length);
  UI.updateStats(calcularStats());
  renderFilters();
}

function renderFilters() {
  UI.renderFilters(conteosPorCategoria(), catActiva, (cat) => {
    catActiva  = cat;
    selectedId = null;
    UI.clearDetail();
    render();
  });
}

/* 
EVENTOS
*/

// Buscador en vivo
const searchInput = document.getElementById("searchInput");
const searchClear = document.getElementById("searchClear");

searchInput.addEventListener("input", () => {
  busqueda = searchInput.value;
  searchClear.classList.toggle("visible", busqueda.length > 0);
  render();
});

searchClear.addEventListener("click", () => {
  searchInput.value = "";
  busqueda = "";
  searchClear.classList.remove("visible");
  searchInput.focus();
  render();
});

// Delegación en la grilla: clic en botón comprar o en tarjeta
document.getElementById("productGrid").addEventListener("click", e => {
  const btn = e.target.closest(".btn-buy");
  if (btn && !btn.disabled) {
    e.stopPropagation();
    comprar(Number(btn.dataset.id));
    return;
  }

  const card = e.target.closest(".product-card");
  if (card) {
    const id = Number(card.dataset.id);
    if (selectedId === id) {
      selectedId = null;
      UI.setSelected(null);
      UI.clearDetail();
    } else {
      selectedId = id;
      UI.setSelected(id);
      const p = inventarioBase.find(x => x.id === id);
      if (p) UI.showDetail(p, stockMap[id] ?? 0);
    }
  }
});

// Modo oscuro
document.getElementById("themeToggle").addEventListener("click", () => {
  tema = tema === "light" ? "dark" : "light";
  UI.applyTheme(tema);
  Storage.setTema(tema);
});

// Reiniciar stock (QA: confirmación antes de ejecutar)
document.getElementById("resetStock").addEventListener("click", () => {
  if (!confirm("¿Reiniciar el stock de todos los productos a los valores originales?")) return;

// Mutar el mismo objeto para que las referencias sigan siendo válidas
const fresh = Storage.reiniciar();
Object.assign(stockMap, fresh);

selectedId = null;
UI.clearDetail();

// Animación del ícono
const btn = document.getElementById("resetStock");
btn.classList.add("spin-once");
btn.addEventListener("animationend", () => btn.classList.remove("spin-once"), { once: true });

UI.toast("Stock reiniciado correctamente.", "info");
render();
});

/* 
INICIO
*/
UI.applyTheme(tema);
render();

})();
