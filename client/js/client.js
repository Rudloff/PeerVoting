/*global $, Peer, options*/
/*jslint browser: true*/
var conn;
function addQuestion(index, question) {
    'use strict';
    var html = '<li><fieldset class="ui-field-contain" data-role="controlgroup" data-type="horizontal"><legend>' + question.label + '</legend>', i;
    for (i = question.min; i <= question.max; i += question.step) {
        html += '<input name="' + encodeURIComponent(question.label) + '" id="note-' + i + '" type="radio" value="' + i + '"><label for="note-' + i + '">' + i + '</label>';
    }
    html += '</fieldset></li>';
    $('#questions').prepend(html).listview('refresh').trigger('create');
}

function getQuestions(questions) {
    'use strict';
    $.each(questions, addQuestion);
    $.mobile.loading('hide');
}

function startPeer(id) {
    'use strict';
    $.mobile.loading('show');
    var peer = new Peer({key: options.peerjsKey});
    conn = peer.connect(id + '-contest');
    conn.on('data', getQuestions);
}

function changePage(e) {
    'use strict';
    switch ($(e.target).attr('id')) {
    case 'voting':
        var id = localStorage.getItem('contest-id-client');
        if (id) {
            startPeer(id);
        } else {
            $.mobile.changePage('#home');
        }
        break;
    }
}

function vote() {
    'use strict';
    conn.send($('#questions input:radio:checked').serializeArray());
    $('input[type=radio]').checkboxradio('disable');
    $('button').button().button('disable');
}

function start() {
    'use strict';
    localStorage.setItem('contest-id-client', $('#contest-name').val());
    $.mobile.changePage('#voting');
}

function init() {
    'use strict';
    $(document).on('pageshow', changePage);
    $('#start-peer').click(start);
    $('#vote').click(vote);
}

$(document).ready(init);
