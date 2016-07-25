; var Ahimsā = 'अहिंसा'
; document.write(
    link(heading(format(
        'Will code for '
        + hover('food', 'By food, I mean money; and by money I mean enough to pay for rent, bills, and food...and a logitech mouse, and a samsung galaxy android, and head-phones(leatherless, split_double_cable, microphone), and the ultimate hacking keyboard with braille keycaps, and a 3D printer, and a slow-mo cam, and electronics, and lasers, and tools, and archaeological/excavation equipment, and a lab...on an island...close to Marianas Trench...with an aircraft hanger...and three runways...(Incoming,Outgoing,Urgent)...and Internet access! :D')
        + '!'
        , 'u'
    ), 3), 'http://stevehanov.ca/blog/index.php?id=56')
)
; var list = [
    [  0, hover('Has written a compiler or OS for fun', 'How far should I go? ...I wrote a script.pl that compiles binary/hex/~')]
    , [1, hover('Resume compiled from LaTeX', 'I know LaTeX! :D')]
    , [1, hover('Contributes to open source software', 'My web apps count!?! :D')]
    , [0, hover('Has written a compiler or OS for class', 'When I do my M.IT; after I finish my B.IT...')]
    , [0, hover('Has blog discussing programming topics', 'Probably never going to happen; got to write the weblogware first, gotta write &apos;em all..! :D')]
    , [1, link('President of programming/' + format('robotics', 's') + '/' + format('engineering', 's') + ' club', '/license')]
    , [1, link('Participated in programming/' + format('robotics', 's') + '/' + format('engineering', 's') + ' contest', '/license')]
    , [0, hover('Internship at Google or Microsoft', 'I&apos;ll never be good enough... D&apos;8'), 1]
    , [1, 'Has written non-trivial programs in dynamic languages (perl/python/' + format('ruby', 's') + ')']
    , [1, hover('Knows 3 or more programming languages', 'I can name over a hundred!!! :D')]
    , [0, hover('Previous position demonstrates similar skills', 'What previous position? ...in the sitting position, at my computer?')]
    , [0, hover('Has internship', 'When I found my first company...')]
    , [0, hover('Founded a company', 'That needs money; something I won&apos;t have if I don&apos;t get back on Human Services soon..!')]
    , [0, hover('Personal web page uses Rails, PHP, or ASP.NET', 'Never going to get this one; Perl FTW!!! It&apos;s a text processing language, and (meta)²programming (PL>JS>HTML) is all about textual data (What data isn&apos;t textual? I can make it textual..! :D).'), 1]
    , [1, link('Email address at own domain', 'mailto:shyam@shyam.id.au?Subject=SHUT%20UP%20AND%20TAKE%20MY%20MONEY!')]
    , [1, 'Has modified programs in dynamic languages (perl/python/' + format('ruby', 's') + ')']
    , [1, link('Has personal web page', '/')]
    , [1, hover('High grades, top of class, etc.', 'I got 99 HD for Java; just missed out on triple digits, never gonna happen... D&apos;8')]
    , [0, hover('Won scholarship', 'I already know it&apos;ll never happen; I&apos;m psychic! :D'), 1]
    , [0, hover('Lists job at fast food chain', Ahimsā), 1]
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
    + br + hover('To be continued...', 'When I get some time... (I&apos;ll have to make some up...)')
)
