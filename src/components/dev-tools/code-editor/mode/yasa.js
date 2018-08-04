import ace from 'brace'

ace.define('ace/mode/yasa', function (require, exports) {
  const oop = require('ace/lib/oop')
  const TextMode = require('ace/mode/text').Mode
  const JsonMode = require('ace/mode/json').Mode
  const CstyleBehaviour = ace.acequire('ace/mode/behaviour/cstyle').CstyleBehaviour
  const YasaHighlightRules = require('ace/mode/yasa_highlight_rules').YasaHighlightRules
  const Tokenizer = require('ace/tokenizer').Tokenizer

  let Mode = function () {
    // this.HighlightRules = YasaHighlightRules
    const highlighter = new YasaHighlightRules()
    this.$behaviour = new CstyleBehaviour()
    this.$tokenizer = new Tokenizer(highlighter.getRules())
    this.$embeds = highlighter.getEmbeds()
    this.createModeDelegates({
      'json-': JsonMode
    })
  }
  oop.inherits(Mode, TextMode);

  (function () {
  }).call(Mode.prototype)

  exports.Mode = Mode
})

ace.define('ace/mode/yasa_highlight_rules', function (require, exports) {
  const oop = require('ace/lib/oop')
  const TextHighlightRules = require('ace/mode/text_highlight_rules').TextHighlightRules
  const JsonHighlightRules = require('ace/mode/json_highlight_rules').JsonHighlightRules

  let YasaHighlightRules = function () {
    this.$rules = {
      'start': [
        {
          token: 'keyword',
          regex: /^(GET|POST|PUT|HEADER|DELETE)(\s+|$)/
        },
        {
          token: 'paren.lparen',
          regex: '{',
          next: 'json-start'
        }
      ]
    }
    this.embedRules(JsonHighlightRules, 'json-', [{
      token: 'end',
      regex: /^$/,
      next: 'start'
    }])
  }

  oop.inherits(YasaHighlightRules, TextHighlightRules)

  exports.YasaHighlightRules = YasaHighlightRules
})
