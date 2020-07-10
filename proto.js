String.prototype.trim = function () {
  return this.replace(/^s+|s+$/g, "");
};
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.removeNonASCII = function(){
  return this.replace(/[^\x20-\x7E]/g, '');
};
String.prototype.stripHTMLTags = function(){
  return this.replace(/<[^>]*>/g, '');
};