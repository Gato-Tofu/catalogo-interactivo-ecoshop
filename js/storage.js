const Storage = (() => {
  const KEY_STOCK   = "ecoshop_stock_v1";
  const KEY_COMPRAS = "ecoshop_compras_v1";

/** Carga el mapa { id → stock } desde localStorage o lo crea desde inventarioBase. */
function cargar() {
  try {
    const raw = localStorage.getItem(KEY_STOCK);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("[Storage] Error al leer:", e);
  }
  return _mapaBase();
}

/** Persiste el mapa de stock. */
function guardar(stockMap) {
  try {
    localStorage.setItem(KEY_STOCK, JSON.stringify(stockMap));
  } catch (e) {
    console.warn("[Storage] Error al guardar:", e);
  }
}

/** Reinicia al stock original y borra el contador de compras. Devuelve el nuevo mapa. */
function reiniciar() {
  const mapa = _mapaBase();
  guardar(mapa);
  try { localStorage.setItem(KEY_COMPRAS, "0"); } catch (e) { /* ignore */ }
  return mapa;
}

/** Número total de compras acumuladas (persiste entre sesiones). */
function getCompras() {
  try { return parseInt(localStorage.getItem(KEY_COMPRAS) || "0", 10); } catch (e) { return 0; }
}

/** Incrementa el contador de compras en 1. */
function addCompra() {
  try { localStorage.setItem(KEY_COMPRAS, String(getCompras() + 1)); } catch (e) { /* ignore */ }
}

/** Carga preferencia de tema. */
function getTema() {
  try { return localStorage.getItem("ecoshop_tema") || "light"; } catch (e) { return "light"; }
}

/** Guarda preferencia de tema. */
function setTema(t) {
  try { localStorage.setItem("ecoshop_tema", t); } catch (e) { /* ignore */ }
}

// Privada: construye { id → stock } desde los valores base
function _mapaBase() {
  return inventarioBase.reduce((acc, p) => { acc[p.id] = p.stock; return acc; }, {});
}

return { cargar, guardar, reiniciar, getCompras, addCompra, getTema, setTema };
})();
