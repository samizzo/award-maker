define([ 'jquery', 'handlebars' ], function($, Handlebars) {
    var largeDeviceTemplateSource =
        '\t<div class="uk-width-large-1-{{size}}">\n' +
            '\t\t<div class="award uk-vertical-align uk-text-center">\n' +
                '\t\t\t<div class="uk-vertical-align-middle uk-container-center">\n' +
                    '\t\t\t\t<h2>{{position}}</h2>\n' +
                    '\t\t\t\t<p>{{category}}</p>\n' +
                    '\t\t\t\t<hr/>\n' +
                    '\t\t\t\t<p class="medium">{{festival}}</p>\n' +
                '\t\t\t</div>\n' +
            '\t\t</div>\n' +
        '\t</div>';
    var largeDeviceTemplate = Handlebars.compile(largeDeviceTemplateSource);

    var mediumDeviceTemplateSource =
        '\t<div class="uk-width-medium-1-{{size}}">\n' +
            '\t\t<div class="award uk-vertical-align uk-text-center">\n' +
                '\t\t\t<div class="uk-vertical-align-middle uk-container-center">\n' +
                    '\t\t\t\t<h2>{{position}}</h2>\n' +
                    '\t\t\t\t<p>{{category}}</p>\n' +
                    '\t\t\t\t<hr/>\n' +
                    '\t\t\t\t<p class="medium">{{festival}}</p>\n' +
                '\t\t\t</div>\n' +
            '\t\t</div>\n' +
        '\t</div>';
    var mediumDeviceTemplate = Handlebars.compile(mediumDeviceTemplateSource);

    var smallDeviceTemplateSource =
        '\t<div class="uk-width-small-1-{{size}}">\n' +
            '\t\t<div class="award uk-vertical-align uk-text-center">\n' +
                '\t\t\t<div class="uk-vertical-align-middle uk-container-center">\n' +
                    '\t\t\t\t<h2>{{position}}</h2>\n' +
                    '\t\t\t\t<p>{{category}}</p>\n' +
                    '\t\t\t\t<hr/>\n' +
                    '\t\t\t\t<p class="medium">{{festival}}</p>\n' +
                '\t\t\t</div>\n' +
            '\t\t</div>\n' +
        '\t</div>';
    var smallDeviceTemplate = Handlebars.compile(smallDeviceTemplateSource);

    var $preview = $('.award-preview-container');

    function getHtml(template, award, size) {
        var context = { 
            size: size,
            position: award.position,
            category: award.category,
            festival: award.festival
        };
        var html = template(context);
        return html;
    }

    function makeLaurels(awards, numItemsPerRow, div, template) {
        // First generate all complete rows.
        var html = '';
        var numFullRows = Math.floor(awards.length / numItemsPerRow);
        for (var i = 0; i < numFullRows; i++) {
            html += div;
            var firstIndex = (i*numItemsPerRow);
            for (var index = firstIndex; index < firstIndex+numItemsPerRow; index++) {
                var award = awards[index];
                html += getHtml(template, award, numItemsPerRow);
            }
            html += '</div>\n';
        }

        // Now generate incomplete rows.
        var numRemaining = awards.length % numItemsPerRow;
        if (numRemaining > 0) {
            html += div;
            for (i = 0; i < numRemaining; i++) {
                index = (numFullRows*numItemsPerRow) + i;
                award = awards[index];
                html += getHtml(template, award, numRemaining);
            }
            html += '</div>\n';
        }

        return html;
    }

    function refresh(awards) {
        $preview.empty();

        var numFullRows, numRemaining, index, i, firstIndex, award;

        // Build large device layout (three laurels per row).
        var html = '<!-- Large device layout -->\n';
        html += makeLaurels(awards, 3, '<div class="uk-grid uk-text-center uk-visible-large" id="awards">\n', largeDeviceTemplate);

        // Build medium device layout (two laurels per row).
        html += '<!-- Medium device layout -->\n';
        html += makeLaurels(awards, 2, '<div class="uk-grid uk-text-center uk-visible-medium" id="awards">\n', mediumDeviceTemplate);

        // Build small device layout (one laurel per row).
        html += '<!-- Small device layout -->';
        html += makeLaurels(awards, 1, '<div class="uk-grid uk-text-center uk-visible-small" id="awards">\n', smallDeviceTemplate);

        $preview.html(html);
    }

    return {
        refresh: refresh
    };
});
