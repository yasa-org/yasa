(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-65c86e8c"],{"36c6":function(t,e,r){"use strict";(function(t){r.d(e,"a",(function(){return l}));var n,o,i=function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])},t(e,r)};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();if("object"===typeof t)o="win32"===t.platform;else if("object"===typeof navigator){var a=navigator.userAgent;o=a.indexOf("Windows")>=0}var s=/^\w[\w\d+.-]*$/,u=/^\//,h=/^\/\//;function c(t,e){if(!t.scheme&&e)throw new Error('[UriError]: Scheme is missing: {scheme: "", authority: "'+t.authority+'", path: "'+t.path+'", query: "'+t.query+'", fragment: "'+t.fragment+'"}');if(t.scheme&&!s.test(t.scheme))throw new Error("[UriError]: Scheme contains illegal characters.");if(t.path)if(t.authority){if(!u.test(t.path))throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character')}else if(h.test(t.path))throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")')}function f(t,e){return t||e?t:"file"}function g(t,e){switch(t){case"https":case"http":case"file":e?e[0]!==d&&(e=d+e):e=d;break}return e}var p="",d="/",m=/^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/,l=function(){function t(t,e,r,n,o,i){void 0===i&&(i=!1),"object"===typeof t?(this.scheme=t.scheme||p,this.authority=t.authority||p,this.path=t.path||p,this.query=t.query||p,this.fragment=t.fragment||p):(this.scheme=f(t,i),this.authority=e||p,this.path=g(this.scheme,r||p),this.query=n||p,this.fragment=o||p,c(this,i))}return t.isUri=function(e){return e instanceof t||!!e&&("string"===typeof e.authority&&"string"===typeof e.fragment&&"string"===typeof e.path&&"string"===typeof e.query&&"string"===typeof e.scheme&&"function"===typeof e.fsPath&&"function"===typeof e.with&&"function"===typeof e.toString)},Object.defineProperty(t.prototype,"fsPath",{get:function(){return C(this)},enumerable:!0,configurable:!0}),t.prototype.with=function(t){if(!t)return this;var e=t.scheme,r=t.authority,n=t.path,o=t.query,i=t.fragment;return void 0===e?e=this.scheme:null===e&&(e=p),void 0===r?r=this.authority:null===r&&(r=p),void 0===n?n=this.path:null===n&&(n=p),void 0===o?o=this.query:null===o&&(o=p),void 0===i?i=this.fragment:null===i&&(i=p),e===this.scheme&&r===this.authority&&n===this.path&&o===this.query&&i===this.fragment?this:new y(e,r,n,o,i)},t.parse=function(t,e){void 0===e&&(e=!1);var r=m.exec(t);return r?new y(r[2]||p,decodeURIComponent(r[4]||p),decodeURIComponent(r[5]||p),decodeURIComponent(r[7]||p),decodeURIComponent(r[9]||p),e):new y(p,p,p,p,p)},t.file=function(t){var e=p;if(o&&(t=t.replace(/\\/g,d)),t[0]===d&&t[1]===d){var r=t.indexOf(d,2);-1===r?(e=t.substring(2),t=d):(e=t.substring(2,r),t=t.substring(r)||d)}return new y("file",e,t,p,p)},t.from=function(t){return new y(t.scheme,t.authority,t.path,t.query,t.fragment)},t.prototype.toString=function(t){return void 0===t&&(t=!1),_(this,t)},t.prototype.toJSON=function(){return this},t.revive=function(e){if(e){if(e instanceof t)return e;var r=new y(e);return r._formatted=e.external,r._fsPath=e._sep===v?e.fsPath:null,r}return e},t}(),v=o?1:void 0,y=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e._formatted=null,e._fsPath=null,e}return i(e,t),Object.defineProperty(e.prototype,"fsPath",{get:function(){return this._fsPath||(this._fsPath=C(this)),this._fsPath},enumerable:!0,configurable:!0}),e.prototype.toString=function(t){return void 0===t&&(t=!1),t?_(this,!0):(this._formatted||(this._formatted=_(this,!1)),this._formatted)},e.prototype.toJSON=function(){var t={$mid:1};return this._fsPath&&(t.fsPath=this._fsPath,t._sep=v),this._formatted&&(t.external=this._formatted),this.path&&(t.path=this.path),this.scheme&&(t.scheme=this.scheme),this.authority&&(t.authority=this.authority),this.query&&(t.query=this.query),this.fragment&&(t.fragment=this.fragment),t},e}(l),w=(n={},n[58]="%3A",n[47]="%2F",n[63]="%3F",n[35]="%23",n[91]="%5B",n[93]="%5D",n[64]="%40",n[33]="%21",n[36]="%24",n[38]="%26",n[39]="%27",n[40]="%28",n[41]="%29",n[42]="%2A",n[43]="%2B",n[44]="%2C",n[59]="%3B",n[61]="%3D",n[32]="%20",n);function b(t,e){for(var r=void 0,n=-1,o=0;o<t.length;o++){var i=t.charCodeAt(o);if(i>=97&&i<=122||i>=65&&i<=90||i>=48&&i<=57||45===i||46===i||95===i||126===i||e&&47===i)-1!==n&&(r+=encodeURIComponent(t.substring(n,o)),n=-1),void 0!==r&&(r+=t.charAt(o));else{void 0===r&&(r=t.substr(0,o));var a=w[i];void 0!==a?(-1!==n&&(r+=encodeURIComponent(t.substring(n,o)),n=-1),r+=a):-1===n&&(n=o)}}return-1!==n&&(r+=encodeURIComponent(t.substring(n))),void 0!==r?r:t}function P(t){for(var e=void 0,r=0;r<t.length;r++){var n=t.charCodeAt(r);35===n||63===n?(void 0===e&&(e=t.substr(0,r)),e+=w[n]):void 0!==e&&(e+=t[r])}return void 0!==e?e:t}function C(t){var e;return e=t.authority&&t.path.length>1&&"file"===t.scheme?"//"+t.authority+t.path:47===t.path.charCodeAt(0)&&(t.path.charCodeAt(1)>=65&&t.path.charCodeAt(1)<=90||t.path.charCodeAt(1)>=97&&t.path.charCodeAt(1)<=122)&&58===t.path.charCodeAt(2)?t.path[1].toLowerCase()+t.path.substr(2):t.path,o&&(e=e.replace(/\//g,"\\")),e}function _(t,e){var r=e?P:b,n="",o=t.scheme,i=t.authority,a=t.path,s=t.query,u=t.fragment;if(o&&(n+=o,n+=":"),(i||"file"===o)&&(n+=d,n+=d),i){var h=i.indexOf("@");if(-1!==h){var c=i.substr(0,h);i=i.substr(h+1),h=c.indexOf(":"),-1===h?n+=r(c,!1):(n+=r(c.substr(0,h),!1),n+=":",n+=r(c.substr(h+1),!1)),n+="@"}i=i.toLowerCase(),h=i.indexOf(":"),-1===h?n+=r(i,!1):(n+=r(i.substr(0,h),!1),n+=i.substr(h))}if(a){if(a.length>=3&&47===a.charCodeAt(0)&&58===a.charCodeAt(2)){var f=a.charCodeAt(1);f>=65&&f<=90&&(a="/"+String.fromCharCode(f+32)+":"+a.substr(3))}else if(a.length>=2&&58===a.charCodeAt(1)){f=a.charCodeAt(0);f>=65&&f<=90&&(a=String.fromCharCode(f+32)+":"+a.substr(2))}n+=r(a,!0)}return s&&(n+="?",n+=r(s,!1)),u&&(n+="#",n+=e?u:b(u,!1)),n}}).call(this,r("4362"))},dc61:function(t,e,r){"use strict";function n(t,e){var r;return r=0===e.length?t:t.replace(/\{(\d+)\}/g,(function(t,r){var n=r[0];return"undefined"!==typeof e[n]?e[n]:t})),r}function o(t,e){for(var r=[],o=2;o<arguments.length;o++)r[o-2]=arguments[o];return n(e,r)}function i(t){return o}r.d(e,"a",(function(){return i}))},fa5b:function(t,e,r){"use strict";r.r(e),r.d(e,"setupMode1",(function(){return i})),r.d(e,"setupMode",(function(){return a}));var n=r("3023"),o=r("6dbe");function i(t){var e=new n["a"](t),r=function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];return e.getLanguageServiceWorker.apply(e,t)},i=t.languageId;monaco.languages.registerCompletionItemProvider(i,new o["a"](r)),monaco.languages.registerHoverProvider(i,new o["i"](r)),monaco.languages.registerDocumentHighlightProvider(i,new o["d"](r)),monaco.languages.registerLinkProvider(i,new o["e"](r)),monaco.languages.registerFoldingRangeProvider(i,new o["h"](r)),monaco.languages.registerDocumentSymbolProvider(i,new o["g"](r)),monaco.languages.registerSelectionRangeProvider(i,new o["k"](r)),monaco.languages.registerRenameProvider(i,new o["j"](r)),"html"===i&&(monaco.languages.registerDocumentFormattingEditProvider(i,new o["c"](r)),monaco.languages.registerDocumentRangeFormattingEditProvider(i,new o["f"](r)),new o["b"](i,r,t))}function a(t){var e=[],r=[],i=new n["a"](t);e.push(i);var a=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return i.getLanguageServiceWorker.apply(i,t)};function h(){var e=t.languageId,n=t.modeConfiguration;u(r),n.completionItems&&r.push(monaco.languages.registerCompletionItemProvider(e,new o["a"](a))),n.hovers&&r.push(monaco.languages.registerHoverProvider(e,new o["i"](a))),n.documentHighlights&&r.push(monaco.languages.registerDocumentHighlightProvider(e,new o["d"](a))),n.links&&r.push(monaco.languages.registerLinkProvider(e,new o["e"](a))),n.documentSymbols&&r.push(monaco.languages.registerDocumentSymbolProvider(e,new o["g"](a))),n.rename&&r.push(monaco.languages.registerRenameProvider(e,new o["j"](a))),n.foldingRanges&&r.push(monaco.languages.registerFoldingRangeProvider(e,new o["h"](a))),n.selectionRanges&&r.push(monaco.languages.registerSelectionRangeProvider(e,new o["k"](a))),n.documentFormattingEdits&&r.push(monaco.languages.registerDocumentFormattingEditProvider(e,new o["c"](a))),n.documentRangeFormattingEdits&&r.push(monaco.languages.registerDocumentRangeFormattingEditProvider(e,new o["f"](a))),n.diagnostics&&r.push(new o["b"](e,a,t))}return h(),e.push(s(r)),s(e)}function s(t){return{dispose:function(){return u(t)}}}function u(t){while(t.length)t.pop().dispose()}}}]);
//# sourceMappingURL=chunk-65c86e8c.03e8518b.js.map