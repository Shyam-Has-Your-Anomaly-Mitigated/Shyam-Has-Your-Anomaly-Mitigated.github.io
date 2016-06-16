// Should these be anonymous..?
; function getId(string)    {; return document.getElementById(string)        }
; function getClass(string) {; return document.getElementsByClassName(string)}

/***************************** Text_Processing.pl *****************************/
; var tab = '&nbsp;&nbsp;&nbsp;&nbsp;'
; var br = '<br>' // newline == \n\r || lf+cr

; function Sanskrit(Devanagari) {
    return '<span class="Sanskrit">' + Devanagari + '</span>'
}

; function format(innerHTML, options, attributes) {
    // ...is this used as format('abc','ui') ?!?
    ; var attributes = attributes? attributes: {}
    ; for(var char of options.split('')) {
        switch(char) {
            case 'b':
            case 'i':
            case 'u':
                ; innerHTML = '<'
                    + char
                    + (attributes.class? ' class=\'' + attributes.class + '\'': '')
                    + (attributes.title? ' title=\'' + attributes.title + '\'': '')
                    + '>' + innerHTML + '</' + char + '>'
        }
    }
    ; return innerHTML
}
// ...are these redundant? ...or should they have single width namespaces?
; function bold(     innerHTML, attributes) {; return format(innerHTML, 'b', attributes)}
; function italics(  innerHTML, attributes) {; return format(innerHTML, 'i', attributes)}
; function underline(innerHTML, attributes) {; return format(innerHTML, 'u', attributes)}

; function hyperlink(innerHTML, url) {
    ; return '<a href=\'' + url + '\' target=\'_blank\'>' + innerHTML + '</a>'
}
; function image(attributes) {
    ; var attributes = attributes? attributes: {}
    ; return '<img'
        + (attributes.url    ? ' src=\''     + attributes.url     + '\'': '')
        + (attributes.alt    ? ' alt=\''     + attributes.alt     + '\'': '')
        + (attributes.class  ? ' class=\''   + attributes.class   + '\'': '')
        + (attributes.onerror? ' onerror=\'' + attributes.onerror + '\'': '') // onerror: '; this.src="./favicon.ico"; this.onerror=""'
        + '/>'
}

//; function input({type, value, title, onclick, onchange} = {}) {
; function input(attributes) {
    ; var attributes = attributes? attributes: {}
    ; return '<input'
        + (attributes.type    ? ' type=\''     + attributes.type     + '\'': '')
        + (attributes.value   ? ' value=\''    + attributes.value    + '\'': '')
        + (attributes.title   ? ' title=\''    + attributes.title    + '\'': '')
        + (attributes.onclick ? ' onclick=\''  + attributes.onclick  + '\'': '')
        + (attributes.onchange? ' onchange=\'' + attributes.onchange + '\'': '')
        + '>'
}

; function select(innerHTML, attributes) {
    ; var attributes = attributes? attributes: {}
    ; return '<select '
        + (attributes.title   ? ' title=\''    + attributes.title    + '\'': '')
        + (attributes.onclick ? ' onclick=\''  + attributes.onclick  + '\'': '')
        + (attributes.onchange? ' onchange=\'' + attributes.onchange + '\'': '')
        + '>' + innerHTML + '</select>'
}
; function option(innerHTML, attributes) {
    ; var attributes = attributes? attributes: {}
    ; return '<option '
        + (attributes.value   ? ' value=\'' + attributes.value + '\'': '')
        + (attributes.disabled? ' disabled': '')
        + (attributes.selected? ' selected': '')
        + '>' + innerHTML + '</option>'
}

; function heading(title, type) {
    ; if(type < 1) type = 1
    ; if(6 < type) type = 6
    ; return '<h'+type+'>' + title + '</h'+type+'>'
}

; function listify(list, type) { // listicle
    ; var ret = '<' + type + '>'
    //; for(var i=0; i<list.length ;i++) {; ret += list[i] + '<br>'}
    ; for(var val of list) {; ret += '<li>' + val + '</li>'}
    ; return ret + '</' + type + '>'
}

; function tabulate(matrix, heading) {
    /*
        tabulate(
            [
                ['A', 'B']
                , ['a', 'b']
            ], true
        )
    */
    ; var table = '<table>'
    ; if(heading) {
        ; table += '<tr>'
        ; for(var col of matrix.shift()) {
            ; table += '<th>' + col + '</th>'
        }
        ; table += '</tr>'
    }
    ; for(var row of matrix) {
        ; table += '<tr>'
        ; for(var col of row) {
            ; table += '<td>' + col + '</td>'
        }
        ; table += '</tr>'
    }
    ; return table + '</table>'
}
