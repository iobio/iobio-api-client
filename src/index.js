import { request } from 'xhr-stream-dl';


class Command {
  constructor(name, args, server, options) {

    this._server = server;

    this._callbacks = {
      'data': null,
      'end': null,
      'error': null,
      'queue': null,
      'exit': null,
    };

    this.pipeline = [
      [name, args, options]
    ];
  }

  pipe(name, args, options) {

    const other = new Command(name, args, this._server, options);

    this.pipeline = this.pipeline.concat(other.pipeline);

    return this;
  }

  on(eventName, callback) {
    if (this._callbacks[eventName] !== undefined) {
      this._callbacks[eventName] = callback;
    }
    else {
      const valid = Object.keys(this._callbacks).join(', ');
      throw new Error(`Invalid event name "${eventName}". Valid options are [${valid}]`);
    }
  }

  off(eventName) {
    delete this._callbacks[eventName];
  }

  run() {
    const pipeline = JSON.stringify(this.pipeline);
    //const paramStr = encodeParams(params);
    const query = encodeURI(this._server + "/call?pipeline=" + pipeline);
    console.log(query);
    this._stream = request(query);

    this._stream.onData(this._callbacks['data']);
    this._stream.onEnd(this._callbacks['end']);
    this._stream.onError(this._callbacks['error']);
  }
}


class Api {

  constructor(server) {
    this.cmd = Command;
    this._server = 'http://' + server;
  }

  call(name, args, options) {
    return new Command(name, args, this._server, options);
  }

  //call(endpoint, params) {
  //  const paramStr = encodeParams(params);
  //  const query = encodeURI(this._server + "/" + endpoint + paramStr);
  //  const stream = request(query);
  //  return stream;
  //}
}

//function encodeParams(obj) {
//
//  const keys = Object.keys(obj);
//
//  const params = Object.keys(obj).map((key, i) => {
//    let sep = '&';
//    if (i === 0) {
//      sep = '?';
//    }
//
//    // TODO: might need this
//    //let value = encodeURIComponent(String(obj[key]));
//    const value = String(obj[key]);
//
//    return sep + key + '=' + value;
//  });
//
//  return params.join('');
//}

export {
  Api,
};
