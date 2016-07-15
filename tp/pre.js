; function characterise() {
    ; var
        r        = ''                    //return
        , s      = getId('percent').value//string
        , coding = getId('coding' ).value
        , encode
        , o = getId('open').value
        , c = getId('close').value
    ; switch(coding) {
        case 'unicode': encode = function(x) {return o + x.toString(16) + c}; break;
        case 'decimal': encode = function(x) {return o + x              + c}; break;
        case 'hexadec': encode = function(x) {return o + x.toString(16) + c}; break;
        case 'cstyles': encode = function(x) {return o + x.toString(16) + c}; break;
        case 'percent': encode = function(x) {return 'pending...'          }; break;
        case 'extendm': encode = function(x) {return 'pending...'          }; break;
        case 'hypertm': encode = function(x) {return 'pending...'          }; break;
        case 'xypertm': encode = function(x) {return 'pending...'          }; break;
    }
    ; for (var a = 0, z = s.length; a < z; a += String.fromCodePoint(char).length) {
        ; var char = s.codePointAt(a)
        ; r += encode(char)
    }
    ; getId('percent').value = getId('casing').value=='lower'? r.toLowerCase(): r.toUpperCase()
}
; function reformat(option) {
    ; var o, c
    ; switch(option) {
        case 'unicode': o = 'U+' ; c = ' '; break;
        case 'decimal': o = '&#' ; c = ';'; break;
        case 'hexadec': o = '&#x'; c = ';'; break;
        case 'cstyles': o = '\\' ; c = '␠'; break;
        case 'percent': o = '%'  ; c = '' ; break;
        case 'extendm': o = '&'  ; c = ';'; break;
        case 'hypertm': o = '&'  ; c = ';'; break;
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
        option('lower', {value: 'lower', selected: true})
        + option('UPPER', {value: 'CAPITAL'})
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
    + input({type:'button', value:'encode', onclick:';characterise()'})
    + input({type:'button', value:'decode', onclick:';alert("pending...")'})
    + br + '<textarea id="percent"></textarea>'
    + br +  link('☺', 'http://www.amp-what.com/')
    + '...' + link('™', 'http://textmechanic.co/ASCII-to-Unicode-Converter.html')
)
