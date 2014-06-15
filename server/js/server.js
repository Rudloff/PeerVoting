/*global $, questions, Peer*/
/*jslint browser: true*/
var peer;
var judges = [];

function getVote(vote) {
    console.log(vote);
}

function addQuestion(i, question) {
    var html = '<li>' + question.label + '</li>'
    $('#votes').append(html).listview().listview('refresh').trigger('create');
}

function newJudge(conn) {
    'use strict';
    console.log(judges, conn.id, $.inArray(conn.id, judges));
    judges.push(conn.id);
    $('#judges').text(judges.length + ' judges connected');
    conn.on('open', function () {
        conn.send(questions);
    });
    conn.on('data', getVote);
}

function connected() {
    'use strict';
    $('#judges').text('0 judges connected');
    peer.on('connection', newJudge);
    $.mobile.loading('hide');
}

function startPeer(id) {
    'use strict';
    $.mobile.loading('show');
    peer = new Peer(id + '-contest', {key: options.peerjsKey});
    peer.on('open', connected);
}

function changePage(e) {
    'use strict';
    switch ($(e.target).attr('id')) {
    case 'results':
        var id = localStorage.getItem('contest-id-server');
        if (id) {
            startPeer(id);
        } else {
            $.mobile.changePage('#home');
        }
        break;
    }
}

function start() {
    'use strict';
    localStorage.setItem('contest-id-server', $('#contest-name').val());
    $.mobile.changePage('#results');
}

function init() {
    'use strict';
    $(document).on('pageshow', changePage);
    $('#start-peer').click(start);
    $.each(questions, addQuestion);
}

$(document).ready(init);
