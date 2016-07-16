function storeClientFile(f) {// f.name, f.type, f.size, f.lastModified, f.lastModifiedDate, f.slice
    try {
        if(f.type == 'application/json') {// http://www.ietf.org/rfc/rfc4627.txt
            var r = new FileReader();
            r.onload = function() {localStorage.rc = r.result};
            r.readAsText(f);
        } else {alert('Your file is MIME:'+f.type+', it must be MIME:application/json');}
    } catch(e) {alert(e);}
}

function no(s, j) {
    try {
        return j? JSON.parse(s): JSON.stringify(s);
    } catch(e) {
        alert(
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
        );
    }
}

// https://gist.github.com/webinista/11240585
const foldm = (r,j) => r.reduce((a,b,i,g) => !(i % j)? (a.push(g.slice(i,i+j)), a): a, []);

// is File API available?
if (!(window.File && window.FileReader && window.FileList && window.Blob)) {alert('Where\'s my File API?.');}
// is localStorage available?
if(typeof window.localStorage===undefined || typeof localStorage===undefined){alert('Where\'s my localStorage?');}
//localStorage.clear();

/*
http://time.is/widgets
https://www.timeanddate.com/services/api/
http://www.iso.org/iso/home/standards/iso8601.htm
https://en.wikipedia.org/wiki/ISO_8601
https://xkcd.com/1179/
*/
function timestamp(t) {
    var
        zero  =(x=>(x<10)?'0' +x:x) // function zero(i) {return (i<10?'0'+i:i);}
        , zeroes=(x=>(x<10)?'00'+x:x<100?'0'+x:x) // function zeroes(i) {return (i<10?'00'+i:i<100?'0'+i:i);}
        , Y  =        t.getFullYear()
        , M  = zero(  t.getMonth() +1)
        , D  = zero(  t.getDate())
        , h  = zero(  t.getHours())
        , m  = zero(  t.getMinutes())
        , s  = zero(  t.getSeconds())
        , ms = zeroes(t.getMilliseconds());
    return Y+'-'+M+'-'+D+' '+h+':'+m+':'+s+'.'+ms;
}
function secondstamp(time) { // time=seconds
    var s, m, h, d;
    s = time % 60;
    time = (time - s)/60;
    m = time % 60;
    time = (time - m)/60;
    h = time % 24;
    time = (time - h)/24;
    d = time;
    return [d, h, m, s];
}
function timer(a, b) {
    var
        diff = new Date(new Date(b) - new Date(a))
        , [d,h,m,s] = secondstamp(parseInt(diff/1000))
    ;
    return ((0<d?d+'d ':'') + (0<h?h+'h ':'') + (0<m?m+'m ':'') + s + 's');
}
function timer_clock(id, object, property) {
    var diff,d,h,m,s,t;
    diff = new Date(new Date() - new Date(object[property]));
    [d,h,m,s] = secondstamp(parseInt(diff/1000));
    getId(id).innerHTML = (0<d?d+'d ':'') + (0<h?h+'h ':'') + (0<m?m+'m ':'') + s + 's';
    t = setTimeout(timer_clock, 100, id, object, property);
}
function clock() {
    var t;
    getId('clock').innerHTML = timestamp(new Date()) + ' (' + new Date() + ')';
    t = setTimeout(clock, 1);//100
} clock();

var rc;
init();// whatever the fuck is going on here; should've just used the good old hard-coded system..!

function init() {
    if(localStorage.rc !== undefined) {
        rc = no(localStorage.rc, 1);
        load();
    } else {
        rc = no('{"Lucid REMS":{"header":{"hover":"dynamic polyphasic reboot","link":"https://en.wikipedia.org/wiki/Biphasic_and_polyphasic_sleep","time":null,"alarm":null},"row":{"sleep":{"time":null,"alarm":null},"wake":{"time":null,"alarm":null},"man":{"time":null,"alarm":null},"auto":{"time":null,"alarm":null}}},"Refuel":{"header":{"hover":"input","link":"https://en.wikipedia.org/wiki/Garbage_in,_garbage_out","time":null,"alarm":null},"row":{"Inhalation":{"time":null,"alarm":null},"rehydration":{"time":null,"alarm":null},"consumption":{"time":null,"alarm":null},"Electrification":{"time":null,"alarm":null}}},"Garbage":{"header":{"hover":"output","link":"https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)","time":null,"alarm":null},"row":{"Perspiration":{"time":null,"alarm":null},"Presmegation":{"hover":"Smeghead, it\'s dick cheese!","time":null,"alarm":null},"Parturition":{"hover":"I don\'t know what all the fuss is about, it\'s painless; quite an enjoyable experience actually, and always has been...","link":"http://forlackofabettercomic.com/?id=47","time":null,"alarm":null},"Urination":{"time":null,"alarm":null},"Defecation":{"time":null,"alarm":null},"Regurgitation":{"time":null,"alarm":null}}},"Śuci":{"header":{"time":null,"alarm":null},"row":{"Brush Teeth":{"time":null,"alarm":null},"Scrape Tongue":{"time":null,"alarm":null},"Floss Teeth":{"time":null,"alarm":null},"Wash Mouth":{"time":null,"alarm":null},"Shave Head":{"time":null,"alarm":null},"Shower Body":{"time":null,"alarm":null}}},"TGIM":{"header":{"time":null,"alarm":null},"row":{"Watch TGIM":{"link":"https://www.youtube.com/user/etthehiphoppreacher/videos","time":null,"alarm":null},"Laundry":{"time":null,"alarm":null},"Vacuum":{"time":null,"alarm":null},"Clip Nails":{"time":null,"alarm":null},"Check Mail":{"time":null,"alarm":null}}}}', 1);
        load();
        reset_timers();
    }
    update_tables();
    reset_tables();
}

function reset_tables() {
    for(var t in rc) {for(var e in rc[t].row) {// for each in table in rc
        timer_clock(e, rc[t].row[e], 'time');
    }};
}

function test() {
    reset_timers();
    update_tables();
    for(var t in rc) {for(var e in rc[t].row) {// for each in table in rc
        timer_clock(e, rc[t].row[e], 'time');
    }};
}
function update_tables() {
    localStorage.rc = no(rc,0);
    for(var t in rc) {for(var e in rc[t].row) {// for each in table in rc
        getId(e).title = timestamp(new Date(rc[t].row[e].time));
    }};
}
function reset_timers() {
    for(var t in rc) {for(var e in rc[t].row) {// for each in table in rc
        rc[t].row[e].time = new Date();
    }};
}

function load() {
    if(getId('f').value!=='') {// HOW TO RESET TIMERS FOR NEW FILE?!?
        rc = no(localStorage.rc, 1);
        reset_timers();
        localStorage.rc = no(rc, 0);
//        getId('f').reset()
//        update_tables();
//        reset_tables();
//        location.reload();
    }
    var h = getId('Holly');
    h.innerHTML = '';
    for(var table in rc) {
        var list = foldm(Object.keys(rc[table].row), 1)
        for(var e in list) {
            var oc = 'rc["'+table+'"].row'+'["'+Object.keys(rc[table].row)[e]+'"].time = new Date';
            list[e] = [
                ['start', {}]
                , ['stop', {}]
                , [list[e], {}]
                , ['', {id: list[e], onclick: oc}]
            ];
        };
        h.innerHTML += tabulate(
            [[[table, {colspan: '4'}]]].concat(list)
            , true, {style: "; display: inline-block; vertical-align: top"}
        );
    }
}

function click_to_update(type) {
    for(var t in rc) {for(var e in rc[t].row) {// for each in table in rc
        rc[t].row[e].time = new Date();
    }};
    update_tables();
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
