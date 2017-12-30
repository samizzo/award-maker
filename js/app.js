requirejs.config({
    'baseUrl': 'js',
    'paths': {
        'jquery': 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min',
        'mustache': 'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.3.0/mustache.min'
        'clipboard': 'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min'
    }
});

requirejs([ 'main' ]);
