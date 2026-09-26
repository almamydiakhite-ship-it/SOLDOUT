import {
  c as b,
  r as x,
  j as e,
  h as v,
  i as y,
  a as p,
  e as g,
  k,
  P as j,
  S as N,
  C as w,
  g as M,
} from "./index-CHCgfVcq.js";
const $ = [
    ["path", { d: "M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4", key: "1nerag" }],
    ["path", { d: "M14 13.12c0 2.38 0 6.38-1 8.88", key: "o46ks0" }],
    ["path", { d: "M17.29 21.02c.12-.6.43-2.3.5-3.02", key: "ptglia" }],
    ["path", { d: "M2 12a10 10 0 0 1 18-6", key: "ydlgp0" }],
    ["path", { d: "M2 16h.01", key: "1gqxmh" }],
    ["path", { d: "M21.8 16c.2-2 .131-5.354 0-6", key: "drycrb" }],
    ["path", { d: "M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2", key: "1tidbn" }],
    ["path", { d: "M8.65 22c.21-.66.45-1.32.57-2", key: "13wd9y" }],
    ["path", { d: "M9 6.8a6 6 0 0 1 9 5.2v2", key: "1fr1j5" }],
  ],
  L = b("fingerprint-pattern", $);
const S = [
    [
      "path",
      {
        d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",
        key: "wrbu53",
      },
    ],
    ["path", { d: "M15 18H9", key: "1lyqi6" }],
    [
      "path",
      {
        d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
        key: "lysw3i",
      },
    ],
    ["circle", { cx: "17", cy: "18", r: "2", key: "332jqn" }],
    ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }],
  ],
  P = b("truck", S);
function C({
  product: s,
  width: h,
  height: c,
  eager: o = !1,
  linked: m = !1,
  className: l = "",
}) {
  const a = x.useRef(null),
    [i, n] = x.useState(0),
    f = (t) => {
      const r = a.current;
      if (!r) return;
      const u = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      (r.scrollTo({ left: t * r.clientWidth, behavior: u ? "auto" : "smooth" }),
        n(t));
    },
    d = () => {
      const t = a.current;
      if (!t) return;
      const r = Math.round(t.scrollLeft / t.clientWidth);
      n((u) => (u === r ? u : r));
    };
  return e.jsxs("div", {
    className: `relative overflow-hidden bg-ink-850 ${l}`,
    children: [
      e.jsx("div", {
        ref: a,
        onScroll: d,
        className:
          "so-rail flex aspect-4/5 snap-x snap-mandatory overflow-x-auto overscroll-x-contain",
        children: s.views.map((t, r) => {
          const u = e.jsx("img", {
            src: y(t.src, { w: h, h: c, fit: "cover" }),
            srcSet: v(t.src, { w: h, h: c, fit: "cover" }),
            alt: `${s.name} — ${t.label.toLowerCase()}, ${s.colourway}`,
            loading: o && r === 0 ? "eager" : "lazy",
            decoding: "async",
            className: "h-full w-full object-cover",
          });
          return e.jsx(
            "div",
            {
              className: "h-full w-full shrink-0 snap-center snap-always",
              children: m
                ? e.jsx(p, {
                    to: "/produits/$productId",
                    params: { productId: s.id },
                    className: "block h-full w-full",
                    tabIndex: r === i ? void 0 : -1,
                    "aria-label": `${s.name} — voir la pièce`,
                    children: u,
                  })
                : u,
            },
            t.src,
          );
        }),
      }),
      e.jsx("div", {
        className:
          "absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 rounded-full border so-hairline bg-ink-950/80 p-1 backdrop-blur-sm",
        role: "group",
        "aria-label": `${s.name} — avant et arrière`,
        children: s.views.map((t, r) =>
          e.jsx(
            "button",
            {
              type: "button",
              onClick: () => f(r),
              "aria-pressed": r === i,
              className: `so-label rounded-full px-3.5 py-2 text-[0.5rem] transition-colors duration-300 ${r === i ? "bg-bone text-ink-950" : "text-fog hover:text-bone"}`,
              children: t.label,
            },
            t.src,
          ),
        ),
      }),
    ],
  });
}
function R({ product: s, index: h }) {
  const { addLine: c } = g(),
    [o, m] = x.useState(null),
    [l, a] = x.useState(!1),
    [i, n] = x.useState(!1),
    f = () => {
      if (!o) {
        a(!0);
        return;
      }
      (c(s.id, o), n(!0), window.setTimeout(() => n(!1), 1600));
    };
  return e.jsxs("article", {
    className:
      "group relative flex flex-col overflow-hidden rounded-2xl border so-hairline bg-ink-900 transition-colors duration-500 hover:border-rose/35",
    children: [
      e.jsxs("div", {
        className: "relative",
        children: [
          e.jsx(C, {
            product: s,
            width: 520,
            height: 650,
            eager: h < 4,
            linked: !0,
          }),
          e.jsxs("span", {
            className:
              "so-label pointer-events-none absolute left-3 top-3 rounded-full bg-ink-950/75 px-3 py-1.5 text-[0.5625rem] text-rose backdrop-blur-sm",
            children: ["Ch. ", s.chapterNo],
          }),
          s.isNew &&
            e.jsx("span", {
              className:
                "so-label pointer-events-none absolute right-3 top-3 rounded-full bg-hot px-3 py-1.5 text-[0.5625rem] text-bone",
              children: "Nouveau",
            }),
        ],
      }),
      e.jsxs("div", {
        className: "flex flex-1 flex-col gap-4 p-4",
        children: [
          e.jsxs("div", {
            children: [
              e.jsxs("div", {
                className: "flex items-baseline justify-between gap-3",
                children: [
                  e.jsx("h3", {
                    className: "so-wordmark text-lg text-bone",
                    children: e.jsx(p, {
                      to: "/produits/$productId",
                      params: { productId: s.id },
                      className:
                        "transition-colors duration-300 hover:text-rose",
                      children: s.name,
                    }),
                  }),
                  e.jsx("span", {
                    className:
                      "shrink-0 text-sm font-bold tabular-nums text-bone",
                    children: k(j),
                  }),
                ],
              }),
              e.jsx("p", {
                className: "mt-1.5 text-[0.8125rem] leading-snug text-fog",
                children: s.tagline,
              }),
            ],
          }),
          e.jsxs("div", {
            className: "mt-auto",
            children: [
              e.jsx("div", {
                className: "flex flex-wrap gap-1.5",
                children: N.map((d) =>
                  e.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        (m(d), a(!1));
                      },
                      "aria-pressed": o === d,
                      className: `min-w-9 rounded-md border px-2 py-1.5 text-[0.6875rem] font-bold transition-colors duration-200 ${o === d ? "border-rose bg-rose text-ink-950" : "border-bone/15 text-fog hover:border-bone/45 hover:text-bone"}`,
                      children: d,
                    },
                    d,
                  ),
                ),
              }),
              e.jsx("p", {
                className: `so-label mt-2 text-[0.5625rem] text-hot transition-opacity duration-300 ${l ? "opacity-100" : "opacity-0"}`,
                role: l ? "alert" : void 0,
                children: "Choisis une taille",
              }),
              e.jsx("button", {
                type: "button",
                onClick: f,
                className: `so-btn so-btn-sheen mt-1 w-full py-3.5 text-[0.625rem] ${i ? "so-btn-hot" : "so-btn-solid"}`,
                children: i
                  ? e.jsxs(e.Fragment, {
                      children: [
                        e.jsx(w, { size: 14, strokeWidth: 2.6 }),
                        " Ajouté",
                      ],
                    })
                  : e.jsxs(e.Fragment, {
                      children: [
                        e.jsx(M, { size: 14, strokeWidth: 2.6 }),
                        " Ajouter au panier",
                      ],
                    }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function A({ children: s, className: h = "", delay: c = 0, as: o = "div" }) {
  const m = x.useRef(null);
  return (
    x.useEffect(() => {
      const l = m.current;
      if (!l) return;
      if (typeof IntersectionObserver > "u") {
        l.classList.add("is-in");
        return;
      }
      const a = new IntersectionObserver(
        (i) => {
          for (const n of i)
            n.isIntersecting &&
              (n.target.classList.add("is-in"), a.unobserve(n.target));
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
      );
      return (a.observe(l), () => a.disconnect());
    }, []),
    e.jsx(o, {
      ref: m,
      className: `so-reveal ${h}`,
      style: c ? { transitionDelay: `${c}ms` } : void 0,
      children: s,
    })
  );
}
export { L as F, R as P, A as R, P as T, C as a };
