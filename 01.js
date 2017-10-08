var client = require('ari-client');

var url = "http://localhost:8088";
var username = "test";
var password = "test";

client.connect(url, username, password)
    .then((ari) => {
        var channel = ari.Channel();
        return channel.originate({endpoint: 'SIP/101', extension: "102", context:"internal", priority: "1"});
    })
    .then((channel) => {
        console.log('channel:', channel);
    })
    .catch((err) => {
        console.log('err:', err);
    });