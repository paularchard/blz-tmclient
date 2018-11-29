const assert = require('assert');
const { verify, sign, pub_from_priv } = require('./ecdsa_secp256k1');
const database_pb = require('../proto/database_pb');
const bluzelle_pb = require('../proto/bluzelle_pb');


module.exports = class Crypto {

    constructor({private_pem, onIncomingMsg, onOutgoingMsg}) {

        this.private_pem = private_pem;
        this.onIncomingMsg = onIncomingMsg;
        this.onOutgoingMsg = onOutgoingMsg;

    }


    sendOutgoingMsg(msg) {

        assert(msg instanceof database_pb.database_msg,
            "Sent message not an instance of database_msg.");


        const bin = msg.serializeBinary();

        const bzn_envelope = new bluzelle_pb.bzn_envelope();

        bzn_envelope.setSender(pub_from_priv(this.private_pem));
        bzn_envelope.setSignature(sign(bin, this.private_pem));
        bzn_envelope.setTimestamp(new Date().getTime());

        bzn_envelope.setDatabaseMsg(bin);

        const ultimate_bin = bzn_envelope.serializeBinary();

        this.onOutgoingMsg(ultimate_bin);

    }


    sendIncomingMsg(msg) {

        // If the connection layer sends an error, skip this layer.

        if(msg instanceof database_pb.database_msg) {
            this.onIncomingMsg(msg);
        }


        assert(msg instanceof Buffer,
            "Msg not an instance of Buffer.");


        // Verification not implemented


        const bzn_envelope = bluzelle_pb.bzn_envelope.deserializeBinary(bin);

        assert(bzn_envelope.getPayloadCase() === bzn_envelope.PayloadCase.DATABASE_RESPONSE,
            "Daemon sent a non-database_response.");


        const bzn_envelope_payload = bzn_envelope.getDatabaseResponse();
        
        const database_msg = database_pb.database_msg.deserializeBinary(bzn_envelope_payload);
        
        this.onIncomingMsg(database_msg);

    }

};