// Should these be anonymous..?
; function getId(string)    {; return document.getElementById(string)        }
; function getClass(string) {; return document.getElementsByClassName(string)}

/***************************** Text_Processing.pl *****************************/
; var tab = '&nbsp;&nbsp;&nbsp;&nbsp;'
; var br = '<br>' // newline == \n\r || lf+cr

; function format(text, options) {
    // ...is this used as format('abc','ui') ?!?
    ; if(-1<options.indexOf('b')) text = b(text)
    ; if(-1<options.indexOf('i')) text = i(text)
    ; if(-1<options.indexOf('u')) text = u(text)
    ; return text
}
; function b(text) {
    ; return '<b>' + text + '</b>'
}
; function i(text) {
    ; return '<i>' + text + '</i>'
}
; function u(text) {
    ; return '<u>' + text + '</u>'
}

; function hyperlink(text, url) {
    ; return '<a href=\'' + url + '\' target=\'_blank\'>' + text + '</a>'
}

; function input(type) {
    ; return '<input type=\'' + type + '\'>'
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
