define([ 'jquery', 'preview', 'json', 'presskit', 'clipboard' ], function($, Preview, Json, Presskit, Clipboard) {
    var awards = [];
    var clipboard = new Clipboard('.clipboard-btn');

    var $position = $('#position');
    var $category = $('#category');
    var $festival = $('#festival');
    var $errorMsg = $('.error-message');
    var $tableData = $('#table-data');
    var $preview = $('.award-preview');

    function makeTableRow(award, index) {
        return '<tr><td>'+award.position+'</td><td>'+award.category+'</td><td>'+award.festival+'</td><td><button data-awardindex="'+index+'"" class="remove-award uk-button uk-button-mini uk-button-primary fa fa-trash-o"></button></td></tr>';
    }

    function addAward(position, category, festival) {
        var award = {
            position: position,
            category: category,
            festival: festival
        };
        awards.push(award);
    }

    function removeAward(index) {
        if (index >= 0 && index < awards.length) {
            awards.splice(index, 1);
            refreshTable();
            Presskit.refresh(awards);
            Preview.refresh(awards);
            Json.refresh(awards);
        }
    }

    function refreshTable() {
        $tableData.empty();
        for (var i = 0; i < awards.length; i++) {
            var award = awards[i];
            var html = makeTableRow(award, i);
            $tableData.append(html);
        }
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

    function hideError(tableElement) {
        tableElement.removeClass('uk-form-danger');
        tableElement.val('');
    }

    $position.keyup(onKeyUp);
    $category.keyup(onKeyUp);
    $festival.keyup(onKeyUp);

    Json.setOnJsonUpdated(function (valid, newAwards) {
        if (valid) {
            awards = newAwards;
            refreshTable();
            Presskit.refresh(awards);
            Preview.refresh(awards);
        }

        $errorMsg.addClass('uk-hidden');
        hideError($position);
        hideError($category);
        hideError($festival);
    });

    $('tbody').on('click', '.remove-award', function (eventData) {
        var $target = $(eventData.target);
        var index = $target.data('awardindex');
        removeAward(index);
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
        Presskit.refresh(awards);
        Json.refresh(awards);
        Preview.refresh(awards);

        // Clear the old values.
        $position.val('');
        $category.val('');
        $festival.val('');
    });
});
