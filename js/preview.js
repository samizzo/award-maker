define([ 'jquery', 'handlebars' ], function($, Handlebars) {
    var largeDeviceTemplateSource =
        '\t<div class="uk-width-large-1-{{size}}">\n' +
            '\t<div class="award uk-vertical-align uk-text-center">\n' +
                '\t\t<div class="uk-vertical-align-middle uk-container-center">\n' +
                    '\t\t\t<h2>{{position}}</h2>\n' +
                    '\t\t\t<p class="">{{category}}</p>\n' +
                    '\t\t\t<hr/>\n' +
                    '\t\t\t<p class="medium">{{festival}}</p>\n' +
                '\t\t</div>\n' +
            '\t</div>\n' +
        '\t</div>';
    var largeDeviceTemplate = Handlebars.compile(largeDeviceTemplateSource);
    var $preview = $('.award-preview-container');

    function refresh(awards) {
        $preview.empty();

        // Build large device layout.
        var html = '<!-- Large device layout -->\n';

        // First generate all complete rows.
        var numFullRows = Math.floor(awards.length / 3);
        for (var i = 0; i < numFullRows; i++) {
            html += '<div class="uk-grid uk-text-center uk-visible-large" id="awards">\n';
            var firstIndex = (i*3);
            for (var index = firstIndex; index < firstIndex+3; index++) {
                var award = awards[index];
                var context = { 
                    size: 3,
                    position: award.position,
                    category: award.category,
                    festival: award.festival
                };
                html += largeDeviceTemplate(context);
            }
            html += '</div>\n';
        }

        // Now generate incomplete rows.
        var numRemaining = awards.length % 3;
        if (numRemaining > 0) {
            html += '<div class="uk-grid uk-text-center uk-visible-large" id="awards">\n';
            for (var i = 0; i < numRemaining; i++) {
                var index = (numFullRows*3) + i;
                var award = awards[index];
                var context = { 
                    size: numRemaining,
                    position: award.position,
                    category: award.category,
                    festival: award.festival
                };
                html += largeDeviceTemplate(context);
            }
            html += '</div>\n';
        }

        $preview.html(html);
    }

    return {
        refresh: refresh
    };
});
