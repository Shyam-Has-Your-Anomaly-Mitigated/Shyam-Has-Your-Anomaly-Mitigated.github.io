; document.write(
    br + tabulate(
        [
            [
                'IMG', 'Program', 'Description', 'Source'
            ], [onerror=""
                image({
                    url: 'https://www.gimp.org/images/wilber16.png', alt: 'ICO', class: 'ico'
                    , onerror: '; this.src="./favicon.ico"; this.onerror=""'})
                , 'GIMP'    , '2D Raster Editor', hyperlink('GNU Project', 'https://www.gimp.org/')
            ], [
                , 'Inkscape', '2D Vector Editor', hyperlink('Indiana Jones', 'https://inkscape.org/')
            ], [
                , 'Blender' , '3D Object Editor', hyperlink('Blender Foundation', 'https://www.blender.org/')]
        ], true
    )
)
