define([ 'jquery' ], function($) {
    var $jsonErrorMsg = $('.json-error-message');
    var $json = $('.award-json textarea');
    var onJsonUpdated = function () { };

    function makeJsonRow(award) {
        // { "position": "WINNER", "category": "GAME OF THE YEAR", "festival": "INTEL LEVEL UP 2017" },
        var json = '\t{\n';
        json += '\t\t"position": "' + award.position + '",\n';
        json += '\t\t"category": "' + award.category + '",\n';
        json += '\t\t"festival": "' + award.festival + '"\n';
        json += '\t}';
        return json;
    }

    $json.keyup(function () {
        var awards = [];
        var valid = true;
        try {
            awards = JSON.parse($json.val());
        } catch (err) {
            awards = [];
            showError('Invalid JSON.');
            valid = $json.val().length === 0;
        }

        if (valid) {
            $jsonErrorMsg.addClass('uk-hidden');
        }

        onJsonUpdated(valid, awards);
    });

    function refresh(awards) {
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

    function showError(msg) {
        $jsonErrorMsg.removeClass('uk-hidden');
        $jsonErrorMsg.text(msg);
    }

    function hideError() {
        $jsonErrorMsg.addClass('uk-hidden');
    }

    function setOnJsonUpdated(callback) {
        onJsonUpdated = callback;
    }

    return {
        refresh: refresh,
        showError: showError,
        hideError: hideError,
        setOnJsonUpdated: setOnJsonUpdated
    }
});
