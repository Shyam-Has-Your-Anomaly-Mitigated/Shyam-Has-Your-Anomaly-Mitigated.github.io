; function characterise() {//http://www.amp-what.com/
    ; var
        r = ''
        , s = getId('percent').value
        , encode
        , coding = getId('coding').value
    ; switch(coding) {
        case 'unicode':
            encode = function(c) {return 'U+'  + c.toString(16) + ' '};
            break;
        case 'decimal':
            encode = function(c) {return '&#'  + c + ';'};
            break;
        case 'hexadec':
            encode = function(c) {return '&#x' + c.toString(16) + ';'};
            break;
        case 'cstyles':
            encode = function(c) {return '\\'  + c.toString(16) + '␠'};
            break;
        case 'percent':
            encode = function(c) {return 'pending...'};
            break;
    }
    ; for (var a = 0, z = s.length; a < z; a += String.fromCodePoint(char).length) {
        ;var char = s.codePointAt(a)
        ; r += encode(char)
    }
    ; getId('percent').value = getId('casing').value=='lower'? r.toLowerCase(): r.toUpperCase()
}
; document.write(
    br
    + heading(format(link('Text Processing', 'https://en.wikipedia.org/wiki/Text_Processing_Utility'), 'u'), 3)
    + link('wysiwyg', './wysiwyg')
    + br + link('charcodes', './charcodes')
    + br
    + br + hr
    + br
    + select(
        + option('lower', {value: 'lower', selected: true})
        + option('UPPER', {value: 'CAPITAL'})
        , {i: 'casing'}
    )
    + select(
        + option('UNI', {value: 'unicode'})
        + option('DEC', {value: 'decimal'})
        + option('HEX', {value: 'hexadec', selected: true})
        + option('CSS', {value: 'cstyles'})
        + option('URL', {value: 'percent', disabled: true})//selected
        , {i: 'coding'}
    )
    + input({type:'button', value:'encode', onclick:';characterise()'})
    + input({type:'button', value:'decode', onclick:';alert("pending...")'})
    + br + '<textarea id="percent"></textarea>'
)
