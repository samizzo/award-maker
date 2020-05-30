requirejs.config({
    'baseUrl': 'js',
    'paths': {
        'jquery': 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min',
        'mustache': 'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.3.0/mustache.min',
        'clipboard': 'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min',
        'filesaver': 'https://cdn.rawgit.com/eligrey/FileSaver.js/5ed507ef8aa53d8ecfea96d96bc7214cd2476fd2/FileSaver.min',
        'canvastoblob': 'https://cdnjs.cloudflare.com/ajax/libs/javascript-canvas-to-blob/3.14.0/js/canvas-to-blob.min',
        'uikit': 'https://cdnjs.cloudflare.com/ajax/libs/uikit/2.27.4/js/uikit.min'
    },
    shim: {
        'uikit': {
            deps: [ 'jquery' ]
        }
    }
});

requirejs([ 'main' ]);
