requirejs.config({
    'baseUrl': 'js',
    'paths': {
        'jquery': 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min',
        'handlebars': 'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.11/handlebars.min',
        'clipboard': 'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min'
    }
});

requirejs([ 'main' ]);
