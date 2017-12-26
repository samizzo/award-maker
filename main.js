$(document).ready(function() {
    var awards = [];

    var $position = $('#position');
    var $category = $('#category');
    var $festival = $('#festival');
    var $errorMsg = $('.error-message');
    var $jsonErrorMsg = $('.json-error-message');
    var $tableData = $('#table-data');
    var $preview = $('.award-preview');
    var $json = $('.award-json textarea');
    var $presskit = $('.award-presskit textarea');

    function makeTableRow(award) {
        return '<tr><td>'+award.position+'</td><td>'+award.category+'</td><td>'+award.festival+'</td><td>&nbsp;</td></tr>';
    }

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

    function makeJsonRow(award) {
        // { "position": "WINNER", "category": "GAME OF THE YEAR", "festival": "INTEL LEVEL UP 2017" },
        var json = '\t{\n';
        json += '\t\t"position": "' + award.position + '",\n';
        json += '\t\t"category": "' + award.category + '",\n';
        json += '\t\t"festival": "' + award.festival + '"\n';
        json += '\t}';
        return json;
    }

    function addAward(position, category, festival) {
        var award = {
            position: position,
            category: category,
            festival: festival
        };
        awards.push(award);
    }

    function refreshTable() {
        $tableData.empty();
        for (var i = 0; i < awards.length; i++) {
            var award = awards[i];
            var html = makeTableRow(award);
            $tableData.append(html);
        }
    }

    function refreshJson() {
        /*
        [
            { "position": "WINNER", "category": "GAME OF THE YEAR", "festival": "INTEL LEVEL UP 2017" },
            { .. }
        ]
        */

        var json = '[\n';
        for (var i = 0; i < awards.length; i++) {
            var award = awards[i];
            json += makeJsonRow(award);
            if (i !== awards.length - 1) {
                json += ',';
            }
            json += '\n';
        }
        json += ']';
        $json.val(json);
    }

    function refreshPresskit() {
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

    function showError(msg, element) {
        element.addClass('uk-form-danger');
        $errorMsg.removeClass('uk-hidden');
        $errorMsg.text(msg);
    }

    function showJsonError(msg) {
        $jsonErrorMsg.removeClass('uk-hidden');
        $jsonErrorMsg.text(msg);
    }

    function onKeyUp(eventData) {
        $(this).removeClass('uk-form-danger');
        $errorMsg.addClass('uk-hidden');
        // TODO: on enter, validate and add the award
    }

    $position.keyup(onKeyUp);
    $category.keyup(onKeyUp);
    $festival.keyup(onKeyUp);

    $('.add-award').click(function () {
        // Validate the form data.
        var position = $position.val();
        if (position == null || position.length === 0) {
            showError('Please enter an award position (e.g. finalist, winner, etc).', $position);
            return;
        }

        var category = $category.val();
        if (category == null || category.length === 0) {
            showError('Please enter an award category (e.g. best audio, etc).', $category);
            return;
        }

        var festival = $festival.val();
        if (festival == null || festival.length === 0) {
            showError('Please enter a festival name.', $festival);
            return;
        }

        $jsonErrorMsg.addClass('uk-hidden');

        // Add a new award to the table and refresh it.
        addAward(position, category, festival);
        refreshTable();
        refreshJson();
        refreshPresskit();

        // Clear the old values.
        $position.val('');
        $category.val('');
        $festival.val('');
    });

    $json.keyup(function () {
        var valid = true;
        try {
            awards = JSON.parse($json.val());
        } catch (err) {
            awards = [];
            showJsonError('Invalid JSON.');
            valid = $json.val().length === 0;
        }

        if (valid) {
            $jsonErrorMsg.addClass('uk-hidden');
        }

        refreshTable();
        refreshPresskit();
    });
});
