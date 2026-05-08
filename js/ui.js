
const UI = (() => {

// ─ Referencias DOM ─
const grid          = document.getElementById("productGrid");
const emptyState    = document.getElementById("emptyState");
const filterBtns    = document.getElementById("filterButtons");
const detailContent = document.getElementById("detailContent");
const catalogTitle  = document.getElementById("catalogTitle");
const catalogCount  = document.getElementById("catalogCount");
const toastCont     = document.getElementById("toastContainer");
const els = {
  total:   document.getElementById("statTotal"),
  valor:   document.getElementById("statValor"),
  cats:    document.getElementById("statCategorias"),
  compras: document.getElementById("statCompras"),
};

// ─ Grilla ─

function renderGrid(productos, stockMap, selectedId) {
  grid.innerHTML = "";
  emptyState.hidden = productos.length > 0;
  productos.forEach((p, i) => {
    const card = _buildCard(p, stockMap[p.id] ?? 0, p.id === selectedId);
    card.style.animationDelay = `${i * 45}ms`;
    grid.appendChild(card);
  });
}

/** Actualiza una tarjeta ya renderizada (stock + estado agotado). */
function patchCard(producto, stock) {
  const card = grid.querySelector(`[data-id="${producto.id}"]`);
  if (!card) return;

  card.querySelector(".stock-num").textContent = stock;

  const fill = card.querySelector(".stock-fill");
  fill.style.width = Math.max(0, (stock / STOCK_MAX) * 100) + "%";
  fill.className = "stock-fill" + _stockClass(stock);

  const btn = card.querySelector(".btn-buy");
  if (stock <= 0) {
    card.classList.add("agotado");
    btn.disabled = true;
    btn.innerHTML = '<i class="fa fa-ban"></i> Agotado';
    if (!card.querySelector(".badge-agotado")) {
      const b = document.createElement("div");
      b.className = "badge-agotado";
      b.textContent = "Agotado";
      card.querySelector(".card-img-wrapper").appendChild(b);
    }
  }
}

/** Animación de compra exitosa en la tarjeta. */
function animateBuy(id) {
  const btn = grid.querySelector(`[data-id="${id}"] .btn-buy`);
  if (!btn) return;
  btn.style.animation = "none";
  void btn.offsetWidth;
  btn.style.animation = "";
}

/** Marca/desmarca tarjeta seleccionada. */
function setSelected(id) {
  grid.querySelectorAll(".product-card.selected").forEach(c => c.classList.remove("selected"));
  if (id != null) {
    const c = grid.querySelector(`[data-id="${id}"]`);
    if (c) c.classList.add("selected");
  }
}

/** Agita una tarjeta (intento de compra agotada). */
function shakeCard(id) {
  const card = grid.querySelector(`[data-id="${id}"]`);
  if (!card) return;
  card.classList.remove("shake-anim");
  void card.offsetWidth;
  card.classList.add("shake-anim");
  card.addEventListener("animationend", () => card.classList.remove("shake-anim"), { once: true });
}

// ─ Filtros ─

function renderFilters(conteos, activa, onSelect) {
  filterBtns.innerHTML = "";
  const total = Object.values(conteos).reduce((a, b) => a + b, 0);
  filterBtns.appendChild(_buildFilterBtn("todos", "🌿", "Todos", total, activa === "todos", onSelect));
  Object.entries(CATEGORIAS).forEach(([cat, meta]) => {
    if (!conteos[cat]) return;
    filterBtns.appendChild(_buildFilterBtn(cat, meta.icon, meta.label, conteos[cat], activa === cat, onSelect));
  });
}

// ─ Detalle ─

function showDetail(p, stock) {
  const stockTxt = stock <= 0 ? "Agotado" : `${stock} unid.`;
  const stockColor = stock <= 0 ? "var(--clr-danger)" : stock <= 3 ? "var(--clr-warn)" : "inherit";
  detailContent.innerHTML = `
    <img class="detail-img" src="${p.imagen}" alt="${p.nombre}"
          onerror="this.src='https://placehold.co/400x160/d8f3dc/2d6a4f?text=EcoShop'" />
    <h3 class="detail-name">${p.nombre}</h3>
    <div class="detail-price">S/ ${p.precio.toFixed(2)}</div>
    <div class="detail-row"><span>Categoría</span><strong>${CATEGORIAS[p.categoria]?.label ?? p.categoria}</strong></div>
    <div class="detail-row"><span>Stock</span><strong style="color:${stockColor}">${stockTxt}</strong></div>
    <div class="detail-row"><span>ID</span><strong>#${String(p.id).padStart(3,"0")}</strong></div>
    <p class="detail-desc">${p.descripcion}</p>`;
}

function clearDetail() {
  detailContent.innerHTML = `<p class="placeholder-msg">Haz clic en un producto para ver su información.</p>`;
}

// ─ Estadísticas ─

function updateStats({ total, valor, cats, compras }) {
  _animateStat(els.total,   String(total));
  _animateStat(els.valor,   `S/ ${valor.toFixed(2)}`);
  _animateStat(els.cats,    String(cats));
  _animateStat(els.compras, String(compras));
}

function updateCatalogHeader(cat, count) {
  catalogTitle.textContent = cat === "todos" ? "Todos los productos"
    : `${CATEGORIAS[cat]?.icon ?? ""} ${CATEGORIAS[cat]?.label ?? cat}`;
  catalogCount.textContent = count ? `${count} producto${count !== 1 ? "s" : ""}` : "";
}

// ─ Tema ─

function applyTheme(tema) {
  document.documentElement.setAttribute("data-theme", tema);
  const icon = document.getElementById("themeIcon");
  if (icon) icon.className = tema === "dark" ? "fa fa-sun" : "fa fa-moon";
}

// ─ Toast ─

function toast(msg, tipo = "success") {
  const icons = { success: "fa-check-circle", warn: "fa-triangle-exclamation", error: "fa-circle-xmark", info: "fa-circle-info" };
  const el = document.createElement("div");
  el.className = `toast toast-${tipo}`;
  el.innerHTML = `<i class="fa ${icons[tipo] || icons.info}"></i> ${msg}`;
  toastCont.appendChild(el);
  setTimeout(() => {
    el.classList.add("out");
    el.addEventListener("animationend", () => el.remove(), { once: true });
  }, 2800);
}

// ─ Privadas ─

function _buildCard(p, stock, selected) {
  const agotado = stock <= 0;
  const meta = CATEGORIAS[p.categoria];
  const pct = Math.max(0, (stock / STOCK_MAX) * 100);
  const card = document.createElement("div");
  card.className = `product-card${agotado ? " agotado" : ""}${selected ? " selected" : ""}`;
  card.dataset.id = p.id;
  card.innerHTML = `
    <div class="card-img-wrapper">
      <img class="card-img" src="${p.imagen}" alt="${p.nombre}" loading="lazy"
            onerror="this.src='https://placehold.co/400x155/d8f3dc/2d6a4f?text=EcoShop'" />
      <span class="card-badge">${meta?.icon ?? ""} ${meta?.label ?? p.categoria}</span>
      ${agotado ? '<div class="badge-agotado">Agotado</div>' : ""}
    </div>
    <div class="card-body">
      <h3 class="card-name">${p.nombre}</h3>
      <div class="card-price">S/ ${p.precio.toFixed(2)}</div>
      <div>
        <div class="stock-label"><span>Stock</span><span class="stock-num">${stock}</span></div>
        <div class="stock-track"><div class="stock-fill${_stockClass(stock)}" style="width:${pct}%"></div></div>
      </div>
    </div>
    <div class="card-footer">
      <button class="btn-buy" data-id="${p.id}" ${agotado ? "disabled" : ""}>
        ${agotado ? '<i class="fa fa-ban"></i> Agotado' : '<i class="fa fa-cart-plus"></i> Comprar'}
      </button>
    </div>`;
  return card;
}

function _buildFilterBtn(cat, icon, label, count, active, onSelect) {
  const btn = document.createElement("button");
  btn.className = `btn-filter${active ? " active" : ""}`;
  btn.dataset.cat = cat;
  btn.innerHTML = `<span>${icon}</span><span>${label}</span><span class="filter-badge">${count}</span>`;
  btn.addEventListener("click", () => onSelect(cat));
  return btn;
}

function _stockClass(stock) {
  if (stock <= 2) return " critical";
  if (stock <= 5) return " low";
  return "";
}

function _animateStat(el, val) {
  if (!el || el.textContent === val) return;
  el.textContent = val;
  el.classList.remove("stat-pulse");
  void el.offsetWidth;
  el.classList.add("stat-pulse");
  el.addEventListener("animationend", () => el.classList.remove("stat-pulse"), { once: true });
}

return { renderGrid, patchCard, animateBuy, setSelected, shakeCard, renderFilters, showDetail, clearDetail, updateStats, updateCatalogHeader, applyTheme, toast };
})();
