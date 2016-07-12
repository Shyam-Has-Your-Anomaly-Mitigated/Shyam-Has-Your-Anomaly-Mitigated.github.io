; document.write(
    input(  {type: 'button', value: 'B'      , t: 'Fat Text'        , onclick: '; format("b")'})
    + input({type: 'button', value: 'I'      , t: 'Slant Text'      , onclick: '; format("i")'})
    + input({type: 'button', value: 'U'      , t: 'Rule Text'       , onclick: '; format("u")'})
    + input({type: 'button', value: 'S'      , t: 'Cross Text'      , onclick: '; format("s")'})
    + input({type: 'button', value: '>'      , t: 'Nestfull Text'   , onclick: '; format("›")'})
    + input({type: 'button', value: '<'      , t: 'Nestless Text'   , onclick: '; format("‹")'})
    + input({type: 'button', value: '^'      , t: 'Super Text'      , onclick: '; format("ˢ")'}) // promote
    + input({type: 'button', value: 'v'      , t: 'Sub Text'        , onclick: '; format("ₛ")'}) // demote
    + input({type: 'button', value: '&#8734;', t: 'Hyper Link'      , onclick: '; format("∞")'}) // &infin;
    + input({type: 'button', value: '&#8733;', t: '! Link'          , onclick: '; format("∝")'}) // &prop;
    + input({type: 'color' , value: '#003366', t: 'Textual Colour'  , onclick: '; format("fg", this.value)', onchange: '; format("fg", this.value)'})
    + input({type: 'color' , value: '#ffff00', t: 'Highlight Colour', onclick: '; format("bg", this.value)', onchange: '; format("bg", this.value)'})
    + input({type: 'button', value: '+'      , t: 'Big Text'        , onclick: '; format("+")'})
    + input({type: 'button', value: '-'      , t: 'Small Text'      , onclick: '; format("-")'})
    + input({type: 'button', value: 'pt'     , t: 'Resize Text'     , onclick: '; format("pt")'})
    + input({type: 'button', value: 'H'      , t: 'Title Text'      , onclick: '; format("h")'})
    + select(
        /*
            https://en.wikipedia.org/wiki/Web_typography#Generic_font_families
            http://code.stephenmorley.org/html-and-css/the-myth-of-web-safe-fonts/
            http://web.mit.edu/jmorzins/www/fonts.html
            http://www.w3schools.com/cssref/css_websafe_fonts.asp
        */
        option('Web Safe'       , {disabled: true})
        // The monospaced stack
        + option('Monospace'    , {value: 'courier new,courier,monospace,sans-serif'})
        // The sans-monoed stack
        + option('Sans-mono'    , {value: 'lucida console,monaco,monospace,sans-serif'})
        // The pure-monoed stack
        + option('Pure-mono'    , {value: 'monospace,sans-serif', selected: true})
        // The wide sans-serif stack
        + option('Sans-serif'   , {value: 'verdana,geneva,sans-serif'})
        // The narrow sans-serif stack
        + option('Antenna'      , {value: 'helvetica,arial,sans-serif'}) // Little Mermaid
        // The wide serif stack
        + option('Serif'        , {value: 'georgia,utopia,charter,serif'})
        // The narrow serif stack
        + option('Roman Num'    , {value: 'times new roman,times,serif'})
        + option('!!!'          , {disabled: true})
        // The cursive stack
        + option('Comical'      , {value: 'comic sans ms,cursive,sans-serif'})
        // The fantasy stacks
        + option('Serif'        , {disabled: true})
        + option('Georgia'      , {value: 'georgia,serif'})
        + option('Palatino'     , {value: 'palatino linotype,book antiqua,palatino,serif'})
        + option('Times'        , {value: 'times new roman,times,serif'})
        + option('Sans-Serif'   , {disabled: true})
        + option('Arial'        , {value: 'arial,helvetica,sans-serif'})
        + option('Arial Black'  , {value: 'arial black,gadget,sans-serif'})
        + option('Impact'       , {value: 'impact,charcoal,sans-serif'})
        + option('Lucida Dreama', {value: 'lucida sans unicode,lucida grande,sans-serif'})
        + option('Tahoma'       , {value: 'tahoma,geneva,sans-serif'})
        + option('Trebuchet MS' , {value: 'trebuchet ms,helvetica,sans-serif'})
        + option('Verdana'      , {value: 'verdana,geneva,sans-serif'})
        , {onclick: '; format("f", this.value)', onchange: '; format("f", this.value)', t: 'Textual Font'}
    )
    + input({type: 'button', value: 'X'    , t: 'Clear Formatting', onclick: '; format("x")'})
    + input({type: 'button', value: 'CSS'  , t: 'useCSS'          , onclick: '; format("css")'})
    + input({type: 'button', value: 'Style', t: 'styleWithCSS'    , onclick: '; format("style")'})
)
