// https://gist.github.com/webinista/11240585
; const foldm = (r,j) => r.reduce((a,b,i,g) => !(i % j)? (a.push(g.slice(i,i+j)), a): a, [])

// is File API available?
; if(!(window.File && window.FileReader && window.FileList && window.Blob)) {; alert('Where\'s my File API?.')}
// is localStorage available?
; if(typeof window.localStorage===undefined || typeof localStorage===undefined){; alert('Where\'s my localStorage?')}

// globals
; var rc, timeout={}

// main
; clock()
; init()// whatever the fuck is going on here; should've just used the good old hard-coded system..!

// drag & drop; http://stackoverflow.com/a/33917000
; var dnd = getId('dnd')
; function showDropZone() {; dnd.style.visibility = "visible"}
; function hideDropZone() {; dnd.style.visibility = "hidden" }
; function allowDrag(e) {
    ; if (true) {  // Test that the item being dragged is a valid one
        ; e.dataTransfer.dropEffect = 'copy'
        ; e.preventDefault()
    }
}
; function handleDrop(e) {
    ; e.preventDefault()
    ; e.stopPropagation()
    ; hideDropZone()
    ; try {
        ; var r = new FileReader()
        ; r.onload = function() {; reconfigure(r.result, 0)}
        ; r.readAsText(e.dataTransfer.files[0])
    } catch(e) {; alert(e)}
}
; window.addEventListener('dragenter', function(e) {; showDropZone()})// 1
; dnd.addEventListener(   'dragenter', allowDrag                     )// 2
; dnd.addEventListener(   'dragover' , allowDrag                     )// 2
; dnd.addEventListener(   'dragleave', function(e) {; hideDropZone()})// 3
; dnd.addEventListener(   'drop'     , handleDrop                    )// 4

// file browser
; function storeClientFile(f) {// f.name, f.type, f.size, f.lastModified, f.lastModifiedDate, f.slice
    ; try {
        ; if(f.type == 'application/json') {// http://www.ietf.org/rfc/rfc4627.txt
            ; var r = new FileReader()
            ; r.onload = function() {; reconfigure(r.result, 0)}
            ; r.readAsText(f)
        } else {; alert('Your file is MIME:'+f.type+', it must be MIME:application/json')}
    } catch(e) {; alert(e)}
}

// json
; function no(s, j) {
    ; try {
        ; return j? JSON.parse(s): JSON.stringify(s)
    } catch(e) {
        ; alert(
            'Your JSON file is compromised!'
            + '\n\n\nHere are some JSON validation services:'
            + '\n\nhttp://www.jsoneditoronline.org/\n(This one supports objectivity.)'
            + '\n\nhttp://jsonformatter.org/\n(This one does everything, and more!)'
            + '\n\nhttps://jsonformatter.curiousconcept.com/\n(Use the "Compact" Template.)'
            + '\n\nhttp://www.freeformatter.com/json-validator.html\n(This validates for JS and RFC4627)'
            + '\n\nhttp://jsonlint.com/\n(I think "PRO" is free.)'
            + '\n\nhttp://codebeautify.org/jsonvalidate\n(This one shows statistics.)'
            + '\n\nhttp://www.jsonschemavalidator.net/\n(This one has many schemas; I should use schemas?)'
            + '\n\nhttps://davidwalsh.name/json-validation\n(This one is verbose; I\'ll probably get around to schemas?)'
            + '\n\nhttps://davidwalsh.name/incredible-codepen-demos\n(This isn\'t one, but it has a cube! :D)'
        )
    }
}

/*
http://time.is/widgets
https://www.timeanddate.com/services/api/
http://www.iso.org/iso/home/standards/iso8601.htm
https://en.wikipedia.org/wiki/ISO_8601
https://xkcd.com/1179/
*/
; function timestamp(t) {
    ; var
        zeroes = (x => (x<10)? '00'+x: x<100? '0'+x: x)
        , zero = (x => (x<10)? '0' +x: x)
        , Y    =        t.getFullYear()
        , M    = zero(  t.getMonth()+1)
        , D    = zero(  t.getDate()   )
        , h    = zero(  t.getHours()  )
        , m    = zero(  t.getMinutes())
        , s    = zero(  t.getSeconds())
        , ms   = zeroes(t.getMilliseconds())
        , z    = t.toString().replace(/^.+:\d+ /, '')
    ; return ''
        + Y + '-' + M + '-' + D
        + ' ' + h + ':' + m + ':' + s + '.' + ms
        + ' ' + z
}
; function secondstamp(time) {// time=seconds
    ; var s, m, h, d
    ; s = time % 60
    ; time = (time - s)/60
    ; m = time % 60
    ; time = (time - m)/60
    ; h = time % 24
    ; time = (time - h)/24
    ; d = time
    ; return [d, h, m, s]
}
; function timer(a, b) {
    ; var
        diff = new Date(new Date(b) - new Date(a))
        , [d,h,m,s] = secondstamp(parseInt(diff/1000))
    ; return ((0<d?d+'d ':'') + (0<h?h+'h ':'') + (0<m?m+'m ':'') + s + 's')
}
; function timer_clock(id, object, property, t) {
    ; var diff,d,h,m,s
    ; diff = new Date(Date.now() - new Date(object[property]))
    ; [d,h,m,s] = secondstamp(parseInt(diff/1000))
    ; getId(id).innerHTML = (0<d?d+'d ':'') + (0<h?h+'h ':'') + (0<m?m+'m ':'') + s + 's'
    ; timeout[t] = setTimeout(timer_clock, 100, id, object, property, t)
}
; function clock() {
    ; var t
    ; getId('clock').innerHTML = timestamp(new Date())
    ; t = setTimeout(clock, 1)//100
}

; function init() {
    ; if('rc' in localStorage) {; reconfigure(localStorage.rc, 0)}
        else {; download('awoogarc.json')}
}
; function download(url) {
        ; var xhr = new XMLHttpRequest()
        ; xhr.onreadystatechange = function() {
            ; if (xhr.readyState == 4 && xhr.status == 200) {
                ; reconfigure(xhr.responseText, 1)
            }
        }
        ; xhr.open("GET", url, true)
        ; xhr.send()
}

; function reconfigure(json, reset) {
    ; rc = no(json, 1)
    ; if(reset) {; reset_timers()}// to reset, or not to reset; that is configurable...
    ; localStorage.rc = no(rc, 0)
    ; Molly()
    ; reset_tables()
}
; function Molly() {
    ; var h = getId('Holly')// ^
    ; h.innerHTML = ''
    ; for(var table in rc) {
        ; var head = Molly_header(foldm(Object.keys(rc[table].header), 1), table)
        ; var list = Molly_row(foldm(Object.keys(rc[table].row), 1), table)
        ; h.innerHTML += tabulate(
            [head].concat(list)
            , true, {style: "; display: inline-block; vertical-align: top; margin: 3px"}
        )
    }
}
; function Molly_hover(object, name) {
    ; var s = 'hover' in object
        ? {class: 'hover', title: object.hover.replace(/'/g, '&#x27;')}
        : {}
    ; return 'hover' in object? span(name, s): name
}
; function Molly_link(object, name) {; return 'link' in object? name + ' ∞': name}
; function Molly_header(list, table) {
    ; var th = {colspan: 4}, h
    ; return [
        [
            Molly_link(rc[table].header, Molly_hover(rc[table].header, table))
            , th
        ],{onclick: (// what a waste...
                'link' in rc[table].header
                ? 'window.open(&#x27;' + rc[table].header.link + '&#x27;, &#x27;_blank&#x27;).focus()'
                : ''
        )}
    ]
}
; function Molly_row(list, table) {
    ; for(var e in list) {
        ; var js = '; rc["'+table+'"].row'+'["'+Object.keys(rc[table].row)[e]+'"].time = new Date; localStorage.rc = no(rc, 0)'
        ; list[e] = [
            [  '↦', {id: list[e] + '-start', class: 'start'}]
            , ['⇥' , {id: list[e] + '-stop' , class: 'stop' }]
            , [
                Molly_link(rc[table].row[list[e]], Molly_hover(rc[table].row[list[e]], list[e]))
                , {id: list[e] + '-ident', class: 'ident', onclick: js}
            ]
            , ['', {id: list[e] + '-time' , class: 'time' , onclick: js}]
            , {onclick: (// what a waste...
                'link' in rc[table].row[list[e]]
                ? 'window.open(&#x27;' + rc[table].row[list[e]].link + '&#x27;, &#x27;_blank&#x27;).focus()'
                : ''
            )}
        ]
    }
    ; return list
}
; function reset_timers() {
    ; for(var t in rc) {; for(var e in rc[t].row) {// for each in table in rc
        ; rc[t].row[e].time = Date.now()
    }}
}
; function reset_tables() {
    ; for(var e in timeout) {; clearTimeout(timeout[e])}
    ; for(var t in rc) {; for(var e in rc[t].row) {// for each in table in rc
        ; timer_clock(e + '-time', rc[t].row[e], 'time', e)
    }}
}

// add exceptions for sleep, wake, man, and auto; above...
// add CSS awooga and timers here, need to adjust table structure and whatever else...
// clean up; pre.js...
// implement statistical logging; replace "Download" and textarea...
// implement start/stop for statistical logging...
// add <input> for notes/commenting statistical logs...
// scrutinise paperwork before scanning/shredding...
// add study, and what not, to the awoogarc.json file...

// FFS; make the whole row clickable!!! D-:<

// awoogarc.json: drag'n'drop, weblinks...

/* Awoogas
taboo
    time = <seconds>
    on   : 0s to this(time)         ; awooga(time_colours)
    off  : this(time) to done
    on   : done to next(time)       ; awooga(time_colours)
    done = 0s
tardy
    time = <seconds>
    off  : 0s to this(time)
    on   : this(time) to done       ; awooga(time_colours)
    off  : done to next(time)
    done = 0s
taboo & tardy
    taby = <seconds>
    tard = <seconds>
    on   : 0s to this(taby)         ; awooga(taby_colours)
    off  : this(taby) to this(tard)
    on   : this(tard) to done       ; awooga(tard_colours)
    on   : done to next(taby)       ; awooga(taby_colours)
    done = 0s

every <time> after <seconds>
    {laundry∈every(week)|[6am,+∞)}
every <time> between <seconds> and <seconds>
    {rehydrate∈every(hour)|[6am,9pm]}

time∈{
    "other"∈{
        "secondly", "minutely"   , "hourly" , "daily"
        , "weekly", "fortnightly", "monthly", "yearly"
    }
    , {"seconds"∈ℤ|[1,+∞ )}
    , {"second" ∈ℤ|[1,60 ]}
    , {"minute" ∈ℤ|[1,60 ]}
    , {"hour"   ∈ℤ|[1,24 ]}
    , {"wday"   ∈ℤ|[1,7  ]}
    , {"mday"   ∈ℤ|[1,31 ]}
    , {"day"    ∈ℤ|[1,365]}
    , {"week"   ∈ℤ|[1,52 ]}
    , {"month"  ∈ℤ|[1,12 ]}
}
*/

// NEED TO WRITE UP SOME KIND OF WYSIWYG FOR THIS... (temporal conversions to seconds, and the rest of JSON; replace the recommendations.)

/*
awooga_profiles
    animation: DONT_PANIC 5s infinite
        colour_A = FF0
        colour_Z = F00
    animation: biomedical 5s infinite
        colour_A = FF0
        colour_Z = 0FF
    animation: static 5s infinite
        colour_A = F
        colour_Z = 0

linked_clicks
    update time
    log stats
    open link in new tab

custom_files
    awoogarc.json
    awoogarc.css
*/

// this needs validation...
// <input type="button" value="Cyberphile" onclick="download(prompt())">
