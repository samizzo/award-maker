requirejs.config({
    'baseUrl': 'js',
    'paths': {
        'jquery': 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min',
        'handlebars': 'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.11/handlebars.min'
    }
});

requirejs([ 'main' ]);
