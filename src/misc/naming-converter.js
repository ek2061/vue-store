export default {
  /**
   * CamelCase to underscore seperated uppercase
   */
  camelCase2UnderscoreUppercase: function(string) {
    return string.replace(/([A-Z]+)/g, "_$1").toUpperCase();
  }
};
