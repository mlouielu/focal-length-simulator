/*eslint no-undef: "off"*/

var translator = null;

function i18n_init() {
// The below provided options are default.

translator = new Translator({
  defaultLanguage: "zh_TW",
  detectLanguage: true,
  selector: "[data-i18n]",
  debug: false,
  registerGlobally: "__",
  persist: false,
  persistKey: "preferred_language",
  filesLocation: "i18n"
});

translator.fetch(["zh_TW", "en"]).then(() => {
  // Calling `translatePageTo()` without any parameters
  // will translate to the default language.
  translator.translatePageTo();
  registerLanguageToggle();

  // Assume you have a query string like "?lang=val1"
  const queryString = window.location.search;

  // Create a URLSearchParams instance
  const urlParams = new URLSearchParams(queryString);

  // Access the parameters
  const lang = urlParams.get('lang');
  if (!lang) {
	lang = "en";
  }

  translator.translatePageTo(lang);
  document.querySelector("#lang-select").value = lang;
});
}

function registerLanguageToggle() {
  var select = document.querySelector("select");

  select.addEventListener("change", evt => {
    var language = evt.target.value;
    translator.translatePageTo(language);
  });
}
