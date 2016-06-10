// Should these be anonymous..?
; function getId(string)    {; return document.getElementById(string)        }
; function getClass(string) {; return document.getElementsByClassName(string)}

/***************************** Text_Processing.pl *****************************/
; var tab = '&nbsp;&nbsp;&nbsp;&nbsp;'
; var br = '<br>' // newline == \n\r || lf+cr

; function format(text, options) {
    // ...is this used as format('abc','ui') ?!?
    ; if(-1<options.indexOf('b')) text = bold(text)
    ; if(-1<options.indexOf('i')) text = italics(text)
    ; if(-1<options.indexOf('u')) text = underline(text)
    ; return text
}
; function bold(text) {; return '<b>' + text + '</b>'}
; function italics(text) {; return '<i>' + text + '</i>'}
; function underline(text) {; return '<u>' + text + '</u>'}

; function hyperlink(text, url) {
    ; return '<a href=\'' + url + '\' target=\'_blank\'>' + text + '</a>'
}

//; function input({type, value, title, onclick, onchange} = {}) {
; function input(attributes) {
    ; var attributes = attributes === undefined? {}: attributes
    ; return '<input'
        + (attributes.type     === undefined? ' type=\''     + attributes.type     + '\'': '')
        + (attributes.value    === undefined? ' value=\''    + attributes.value    + '\'': '')
        + (attributes.title    === undefined? ' title=\''    + attributes.title    + '\'': '')
        + (attributes.onclick  === undefined? ' onclick=\''  + attributes.onclick  + '\'': '')
        + (attributes.onchange === undefined? ' onchange=\'' + attributes.onchange + '\'': '')
        + '>'
}

; function select(innerHTML, attributes) {
    ; var attributes = attributes === undefined? {}: attributes
    ; return '<select '
        + (attributes.title    === undefined? ' title=\''    + attributes.title    + '\'': '')
        + (attributes.onclick  === undefined? ' onclick=\''  + attributes.onclick  + '\'': '')
        + (attributes.onchange === undefined? ' onchange=\'' + attributes.onchange + '\'': '')
}
; function option(innerHTML, attributes) {
    ; var attributes = attributes === undefined? {}: attributes
    ; return '<option '
        + (attributes.value    === undefined? ' value=\'' + attributes.value + '\'': '')
        + (attributes.disabled === undefined? ' disabled': '')
        + (attributes.selected === undefined? ' selected': '')
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
