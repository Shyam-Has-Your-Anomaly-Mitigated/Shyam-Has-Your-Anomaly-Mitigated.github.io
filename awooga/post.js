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
    , css_diff = x => parseInt((new Date(new Date() - new Date(x))) / 1000)// This is from long ago; what does it do..?
    , css_minute = 60
    , css_hour   = 3600  // 60*60
    , css_day    = 86400 // 60*60*24

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
    ; if(reset) {; reset_timers()}// to reset, or not to reset; that is configurable...
    ; localStorage.rc = no(rc, 0)
    ; Molly()
    ; reset_timeout()
    ; reset_tables()
    ; css_keyframes(rc.Alarms)
    ; css_clear()
    ; css_timer()
}
; function reset_timeout() {
    ; for(var id in timeout) {; clearTimeout(timeout[id])}
    ; timeout = {}
}
; function reset_timers() {
    ; for(var t in rc) {; for(var e in rc[t]) {// ∀ each ∈ table ∈ rc
        ; if(t != 'Alarms') {; rc[t][e].time = Date.now()}
    }}
}
; function reset_tables() {
    ; for(var t in rc) {; for(var id in rc[t]) {// ∀ id ∈ table ∈ rc
        ; if(t != 'Alarms' && !rc[t][id].title) {
            ; timer(id, rc[t][id], 'time')
        }
    }}
}

; function css_clear() {
    ; for(var t in rc) {; for(var e in rc[t]) {// ∀ each ∈ table ∈ rc
        ; if(t != 'Alarms') {
            ; if(rc[t][e].title) {
                ; getId(e + '-row').style = ''
            } else {
                ; getId(e + '-ident').style = ''
            }
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
; function css_timer() {
    /*
        This should be changed...
            included in the individual timers?
            onclick will do the trick?
    */
    ; for(var t in rc) {// ∀ each ∈ {'Alarms'} ∉ table ∈ rc
        ; if(t != 'Alarms') {// ^
            ; for(var e in rc[t]) {// ^
                ; if(rc[t][e].alarm) {
                    ; var
                        deadline = rc[t][e].alarm.deadline
                        , taboo  = rc[t][e].alarm.taboo
                        , title  = rc[t][e].title
                        , time   = rc[t][e].time
                    ; if(deadline && (deadline.time <= css_diff(time))) {
                        ; getId(e + (title? '-row': '-ident')).style = 'animation: ' + deadline.style + ' ' + deadline.interval + 's infinite'
                    } else if(taboo && (css_diff(time) <= taboo.duration)) {
                        ; getId(e + (title? '-row': '-ident')).style = 'animation: ' + taboo.style    + ' ' + taboo.interval    + 's infinite'
                    } else {
                        ; getId(e + (title? '-row': '-ident')).style = ''
                    }
                }
            }
        }
    }
    ; timeout['Shyam'] = setTimeout(css_timer, 100)
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
        ; if('link'  in rc[table][list[e]]) {; attributes.onclick += '; window.open(&#x27;' + rc[table][list[e]].link + '&#x27;, &#x27;_blank&#x27;).focus()'}
        ; if('hover' in rc[table][list[e]]) {; attributes.c = 'hover'; attributes.t = rc[table][list[e]].hover.replace(/'/g, '&#x27;')}
        ; if(rc[table][list[e]].title) {
//            ; attributes.onclick += '; this.style=""'// 'getId("' + list[e] + '-row")'
            ; list[e] = [
                [
                    Molly_hover(rc[table][list[e]], list[e]) + ('link' in rc[table][list[e]]? ' ∞': '')
                    , {colspan: 4}
                ]
                , 'th'
                , attributes
            ]
        } else {
//            ; attributes.onclick += '; getId("' + list[e] + '-ident").style=""'
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
    style   : static
    interval: 5
    reset   : daily
}
deadline: {
    time    : 60*60*24
    style   : DONT_PANIC
    interval: 5
    reset   : weekly
}

should taboo be subtracted from deadline? it can be configurable..? (akin to optional settings like inverted controls; ¿gamification?)

resets will be logged
    logs will have a statistical; ∀reset:-1
    a-=-1 ≠ a-=1 ≠ a=-1

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
    http://waterprint.net/soy_milk.html
    http://theconversation.com/soy-versus-dairy-whats-the-footprint-of-milk-8498
    http://theconversation.com/soy-versus-dairy-which-milk-is-better-for-you-9379
    http://empoweredsustenance.com/avoid-soy-milk/
    https://youtu.be/mvvx2yQRbzQ
    https://www.youtube.com/playlist?list=PLJicmE8fK0EihspOYDP20Aody8zonQVEY
    https://youtu.be/UfYpxF32EZo
    https://en.wikipedia.org/wiki/Template:Cooking_techniques
    https://en.wikipedia.org/wiki/Template:Lists_of_prepared_foods
    https://en.wikipedia.org/wiki/Template:Instant_foods
    https://en.wikipedia.org/wiki/Category:Food_and_drink_preparation
    https://en.wikipedia.org/wiki/Template:Antioxidants
    https://en.wikipedia.org/wiki/Template:Gluten_sensitivity
    https://en.wikipedia.org/wiki/Template:Consumer_Food_Safety
    https://en.wikipedia.org/wiki/Category:Food_navigational_boxes
        https://en.wikipedia.org/wiki/Category:E_number_infoboxes
        https://en.wikipedia.org/wiki/Template:Food_Substitutes
        https://en.wikipedia.org/wiki/Template:Food_chemistry
        https://en.wikipedia.org/wiki/Template:Food_preservation
    https://en.wikipedia.org/wiki/Category:Food_ingredients
        https://en.wikipedia.org/wiki/Category:Food_additives
    https://en.wikipedia.org/wiki/Category:Food_preservation
    https://en.wikipedia.org/wiki/Category:Food_science
    https://en.wikipedia.org/wiki/Category:Food_safety
    https://en.wikipedia.org/wiki/Wood_preservation#Chemical_preservatives
    https://en.wikipedia.org/wiki/Category:Process_chemicals
    https://en.wikipedia.org/wiki/Category:Free_radicals
    https://en.wikipedia.org/wiki/Category:Life_extension
        https://en.wikipedia.org/wiki/Category:Anti-aging_substances
statistical logs = spreadsheet
star trek
    Notes = captains logs (the user is the captain)
    medical  logs (medical officer)
    activity logs (first/science officer; educational officer? table-dependent...)

primary links have optional/variable secondary links for things like webcomics, file://pdf#pages, and http://pdf#pages
    plink
    slink
permalink = static
tempolink = dynamic: this.onclick=link(prompt())

rc = {
    tables: {<current(awoogarc.json)>}
    , alarms: {
        static: {colour_A: 0, colour_Z: F, duration: 5(seconds)}
        , DONT_PANIC: {...}
        , life_threatening: {...}

    }
}

Alarms can be gradually ¿dis?colouring, or spontaneously flashing...
Daily reset option... disarm: [{Y,M,D,D_number,D_name}, seconds_from_start]
Temporary...          click? `rm` :``
Add/edit/rm by table name... (right-click context menu, contenteditable,..)
    options/settings tab
    no need for validation or wysiwyg

I kind of want something more intelligent; but I guess it's a good place to start..?
    https://en.wikipedia.org/wiki/Category:Spreadsheet_file_formats
    https://en.wikipedia.org/wiki/Attribute-value_system
    https://en.wikipedia.org/wiki/Model_audit
        ...due diligence?
js export spreadsheet
    http://stackoverflow.com/questions/18234448/exporting-html-tables-to-excel-xls-in-a-separate-sheet
    http://stackoverflow.com/questions/5524143/how-can-i-export-tables-to-excel-from-a-webpage
    http://jordiburgos.com/post/2013/javascript-export-to-excel.html
    http://www.kubilayerdogan.net/javascript-export-html-table-to-excel-with-custom-file-name/
    https://datatables.net/extensions/buttons/examples/initialisation/export.html
http://lhorie.github.io/mithril-blog/a-spreadsheet-in-60-lines-of-javascript.html

awoogarc-*.json
    * = version number
    load the relevant script
    this will provide legacy support
    a modular approach to save bandwidth
awoogarc.json
    volatile, current, testing, All The&Things, experimental, active, unstable, instable, astable, singularitously stable

new alarm
    "start": {}
click anywhere the row to disable alarm
the temporal shift behaves no differently

Cycle of text; a list...
    Laundry <---> Hangout Washing
    A --> B --> C --> D
    ^-----------------v

Minimise/maximise headings (drop down, folding,..)
    Instead of tabs..?
    ...what about optional settings?

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

If this wasn't hosted on GitHub, a license would be required to even know the address∈{IP,URI,URL,..}.
@future: amend the AYOR license to include "shyam.id.au" and any preppendages/appendages...
...Or just the domain name will serve? Any and all property...
This will give me an excuse to physically tinker with their brains against their will (to protect my intellectual property! :D)...
You so much as think of me, my name, or anything..!
Yeah, fuck you all and your so-called IP; it's in my intellectual/cyber/air/~ space now. q:
https://youtu.be/kJa2kwoZ2a4
...
Advertisements are an invasion to privacy.
That includes word-of-mouth adware.
If I find out about your base, all your base are belong to me.
...
They should have to pay me, to advertise to me.
I'll pay them what they pay me.
...
Radio waves that pass through my body and into my brain/mind..!

This is the future!
https://youtu.be/TR0baWuB6v4
Internet access routed through the waterways.

They should teach Vedic creationism in schools; it's more ℝealistic..!
    https://en.wikipedia.org/wiki/Hindu_cosmology#Reception
8.64 × 1.5 = 12.96
I'd say they overshot by 60%..?
    https://en.wikipedia.org/wiki/Age_of_the_universe
The kṣīra-sāgaraḥ orbit also has an epic range of 25 million sūrya orbits...
    https://en.wikipedia.org/wiki/Galactic_year
...how is universal age related to galactic momentum? (margin of error?)
^(the first dot is a Majuscule periodic)

...I have reason to believe some "humans" call themselves Aryan, for the same reason "royalty" call themselves Majesty; or even Royalty for that matter.
Some people probably choose to interpret at their own discretion...
The 卐misinterpretation卐 occured at a temporal convenience...
    https://en.wikipedia.org/wiki/Aryan
This has also been greedily compromised...
    https://en.wikipedia.org/wiki/Manu_Smriti#Authenticity_and_inconsistencies_in_various_manuscripts
I wonder what happened to the Mandarini Sampradaya..?

These are all states of matter...
    https://en.wikipedia.org/wiki/Classical_element#Hinduism

Colours support colour-blindness.
A central room with different coloured/shaped buttons to open matching coloured/shaped doors and ENTER other rooms.
Other rooms for food/water, sleep, play, bathe/swim,.. (What am I missing..?)
The panel has the buttons oriented relative to the spacial orientation of the doors.
...
All other rooms have a monitor with coloured/shaped buttons.
Monitor displays pseudo-randomised coloured shapes.
Press the matching button to open door and ESCAPE from the room.
...
Train apes to use this system.
Allow offspring to learn by observation (or some other means).
The test is to isolate the offspring and observe whether they learned by observation (or any other means).
...
How long does learning by observation take, compared with professional training?
What about hobbyists?
...
https://en.wikipedia.org/wiki/Great_ape_personhood
https://en.wikipedia.org/wiki/Great_ape_language
...
Due to unfamiliarity with buttons and their purpose/use...
I don't think it's reasonable to assume any lifeform would be likely to figure it out without inital help.
Especially with the lack of knowing how the system works, because it's hidden from view.
But maybe they will get bored and play with the buttons?
Then there must be a possiblity for them to learn.
It's worth looking into, in any case, all possibilities must be explored.
...
Bruteforce/failed attempts will trigger a timeout; the button/door coloured lights will be deactivated.
The colours will change periodically, the timeout will be for the next rotation.
Auditry feedback will indicate valid button pushes.
...
They must perform ordered tasks; bathe before food/water..?
Depends on where the sun is; who's on duty for a midnight snack..?

If we encounter alien life...
How will we treat them? People will want to eat them...
We can only expect the same treatment from other lifeforms.

नारद taught प्रह्लाद while he was in the womb.
Spiders and other lifeforms (trees?) may do the same..?

Who is that professor who handed out an impossible assignment?
I remember attempting it; then I looked it up, and found out others had failed...
It seemed simple enough at the time...
Something to do with artificial intelligence, or graphics, or something..?
...
Same goes for the astronomer who's a spot-the-difference expert...birthing/dying stars? nebulae? blackholes?..
I think he just memorised a bunch of star charts, or something..?

Sequencing can prove if sexuality is pre-decided at birth; I doubt it is.
It's just Yet Another Excuse; "YAE we can do what ever we want ∵ we aren't responsible"...
Be offended ∵ कर्म is not your fawlt either.
...
It's not a birth defect if it occurs later in life.
And we aren't devolving into our own demise; procreation isn't going extinct.
...
Racism isn't a birth defect either.

Universal dimensions may be constant...
Galaxies pull everything in...
Increasing the distance between galaxies...
Appears as if the universe is expanding...
...
Now they think it's shrinking?
Probably it's breathing; महाविष्णु...
https://en.wikipedia.org/wiki/Hindu_cycle_of_the_universe
...
Don't want to repeat myself...
But something about galaxy=universe, universe=(multiverse∨metaverse),..
http://shyam.id.au/mowgli
...
https://en.wikipedia.org/wiki/Hindu_cosmology#Reception
If G-waves were produced by a pair of black holes:
The two black holes of which our universe (AKA "Milky Way galaxy") revolves around; represent ब्रह्मा (creator), and शिव (destroyer).
विष्णु is somewhere (everywhere) out there in the multiverse of so-called galaxies.
https://en.wikipedia.org/wiki/Trimurti
...
NASA just found विष्णु!!!
https://www.nasa.gov/feature/goddard/2017/gravitational-wave-kicks-monster-black-hole-out-of-galactic-core
A neutrino of our recursive ℝeality (reincarnation); and there are black/white/ETC "holes" (who came up with that?!? where do they go?!? what is on the other side?!? are they *-dimensional portals?!?)

The wine industry sponsors scientific research that conveniently promotes the theory that wine/alcohol is healthy, and extends longevity.
Grapes are healthy; fresh grapes are the healthiest grapes.
Fresh food extends longevity.
...
The yoghurt industry is responsible for probiotics.
...
The flower industry is responsible for valentines day.
...
Hmm, (tip-of-the-tongue)s...

Use overtones to shatter a wine glass? Without a mic?
Tuvan people could make a movie, "The Drunken Хөөмей".

https://youtu.be/A4INSuaT1os
CPT330: Software Engineering Project Management
    The Girl Who Never Ate
        Scrumptious daily stand-up meetings... (c̄ munchy honeycakes and yellow jelly; I can't believe there is a BiP wiki, who does this?!? OMG WTF BBQ 123)
    http://www.newyorker.com/magazine/2007/12/10/the-checklist
        Best practices? Hospitals are just another business, so what do they care..?
It would seem I forgot to write about ^those^ in the forums; I can assure you, they are relevant..!
    https://zapier.com/blog/the-checklist-manifesto/
    http://adverselling.typepad.com/how_law_firms_sell/2010/09/project-management-part-14-the-power-of-checklists.html
Checklists are programs; programmers should be good at developing checklists, and implementing new "features".
    http://atulgawande.com/book/the-checklist-manifesto/
    http://www.realsimple.com/checklist
        Computer assembly...
            http://www.realsimple.com/home-organizing/organizing/closets/professional-closet-organizer-tips?iid=feat-story-3
    http://checklists.com/
    http://checklist.com/
http://www.nature.com/news/hospital-checklists-are-meant-to-save-lives-so-why-do-they-often-fail-1.18057
    http://www.projectcheck.org/checklist-for-checklists.html
...
https://en.wikipedia.org/wiki/Antimicrobial_surface#Antimicrobial_Activity
https://en.wikipedia.org/wiki/Antimicrobial_properties_of_copper#E._coli
https://en.wikipedia.org/wiki/Antimicrobial_copper-alloy_touch_surfaces
https://en.wikipedia.org/wiki/Infection_control#Antimicrobial_surfaces
https://en.wikipedia.org/wiki/Hospital-acquired_infection#Antimicrobial_surfaces
https://en.wikipedia.org/wiki/Coating#Functions_of_coatings
https://youtu.be/DjZ6b20LSoc
...
Pharmaceutical = Mechanical
Fix something here, break something there...
Side effects are dysfunctional!
...
Medical practitioners should have to pass a handwriting test, regularly.
https://youtu.be/ivq2a9iXeJs
Random testing, without notice, should keep them on their toes.

What do they care?
It's the way it sounds...
Not the meaning of the words...
What is going on here?
Going on = Progressing ≠ ~What is this?~
Expression is illogical and requires suppression!

I wish all books came with a character/word/page count; average reading time..?

Do any games have crying?
I don't mean, as a game mechanic to flood a room and swim against gravity...
Or in a cutscene...
I mean: due to damage, an action/inaction,..
As in: the character you roleplay as, cries in ℝealtime.
...たまごっち

Can juggling prevent <relevant_disease>? (arthritis?)
Prevention = Cure ¬c̄ Hospital ∨ Medicine

There's a lot of "-thing"s, it's just a matter of understanding them...
Some kind of electromagnetic signal, or whatever...
The meaning behind a wave, or lack thereof...
Observing the spin of a particle...
What does it all mean?
...
Can you tell the size and distance of a "-thing" swimming/dropped into water, by the (audible) splash wave(s) alone?
An aquatic observatory...
...
Wow, I'm hallucinating, spacial disorientation; I need to sleep‽
The gap between my bed and the table appears to be ever increasing; but I can still reach the keyboard quite comfortably... (comftably)
The gap is only as wide as my finger, and if I finger it; my finger appears to expand with the gap!
Perhaps it's only the darkness, and/or contrast, or something..?
This could all just be a visual illusion..?
My brain is also dehydrated; I ran out of water some time this morning, after about 3am, before about 8am, now it's 1pm...
...I'M MIB
I wonder if I could GoFundMe a humidifier; I guess I could just boil some steam into the atmosphere instead...
My blood feels weird; I need a syringe to get it out..!
My theory is that my body will work overtime to produce more blood; fresh blood..!
I think my eyes are drifting apart when I look at the gap..?
But they must auto-re-align; without my notice..!
...
My right ear and nose is bleeding!?!
...
I think this has something to do with the elevated thermal-reaction levels emenating from my heater..?
My nostrils are overflowing with lifeforms..!

Lets drill a hole straight through the Moon...
Drop "-thing"s down/through it...
Turn it into a telescope...
It should face Earth, and be wide enough to compensate for the wobble...
Telescope from Earth looking through the Moon during an eclipse...

https://youtu.be/qRnU0bqsyq0
9HR34K ATTACKS!
http://shyam.id.au/mowgli

https://youtu.be/0MVGeRa-vLo
I bet asbestos had something to do with Starlite..!
https://youtu.be/KuHL7hiFTnc
Who in their right mind...
No wonder his family won't release it; they know the cause of death!
Why this kolaveri di?
https://www.quora.com/Which-theoretically-is-a-better-thermal-insulator-Starlite-or-Aerogel-and-why
...
https://youtu.be/gg5PYU2CznY
I have a theory for the last one...
http://shyam.id.au/mowgli

https://youtu.be/Pl0icc3XiVI
Humans like picante, even though it's designed to prevent us from consuming it in the first place..!
Humans also consume sugar until they get diabetes..!
Heat could be like a drug for insects, until they need to rest and decide to..!
One thing is for sure; humans are no more intelligent.
https://youtu.be/MwWACB6w8D0
...females!

Everything is moving, nothing is where it was, so where is everything?!?

Tonal clicks for the blind..!
...to prevent them from walking into poles? (...from that documentary?)

Cannot logically justify death as both; a punishment, and for mercy.
    Putting criminals out of their misery; because it's a proven deterrent, which is why it still exists, and is still actively used...
    Executing innocent animals; to make us feel better about ourselves...
https://en.wikipedia.org/wiki/Capital_punishment
https://en.wikipedia.org/wiki/Euthanasia
Sacrifices must be made! ...logical sacrifices.

https://youtu.be/jAhjPd4uNFY
https://en.wikipedia.org/wiki/Invasive_species
https://en.wikipedia.org/wiki/Antimicrobial_resistance
https://en.wikipedia.org/wiki/Genetically_modified_food_controversies
https://en.wikipedia.org/wiki/CRISPR
Think of a triangle with three sides; a, b, and c.
Changing one of those sides, doesn't require the other two sides to change.
But the angles will change. (It can be done the other way, but for the purposes of the point I'm attempting to make here...)
Imagine the angles represent the relationships in our DNA.
Until we can run computer simulations...
I mean input=DNA, and output=virtually_cloned_lifeform...
CRISPR cannot be considered safe.
We cannot pretend to know everything.
Trial and error is not for the intelligent; it's called "brute" force for a reason.
What are the psychological implications? KHAN!!!
As I understand it, there are known genetic diseases which affect our psychology.
So a computer simulation must include an environment; for the virtual lifeform to interact with, learn, memory,..
Artificial intelligence has a very long way to go; as does computational power.
Then psychology can be tested.
Genetic Programming, is just like any other kind of programming; think of all the bugs!
Accidents happen; accidental new diseases/problems.
#WeArentReady
#WAR
#BurnTheLabs
#ActifistThemInTheFace
#WeveEnoughProblemsAsItIsNow
#wePAIIN
https://en.wikipedia.org/wiki/Wireless_electronic_devices_and_health
https://en.wikipedia.org/wiki/Brain_tumor#Cause
...
https://www.youtube.com/watch?v=9nCHK97kwR4
making pigs more human is like making computers more sentient; at some point you have to query self-destructive exploitation
why not just have a "slave" class of humans who serve as organ donors, and replace artificial intelligence in the workforce?
https://www.youtube.com/watch?v=lrzXE5XttOE
"us" versus "them"
https://www.youtube.com/watch?v=6grLJyqIM8E
"he who fights too long against dragons becomes a dragon himself"

the birds and the bees
the bird is female (that's why we call humanoid females "chicks")
the bee is male (only their queens are female, and working-class men are the busy bees of our pre-feminist society)
the bee has a...stinger
the bee "pricks" the bird with his...stinger
~
¿the bird somehow has a baby?..this is where the magic ℝeally happens!
   the bird has an allergic reaction that your mother empathically experiences
   it just occurred to me that females are just reusable eggs; eggception, an egg within an egg
~
the bird is a stalk
the stalk is like santa
the bird flies the baby home to mummy and daddy
now go play outside, while spying with your little eye for the stalk carrying your new baby sibling
just ignore how morbidly obese mummy is...she's just sick, and that's why she throws up every morning; and it's also how we tell when it's time for the stalk to visit us, because mummies are allergic to stalks
...
we have to take mummy to the hospital so they can make her better again; quick, get in the car!!!
...
sorry you missed the stalk; it flew in through the window as the doctor was fixing mummy
say hello to your little friend (shtylf***!!!)

science is fawlty
dark matter is just an excuse to support nescience
lets just do whatever we can to support archaically accepted theories
even though it doesn't work, lets just patch it with a new concept (dark matter) to force it to work
May the F be c̄ you
...
: quantum experiments; perhaps I'll get to try them myself one day (never going to happen)
...
double-slit experiment
sounds like an illusion; I can make <object> disappear, unless you check my hands
is this not evidence that proves magic is ¬ℂomplex!? (because you can't see ℝeal magic)
...
entanglement: particular spins
I have notes/notions about this somewhere
...
: biological experiments; probably achievable now, but I'm not ready yet
...
botanical communication
plants communicate with other plants via roots, so why can't we understand them?
...
animalistic communication
same as plants, but animals can learn to communicate on our level; we are pathetic
...
human subject research
I want to murder someone, and then attempt to revive them; I feel like there's not enough research being done here
and the other "-thing"s (injuries, IPO, thermoplastic brains, and one more that is dancing on my neurotongue)
...
: temporal experiments
...
dimensions can be explored, but only as an observer; need to discover some"-thing" new
...
perpetual motion machine, that also disassembles/reassembles atomic structures faster than the needle & thread technique (gas -> solid)
what else can it do?
it has too many moving parts; so it's immutable, and sensitive to the planetary influences (earth quakes/tremors/orbits/ETC)
can always go back to the purely perpetual motion machine, with fewer moving parts (simpler); but it's a primitive concept
...
electronic experiments
...
???
what was the other machine?
something finicky
heavy on the mathematics
I think it's just to make a computer from scratch, but first I have to make the electronic components from scratch
like the size of deep thought, and about as useful; effortlessly
...
atomic experiments
...
science from scratch

somthing about madified scientists
	Bill Nye, the science guy, was abducted by Monsanto and replaced by GMO Nye, the modified guy.
something about skepticism
	pyramid power is ℝeal
		https://en.wikipedia.org/wiki/Leyden_jar
something about Mexicans
	aliens are ℝeal; micro-aliens
something about atomic particles
	floaters are atoms; trekkIbm
		https://en.wikipedia.org/wiki/Floater
		https://en.wikipedia.org/wiki/A_Boy_and_His_Atom
		http://www.research.ibm.com/articles/madewithatoms.shtml
	do robots see floaters?
	...
	the balls of light that sporadically flash in the corners of my eyes are either "cosmic ray visual phenomena", or phosphene
something about spin
	string theory
		http://localhost/
something about dimensions
	if time is different for every "-thing" (relativity, altitude, velocity, dimensions)
	biologists discovered temporal anomalies in comparable mammalian heart beats
		https://www.youtube.com/watch?v=ZT59QUlrTFQ

I also want to use ice as a fuel source; like (char)coal.

Our galactic orbit could alter our distance from the middle; which could influence our bio-chemistry, electricity/technology, ETC...
This would explain our short-lived existence, and ancestral abnormalities.
ETC...

cosmic rays & ultrasounds & radio waves & ETC could cause "-thing"s like autism, headaches, neurodegeneration, ETC
ozone layer protects us from cosmic rays, right?
https://en.wikipedia.org/wiki/Tin_foil_hat
...
caffeine, alcohol, and other artificially stimulating in"toxic"ants could cause "-thing"s like neurodegeneration
Gus Bonner (Stargate Infinity) mentions "athletes back on Earth thought so too, when they used chemicals to boost their performance; it seemed to work for a while", and his niece finished with "until they discover it harmed them"; the context was Mandro stones
some humans are lactose intolerant, albino, ETC, and then there is the bubble boy (Seinfeld); we are not all created as equals
the placebo effect is the best; decaf tea/coffee, and non-alcoholic versions of alcoholic drinks
epinephrine/cortisol/norepinephrine/dopamine/serotonin/oxytocin/endorphins rushes, and other mental states, can be forced with the meditative/suggestible/ETC mind; use the force
it's all in your head
https://en.wikipedia.org/wiki/Caffeine_dependence
https://en.wikipedia.org/wiki/Effect_of_caffeine_on_memory
https://en.wikipedia.org/wiki/Caffeine-induced_sleep_disorder
https://en.wikipedia.org/wiki/Caffeine-induced_anxiety_disorder
https://en.wikipedia.org/wiki/Ban_on_caffeinated_alcoholic_drinks
https://en.wikipedia.org/wiki/Alcohol_dependence
https://en.wikipedia.org/wiki/Alcohol_abuse
https://en.wikipedia.org/wiki/Alcoholism
https://en.wikipedia.org/wiki/High-functioning_alcoholic
https://en.wikipedia.org/wiki/Disease_theory_of_alcoholism
https://en.wikipedia.org/wiki/Alcohol-related_dementia
https://en.wikipedia.org/wiki/Alcohol_and_cancer
https://en.wikipedia.org/wiki/Long-term_effects_of_alcohol_consumption
https://en.wikipedia.org/wiki/Long-term_impact_of_alcohol_on_the_brain
https://en.wikipedia.org/wiki/Alcohol-related_brain_damage
https://en.wikipedia.org/wiki/Alcoholic_liver_disease
https://en.wikipedia.org/wiki/Alcoholic_hepatitis
https://en.wikipedia.org/wiki/Austrian_syndrome
https://en.wikipedia.org/wiki/Alcohol_myopia
https://en.wikipedia.org/wiki/Alcohol_withdrawal_syndrome
https://en.wikipedia.org/wiki/Alcoholic_hallucinosis
https://en.wikipedia.org/wiki/Alcohol_intoxication
https://en.wikipedia.org/wiki/Drunk_driving_law_by_country
https://en.wikipedia.org/wiki/Drunk_drivers
https://en.wikipedia.org/wiki/List_of_deaths_through_alcohol

I want to advertise on a road-side billboard...
https://en.wikipedia.org/wiki/Photosensitive_epilepsy

I think I have discovered at least three ways to process nuclear waste...
But one is just feeding the sun...
Another is based on solar simulations...
Another is cerebral, at best!

RAM(
	homer is rick
		https://en.wikipedia.org/wiki/Homer
		https://en.wikipedia.org/wiki/Homer_Simpson
	Rick Sanchez     is comparable c̄ Homer Simspon, the burping alcoholic nuclear physicist who abuses Bart Simpson, but does not let him die.
	Jerry Smith      is comparable c̄ Maggie Simpson.
	Summer Smith     is comparable c̄ Lisa Simpson.
	Morty Smith      is comparable c̄ Bart Simpson.
	Beth Smith       is comparable c̄ Marge Simpson.
	Principal Vagina is comparable c̄ Superintendent Chalmers.
	Mr. Goldenfold   is comparable c̄ Dewey Largo.
	Jessica          is comparable c̄ Mary Spuckler
	Annie            is comparable c̄ Jenda Simpson

	Rick has travelled through time; the time travel box is full of "-thing"s to expect (not the concept being shelved by the devs; "it's on the shelf"), and is the reason he didn't shoot Jerry.

	Rick knows too much about the other Ricks, than Morty, for Morty to be his original Morty; Rick also has memories of Morty as a baby/child, which is contradictory to his supposed backstory with the first observable dimension...
	S01E06 -> S02E05; explains Rick upholding baby Morty, in an image on Birdpersons' wall.

	Most Rickless Mortys are probably the result of failed attempts to establish a stable portal; I'm thinking about StarGate...

	Evil Morty...
	I like the theory that Evil Rick body swapped with his Morty, and used tech to control his old body.

	A big query is; who is Ricks' wife?
	She did not die, with her daughter; Rick & baby Morty contradict such a falsified memory.
	Rick is drooling from mega drugs; but he, and his daughter, are highly intelligent; so he could've studied their biodata, as it's a genetic trait compromised only by Jerrys' Y chromosome...
)

ST:DIS theory
Stamets metamorphoses into the Tardigrade; they only found one Tardigrade, and I doubt they will find another.

Farscape
Pa'u Zotoh Zhaan; Pa'u = Power (she has level 9/10/ETC power; AKA The Powerful Zotoh Zhaan), and Zs are like lightning bolts
episode "Look at the Princess"; while she was a statue, she was witness/evidence to events that could incriminate her bro & scarran...why didn't they just ask her what happened to Kryten? she had all of the answers!?! I guess she couldn't speak out against them before, so why would now be any different... But the others could've at least asked when nobody else was around (or not, since only one person at a time can hear her; why not put her on speaker, so it's almost like she's not even a statue, and they all could use that tech + networking for socialising without using up their age); to find his head...
episode "Till the Blood Runs Clear"; wasn't Furlow in Resident Evil?
episode "The Locket"; "Kahanyu protect Moya" (Can you protect Moya? ,,,there's another one of these; probably in the primary season...) & "I am too old for this shit"
episode "I, E.T."; isolated aliens who've never met other aliens, nor left their planet, have translator microbes?
episode "Green Eyed Monster"; Aeryn Sun is a sun...

Kay'me maia kosa Visha'meel maia kosa ah Khalaan ah Khalaan (may the goddess accept me to her bosom)
Yu Mo Gui Gwai Fai Di Zao
oṃ maṇi padme hūṃ
*/

// http://shyam.id.au/tp
//
// Ė to ė, and back
// unicode casings
// cases += 'leading majuscules'
// cases += 'initial majuscule'
// cases += 'punctuated majuscules'
//
// 1/2 to ½, and back
// ae to æ, and back
// c^- to c̄, and back
// (La)TeX
// subscript, script, superscript
// ,..

// AMOD: At My Own Discretion

// http://shyam.id.au/metrology
//      unit conversions
//      calendar conversions
//      language conversions

// http://shyam.id.au/metronomy
//      astrological comparisons

// http://shyam.id.au/icanninja
//      #4*: open the sauce...may the sauce be ȯn you
//      metadata.pl (Perl Language)
//      crack.asm   (A Shifty Mechanism)
//      1st!contact (ClOse eNcounTers of thÆ 8Th kind)
//      st.ego      (stEnOps||eGaNo)
