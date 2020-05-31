import * as ace from 'brace'

ace.define('ace/mode/yasa', function (require, exports) {
  const oop = ace.acequire('ace/lib/oop')
  const TextMode = ace.acequire('ace/mode/text').Mode
  const JsonMode = ace.acequire('ace/mode/json').Mode
  const CstyleBehaviour = ace.acequire('ace/mode/behaviour/cstyle').CstyleBehaviour
  const YasaHighlightRules = ace.acequire('ace/mode/yasa_highlight_rules').YasaHighlightRules
  const Tokenizer = ace.acequire('ace/tokenizer').Tokenizer

  const Mode = function () {
    const highlighter = new YasaHighlightRules()
    this.$behaviour = new CstyleBehaviour()
    this.$tokenizer = new Tokenizer(highlighter.getRules())
    this.$embeds = highlighter.getEmbeds()
    this.createModeDelegates({
      'json-': JsonMode
    })
  }
  oop.inherits(Mode, TextMode)

  Mode()

  exports.Mode = Mode
})

ace.define('ace/mode/yasa_highlight_rules', function (require, exports) {
  const oop = ace.acequire('ace/lib/oop')
  const TextHighlightRules = ace.acequire('ace/mode/text_highlight_rules').TextHighlightRules
  const JsonHighlightRules = ace.acequire('ace/mode/json_highlight_rules').JsonHighlightRules

  const YasaHighlightRules = function () {
    this.$rules = {
      start: [
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
