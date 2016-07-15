// Should these be anonymous..?
; function getId(string)    {; return document.getElementById(string)        }
; function getClass(string) {; return document.getElementsByClassName(string)}

/***************************** Text_Processing.pl *****************************/
/* screw the server, I need readability!!!
 * at least for function names
 * attributes can be single char namespaces where it makes sense; class, title,..
 */
; var br  = '<br>' // newline == \n\r || lf+cr
; var tab = '&nbsp;&nbsp;&nbsp;&nbsp;'
; var hr  = '<hr>'

// need div() function...
// first clean up heading() as h()

; function Sanskrit(Devanagari) {
    return '<span class="Sanskrit">' + Devanagari + '</span>'
}

//http://stackoverflow.com/a/32542368
; function getName(property) {; return /\.([^\.;]+);?\s*\}$/.exec(property.toString())[1]}
; function idiosync(attributes) {
    ; var
        r = ''// return
        , a = attributes? attributes: {}
    ; for(var e in a) {// for each in attributes
        ; switch(e) {
            case 'i'       : r += ' id=\''    + a[e] + '\'';
            case 'c'       : r += ' class=\'' + a[e] + '\'';
            case 't'       : r += ' title=\'' + a[e] + '\'';//change to h & hover?
            case 'url'     : r += ' src=\''   + a[e] + '\'';//change to geller?uri
            case 'disabled': r += ' disabled';
            case 'selected': r += ' selected';
            case default   : r += ' ' + e + '=\'' + a[e] + '\'';
        }
    }
    ; return r
}

; function s(innerHTML, attributes) {// span
    ; return '<span'
        + idiosync(attributes)// title, class
        + '>' + innerHTML + '</span>'
}
; function f(innerHTML, options, attributes) {// format
    // ...is this used as format('abc','ui') ?!?
    // options should come first...another time...
    ; for(var char of options.split('')) {
        ; switch(char) {
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
                ;
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

; function a(innerHTML, url, attributes) {//hyperlink
    ; return '<a href=\'' + url + '\''
        + idiosync(attributes)// class, title
        + ' target=\'_blank\''
        + '>' + innerHTML + '</a>'
}
; link = a
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
