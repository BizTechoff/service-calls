import { config } from "dotenv"
import { Remult } from "remult"
import { User } from "../app/users/user"
export class MessageType {
  static Empty = new MessageType()
  constructor(public caption = '') { }
  id!: string
}
export interface message {
  type: MessageType,
  text: string
}
config()

// This Function inserts a key-value pair {"hello":"world"} in the message and publishes 
// it to a new channel: ‘hello_universe’
// For testing: you can use the following test payload: {"foo":"bar"}

// Below is the code with inline explanations

// Declare the Function with the export syntax. The incoming message is called request
export default (request:any) => {

  // Require console module to display variables for troubleshooting
  var console = require("console");
  var pubnub = require("pubnub");

  try {
    // Add to the message a key ‘hello’ with the value ‘world’
    request.message.hello = "world";
    // Remove the existing key ‘foo’ and its value in the message
    delete request.message.send;

    // This is where it differs from the Before Publish or Fire. Since it’s an After Publish or Fire, we need 
    // to publish the mutated message to a channel. In this example, we choose the channel "hello_universe".

    var forwardingMessage = JSON.parse(JSON.stringify(request.message));
    pubnub.publish({ channel: "admin", message: forwardingMessage });

    // The result is a promise resolution for the message request.
    return Promise.resolve(request);
  }
  catch (e) {
    // Handle error
    console.error("Uncaught exception:", e);
  }
  return Promise.resolve('error');
};

export const pubnub_server = async (
  uid = '',
  message: message = { type: MessageType.Empty, text: '' },
  remult?: Remult) => {

  if (!message) {
    message = { type: MessageType.Empty, text: '' }
  }
  if (!message.type) {
    message.type = MessageType.Empty
  }
  if (!message.text) {
    message.text = 'no-text'
  }
  if (!uid) {
    uid = remult!.user.id
  }

  let exists = await remult!.repo(User).findId(uid)
  if (!exists) {
    message.text = 'no-exists-uid'
    // return message
  }

  let auth = {
    publishKey: process.env['PUBNUB_PUBLISH_KEY'],
    subscribeKey: process.env['PUBNUM_SUBSCRIBE_KEY'],
    uuid: uid
    // secretKey: 'mySecretKey'
  }

  // const pubnubRef = new  PubNub(auth)

  // pubnub.addListener({
  //   message: function (m) {
  //     // handle messages
  //   },
  //   presence: function (p) {
  //     // handle presence  
  //   },
  //   signal: function (s) {
  //     // handle signals
  //   },
  //   objects: (objectEvent) => {
  //     // handle objects
  //   },
  //   messageAction: function (ma) {
  //     // handle message actions
  //   },
  //   file: function (event) {
  //     // handle files  
  //   },
  //   status: function (s) {
  //     // handle status  
  //   },
  // });

  // var publishPayload = {
  //   channel: remult?.user.pubnub,
  //   message: {
  //     title: message.type?.caption,
  //     description: message.text
  //   }
  // }

  // pubnub.publish(publishPayload, function (status, response) {
  //   console.log(status, response);
  // })

  // pubnub.subscribe({
  //   channels: ["hello_world"]
  // });

}
