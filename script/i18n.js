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

translator.fetch(["en", "zh_TW"]).then(() => {
  // Calling `translatePageTo()` without any parameters
  // will translate to the default language.
  translator.translatePageTo();
  registerLanguageToggle();
});

}

function registerLanguageToggle() {
  var select = document.querySelector("select");

  select.addEventListener("change", evt => {
    var language = evt.target.value;
    translator.translatePageTo(language);
  });
}
