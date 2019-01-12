const Farmer = artifacts.require('FarmerRole');

contract(Farmer, accounts => {

    const defaultAccount = accounts[0];
    const testFarmer = accounts[1];
    const anotherTestFarmer = accounts[2];
    const hacker = accounts[3];

    beforeEach(async () => {
        this.contract = await Farmer.new({from: defaultAccount});
    });

    describe('can manage farmer role', () => {
        beforeEach(async () => {
            await this.contract.addFarmer(testFarmer);
        });

        it('can add a new farmer', async () => {
            const farmerAdded = await this.contract.isFarmer(testFarmer);
            assert.equal(farmerAdded, true);
        });

        it('farmer can renounce to role', async () => {
            await this.contract.renounceFarmer({from: testFarmer});
            const farmerExists = await this.contract.isFarmer(testFarmer);
            assert.equal(farmerExists, false);
        });

        it('a farmer can attribute role to other account', async () => {
            await this.contract.addFarmer(anotherTestFarmer, {from: testFarmer});
            const farmerAdded = await this.contract.isFarmer(anotherTestFarmer);
            assert.equal(farmerAdded, true);
        });

        it('a user without farmer role cant attribute farmer role to another user', async () => {
            try {
                await this.contract.addFarmer(anotherTestFarmer, {from: hacker});
                assert(false);
            } catch (error) {
                assert.ok(error);
            }
        });
    });
});
