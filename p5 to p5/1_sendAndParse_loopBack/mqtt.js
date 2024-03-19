// MQTT client:
let mqttClient;

// topic to subscribe to when you connect:
// these variables can also be put in main tab 

// let publishTopic = "somePubTopic"; // when pub/sub are same you loopback data
// let subscribeTopic1 = "sub1";
// let subscribeTopic2 = "sub2";

// MQTT broker location and port (shiftr):
let broker = {
  hostname: URL_FROM_INSTANCE, // socket needs specifc URL
  port: 443 // 443, 1883
};


// MQTT broker login creds
// these should be kept private
let creds = {
  clientID: DEVICE_NAME_IN_QUOTES, // "myDeviceName"
  mqttUser: INSTANCE_OR_USER_NAME, //  "instanceName"
  mqttPW: CHECK_DtwoL_FOR_MQTT_KEY // secret - from token
};


// called from setup
function connectMQTT(){
  //connect to shiftr (mqtt.js)
  createMQTTClientObject();
  createMQTTConnection();
  createMQTTClientCallbacks();
}


// called from setup
function createMQTTClientObject() {
  // Create an MQTT client:
  mqttClient = new Paho.MQTT.Client(
    broker.hostname, // url
    Number(broker.port), // port
    creds.clientID // device name
  );
}


//called from setup
function createMQTTConnection() {
  console.log("connecting shiftr ... ");
  pongConnectionState = 0;
  // connect to the MQTT broker:
  mqttClient.connect({
    onSuccess: onConnect,     // callback function for when you connect
    userName: creds.mqttUser, // username
    password: creds.mqttPW, // password
    useSSL: true, // use SSL - back to true
    onFailure: onFailedConnection
  });

}


function createMQTTClientCallbacks() {
  // set callback handlers for the client:
  mqttClient.onConnectionLost = onConnectionLost;
  mqttClient.onMessageArrived = onMqttMessageArrived;
}

// called if SHIFTR connection fails:
function onFailedConnection(){
  console.log(" !! shiftr failed to connect - \n !! check secrets.js");
}


// called when the client connects
function onConnect() {
  console.log("connected to shiftr @ \n" + broker.hostname ); // you get here when shiftr connection is ok

  // subscribe here :: technically you can subscribe to as many topics as you want
  mqttClient.subscribe(mySubscribeTopic);

  console.log("PUBlishing to:  \n" + myPublishTopic );
  console.log("SUBscribing to: \n" + mySubscribeTopic );

}

// called when the client loses its connection
function onConnectionLost(response) {
  if (response.errorCode !== 0) {
    console.log("onConnectionLost:" + response.errorMessage);
    console.log("shiftr connection lost");
    console.log("will try to reconnect");
  }
}


// MQTT TALK -- called when you want to send a message:
function publishMqttMessage(topic, package) {

  // if the client is connected to the MQTT broker:
  if (mqttClient.isConnected()) {

    package = String(package);
    let publishMessage = new Paho.MQTT.Message(package);
    // choose the destination topic:
    //console.log('topic ' + topic);
    publishMessage.destinationName = topic;
    // send it:
    mqttClient.send(publishMessage);
    // print what you sent:
    //  console.log("sending :: " + publishMessage.payloadString);
  } // end color check
}


// MQTT LISTEN -- called when a message arrives
    // when a message arrives you have to PARES (unpack) it 
    // if you are susbscribed to >1 TOPIC, you must also sort which TOPIC arrived 

function onMqttMessageArrived(message) {

  // PARSE (unpack) the arriving MESSAGE 

  // display the incoming message
  debugIncomingMessage(message);

  // uncomment next to show message TOPIC
  // let theTopic = message.destinationName;

  // unpack the payload - its a string of form [*,data,data,#]
  incomingPayload = message.payloadString;
  scissors.parse(incomingPayload);

  //this is project specific 
  remoteInt     = scissors.getInt(0);
  remoteFloat   = scissors.getFloat(1);
  remoteString  = scissors.getString(2);

  console.log("got:: \n" + remoteInt +"\n"+ remoteFloat +"\n"+ remoteString);

} // end message arrived


// look inside an incoming MQTT message
function debugIncomingMessage(m) {
  // mqtt message (m) is an object with 2 parts :
  //      topic (destination name)
  //      content (payloadString)
  console.log('message received');
  console.log('raw message :: ');
  console.log(m); // look at this in console
  console.log("incoming topic :: " + m.destinationName);
  console.log("incoming payload :: " + m.payloadString);
}
