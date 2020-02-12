#!/usr/bin/node

import axios from 'axios'
import moxios from 'moxios'
//import sinon from 'sinon'

// const axios = require('axios');
// const moxios = require('moxios');

const { bluzelle } = require('../lib/bluzelle-node');

const gas_params = {'gas_price': '0.01'};

var app_endpoint = "http://localhost:1317";
const app_service = "/crud";
const tx_command = "txs";

describe('testing api', () =>
{
    beforeEach(() =>
    {
        moxios.install();
    });
    afterEach(() =>
    {
        moxios.uninstall();
    });

    it('test get', () =>
    {
        bluzelle({
            address: 'cosmos1zuxcvpkxlzf37dh4k95e2rujmy9sxqvxhaj5pn',
            mnemonic: 'desert maple evoke popular trumpet beach primary decline visit enhance dish drink excite setup public forward ladder girl end genre symbol alter category choose',
            endpoint: "http://localhost:1317",
            chain_id: "bluzelle"
        }).then(function(bz)
        {
    //        moxios.stubRequest((`${app_endpoint}/auth/accounts/cosmos1zuxcvpkxlzf37dh4k95e2rujmy9sxqvxhaj5pn`),
    //         moxios.stubRequest(('.*/auth/accounts/.*'),
    //         {
    //             status: 200,
    //             responseText: '{"key" : "mykey", "value" " : "myvalue"}'
    //         });

    //        moxios.stubRequest((`${app_endpoint}${app_service}/read/cosmos1zuxcvpkxlzf37dh4k95e2rujmy9sxqvxhaj5pn/mykey`),
    //         moxios.stubRequest(('.*/read/.*'),
    //             {
    //                 status: 200,
    //                 responseText: '{"key" : "mykey", "value" " : "myvalue"}'
    //             });

            bz.quickread("mykey").then(function(res)
            {
                expect(res).toEqual("myvalue");
            });

            done();
        });

    });
});
