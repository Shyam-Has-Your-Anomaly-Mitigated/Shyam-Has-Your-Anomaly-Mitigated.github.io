// Should these be anonymous..?
; function getId(string)    {; return document.getElementById(string)        }
; function getClass(string) {; return document.getElementsByClassName(string)}

/***************************** Text_Processing.pl *****************************/
; var tab = '&nbsp;&nbsp;&nbsp;&nbsp;'
; var br = '<br>' // newline == \n\r || lf+cr

; function format(text, options, attributes) {
    // ...is this used as format('abc','ui') ?!?
    ; var attributes = attributes? attributes: {}
    ; for(var char of options.split('')) {
        switch(char) {
            case 'b':
            case 'i':
            case 'u':
                text = '<'
                    + char
                    + (attributes.class? ' class=\'' + attributes.class + '\'': '')
                    + '>' + text + '</' + char + '>'
        }
    }
    ; return text
}
; function bold(     text, attributes) {; return format(text, 'b', attributes)}
; function italics(  text, attributes) {; return format(text, 'i', attributes)}
; function underline(text, attributes) {; return format(text, 'u', attributes)}

; function hyperlink(text, url) {
    ; return '<a href=\'' + url + '\' target=\'_blank\'>' + text + '</a>'
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
