define([ 'jquery', 'filesaver' ], function($, FileSaver) {
    var $presskit = $('.award-presskit textarea');

    function makePresskitRow(award) {
        /*
        <award>
            <description>Winner - Game of the Year</description>
            <info>Intel Level Up Game Developer Contest, 2017</info>
        </award>
        */
        var presskit = '\t<award>\n';
        presskit += '\t\t<description>' + award.position + ' - ' + award.category + '</description>\n';
        presskit += '\t\t<info>' + award.festival + '</info>\n';
        presskit += '\t</award>\n';
        return presskit;
    }

    function refresh(awards) {
        /*
            <awards>
                <award>
                    <description>Winner - Game of the Year</description>
                    <info>Intel Level Up Game Developer Contest, 2017</info>
                </award>
            </awards>
        */

        var presskit = '<awards>\n';
        for (var i = 0; i < awards.length; i++) {
            var award = awards[i];
            presskit += makePresskitRow(award);
        }
        presskit += '</awards>';
        $presskit.val(presskit);
    }

    $('.download-btn#presskit').click(function () {
        var presskit = $presskit.val();
        if (presskit.length === 0) {
            return;
        }

        var blob = new Blob([$presskit.val()], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'awards-presskit.xml');
    });

    return {
        refresh: refresh
    }
});
