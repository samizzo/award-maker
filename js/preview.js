define([ 'jquery', 'mustache', 'clipboard' ], function($, Mustache, Clipboard) {
    var largeDeviceTemplate =
        '\t\t\t<div class="uk-width-large-1-{{size}}">\n' +
            '\t\t\t\t<div class="award uk-vertical-align uk-text-center">\n' +
                '\t\t\t\t\t<div class="uk-vertical-align-middle uk-container-center">\n' +
                    '\t\t\t\t\t\t<h2>{{position}}</h2>\n' +
                    '\t\t\t\t\t\t<p>{{category}}</p>\n' +
                    '\t\t\t\t\t\t<hr/>\n' +
                    '\t\t\t\t\t\t<p class="small">{{festival}}</p>\n' +
                '\t\t\t\t\t</div>\n' +
            '\t\t\t\t</div>\n' +
        '\t\t\t</div>\n';

    var mediumDeviceTemplate =
        '\t\t\t<div class="uk-width-medium-1-{{size}}">\n' +
            '\t\t\t\t<div class="award uk-vertical-align uk-text-center">\n' +
                '\t\t\t\t\t<div class="uk-vertical-align-middle uk-container-center">\n' +
                    '\t\t\t\t\t\t<h2>{{position}}</h2>\n' +
                    '\t\t\t\t\t\t<p>{{category}}</p>\n' +
                    '\t\t\t\t\t\t<hr/>\n' +
                    '\t\t\t\t\t\t<p class="small">{{festival}}</p>\n' +
                '\t\t\t\t\t</div>\n' +
            '\t\t\t\t</div>\n' +
        '\t\t\t</div>\n';

    var smallDeviceTemplate =
        '\t\t\t<div class="uk-width-small-1-{{size}}">\n' +
            '\t\t\t\t<div class="award uk-vertical-align uk-text-center">\n' +
                '\t\t\t\t\t<div class="uk-vertical-align-middle uk-container-center">\n' +
                    '\t\t\t\t\t\t<h2>{{position}}</h2>\n' +
                    '\t\t\t\t\t\t<p>{{category}}</p>\n' +
                    '\t\t\t\t\t\t<hr/>\n' +
                    '\t\t\t\t\t\t<p class="small">{{festival}}</p>\n' +
                '\t\t\t\t\t</div>\n' +
            '\t\t\t\t</div>\n' +
        '\t\t\t</div>\n';

    var $preview = $('.award-preview-container');

    function getHtml(template, award, size) {
        var context = { 
            size: size,
            position: award.position,
            category: award.category,
            festival: award.festival
        };
        var html = Mustache.render(template, context);
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
            html += '\t\t</div>\n';
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
            html += '\t\t</div>\n';
        }

        return html;
    }

    var lastHtml = '';

    function refresh(awards) {
        $preview.empty();

        var numFullRows, numRemaining, index, i, firstIndex, award;

        // Build large device layout (three laurels per row).
        var html = '\t\t<!-- Large device layout -->\n';
        html += makeLaurels(awards, 3, '\t\t<div class="uk-grid uk-text-center uk-visible-large" id="awards">\n', largeDeviceTemplate);

        // Build medium device layout (two laurels per row).
        html += '\t\t<!-- Medium device layout -->\n';
        html += makeLaurels(awards, 2, '\t\t<div class="uk-grid uk-text-center uk-visible-medium awards" id="awards">\n', mediumDeviceTemplate);

        // Build small device layout (one laurel per row).
        html += '\t\t<!-- Small device layout -->\n';
        html += makeLaurels(awards, 1, '\t\t<div class="uk-grid uk-text-center uk-visible-small" id="awards">\n', smallDeviceTemplate);

        lastHtml = html;
        $preview.html(html);
    }

    var fullHtml =
'<html>\n' +
'\t<head>\n' +
'\t\t<style>\n' +
'\t\t\t/* Award styles for embedding */\n' +
'\t\t\t@import url("https://fonts.googleapis.com/css?family=Raleway:400,700");\n' +
'\n' +
'\t\t\tbody {\n' +
'\t\t\t\tbackground-color: #000;\n' +
'\t\t\t}\n' +
'\n' +
'\t\t\tdiv#awards {\n' +
'\t\t\t\tmargin-top: 0px;\n' +
'\t\t\t}\n' +
'\n' +
'\t\t\tdiv#awards hr {\n' +
'\t\t\t\tmargin: 7px auto 7px auto;\n' +
'\t\t\t\twidth: 160px;\n' +
'\t\t\t}\n' +
'\n' +
'\t\t\tdiv#awards div.award {\n' +
'\t\t\t\tmargin-top: 10px;\n' +
'\t\t\t\twidth: 260px;\n' +
'\t\t\t\theight: 120px;\n' +
'\t\t\t\tbackground: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAABtCAMAAADQzBKcAAAC8VBMVEWDg4MAAAAFBQX///////////////////////////9gYGA+Pz////////+zs7P////////////////////////w8PCUlJSoqKj////////+/v7v7+/////j4+P///+wsLCysrKnqKjZ2dlwcHCbmpqjo6OPj4+YmJhAQEA8PDx3d3f+/v74+Pj////////n5+fc3d3Z2trz8/PIyMj////Jycna2trx8fHCwsLIyMj///+rq6u0tLSgoaFtbW3a2tqIiIimpqb09PT5+fn////////u7u77+/vw8PD////+/v7r7Oz////l5eXV1dX29vbf39/Z2dnOzs7Y2Nja2tqurq7T1NSenp7d3d2Ghobt7Oz8/PzV1tb8/PzQ0NDo5+fe3t6Ojo7o6Ojd3d14eHh3d3ddXl5HR0doaGjKysqHh4f6+vr5+fny8vL+/v729vb////i4uL////////y8vLt7e319fXX19fj4+P4+Pja29vy8vL+/f3Nzc3i4uLOz8/////BwcHc29vu7u69vb3+/v6vr6/h4eGmpqbOzs7FxcW7u7v49/fPzs708/P+/v67u7uYl5eIiIi/v7+Wl5fOzs6fn5+UlZXCwsLf3t7p6el5eXnq6upwcHDGx8evr6+4ublmZmalpaSJiYnCwsLt7e3z9PTo6OjW1tbg4eH09PTx8fH29vb6+/vp6enNzMz////6+vri4uLKysr19PT3+PjJycn///+5ubno5+fp6ens7Oyen5/////9/f3p6Ojz8/O5ubnl5eWoqKj///+ysrKurq7Dw8PW1tbv7++hoaF4eHjZ2trS0tLx8fHGxcWlpKT////R0dGFhYVcXFyDg4P///+9vr7y8vLJyclNTk6WlZWzsrLq6+v4+Pjy8vLT09PExcX4+PjOzs7i4+PMzMzx8fHl5eXh4eH////Dw8L///+ur6/////IyMhvb2/f39+oqKhycnL///////+Tk5OChISGh4c5OjpGRkb///9Ows/aAAAA+nRSTlMCAAL39vT5/PvwDgXkzjLs5tzVu7N4PhDp39nNrolvWEs9MjEtJiMaEQkI1MLBq6OVlIuIhXt4b29bUUQ+OBcWEAbMy723s6+po5+dlI6KhIKAgHFsbGpoZ2RiYGBY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) left no-repeat, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAABtCAMAAADQzBKcAAAC+lBMVEUGBgYAAAD///////////////////////////////9wcHCfn59jY2MzNDT////////////////y8vJpaWn////////////////+/v7//v7///+ys7Ofn5/Z2dmlpaVzc3M8PDzJycmIiIhVVVWPjo7////+/v7////z8/P////////z8/Pc3d3l5eXj4+PIyMj////29/fZ2dnX19f09PT///+xsbGhoaGSkpK3uLja2tqnp6e1tbUhICD////4+Pjv7+/5+fn////t7e3Y2Nj9/f3n5+fk5OT+/v729vbY2dn////q6ur////V1dXf39/Z2dnx8fHMzMy3t7fCwsLa2tqurq7Pz8+enp79/f3V1tbGxsbY2Nivr6/8/PzOzs7Q0NDFxcWRkpLk5OSsrKzKysp4eHisrKx3d3e0tLRubm5jZGSWlZWGhoa2trako6OQkJBKSkr6+vr7/Pzy8vLw8PDi4uL////////19fX6+/vx8fHj4+P////w8PD+/v7r6+vMzc3i4uLOzs7BwcHz8/Pu7u7+/v7Qz8/Ky8vu7e3FxcXZ2dm+vr7g4OCDg4Pr6+v9/f28vLydnZ2IiIijo6Pm5uaXl5e/v7/T09OUlZXf39/f3t6fn5+Dg4Pw8PCXlpaZmZmBgoLq6upWV1fGx8ft7e37+/v19fXo6Ojw8PDW1tbt7e329/fg4eH3+PjKycnp6en29vbQz8/IyMjf39/09PTBwMDo5+fc3d3a2Ni9vb2en5+vr6/////e3t6oqKj////p6Ojz8/PS0tLl5eWoqKj///+ysrKurq7v7+94eHizs7Px8fHa2tq8vLz////q6upcXFx0dHT///93d3dHR0evr6/19fXq6+v4+Pj39/fT09P29vb09PTExcXOzs7i4+PZ2trt7u60tLTs7e3Kysrv7++8vLyur6/Dw8P6+vrj4+OhoaHIyMhvb2+MjIxycnLs7Oz///+FhYX////r6+uFhYXj4+OjoqLJycnIyMhGRkb////+0kWLAAAA/XRSTlMCAPb49Pv88ObdBxAPBOzY1btuGOnQs66tmm8+ODImFREPDQwE49TOzcC3t5WOiIiFhXhpZlFLRj80FhUICODMy8G+trCjo6Gfn5WUj46KgoB4dnJw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) right no-repeat;\n' +
'\t\t\t\tdisplay: inline-block;\n' +
'\t\t\t}\n' +
'\n' +
'\t\t\tdiv#awards div.award h2 {\n' +
'\t\t\t\tmargin: 0;\n' +
'\t\t\t\tfont-size: 13pt;\n' +
'\t\t\t\tcolor: #fff;\n' +
'\t\t\t\tpadding: 0;\n' +
'\t\t\t\ttext-align: center;\n' +
'\t\t\t\tvertical-align: middle;\n' +
'\t\t\t\twidth: 100%;\n' +
'\t\t\t\tfont-family: "Raleway", "Helvetica Neue", Helvetica, Arial, sans-serif;\n' +
'\t\t\t\tfont-weight: bold;\n' +
'\t\t\t}' +
'\n' +
'\t\t\tdiv#awards div.award p {\n' +
'\t\t\t\tline-height: 1.2em;\n' +
'\t\t\t\tmargin: 0;\n' +
'\t\t\t\tpadding: 0;\n' +
'\t\t\t\tfont-size: 9pt;\n' +
'\t\t\t\tcolor: #fff;\n' +
'\t\t\t\ttext-align: center;\n' +
'\t\t\t\tfont-family: "Raleway", "Helvetica Neue", Helvetica, Arial, sans-serif;\n' +
'\t\t\t}\n' +
'\n' +
'\t\t\tdiv#awards div.award p.small {\n' +
'\t\t\t\tfont-size: 9pt;\n' +
'\t\t\t}\n' +
'\t\t</style>\n' +
'\t\t<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uikit/2.27.4/css/uikit.min.css" />\n' +
'\t</head>\n' +
'\t<body>\n';

    var clipboard = new Clipboard('.preview-clipboard', {
        text: function (trigger) {
            var html = fullHtml + lastHtml + '\t</body>\n</html>\n';
            return html;
        }
    });

    return {
        refresh: refresh
    };
});
