// Copyright (C) 2018 Bluzelle
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License, version 3,
// as published by the Free Software Foundation.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.


const WebSocket = require('isomorphic-ws');
const assert = require('assert');
const bluzelle_pb = require('../proto/bluzelle_pb');
const database_pb = require('../proto/database_pb');
const status_pb = require('../proto/status_pb');


module.exports = class Connection {

    constructor({entry, log, onIncomingMsg}) {

        this.connection = new WebSocket(entry);

        this.connection.binaryType = 'arraybuffer';

        this.log = log;
        this.onIncomingMsg = onIncomingMsg;


        this.connection.onmessage = bin => {

            const actual_bin = Buffer.from(bin.data);

            this.log && logIncoming(actual_bin);

            this.onIncomingMsg(actual_bin);
                


            // // If it's a database response, then go deserialize it and go through the whole layer system.
            // const bzn_envelope = bluzelle_pb.bzn_envelope.deserializeBinary(new Uint8Array(actual_bin));

            // assert(bzn_envelope.hasDatabaseResponse() || bzn_envelope.hasStatusRequest(),
            //     "Daemon sent a non-database_response and non-status_request.");
            
            // if(bzn_envelope.hasDatabaseResponse()) {

            //     this.log && logIncoming(actual_bin);


            //     this.onIncomingMsg(
            //         database_pb.database_response.deserializeBinary(bzn_envelope.getDatabaseResponse()));
                

            // // Something completely different for status messages. They have to bypass the whole layered system.
            // } else {

            //     this.onIncomingStatusRequest(
            //         status_pb.status_response.deserializeBinary(bzn_envelope.getStatusRequest()));

            // }


        };

    }

    sendOutgoingMsg(bin) {
        
        if(this.connection.readyState === 1) {

            this.log && logOutgoing(bin);
            this.connection.send(bin);

        } else {

            this.onIncomingMsg(connection_closed_error_response(bin));

        }

    }

};


const connection_closed_error_response = bin => {

    const bzn_envelope = bluzelle_pb.bzn_envelope.deserializeBinary(bin);

    assert(bzn_envelope.getPayloadCase() === bluzelle_pb.bzn_envelope.PayloadCase.DATABASE_MSG);


    const bzn_envelope_payload = bzn_envelope.getDatabaseMsg();
    
    const database_msg = database_pb.database_msg.deserializeBinary(bzn_envelope_payload);
    
    const header = database_msg.getHeader();

    
    const response = new database_pb.database_response();

    response.setHeader(header);

    const error = new database_pb.database_error();
    error.setMessage("CONNECTION NOT OPEN");

    response.setError(error);


    return response;

};


const logIncoming = bin => {

    const bzn_envelope = bluzelle_pb.bzn_envelope.deserializeBinary(new Uint8Array(bin));

    assert(bzn_envelope instanceof bluzelle_pb.bzn_envelope);

    assert(bzn_envelope.hasDatabaseResponse());


    const database_response = database_pb.database_response.deserializeBinary(bzn_envelope.getDatabaseResponse());

    assert(database_response instanceof database_pb.database_response);

    console.log('Incoming\n', filterUndefined(database_response.toObject()));

};


const logOutgoing = bin => {

    const bzn_envelope = bluzelle_pb.bzn_envelope.deserializeBinary(bin);

    assert(bzn_envelope instanceof bluzelle_pb.bzn_envelope);

    assert(bzn_envelope.hasDatabaseMsg());


    const database_msg = database_pb.database_msg.deserializeBinary(bzn_envelope.getDatabaseMsg());

    assert(database_msg instanceof database_pb.database_msg);

    console.log('Outgoing\n', filterUndefined(database_msg.toObject()));

};


const filterUndefined = obj => {

    const out = {};

    Object.keys(obj).
        filter(key => obj[key] !== undefined).
        forEach(key => out[key] = obj[key]);

    return out;

};