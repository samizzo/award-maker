requirejs.config({
    'baseUrl': 'js',
    'paths': {
        // 'js': '.',
        'jquery': 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min'
    }
});

requirejs([ 'main' ]);
