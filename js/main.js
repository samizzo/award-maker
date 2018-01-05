define([ 'jquery', 'preview', 'json', 'presskit', 'image', 'clipboard', 'uikit' ], function($, Preview, Json, Presskit, Image, Clipboard, UIkit) {
    var awards = [];
    var clipboard = new Clipboard('.clipboard-btn');

    var $position = $('#position');
    var $category = $('#category');
    var $festival = $('#festival');
    var $errorMsg = $('.error-message');
    var $tableData = $('#table-data');
    var $preview = $('.award-preview');

    function makeTableRow(award, index) {
        return '<tr><td>'+award.position+'</td><td>'+award.category+'</td><td>'+award.festival+'</td><td><button title="Move up" data-awardindex="'+index+'" class="award-up uk-button uk-button-mini uk-button-primary fa fa-arrow-up"></button><button title="Move down" data-awardindex="'+index+'" class="award-down uk-button uk-button-mini uk-button-primary fa fa-arrow-down"></button><button title="Download as image" data-awardindex="'+index+'" class="award-image uk-button uk-button-mini uk-button-primary fa fa-floppy-o"></button><button title="Delete award" data-awardindex="'+index+'" class="remove-award uk-button uk-button-mini uk-button-primary fa fa-trash-o"></button></td></tr>';
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

    function moveAward(index, newIndex) {
        if (index >= 0 && index < awards.length) {
            var oldAward = awards[index];
            awards.splice(index, 1);
            if (newIndex < 0) {
                newIndex = 0;
            }
            if (newIndex >= awards.length) {
                newIndex = awards.length;
            }
            awards.splice(newIndex, 0, oldAward);

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

    $('tbody').on('click', '.award-up', function (eventData) {
        var $target = $(eventData.target);
        var index = $target.data('awardindex');
        moveAward(index, index - 1);
    });

    $('tbody').on('click', '.award-down', function (eventData) {
        var $target = $(eventData.target);
        var index = $target.data('awardindex');
        moveAward(index, index + 1);
    });

    $('tbody').on('click', '.award-image', function (eventData) {
        var $target = $(eventData.target);
        var index = $target.data('awardindex');
        var award = awards[index];
        Image.save(award);
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

    $('.example').click(function () {
        var json = '[{"position":"WINNER","category":"GAME OF THE YEAR","festival":"INTEL LEVEL UP 2017"},{"position":"WINNER","category":"BEST PUZZLE/PHYSICS GAME","festival":"INTEL LEVEL UP 2017"},{"position":"FINALIST","category":"BEST SOUND/MUSIC","festival":"AZPLAY FESTIVAL 2017"},{"position":"FINALIST","category":"INDIE PRIZE SHOWCASE ASIA","festival":"INDIE PRIZE 2017"},{"position":"FINALIST","category":"ACROSS THE DITCH AWARD","festival":"PLAY BY PLAY FESTIVAL 2017"},{"position":"EDITOR\'S CHOICE","category":"MUSICALITY AWARD","festival":"SLIDEDB APP OF THE YEAR 2016"},{"position":"OFFICIAL SELECTION","category":"MADE WITH UNITY SHOWCASE","festival":"UNITE MELBOURNE 2016"},{"position":"FINALIST","category":"EXCELLENCE IN DESIGN","festival":"AGDA AWARDS 2016"},{"position":"FINALIST","category":"EXCELLENCE IN AUDIO","festival":"AGDA AWARDS 2016"},{"position":"HONORABLE MENTION","category":"INNOVATION","festival":"AGDA AWARDS 2016"}]';
        Json.setJson(json);
    });

    $('.help').click(function () {
        var modal = UIkit.modal('#help');
        modal.show();
    });
});
