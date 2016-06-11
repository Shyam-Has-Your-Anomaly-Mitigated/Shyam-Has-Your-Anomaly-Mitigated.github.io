; document.write(
    br + tabulate(
        [
            [
                'IMG', 'Program', 'Description', 'Source'
            ], [
                image({url: 'https://www.gimp.org/images/wilber16.png', alt: 'ICO', class: 'ico'})
                , 'GIMP', '2D Raster Editor', hyperlink('GNU Project', 'https://www.gimp.org/')
            ], [
                image({url: 'https://media.inkscape.org/static/images/inkscape-logo.png', alt: 'ICO', class: 'ico'})
                , 'Inkscape', '2D Vector Editor', hyperlink('Indiana Jones', 'https://inkscape.org/')
            ], [
                image({url: 'https://www.blender.org/wp-content/themes/bthree/assets/images/favicon.ico', alt: 'ICO', class: 'ico'})
                , 'Blender', '3D ' + format('Object', 'u', {class: 'hover', title: 'Voxels'}) + ' Editor', hyperlink('Blender Foundation', 'https://www.blender.org/')]
        ], true
    )
)
