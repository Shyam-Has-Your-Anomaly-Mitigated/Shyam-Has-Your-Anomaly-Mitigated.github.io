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

Advertisements are an invasion to privacy.
That includes word-of-mouth adware.
If I find out about your base, all your base are belong to me.

They should have to pay me, to advertise to me.
I'll pay them what they pay me.

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
...
Pharmaceutical = Mechanical
Fix something here, break something there...
Side effects are dysfunctional!

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
