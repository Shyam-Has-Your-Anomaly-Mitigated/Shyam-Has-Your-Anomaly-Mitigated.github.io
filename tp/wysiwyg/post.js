; function in2out() {
    ; var x = getId('input').innerHTML
    ; getId('output').innerHTML = escapeHtml(x)
}
; function out2in() {
    ; var x = getId('output').innerHTML
    ; getId('input').innerHTML = unescapeHtml(x.replace(/<br>/g, ''))
}
; function resize(div) {
    ; getId(div+'put').style.width = getId((div=='in'? 'out': 'in')+'put').style.width
}
; function escapeHtml(str) {
    /*
        http://shebang.brandonmintern.com/foolproof-html-escaping-in-javascript/
    */
    ; var div = document.createElement('div')
    ; div.appendChild(document.createTextNode(str))
    ; return div.innerHTML
}
; function unescapeHtml(escapedStr) {
    /*
        http://shebang.brandonmintern.com/foolproof-html-escaping-in-javascript/
    */
    ; var div = document.createElement('div')
    ; div.innerHTML = escapedStr
    ; var child = div.childNodes[0]
    ; return child? child.nodeValue: ''
}
; function format(type, arg) {
    /*
        https://developer.mozilla.org/en/docs/Web/API/Document/execCommand
    */
    ; switch(type) {
        case 'b':
            ; document.execCommand('bold')               ; break;
        case 'i':
            ; document.execCommand('italic')             ; break;
        case 'u':
            ; document.execCommand('underline')          ; break;
        case 's':
            ; document.execCommand('strikeThrough')      ; break;
        case '›':
            ; document.execCommand('indent')             ; break;
        case '‹':
            ; document.execCommand('outdent')            ; break;
        case 'ˢ':
            ; document.execCommand('superscript')        ; break;
        case 'ₛ':
            ; document.execCommand('subscript')          ; break;
        case '∞':
            ; var url = prompt('HREF URI string')
            ; document.execCommand('createLink', 0, url) ; break;
        case '∝':
            ; document.execCommand('unlink')             ; break;
        case 'fg':
            ; document.execCommand('foreColor', 0, arg)  ; break;
        case 'bg':
            ; document.execCommand('hiliteColor', 0, arg); break;
        case '+':
            ; document.execCommand('increaseFontSize')   ; break;
        case '-':
            ; document.execCommand('decreaseFontSize')   ; break;
        case 'pt':
            ; var pt = 0
            ; while((!Number.isInteger(pt)) || pt<1 || 7<pt) {
                ; pt = prompt('Text size between 1 and 7, inclusive.','3')
                ; pt = isNaN(pt)? 0: Number(pt)
            }
            ; document.execCommand('fontSize', 0, pt)    ; break;
        case 'h':
            ; var h = 0
            ; while((!Number.isInteger(h)) || h<1 || 6<h) {
                ; h = prompt('Heading size between 6 and 1, inclusive.','4')
                ; h = isNaN(h)? 0: Number(h)
            }
            ; document.execCommand('heading', 0, 'h'+h)  ; break;
        case 'f':
            ; document.execCommand('fontName', 0, arg)   ; break;
        case 'x':
            ; document.execCommand('removeFormat')       ; break;
        case 'css':
            ; document.execCommand('useCSS')             ; break;
        case 'style':
            ; document.execCommand('styleWithCSS')       ; break;
        default:
                                                         ; break;
    }
    ; in2out()
}
