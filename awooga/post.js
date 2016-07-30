// https://gist.github.com/webinista/11240585
; const foldm = (r, j) => r.reduce((a, b, i, g) => !(i % j)? (a.push(g.slice(i, i + j)), a): a, [])

// is File API available?
; if(!(window.File && window.FileReader && window.FileList && window.Blob)) {; alert('Where\'s my File API?.')}
// is localStorage available?
; if(typeof window.localStorage === undefined || typeof localStorage === undefined){; alert('Where\'s my localStorage?')}

// globals
; var
    rc
    , timeout  = {}
    , re_local = /(file):\/\/\/(.+?\/)+.+\.json/// Can't test on other platforms; MS must be backwards..?
    , re_cyber = /(https?|ftp)(:\/\/)(.+?\.)+(.+?\/)+.+\.json/
    , dnd      = getId('dnd')
    , clock
    , init

// main
; (clock = () => {; getId('clock').innerHTML = timestamp(new Date()); setTimeout(clock, 1)})()
; (init  = () => 'rc' in localStorage? reconfigure(localStorage.rc, 0): download('awoogarc.json'))()

// drag & drop; http://stackoverflow.com/a/33917000
; function dnd_show()  {; dnd.style.visibility = "visible"}
; function dnd_hide()  {; dnd.style.visibility = "hidden" }
; function dnd_drag(e) {; e.dataTransfer.dropEffect = 'copy'; e.preventDefault()}
; function dnd_drop(e) {
    ; e.preventDefault()
    ; e.stopPropagation()
    ; dnd.style.visibility = "hidden"
    ; if (e.dataTransfer.getData('text').match(re_local)) {
        ; browse_file(e.dataTransfer.files[0])
    } else {
        ; alert('Blame the W3C.')
        /* HotTeST Social Engineering Public Computer
            Host a server.
            Tansmit address to server.
            Server downloads file from address.
            Transmit file from server.
            ... https://youtu.be/kJa2kwoZ2a4
            Store their address.
            Edrop their transmissions.
            Phish their username.
            Crack their password.
        */// RoA54: ν = (wealth)′ = r÷t = ∫profits! :D
        //; download(e.dataTransfer.getData('text'))// Doesn't support drag & drop from text editor..?
    }
}
; window.addEventListener('dragenter', dnd_show)// 1
; dnd.addEventListener(   'dragenter', dnd_drag)// 2
; dnd.addEventListener(   'dragover' , dnd_drag)// 2
; dnd.addEventListener(   'dragleave', dnd_hide)// 3
; dnd.addEventListener(   'drop'     , dnd_drop)// 4

; function download(address) {
        ; if(!(address == 'awoogarc.json' || address.match(re_cyber))) {// WTF is the data scheme? Find out ∧ support it! 8D
            ; alert('Invalid address!\nMust begin with: {file, ftp, http, https}∋scheme://\nMust end with: .json\n\nPlease transmit bugs towards: shyam@shyam.id.au')
            ; return false
        }
        ; var xhr = new XMLHttpRequest()
        ; xhr.onreadystatechange = function() {
            ; if (xhr.readyState == 4 && xhr.status == 200) {
                ; reconfigure(xhr.responseText, 1)
            }
        }
        ; xhr.open("GET", address, true)
        ; xhr.send()
        ; return true
}

; function browse_file(f) {// f.name.match(/\.json$/) only enforced for dnd ∧ links
    ; try {
        ; if(f.type == 'application/json') {// http://www.ietf.org/rfc/rfc4627.txt
            ; var r = new FileReader()
            ; r.onload = () => reconfigure(r.result, 0)
            ; r.readAsText(f)
        } else {; alert('Your file is MIME:' + f.type + ', it must be MIME:application/json')}
    } catch(e) {; alert(e)}
}

; function no(s, j) {// (j,s)on
    ; try {
        ; return j? JSON.parse(s): JSON.stringify(s)
    } catch(e) {
        ; alert(
            'Your JSON file is compromised! (http://www.json.org/)'
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
; function zero(x) {; return (x < 10)? '0' + x: x}
; function timestamp(t) {
    ; var
        zeroes = (x => (x < 10)? '00' + x: x < 100? '0' + x: x)
        , Y    =        t.getFullYear()
        , M    = zero(  t.getMonth() + 1)
        , D    = zero(  t.getDate()     )
        , h    = zero(  t.getHours()    )
        , m    = zero(  t.getMinutes()  )
        , s    = zero(  t.getSeconds()  )
        , ms   = zeroes(t.getMilliseconds())
        , z    = t.toString().replace(/^.+:\d+ /, '')
    ; return ''
        + Y + '-' + M + '-' + D
        + ' ' + h + ':' + m + ':' + s + '.' + ms
        + ' ' + z
}
; function timer(id, object, property) {
    ; var
        diff           = new Date(Date.now() - new Date(object[property]))
        , [d, h, m, s] = secondstamp(parseInt(diff/1000))
    ; getId(id + '-time').innerHTML = (
        (  0 < d? zero(d) + 'd ': '')
        + (0 < h? zero(h) + 'h ': '')
        + (0 < m? zero(m) + 'm ': '')
        +         zero(s) + 's'
    )
    ; timeout[id] = setTimeout(timer, 100, id, object, property)
}
; function secondstamp(time) {// time=seconds
    ; var s, m, h, d
    ; s = time % 60
    ; time = (time - s) / 60
    ; m = time % 60
    ; time = (time - m) / 60
    ; h = time % 24
    ; time = (time - h) / 24
    ; d = time
    ; return [d, h, m, s]
}

; function reconfigure(json, reset) {
    ; rc = no(json, 1)
    ; css_keyframes(rc.Alarms)
    ; if(reset) {; reset_timers()}// to reset, or not to reset; that is configurable...
    ; localStorage.rc = no(rc, 0)
    ; Molly()
    ; reset_tables()
}
; function reset_timers() {
    ; for(var t in rc) {; for(var e in rc[t]) {// ∀ each ∈ table ∈ rc
        ; if(t != 'Alarms') {; rc[t][e].time = Date.now()}
    }}
}
; function reset_tables() {
    ; for(var id in timeout) {; clearTimeout(timeout[id])}
    ; for(var t in rc) {; for(var id in rc[t]) {// ∀ id ∈ table ∈ rc
        ; if(t != 'Alarms' && !rc[t][id].title) {
            ; timer(id, rc[t][id], 'time')
        }
    }}
}

; function css_keyframes(o) {// object
    ; var css = getId('keyframes')
    ; css.innerHTML = ''
    ; for(var a in o) {// ∀ alarm ∈ object
        ; var ta = tz = ba = bz = false, style
        ; if('color'        in o[a]) {; ba = bz = ta = tz = o[a].color }
        ; if('color_A'      in o[a]) {; ba = tz = o[a].color_A         }
        ; if('color_Z'      in o[a]) {; ta = bz = o[a].color_Z         }
        ; if('colour'       in o[a]) {; ba = bz = ta = tz = o[a].colour}
        ; if('colour_A'     in o[a]) {; ba = tz = o[a].colour_A        }
        ; if('colour_Z'     in o[a]) {; ta = bz = o[a].colour_Z        }
        ; if('text'         in o[a]) {; ta = tz = o[a].text            }
        ; if('background'   in o[a]) {; ba = bz = o[a].background      }
        ; if('text_A'       in o[a]) {; ta = o[a].text_A               }
        ; if('text_Z'       in o[a]) {; tz = o[a].text_Z               }
        ; if('background_A' in o[a]) {; ba = o[a].background_A         }
        ; if('background_Z' in o[a]) {; bz = o[a].background_Z         }
        ; style = ' '
            + a + '{0%,100%{'
            + (ta? ';color:' + ta: '') + (ba? ';background-color:' + ba: '')
            + '}50%{'
            + (tz? ';color:' + tz: '') + (bz? ';background-color:' + bz: '')
            + '}}'
        ; css.innerHTML += '@keyframes' + style + '@-webkit-keyframes' + style
    }
}

; function Molly() {
    ; var h = getId('Holly')// ^
    ; h.innerHTML = ''
    ; for(var table in rc) {
        if(table != 'Alarms') {
            ; h.innerHTML += tabulate(
                Molly_table(foldm(Object.keys(rc[table]), 1), table)
                , {style: "; display: inline-block; vertical-align: top; margin: 3px"}
            )
        }
    }
}
; function Molly_table(list, table) {
    ; var Molly_hover = (object, name) => 'hover' in object? span(name, {c: 'hover'}): name
    ; for(var e in list) {// ∀ rows ∈ table
        ; var attributes = {
            onclick: '; rc["' + table + '"]["' + list[e] + '"]' + '.time = new Date; localStorage.rc = no(rc, 0)'
            , id   : list[e] + '-row'
        }
        ; if('link'  in rc[table][list[e]]) {; attributes.onclick = 'window.open(&#x27;' + rc[table][list[e]].link + '&#x27;, &#x27;_blank&#x27;).focus()'}// Test-titles...
        ; if('hover' in rc[table][list[e]]) {; attributes.c = 'hover'; attributes.t = rc[table][list[e]].hover.replace(/'/g, '&#x27;')}
        ; if(rc[table][list[e]].title) {
            ; attributes.onclick += '; this.style=""'// 'getId("' + list[e] + '-row")'
            ; list[e] = [
                [
                    Molly_hover(rc[table][list[e]], list[e]) + ('link' in rc[table][list[e]]? ' ∞': '')
                    , {colspan: 4}
                ]
                , 'th'
                , attributes
            ]
        } else {
            ; attributes.onclick += '; getId("' + list[e] + '-ident").style=""'
            ; list[e] = [
                [  '↦', {id: list[e] + '-start', class: 'start'}]
                , ['⇥', {id: list[e] + '-stop' , class: 'stop' }]
                , [
                    Molly_hover(rc[table][list[e]], list[e]) + ('link' in rc[table][list[e]]? ' ∞': '')
                    ,  {id: list[e] + '-ident', class: 'ident'}
                ]
                , ['', {id: list[e] + '-time' , class: 'time' }]
                , 'td'
                , attributes
            ]
        }
    }
    ; return list
}

// add exceptions for sleep, wake, man, and auto; above...
// add CSS awooga and timers here, need to adjust table structure and whatever else...
// clean up; pre.js...
// implement statistical logging; move/reformat "Download"...
// implement start/stop for statistical logging...
// scrutinise paperwork before scanning/shredding...
// add study, games∈{chess,..}, bad_habits∈{smoking,..}, &␦¬, to the awoogarc.json file...

// FFS; make the whole row clickable!!! D-:<
// The background alarm will be triggered according by Sleep; but should be customisable...

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
    , {"seconds"∈ℕ|[1,+∞ )}
    , {"second" ∈ℕ|[1,60 ]}
    , {"minute" ∈ℕ|[1,60 ]}
    , {"hour"   ∈ℕ|[1,24 ]}
    , {"wday"   ∈ℕ|[1,7  ]}
    , {"mday"   ∈ℕ|[1,31 ]}
    , {"day"    ∈ℕ|[1,365]}
    , {"week"   ∈ℕ|[1,52 ]}
    , {"month"  ∈ℕ|[1,12 ]}
}

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
taboo always static?
    but all of that pre-emptive flashing..?
        mostly just for consumption..!
            taboo always static! 8=D
taboo: {
    duration: 60*60*1.5
    type    : static
}
deadline: {
    time: 60*60*24
    type: DONT_PANIC
}

Don't worry about validation(taboo≤deadline), /awooga/rc (or something like that) will do it instead

linked_clicks
    update time
    log stats
    open link in new tab

custom_files
    awoogarc.json
    awoogarc.css
    awoogarc.js
drag&drop
    /awoogarc/
NEED TO WRITE UP SOME KIND OF WYSIWYG FOR THIS... (temporal conversions to seconds, and the rest of JSON; replace the recommendations.)

What about tabs?
Only alarms will flash the tabs; no taboo...

...the row should flash? what about start/stop? there must be special conditions... (¿dependencies?)

https://en.wikipedia.org/wiki/General_medical_examination
    BMI = (height, weight) => kg ÷ m²
    Nutrition = (age, {food}) => ...switch or something; I'm 26, so 1000mg/day Calcium for me! 8-D
    https://youtu.be/fNnStvdG-VY
    https://youtu.be/pWOQuPczY4c
statistical logs = spreadsheet
star trek
    Notes = captains logs (the user is the captain)
    medical  logs (medical officer)
    activity logs (first/science officer; educational officer? table-dependent...)

primary links have optional/variable secondary links for things like webcomics, file://pdf#pages, and http://pdf#pages
    plink
    slink

rc = {
    tables: {<current(awoogarc.json)>}
    , alarms: {
        static: {colour_A: 0, colour_Z: F, duration: 5(seconds)}
        , DONT_PANIC: {...}
        , life_threatening: {...}

    }
}

Can add support for non-hex colours later; like way later, probably...
Alarms can be gradually ¿dis?colouring, or spontaneously flashing...
Daily reset option... disarm: [{Y,M,D,D_number,D_name}, seconds_from_start]
Temporary...          click? `rm` :``
Add/edit/rm by table name...

*/
////////////////////////////////////////////////////////////////////////////////
/*

What I can tell from my archaeological discoveries of the primitive system...
    Sleep   // static ; maximum possible time spent sleeping; no functionality
    Awake   // static ; minimum possible time spent awakened; THIS.click, Sleep.time = Active.time, THIS.time = Active.time = 0
    Active  // static ; storage                             ; THIS.click, Awake.time = THIS.time, THIS.time = 0s
    Auto    // dynamic; storage                             ; mouse.move, Active.time += THIS.time, THIS.time = 0s

; function act() {
    ; update_time_table()
    ; css()
}
; function activetype() {
    ; rest.active = new Date()//man
    ; act()
}
; function activity() {
    ; rest.since = new Date()//auto
    ; act()
}
; document.onkeypress  = () => activetype()//ONKEYPRESS
; document.onclick     = () => activity()  //ONCLICK
; document.onmousemove = () => activity()  //ONMOUSEMOVE

"I have reason to believe that there exists an entire culture that worships The Rings Of Saturn?!?" -- JAPH
"But Neptune has rings too!?!" -- Steven Lisberger
"Temporal distortions make our very own Moon look like a ring around the bad wolf..." -- Guess Who
"The Moon could be used as an International Scientific Interest Station; particle-airy astronomy, and robotic automation." -- Shyam Has Your Anomaly Mitigated! :D
:..an airborne platform tethered to the Moon will stop the Moon from achieving escape velocity; we can also fly to the platform and "just keep climbing, just keep climbing, just keep climbing, climbing, climbing, what do we do? we climb, climb, climb"~

Females are forbidden to practice Tuvan Throat Singing; cursed with "infecundity", if they do.
    They'll become exceptionally skilled with their tongue; lesbian =^^^^^^^^^^^
    Otherwise their husband'll put it in their mouth instead; which =^^^^^^^^^^^
THE CURSE IS ℝEAL!!!
इति सिद्धम्

https://youtu.be/O0f_nFKVoyQ
Is robots taking over from humans, really worse than that?
It reminds me of WikiLeaks...
Usa population control via terrorism of everyone, including themselves..!

Inception Memorisation
Mnemonics can be used to remember mnemonics, to remember mnemonics,..

su   = Super User
sudo = Super User Do Once

*/
