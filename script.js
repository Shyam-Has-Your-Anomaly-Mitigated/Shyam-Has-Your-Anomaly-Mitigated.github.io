// Should these be anonymous..?
; function getId(string)    {; return document.getElementById(string)        }
; function getClass(string) {; return document.getElementsByClassName(string)}

/***************************** Text_Processing.pl *****************************/
; var tab = '&nbsp;&nbsp;&nbsp;&nbsp;'
; var br = '<br>' // newline == \n\r || lf+cr

// need attributes(), div(), span() functions...
// first clean up {b(),i(),u()} as f(), and heading() as h(), and hyperlink() as link()

; function Sanskrit(Devanagari) {
    return '<span class="Sanskrit">' + Devanagari + '</span>'
}

; function attributes(attributes) {
    ; var attributes = attributes? attributes: {}
    ; return ''
        + (attributes.class? ' class=\'' + attributes.class + '\'': '')
        + (attributes.title? ' title=\'' + attributes.title + '\'': '')
}

; function f(innerHTML, options, attributes) {// format
    // ...is this used as format('abc','ui') ?!?
    ; for(var char of options.split('')) {
        switch(char) {
            case 'b':// bold
            case 'i':// italics
            case 'u':// underline
            case 's':// strikethrough
                ; innerHTML = '<'
                    + char
                    + attributes(attributes)// class, title
                    + '>' + innerHTML + '</' + char + '>'
                ; break
        }
    }
    ; return innerHTML
}
// ...are these redundant? ...or should they have single width namespaces?
; function b(innerHTML, attributes) {; return format(innerHTML, 'b', attributes)}
; function i(innerHTML, attributes) {; return format(innerHTML, 'i', attributes)}
; function u(innerHTML, attributes) {; return format(innerHTML, 'u', attributes)}
// why can't these be the other way around? one has value, the other doesn't; unambiguous!
; format    = f
; bold      = b
; italics   = i
; underline = u

; function link(innerHTML, url, attributes) {
    ; return '<a href=\'' + url + '\''
        + attributes(attributes)// class, title
        + ' target=\'_blank\''
        + '>' + innerHTML + '</a>'
}
; hyperlink = link
; function image(attributes) {
    ; var attributes = attributes? attributes: {}
    ; return '<img'
        + (attributes.url    ? ' src=\''     + attributes.url     + '\'': '')
        + (attributes.alt    ? ' alt=\''     + attributes.alt     + '\'': '')
        + (attributes.class  ? ' class=\''   + attributes.class   + '\'': '')
        + (attributes.onerror? ' onerror=\'' + attributes.onerror + '\'': '')// onerror: '; this.src="./favicon.ico"; this.onerror=""'
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

; function h(title, type) {
    ; if(type < 1) type = 1
    ; if(6 < type) type = 6
    ; return '<h'+type+'>' + title + '</h'+type+'>'
}
; heading = h

; function listify(list, type) {// listicle
    /*
        listify(
            [
                'a'
                , 'b'
                , 'c'
            ], 'ol'
        )
    */
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
