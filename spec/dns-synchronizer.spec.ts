import { configurations, DNSSynchronizer, info, error, DNSRecord, DNSSync } from "../src";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10*1000;

let synchronizer = new DNSSynchronizer(configurations.dns[0]);
describe( `dns-synchronizer tests`, () => {
    it(`check-ip test`, (done) => {
        synchronizer.checkIp()
        .then(record => {
            expect(record).toBeDefined(`record returned is not defined`)
            expect( /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/i.test(record.ip) ).toBeTruthy(`ip address ${record.ip} is in the wrong format`)
            done();
        })
        .catch( fault => {
            error(fault);
            done();
        })
    });

});