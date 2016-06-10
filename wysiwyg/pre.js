; document.write(
    input({type: 'button', value: 'B'      , title: 'Fat Text'        , onclick: '; format(\'b\')'})
    input({type: 'button', value: 'I'      , title: 'Slant Text'      , onclick: '; format(\'i\')'})
    input({type: 'button', value: 'U'      , title: 'Rule Text'       , onclick: '; format(\'u\')'})
    input({type: 'button', value: 'S'      , title: 'Cross Text'      , onclick: '; format(\'s\')'})
    input({type: 'button', value: '>'      , title: 'Nestfull Text'   , onclick: '; format(\'>\')'})
    input({type: 'button', value: '<'      , title: 'Nestless Text'   , onclick: '; format(\'<\')'})
    input({type: 'button', value: '^'      , title: 'Super Text'      , onclick: '; format(\'ˢ\')'}) // promote
    input({type: 'button', value: 'v'      , title: 'Sub Text'        , onclick: '; format(\'ₛ\')'}) // demote
    input({type: 'button', value: '&#8734;', title: 'Hyper Link'      , onclick: '; format(\'∞\')'}) // &infin;
    input({type: 'button', value: '&#8733;', title: '! Link'          , onclick: '; format(\'∝\')'}) // &prop;
    input({type: 'color' , value: '#003366', title: 'Textual Colour'  , onclick: '; format(\'fg\', this.value)', onchange: '; format(\'fg\', this.value)'})
    input({type: 'color' , value: '#ffff00', title: 'Highlight Colour', onclick: '; format(\'bg\', this.value)', onchange: '; format(\'bg\', this.value)'})
    input({type: 'button', value: '+'      , title: 'Big Text'        , onclick: '; format(\'+\')'})
    input({type: 'button', value: '-'      , title: 'Small Text'      , onclick: '; format(\'-\')'})
    input({type: 'button', value: 'pt'     , title: 'Resize Text'     , onclick: '; format(\'pt\')'})
    input({type: 'button', value: 'H'      , title: 'Title Text'      , onclick: '; format(\'h\')'})
)
