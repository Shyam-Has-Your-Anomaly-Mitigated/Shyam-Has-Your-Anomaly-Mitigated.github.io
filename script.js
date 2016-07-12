// Should these be anonymous..?
; function getId(string)    {; return document.getElementById(string)        }
; function getClass(string) {; return document.getElementsByClassName(string)}

/***************************** Text_Processing.pl *****************************/
/* screw the server, I need readability!!!
 * at least for function names
 * attributes can be single char namespaces where it makes sense; class, title,..
 */
; var tab = '&nbsp;&nbsp;&nbsp;&nbsp;'
; var br = '<br>' // newline == \n\r || lf+cr

// need attributes(), div(), span() functions...
// first clean up {b(),i(),u()} as f(), and heading() as h(), and hyperlink() as link()

; function Sanskrit(Devanagari) {
    return '<span class="Sanskrit">' + Devanagari + '</span>'
}

; function idiosync(attributes) {
    ; var attributes = attributes? attributes: {}
    ; return ''//this is very inefficient...saves the bandwidth! switch(it)?
        + (attributes.c       ? ' class=\''    + attributes.c        + '\'': '')
        + (attributes.class   ? ' class=\''    + attributes.class    + '\'': '')
        + (attributes.t       ? ' title=\''    + attributes.t        + '\'': '')//change to h..?
        + (attributes.title   ? ' title=\''    + attributes.title    + '\'': '')//change to hover
        + (attributes.url     ? ' src=\''      + attributes.url      + '\'': '')
        + (attributes.alt     ? ' alt=\''      + attributes.alt      + '\'': '')
        + (attributes.onerror ? ' onerror=\''  + attributes.onerror  + '\'': '')// onerror: '; this.src="./favicon.ico"; this.onerror=""'
        + (attributes.type    ? ' type=\''     + attributes.type     + '\'': '')
        + (attributes.value   ? ' value=\''    + attributes.value    + '\'': '')
        + (attributes.onclick ? ' onclick=\''  + attributes.onclick  + '\'': '')
        + (attributes.onchange? ' onchange=\'' + attributes.onchange + '\'': '')
        + (attributes.disabled? ' disabled': '')
        + (attributes.selected? ' selected': '')
}

; function s(innerHTML, attributes) {
    ; return '<span'
        + idiosync(attributes)// title, class
        + '>' + innerHTML + '</span>'
}
; function f(innerHTML, options, attributes) {// format
    // ...is this used as format('abc','ui') ?!?
    // options should come first...another time...
    ; for(var char of options.split('')) {
        switch(char) {
            // heading could/should be 'h'
            case 'b':// bold
            case 'i':// italics
            case 'u':// underline
            case 's':// strikethrough
                ; innerHTML = '<'
                    + char
                    + idiosync(attributes)// class, title
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
; span      = s
; format    = f
; bold      = b
; italics   = i
; underline = u

; function link(innerHTML, url, attributes) {
    ; return '<a href=\'' + url + '\''
        + idiosync(attributes)// class, title
        + ' target=\'_blank\''
        + '>' + innerHTML + '</a>'
}
; hyperlink = link
; function image(attributes) {
    ; return '<img'
        + idiosync(attributes)// url, alt, class, onerror
        + '/>'
}

//; function input({type, value, title, onclick, onchange} = {}) {
; function input(attributes) {
    ; return '<input'
        + idiosync(attributes)// type, value, title, onclick, onchange
        + '>'
}

; function select(innerHTML, attributes) {
    ; return '<select '
        + idiosync(attributes)// title, onclick, onchange
        + '>' + innerHTML + '</select>'
}
; function option(innerHTML, attributes) {
    ; return '<option '
        + idiosync(attributes)// value, disabled, selected
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
