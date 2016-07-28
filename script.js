// This will probably get ℝeally annoying...
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

// Should this be arrowic..?
; String.prototype.times = function(n) {// multiplier
    var r = ''
    for(var e in [...Array(n)]) {r += this}// this is a problem...
    return r
}

/***************************** Text_Processing.pl *****************************/
/* screw the server, I need readability!!!
 * at least for function names
 * attributes can be single char namespaces where it makes sense; class, title,..
 */
; var
    br    = '<br>'// newline: \n\r ∨ lf+cr
    , sp  = '&nbsp;'
    , tab = sp.times(4)
    , hr  = '<hr>'
    , getId     = s => document.getElementById(s)
    , getClass  = s => document.getElementsByClassName(s)
    , bold      = (innerHTML, attributes) => format(innerHTML, 'b', attributes)
    , italics   = (innerHTML, attributes) => format(innerHTML, 'i', attributes)
    , underline = (innerHTML, attributes) => format(innerHTML, 'u', attributes)
    , strike    = (innerHTML, attributes) => format(innerHTML, 's', attributes)
    , hover     = (innerHTML, title)      => span(innerHTML, {c: 'hover', t: title})
    , b = bold
    , i = italics
    , u = underline
    , s = strike
    , a = link
    , h = heading

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
            case 'checked' : r += ' checked' ; break;
            default        : r += ' ' + e + '=\'' + a[e] + '\'';
        }
    }
    ; return r
}

; function div(innerHTML, attributes) {// is that all I need to do?
    ; return '<div'
        + idiosync(attributes)// title, class
        + '>' + innerHTML + '</div>'
}
; function span(innerHTML, attributes) {
    ; return '<span'
        + idiosync(attributes)// title, class
        + '>' + innerHTML + '</span>'
}
; function format(innerHTML, options, attributes) {// format; options should be at the start?
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

; function link(innerHTML, url, attributes) {//hyperlink
    ; return '<a href=\'' + url + '\''
        + idiosync(attributes)// class, title
        + ' target=\'_blank\''
        + '>' + innerHTML + '</a>'
}
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

; function heading(title, type) {
    ; if(type < 1) type = 1
    ; if(6 < type) type = 6
    ; return '<h'+type+'>' + title + '</h'+type+'>'
}

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

; function tabulate(matrix, attributes) {// grep -rnw . -e 'tabulate'
    /*
        tabulate(
            [
                [
                    ['A', {attributes}]
                    , ['B', {attributes}]
                    , 'th'
                    , {attributes}
                ], [
                    ['a', {attributes}]
                    , ['b', {attributes}]
                    , 'td'
                    , {attributes}
                ]
            ], {attributes}
        )
    */
    ; var
        attributes = attributes? attributes: {}
        , table    = '<table' + idiosync(attributes) + '>'
    ; for(var row of matrix) {
        ; var [t, a] = row.splice(row.length - 2, 2)// type, attributes
        ; table += '<tr' + idiosync(a) + '>'
        ; for(var col of row) {
            ; table += '<' + t + idiosync(col[1]) + '>' + col[0] + '</' + t + '>'
        }
        ; table += '</tr>'
    }
    ; return table + '</table>'
}
