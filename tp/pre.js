//https://en.wikipedia.org/wiki/Character_encodings_in_HTML
//http://stackoverflow.com/a/17471151

; function tr(set_A, set_B) {
    ; var set_C = {}
    ; if(set_A.length == set_B.length) {
        ; for(var i = 0; i < set_A.length; i++) {
            ; set_C[set_A[i].codePointAt(0)] = set_B[i]
            ; set_C[set_B[i].codePointAt(0)] = set_A[i]
        }
    } else {
        ; alert('You have found a bug!\nPlease send your text, and configuration, to shyam@shyam.id.au')
    }
    ; return set_C
}
; function tr_char(o, char, c, set_A, set_C) {// inefficiency: ...I just feel like this could be done better!
    ; return set_A.indexOf(char) < 0
        ? char
        : o + set_C[char.codePointAt(0)] + c
}
; function tr_string(o, s, c, set_B, set_C) {// efficiency: lower set_X reassignment frequency
    ; set_B.forEach(
        x => s = s.replace(
            new RegExp(
                (o+x+c).replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
                ,'g'
            )
            , set_C[x.codePointAt(0)]
        )
    )
    ; return s
}

; function tr_mathbb(char, target) {// https://en.wikipedia.org/wiki/Blackboard_bold
    // missing: ⅅ,ⅆ,ⅇ,ⅈ,ⅉ
    ; var
        set_A   = '0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,Γ,γ,Π,π,Σ'.split(',')
        , set_B = '𝟘,𝟙,𝟚,𝟛,𝟜,𝟝,𝟞,𝟟,𝟠,𝟡,𝔸,𝔹,ℂ,𝔻,𝔼,𝔽,𝔾,ℍ,𝕀,𝕁,𝕂,𝕃,𝕄,ℕ,𝕆,ℙ,ℚ,ℝ,𝕊,𝕋,𝕌,𝕍,𝕎,𝕏,𝕐,ℤ,𝕒,𝕓,𝕔,𝕕,𝕖,𝕗,𝕘,𝕙,𝕚,𝕛,𝕜,𝕝,𝕞,𝕟,𝕠,𝕡,𝕢,𝕣,𝕤,𝕥,𝕦,𝕧,𝕨,𝕩,𝕪,𝕫,ℾ,ℽ,ℿ,ℼ,⅀'.split(',')
        , set_C = tr(set_A, set_B)
    ; return target
        ? (
            set_A.indexOf(char) < 0
            ? char
            : set_C[char.codePointAt(0)]
        )
        : (
            set_B.indexOf(char) < 0
            ? char
            : set_C[char.codePointAt(0)]
        )
}

; function tr_xml(o, text, c, target) {// https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Predefined_entities_in_XML
    ; var
        set_A   = "\",&,',<,>".split(',')// WTF?!? amp>& works for xhtml... D=8<
        , set_B = 'quot,amp,apos,lt,gt'.split(',')
        , set_C = tr(set_A, set_B)
    ; return target
        ? tr_char(o, text, c, set_A, set_C)
        : tr_string(o, text, c, set_B, set_C)
}

; function tr_xhtml(o, text, c, target) {// https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Entities_representing_special_characters_in_XHTML
    ; var
        set_A   = '",&,<,>'.split(',')
        , set_B = 'quot,amp,lt,gt'.split(',')
        , set_C = tr(set_A, set_B)
    ; return target
        ? tr_char(o, text, c, set_A, set_C)
        : tr_string(o, text, c, set_B, set_C)
}

; function tr_html(o, char, c) {// https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Character_entity_references_in_HTML
    // missing: shy,zwnj,zwj,lrm,rlm
    // test: "&'<> ¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿŒœŠšŸƒˆ˜ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρςστυφχψωϑϒϖ   –—‘’‚“”„†‡•…‰′″‹›‾⁄€ℑ℘ℜ™ℵ←↑→↓↔↵⇐⇑⇒⇓⇔∀∂∃∅∇∈∉∋∏∑−∗√∝∞∠∧∨∩∪∫∴∼≅≈≠≡≤≥⊂⊃⊄⊆⊇⊕⊗⊥⋅⌈⌉⌊⌋〈〉◊♠♣♥♦
    ; var charset = '",&,\',<,>, ,¡,¢,£,¤,¥,¦,§,¨,©,ª,«,¬,,®,¯,°,±,²,³,´,µ,¶,·,¸,¹,º,»,¼,½,¾,¿,À,Á,Â,Ã,Ä,Å,Æ,Ç,È,É,Ê,Ë,Ì,Í,Î,Ï,Ð,Ñ,Ò,Ó,Ô,Õ,Ö,×,Ø,Ù,Ú,Û,Ü,Ý,Þ,ß,à,á,â,ã,ä,å,æ,ç,è,é,ê,ë,ì,í,î,ï,ð,ñ,ò,ó,ô,õ,ö,÷,ø,ù,ú,û,ü,ý,þ,ÿ,Œ,œ,Š,š,Ÿ,ƒ,ˆ,˜,Α,Β,Γ,Δ,Ε,Ζ,Η,Θ,Ι,Κ,Λ,Μ,Ν,Ξ,Ο,Π,Ρ,Σ,Τ,Υ,Φ,Χ,Ψ,Ω,α,β,γ,δ,ε,ζ,η,θ,ι,κ,λ,μ,ν,ξ,ο,π,ρ,ς,σ,τ,υ,φ,χ,ψ,ω,ϑ,ϒ,ϖ, , , ,,,,,–,—,‘,’,‚,“,”,„,†,‡,•,…,‰,′,″,‹,›,‾,⁄,€,ℑ,℘,ℜ,™,ℵ,←,↑,→,↓,↔,↵,⇐,⇑,⇒,⇓,⇔,∀,∂,∃,∅,∇,∈,∉,∋,∏,∑,−,∗,√,∝,∞,∠,∧,∨,∩,∪,∫,∴,∼,≅,≈,≠,≡,≤,≥,⊂,⊃,⊄,⊆,⊇,⊕,⊗,⊥,⋅,⌈,⌉,⌊,⌋,〈,〉,◊,♠,♣,♥,♦'.split(',')
    ; return charset.indexOf(char) < 0
        ? char
        : o + tr(
            charset
            , 'quot,amp,apos,lt,gt,nbsp,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,Otilde,Ouml,times,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,otilde,ouml,divide,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml,OElig,oelig,Scaron,scaron,Yuml,fnof,circ,tilde,Alpha,Beta,Gamma,Delta,Epsilon,Zeta,Eta,Theta,Iota,Kappa,Lambda,Mu,Nu,Xi,Omicron,Pi,Rho,Sigma,Tau,Upsilon,Phi,Chi,Psi,Omega,alpha,beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa,lambda,mu,nu,xi,omicron,pi,rho,sigmaf,sigma,tau,upsilon,phi,chi,psi,omega,thetasym,upsih,piv,ensp,emsp,thinsp,zwnj,zwj,lrm,rlm,ndash,mdash,lsquo,rsquo,sbquo,ldquo,rdquo,bdquo,dagger,Dagger,bull,hellip,permil,prime,Prime,lsaquo,rsaquo,oline,frasl,euro,image,weierp,real,trade,alefsym,larr,uarr,rarr,darr,harr,crarr,lArr,uArr,rArr,dArr,hArr,forall,part,exist,empty,nabla,isin,notin,ni,prod,sum,minus,lowast,radic,prop,infin,ang,and,or,cap,cup,int,there4,sim,cong,asymp,ne,equiv,le,ge,sub,sup,nsub,sube,supe,oplus,otimes,perp,sdot,lceil,rceil,lfloor,rfloor,lang,rang,loz,spades,clubs,hearts,diams'.split(',')
        )[char.codePointAt(0)] + c
}

; function characterise() {
    ; var
        r        = ''                    //return
        , s      = getId('charbx').value//string
        , encode
        , encase = (getId('casing').value == 'lower'
            ? x => x.toLowerCase()
            : x => x.toUpperCase()
        )
        , o = getId('open').value
        , c = getId('close').value
    ; switch(getId('coding').value) {
        case 'casings': encode = x => o + encase(String.fromCodePoint(x)) + c; break;
        case 'blckbrd': encode = x => tr_mathbb(String.fromCodePoint(x), 0); break;
        case 'bincode': encode = x => o + x.toString(2) + c; break;
        case 'octcode': encode = x => o + x.toString(8) + c; break;
        case 'hexcode':
        case 'ucoding':
        case 'unicode':
        case 'hexadec':
        case 'cstyles': encode = x => o + encase(x.toString(16)) + c; break;
        case 'decimal': encode = x => o + encase(x.toString(10)) + c; break;
        case 'percent': encode = x => o + encase(encodeURIComponent(String.fromCodePoint(x))) + c; break;
        case 'urllink': encode = x => o + encase(encodeURI(String.fromCodePoint(x))) + c; break;
        case 'extendm': encode = x => tr_xml(o, String.fromCodePoint(x), c, 1); break;
        case 'hypertm': encode = x => tr_html(o, String.fromCodePoint(x), c); break;
        case 'xypertm': encode = x => tr_xhtml(o, String.fromCodePoint(x), c, 1); break;
    }
    ; for (var a = 0, z = s.length; a < z; a += String.fromCodePoint(char).length) {
        ; var char = s.codePointAt(a)
        ; r += encode(char)
    }
    ; getId('charbx').value = r
}

; function uncharacterise() {// drop this and one button encodes/decodes? @mathbb
    ; var
        r        = ''                    //return
        , s      = getId('charbx').value//string
        , decode
        , encase = (getId('casing').value == 'lower'
            ? x => x.toUpperCase()
            : x => x.toLowerCase()
        )
        , o = getId('open').value
        , c = getId('close').value
    ; switch(getId('coding').value) {
        case 'casings': getId('charbx').value = encase(s); return;// need to ignore \o nad \c
        case 'blckbrd': decode = x => tr_mathbb(String.fromCodePoint(x), 0); break;
        case 'extendm': getId('charbx').value = tr_xml(o,s,c, 0); return;
        case 'xypertm': getId('charbx').value = tr_xhtml(o,s,c, 0); return;
        case 'bincode':
        case 'octcode':
        case 'hexcode':
        case 'ucoding':
        case 'unicode':
        case 'hexadec':
        case 'cstyles':
        case 'decimal':
        case 'percent':
        case 'urllink':
        case 'hypertm':
        default       :
            ; alert('Pending...')
            ; return
    }
    ; for (var a = 0, z = s.length; a < z; a += String.fromCodePoint(char).length) {
        ; var char = s.codePointAt(a)
        // ^\o\chars\c$
        // if \char starts with \o
        // what about empty \o X \c? (where X = ∧/∨, ¬ >/<)
        //
        // s.match(/\o\(sth)\c/i?g).forEach(/* strip \o & \c before .replace() */)
        ; r += decode(char)
    }
    ; getId('charbx').value = r
}

; function reformat(option) {
    ; var o, c
    ; switch(option) {
        case 'casings':
        case 'blckbrd':
        case 'percent':
        case 'urllink': o = ''   ; c = '' ; break;
        case 'bincode': o = '0b' ; c = ' '; break;
        case 'octcode': o = '0'  ; c = ' '; break;
        case 'hexcode': o = '0x' ; c = ' '; break;
        case 'unicode': o = 'U+' ; c = ' '; break;
        case 'ucoding': o = '\\u'; c = ' '; break;
        case 'decimal': o = '&#' ; c = ';'; break;
        case 'hexadec': o = '&#x'; c = ';'; break;
        case 'cstyles': o = '\\' ; c = '␠'; break;
        case 'extendm':
        case 'hypertm':
        case 'xypertm': o = '&'  ; c = ';'; break;
        default: o = ''; c = '';
    }
    ; getId('open').value = o
    ; getId('close').value = c
}

; document.write(
    heading(format(link('Text Processing', 'https://en.wikipedia.org/wiki/Text_Processing_Utility'), 'u'), 3)
    + link('wysiwyg', './wysiwyg')
    + br + link('chars', './chars')
    + br
    + br + hr
    + br
    + input({type: 'text', id: 'open', placeholder: 'open', size: '5'})
    + select(
        option(  'lower', {value: 'lower'})
        + option('UPPER', {value: 'CAPITAL', selected: true})
        , {i: 'casing'}
    )
    + select(
        option(  '...'        , {value: '.......', disabled: true, selected: true})
        + option('Case'       , {value: 'casings'})
        + option('MathBB'     , {value: 'blckbrd'})
        + option('Binary'     , {value: 'bincode'})
        + option('Octal'      , {value: 'octcode'})
        + option('Hexadecimal', {value: 'hexcode'})
        + option('Unicode'    , {value: 'ucoding'})
        + option('Web...'     , {disabled: true  })
        + option('Unicode'    , {value: 'unicode'})
        + option('Decimal'    , {value: 'decimal'})
        + option('Hexadecimal', {value: 'hexadec'})
        + option('CSS'        , {value: 'cstyles'})
        + option('Percent'    , {value: 'percent'})
        + option('URL Address', {value: 'urllink'})
        + option('XML'        , {value: 'extendm'})
        + option('HTML'       , {value: 'hypertm'})
        + option('XHTML'      , {value: 'xypertm'})
        , {
            i: 'coding'
            , onclick : '; reformat(this.value)'
            , onchange: '; reformat(this.value)'
        }
    )
    + input({type: 'text', id: 'close', placeholder: 'close', size: '5'})
    + input({type: 'button', value: 'encode', onclick: '; characterise()'})
    + input({type: 'button', value: 'decode', onclick: '; uncharacterise()'})
    + br + '<textarea id="charbx"></textarea>'
    + br    + link('☺', 'http://www.amp-what.com/')
    + '...' + link('™', 'http://textmechanic.co/ASCII-to-Unicode-Converter.html')
)
