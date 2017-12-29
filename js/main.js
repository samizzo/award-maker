define([ 'jquery', 'handlebars', 'preview', 'json' ], function($, Handlebars, Preview, Json) {
    var awards = [];

    var $position = $('#position');
    var $category = $('#category');
    var $festival = $('#festival');
    var $errorMsg = $('.error-message');
    var $tableData = $('#table-data');
    var $preview = $('.award-preview');
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

    function replaceTemplateParams(str, params) {
    }

    function showError(msg, element) {
        element.addClass('uk-form-danger');
        $errorMsg.removeClass('uk-hidden');
        $errorMsg.text(msg);
    }

    function onKeyUp(eventData) {
        $(this).removeClass('uk-form-danger');
        $errorMsg.addClass('uk-hidden');
        // TODO: on enter, validate and add the award
    }

    $position.keyup(onKeyUp);
    $category.keyup(onKeyUp);
    $festival.keyup(onKeyUp);

    Json.setOnJsonUpdated(function (valid, newAwards) {
        if (valid) {
            awards = newAwards;
            refreshTable();
            refreshPresskit();
            Preview.refresh(awards);
        }
    });

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

        Json.hideError();

        // Add a new award to the table and refresh it.
        addAward(position, category, festival);
        refreshTable();
        refreshPresskit();
        Json.refresh(awards);
        Preview.refresh(awards);

        // Clear the old values.
        $position.val('');
        $category.val('');
        $festival.val('');
    });


});
