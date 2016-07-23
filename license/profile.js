; document.write('This notice is subject to change without notice.')

; var
    L   = 'Licensees'
    , P = 'Pending'
    , C = 'Criminals'
    , percentage = (t) => 100*t[0]/t.reduce((a, b) => a + b)
    , details = (e, s, t) => ''
        + heading(format('Details', 'u'), 3)
        + format('Name&nbsp;: ', 'b') + document.title
        + br + format('Email: ', 'b') + link(e, 'mailto:' + e + '?Subject=' + s==C? 'Subpœna': 'Hello%20' + document.title + '!%20:D')
        + br + format('Ratio: ', 'b') + percentage(t) + '%'
    , license = (i, u, l, p) => br
        + hr + format('Installation&nbsp;&nbsp;: ', 'b') + i
        + br + format('Uninstallation: ', 'b')      + u
        + br + format('Listicle: ', 'b') + l
        + br + format('Position: ', 'b') + p
    , relicense = license
