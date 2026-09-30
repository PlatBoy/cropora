import catalog from "./i18n-catalog.json";

const localeTags = {
  en: "en-IN",
  hi: "hi-IN",
  pa: "pa-IN",
  bn: "bn-IN",
  ta: "ta-IN",
  te: "te-IN",
  mr: "mr-IN",
  gu: "gu-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  ur: "ur-IN",
  ne: "ne-NP",
  or: "or-IN",
  as: "as-IN",
  es: "es-ES"
};

let activeLocale = "en";

export function setActiveLocale(language) {
  activeLocale = localeTags[language] ? language : "en";
}

export function getIntlLocale() {
  return localeTags[activeLocale] || localeTags.en;
}

export function localize(value) {
  if (typeof value !== "string" || activeLocale === "en") return value;

  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return value;
  const translations = catalog[activeLocale];
  const translated = translations?.[normalized] || translations?.[normalized.toLowerCase()];
  if (!translated) return value;

  const leading = value.match(/^\s*/)?.[0] || "";
  const trailing = value.match(/\s*$/)?.[0] || "";
  return `${leading}${translated}${trailing}`;
}
