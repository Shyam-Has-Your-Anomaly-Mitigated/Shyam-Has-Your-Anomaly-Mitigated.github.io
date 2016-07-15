//https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references
//https://en.wikipedia.org/wiki/Character_encodings_in_HTML
; function characterise() {
    ; var
        r        = ''                    //return
        , s      = getId('charbx').value//string
        , encode
        , encase = (getId('casing').value == 'lower'
            ? function(x) {return x.toLowerCase()}
            : function(x) {return x.toUpperCase()}
        )
        , o = getId('open').value
        , c = getId('close').value
    ; switch(getId('coding').value) {
        case 'unicode':
        case 'hexadec':
        case 'cstyles': encode = function(x) {return o + encase(x.toString(16)) + c}; break;
        case 'decimal': encode = function(x) {return o + encase(x.toString(10)) + c}; break;
        case 'percent':
        case 'extendm':
        case 'hypertm':
        case 'xypertm': encode = function(x) {return o + encase('pending...'  ) + c}; break;
    }
    ; for (var a = 0, z = s.length; a < z; a += String.fromCodePoint(char).length) {
        ; var char = s.codePointAt(a)
        ; r += encode(char)
    }
    ; getId('charbx').value = r
}
; function reformat(option) {
    ; var o, c
    ; switch(option) {
        case 'unicode': o = 'U+' ; c = ' '; break;
        case 'decimal': o = '&#' ; c = ';'; break;
        case 'hexadec': o = '&#x'; c = ';'; break;
        case 'cstyles': o = '\\' ; c = '␠'; break;
        case 'percent': o = '%'  ; c = '' ; break;
        case 'extendm':
        case 'hypertm':
        case 'xypertm': o = '&'  ; c = ';'; break;
        default: o = ''; c = '';
    }
    ; getId('open').value = o
    ; getId('close').value = c
}
; document.write(
    heading(format(link('Text Processing', 'https://en.wikipedia.org/wiki/Text_Processing_Utility'), 'u'), 3)
    + link('wysiwyg', './wysiwyg')
    + br + link('charcodes', './charcodes')
    + br
    + br + hr
    + br
    + input({type: 'text', id: 'open', placeholder: 'open', size: '5'})
    + select(
        option(  'lower', {value: 'lower'})
        + option('UPPER', {value: 'CAPITAL', selected: true})
        , {i: 'casing'}
    )
    + select(
        option(  '...'  , {value: '.......', selected: true, disabled: true})
        + option('UNI'  , {value: 'unicode'})
        + option('DEC'  , {value: 'decimal'})
        + option('HEX'  , {value: 'hexadec'})
        + option('CSS'  , {value: 'cstyles'})
        + option('URL'  , {value: 'percent', disabled: true})//selected
        + option('XML'  , {value: 'extendm', disabled: true})//selected
        + option('HTML' , {value: 'hypertm', disabled: true})//selected
        + option('XHTML', {value: 'xypertm', disabled: true})//selected
        , {
            i: 'coding'
            , onclick : '; reformat(this.value)'
            , onchange: '; reformat(this.value)'
        }
    )
    + input({type: 'text', id: 'close', placeholder: 'close', size: '5'})
    + input({type: 'button', value: 'encode', onclick: ';characterise()'})
    + input({type: 'button', value: 'decode', onclick: ';alert("pending...")'})
    + br + '<textarea id="charbx"></textarea>'
    + br    + link('☺', 'http://www.amp-what.com/')
    + '...' + link('™', 'http://textmechanic.co/ASCII-to-Unicode-Converter.html')
)
