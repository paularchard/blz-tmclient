#!/usr/bin/node

//import axios from 'axios'
//import moxios from 'moxios'
//import sinon from 'sinon'

const { axios } = require('axios');
const { moxios } = require('moxios');
const { bluzelle } = require('bluzelle');

const gas_params = {'gas_price': '0.01'};

var app_endpoint = "http://localhost:1317";
const app_service = "/crud";
const tx_command = "txs";

describe('testing api', () =>
{
    beforeEach(() =>
    {
        moxios.install(http)
    });
    afterEach(() =>
    {
        moxios.uninstall(http)
    });

    it('test get', async () =>
    {
        var bz = await bluzelle({
            address: 'cosmos1zuxcvpkxlzf37dh4k95e2rujmy9sxqvxhaj5pn',
            mnemonic: 'desert maple evoke popular trumpet beach primary decline visit enhance dish drink excite setup public forward ladder girl end genre symbol alter category choose',
            endpoint: "http://localhost:1317",
            chain_id: "bluzelle"
        });


        const expectedPosts = ['Post1', 'Post2'];

        moxios.stubRequest((`${app_endpoint}${app_service}/read/cosmos1zuxcvpkxlzf37dh4k95e2rujmy9sxqvxhaj5pn/mykey`),
            {
                status: 200,
                responseText: '{"key" : "mykey", "value" " : "myvalue"}'
            });

        // moxio.wait(function()
        // {
        //
        // });

        const res = await bz.quickread("mykey");
        expect(res).toEqual("myvalue");
    });
});
