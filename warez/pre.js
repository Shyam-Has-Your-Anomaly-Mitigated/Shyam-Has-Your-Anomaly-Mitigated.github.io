; document.write(
    br
    + tabulate(
        [
            [
                ['IMG', {}]
                , ['Program', {}]
                , ['Description', {}]
                , ['Source', {}]
                , 'th'
                , {}
            ], [
                [image({url: 'https://www.google.com/s2/favicons?domain=www.github.com', alt: 'ICO', c: 'ico'}), {}]
                , [link('CAT', '/cat', {class: 'hover', title: 'Ctrl∧Alt∧T=CLI; see after playful'}), {}]
                , ['Bit Reader/Writer', {}]
                , [link('UNIX', 'http://ftp.gnu.org/gnu/coreutils/'), {}]
                , 'td'
                , {}
            ], [
                [image({url: 'https://www.google.com/s2/favicons?domain=www.vim.org', alt: 'ICO', c: 'ico'}), {}]
                , ['VIM', {}]
                , ['Bit Editor', {}]
                , [link('Indiana Jones', 'http://www.vim.org/'), {}]
                , 'td'
                , {}
            ], [
                [image({url: 'https://www.google.com/s2/favicons?domain=www.git-scm.com', alt: 'ICO', c: 'ico'}), {}]
                , [link('GIT', 'git.sh'), {}]
                , ['Software .Config Manager', {}]
                , [link('L' + format('IN' + format('U', 'u') + 'X', 'b'), 'https://git-scm.com/'), {}]
                , 'td'
                , {}
            ], [// How did they implement their favicon?
                [image({url: 'https://www.google.com/s2/favicons?domain=www.netfilter.org', alt: 'ICO', c: 'ico'}), {}]
                , [link('IPTables', 'iptables.sh'), {}]
                , ['Firewall', {}]
                , [link('Netfilter', 'http://www.netfilter.org/'), {}]
                , 'td'
                , {}
            ], [
                [image({url: 'https://www.google.com/s2/favicons?domain=www.gimp.org', alt: 'ICO', c: 'ico'}), {}]
                , ['GIMP', {}]
                , ['2D Raster Editor', {}]
                , [link('GNU Project', 'https://www.gimp.org/'), {}]
                , 'td'
                , {}
            ], [
                [image({url: 'https://www.google.com/s2/favicons?domain=www.inkscape.org', alt: 'ICO', c: 'ico'}), {}]
                , ['Inkscape', {}]
                , ['2D Vector Editor', {}]
                , [link('Indiana Jones', 'https://inkscape.org/'), {}]
                , 'td'
                , {}
            ], [
                [[image({url: 'https://www.google.com/s2/favicons?domain=www.blender.org', alt: 'ICO', c: 'ico'})], {}]
                , ['Blender', {}]
                , ['3D Voxels Editor', {}]
                , [link('Blender Foundation', 'https://www.blender.org/'), {}]
                , 'td'
                , {}
            ]
        ]
        , {}
    )
)
