// This will probably get annoying...
; var
    n = '\n'
    , title = 'ℝ𝔼𝕊ℙ𝕆ℕ𝕊𝕀𝔹𝕃𝔼 ℂ𝕐𝔹𝔼ℝ 𝕊𝕌ℝ𝔽𝕀ℕ𝔾'
    , whistle = '𝄞三¾三♩三♩三♬三|三♩三♩三♬三‖'
; alert(
    'This website stores files on your computer!'
    + n + '...but it\'s your responsibility ∵ you made the request!'
    + n + 'This website will probably store cookies, among other "-thing"s, at some temporal point (¿now?), but nothing will change; I am not liable, and never was!'
    + n + 'Get your bloody license; or get off the bandwidth!'
    + n + 'shyam.id.au/license'
    + n
    + n + title
    + n + '0) Download source code without assembling/compiling/interpreting/rendering it.'
    + n + '1) Read through ALL of it.'
    + n + '3) AYOR, assemble/compile/interpret/render it.'
    + n
    + n + 'I\'m Nigerian Prince; complete.'
    + n + whistle
    + n + 'https://youtu.be/s3zjRcMnRNY'
    + n + 'https://youtu.be/M94ii6MVilw'
)

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

; function idiosync(attributes) {
    ; var
        r = ''// return
        , a = attributes? attributes: {}
    ; for(var e in a) {// for each in attributes
        ; switch(e) {
            case 'i'       : r += ' id=\''    + a[e] + '\''; break;
            case 'c'       : r += ' class=\'' + a[e] + '\''; break;
            case 't'       : r += ' title=\'' + a[e] + '\''; break;//change to h & hover?
            case 'url'     : r += ' src=\''   + a[e] + '\''; break;//change to geller?uri
            case 'disabled': r += ' disabled'; break;
            case 'selected': r += ' selected'; break;
            default        : r += ' ' + e + '=\'' + a[e] + '\'';
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

; function tabulate(matrix, heading, attributes) {// hopefully this isn't being used yet...
    /*
        tabulate(
            [
                [
                    ['A', {attributes}]
                    , ['B', {attributes}]
                    , {attributes}
                ], [
                    ['a', {attributes}]
                    , ['b', {attributes}]
                    , {attributes}
                ]
            ], true, {attributes}
        )
    */
    ; var
        attributes = attributes? attributes: {}
        , table    = '<table' + idiosync(attributes) + '>'
    ; if(heading) {; table += tabulate_head(matrix.shift())}
    ; for(var row of matrix) {
        ; var a = row.pop()
        ; a = a? a: {}
        ; table += '<tr' + idiosync(a) + '>'
        ; for(var col of row) {
            ; var a = col[1]? col[1]: {}
            ; table += '<td' + idiosync(a) + '>' + col[0] + '</td>'
        }
        ; table += '</tr>'
    }
    ; return table + '</table>'
}
function tabulate_head(row) {
    ; var r = '', a = row.pop()
    ; r += '<tr' + idiosync(a? a: {}) + '>'
    ; for(var col of row) {
        ; r += '<th' + idiosync(col[1]? col[1]: {}) + '>' + col[0] + '</th>'
    }
    ; r += '</tr>'
    ; return r
}
