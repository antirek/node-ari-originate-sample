const client = require('ari-client');
const uuid = require('uuid/v4');

const url = "http://localhost:8088";
const [username, password] = ["test", "test"];

let ari, channel1_Id, channel2_Id;


const createChannel = function (onStasisStart) {
    const channel = ari.Channel();
    
    channel.on('StasisStart', onStasisStart);

    channel.on('ChannelDtmfReceived', (event, channel) => {
      console.log('channel dtmf received', event);
    });

    return channel;
}

const onStasisStart1 = (event, channel) => {
  console.log('stasis start 1', event);
  channel1_Id = event.channel.id;

  const channel2 = createChannel(onStasisStart2);

  channel2.originate({
    endpoint: 'SIP/102',
    app: 'app',
  }, (err, channel) => {
    console.log('originate channel2', channel);
  });
}

const onStasisStart2 = (event, channel) => {
  console.log('stasis start 2', event);

  channel2_Id = event.channel.id;
  
  console.log('bridge ids', channel1_Id, channel2_Id);

  const bridge = ari.Bridge();

  bridge.create()
      .then((bridge) => {
          console.log('bridge', bridge);
          bridge.addChannel({channel: channel1_Id});
          bridge.addChannel({channel: channel2_Id});
      })
 
}


async function main()
{
  try {
    ari = await client.connect(url, username, password);

    ari.start('app');

    let channel1 = createChannel(onStasisStart1);
  
    await channel1.originate({
      endpoint: 'SIP/101',
      app: 'app',
    });
  } catch (e) {
    console.log('err:', err);
  }
}

main();