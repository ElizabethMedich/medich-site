/* =====================================================
   НАСТРОЙКИ САЙТА - меняй только этот блок
   ===================================================== */
const CONFIG = {
  // Ссылка на оплату (Продамус). Пока пусто - кнопки «Оплатить» просто прокручивают к блоку оплаты.
  payUrl: "",

  // Цена. Если пусто - блок с ценой скрыт. Пример: priceText: "4 900 ₽", oldPriceText: "7 900 ₽"
  priceText: "",
  oldPriceText: "",

  // Отзывы. Пока список пустой - раздел «Отзывы» и пункт меню скрыты.
  // Пример: { name: "Анна", text: "Теперь собираюсь за 15 минут!", image: "img/review-1.jpg" }
  reviews: [],

  // Ссылки на документы (Яндекс.Диск). Оферта лежит на странице oferta.html
  docs: {
    privacy: "https://disk.yandex.ru/d/kFQK2PT9_2vc9g",
    pd: "https://disk.yandex.ru/d/w-wKUa7Mqte6tA",
    ads: "https://disk.yandex.ru/d/jHAiiuw4zgJwMQ"
  },

  // Реквизиты в подвале (допиши ИНН / ОГРНИП)
  requisites: "ИП Березкина Е. Е."
};

/* ===================================================== */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // оплата
  $$("[data-pay], [data-pay-btn]").forEach(a => {
    if (CONFIG.payUrl) { a.href = CONFIG.payUrl; a.target = "_blank"; a.rel = "noopener"; }
  });

  // цена
  if (CONFIG.priceText) {
    $("#price").hidden = false;
    $("#priceNow").textContent = CONFIG.priceText;
    if (CONFIG.oldPriceText) $("#priceOld").textContent = CONFIG.oldPriceText; else $("#priceOld").remove();
  }

  // документы и реквизиты
  $$("[data-doc]").forEach(a => { const u = CONFIG.docs[a.dataset.doc]; if (u) a.href = u; });
  $("#req").textContent = CONFIG.requisites || "";

  // отзывы
  if (CONFIG.reviews && CONFIG.reviews.length) {
    $("#reviews").hidden = false;
    $("[data-reviews-link]").hidden = false;
    const list = $("#reviewsList");
    CONFIG.reviews.forEach(r => {
      const d = document.createElement("div"); d.className = "rev reveal";
      if (r.image) { const i = document.createElement("img"); i.src = r.image; i.alt = ""; i.loading = "lazy"; d.appendChild(i); }
      if (r.text) { const p = document.createElement("p"); p.textContent = "«" + r.text + "»"; d.appendChild(p); }
      const b = document.createElement("b"); b.textContent = r.name || ""; d.appendChild(b);
      list.appendChild(d);
    });
  }

  // шапка
  const top = $("#top");
  const onScroll = () => top.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  // мобильное меню
  const burger = $("#burger"), menu = $("#menu");
  const closeMenu = () => { menu.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); };
  burger.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  $$("a", menu).forEach(a => a.addEventListener("click", closeMenu));

  // появление блоков
  const items = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach((el, i) => { el.style.transitionDelay = (i % 5) * 70 + "ms"; io.observe(el); });
  } else items.forEach(el => el.classList.add("is-in"));

  // лёгкий параллакс фото в первом экране
  const fig = $(".cut--hero");
  if (fig && !matchMedia("(prefers-reduced-motion: reduce)").matches && innerWidth > 980) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => { fig.style.transform = "translateY(" + Math.min(window.scrollY * 0.08, 60) + "px)"; ticking = false; });
    }, { passive: true });
  }
})();
