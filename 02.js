const client = require('ari-client');

const url = "http://localhost:8088";
const [username, password] = ["test", "test"];

async function main()
{
  try {
    const ari = await client.connect(url, username, password);

    ari.start('app');

    const channel = ari.Channel();
    channel.on('StasisStart', (event, channel) => {
      console.log('stasis start', event);

      channel.originate({
        endpoint: 'SIP/102',
        app: 'app',
        appArgs: 'hello, world  '
      });
    });

    channel.on('ChannelDtmfReceived', (event, channel) => {
      console.log('channel dtmf received', event);
    });

    channel.on('StasisStop', (event, channel) => {
      ari.stop();
      console.log('mojn mojn');
    });

    await channel.originate({
      endpoint: 'SIP/101',
      app: 'app',
      appArgs: 'hello,world'
    });
  } catch (e) {
    console.log('err:', err);
  }
}

main();