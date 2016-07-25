; var Ahimsā = 'अहिंसा'
; document.write(
    link(heading(format(
        'Will code for '
        + span('food', {c: 'hover', t: 'By food, I mean money; and by money I mean enough to pay for rent, bills, and food...and a logitech mouse, and a samsung galaxy android, and head-phones(leatherless, split_double_cable, microphone), and the ultimate hacking keyboard with braille keycaps, and a 3D printer, and a slow-mo cam, and electronics, and lasers, and tools, and archaeological/excavation equipment, and a lab...on an island...close to Marianas Trench...with an aircraft hanger...and three runways...(Incoming,Outgoing,Urgent)...and Internet access! :D'})
        + '!'
        , 'u'
    ), 3), 'http://stevehanov.ca/blog/index.php?id=56')
)
; var list = [
    [  0, span('Has written a compiler or OS for fun', {c: 'hover', t: 'How far should I go? ...I wrote a script.pl that compiles binary/hex/~'})]
    , [1, span('Resume compiled from LaTeX', {c: 'hover', t: 'I know LaTeX! :D'})]
    , [1, span('Contributes to open source software', {c: 'hover', t: 'My web apps count!?! :D'})]
    , [0, span('Has written a compiler or OS for class', {c: 'hover', t: 'When I do my M.IT; after I finish my B.IT...'})]
    , [0, span('Has blog discussing programming topics', {c: 'hover', t: 'Probably never going to happen; got to write the weblogware first, gotta write &apos;em all..! :D'})]
    , [1, link('President of programming/' + format('robotics', 's') + '/' + format('engineering', 's') + ' club', '/license')]
    , [1, link('Participated in programming/' + format('robotics', 's') + '/' + format('engineering', 's') + ' contest', '/license')]
    , [0, span('Internship at Google or Microsoft', {c: 'hover', t: 'I&apos;ll never be good enough... D&apos;8'}), 1]
    , [1, 'Has written non-trivial programs in dynamic languages (perl/python/' + format('ruby', 's') + ')']
    , [1, span('Knows 3 or more programming languages', {c: 'hover', t: 'I can name over a hundred!!! :D'})]
    , [0, span('Previous position demonstrates similar skills', {c: 'hover', t: 'What previous position? ...in the sitting position, at my computer?'})]
    , [0, span('Has internship', {c: 'hover', t: 'When I found my first company...'})]
    , [0, span('Founded a company', {c: 'hover', t: 'That needs money; something I won&apos;t have if I don&apos;t get back on Human Services soon..!'})]
    , [0, span('Personal web page uses Rails, PHP, or ASP.NET', {c: 'hover', t: 'Never going to get this one; Perl FTW!!! It&apos;s a text processing language, and (meta)²programming (PL>JS>HTML) is all about textual data (What data isn&apos;t textual? I can make it textual..! :D).'}), 1]
    , [1, link('Email address at own domain', 'mailto:shyam@shyam.id.au?Subject=SHUT%20UP%20AND%20TAKE%20MY%20MONEY!')]
    , [1, 'Has modified programs in dynamic languages (perl/python/' + format('ruby', 's') + ')']
    , [1, link('Has personal web page', '/')]
    , [1, span('High grades, top of class, etc.', {c: 'hover', t: 'I got 99 HD for Java; just missed out on triple digits, never gonna happen... D&apos;8'})]
    , [0, span('Won scholarship', {c: 'hover', t: 'I already know it&apos;ll never happen; I&apos;m psychic! :D'}), 1]
    , [0, span('Lists job at fast food chain', {c: 'hover', t: Ahimsā}), 1]
]
; for(var e in list) {
    ; document.write(
        input(
            list[e][0]
            ? {type: 'checkbox', checked: list[e][0]}
            : list[e][2]
            ? {type: 'checkbox', disabled: true}
            : {type: 'checkbox'}
        ) + list[e][1]
        + br
    )
}
; var
    total   = (15+12+11+9+8+8+7+7+6+5+5+4+4+4+3+3+2+1+0+0)
    , me    = ( 0+12+11+0+0+8+7+0+6+5+0+0+0+0+3+3+2+1+0+0)
    , score = (100*me/total)
; document.write(
    br + me + ' ÷ ' + total + ' = ' + score + '%'
    + br + span('To be continued...', {c: 'hover', t: 'When I get some time... (I&apos;ll have to make some up...)'})
)
