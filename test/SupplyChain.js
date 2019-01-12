const SupplyChain = artifacts.require('SupplyChain');

const STATE = {
    HARVESTED:          0,
    GRAPPES_SHIPPED:    1,
    PROCESSED:          2,
    AGED:               3,
    BOTTLED:            4,
    BOXED:              5,
    FOR_SALE:           6,
    SOLD:               7,
    SHIPPED:            8,
    RECEIVED:           9,
    PURCHASED:          10
};

contract(SupplyChain, accounts => {
    const defaultAccount = accounts[0];
    const farmer = accounts[1];
    const cooperative = accounts[2];
    const distributor = accounts[3];
    const retailer = accounts[4];
    const consumer = accounts[5];

    const upc = 2;
    const originFarmerID = farmer;
    const originFarmName = 'My farm';
    const originFarmInformation = 'A farm somewhere';
    const originFarmLatitude = '-8';
    const originFarmLongitude = '39';
    const productNotes = 'Good grappes';

    beforeEach(async () => {
        this.contract = await SupplyChain.new({from: defaultAccount});
        await this.contract.addFarmer(farmer);
        await this.contract.addCooperative(cooperative);
        await this.contract.addDistributor(distributor);
        await this.contract.addRetailer(retailer);
        await this.contract.addConsumer(consumer);
    });

    describe('can manage the supply chain', () => {
        beforeEach(async () => {
            await this.contract.harvestItem(
                upc,
                originFarmerID,
                originFarmName,
                originFarmInformation,
                originFarmLatitude,
                originFarmLongitude,
                productNotes,
                {from: farmer}
            );
        });

        it('farmer can harvest a new item', async () => {
            const bufferOneResult = await this.contract.fetchItemBufferOne.call(upc);
            const bufferTwoResult = await this.contract.fetchItemBufferTwo.call(upc);
            const item = Object.assign(bufferOneResult, bufferTwoResult);

            assert.equal(1, item.itemSKU.toNumber());
            assert.equal(upc, item.itemUPC.toNumber());
            assert.equal(originFarmerID, item.originFarmerID);
            assert.equal(originFarmName, item.originFarmName);
            assert.equal(originFarmInformation, item.originFarmInformation);
            assert.equal(originFarmLatitude, item.originFarmLatitude);
            assert.equal(originFarmLongitude, item.originFarmLongitude);
            assert.equal(productNotes, item.productNotes);
            assert.equal(STATE.HARVESTED, item.itemState);
        });

        it('farmer can ship the grappes', async () => {
            await this.contract.shipGrappesItem(upc, cooperative, {from: farmer});
            const item = await this.contract.fetchItemBufferTwo.call(upc);
            assert.equal(STATE.GRAPPES_SHIPPED, item.itemState);
            assert.equal(cooperative, item.cooperativeID);
        });

        it('cooperative can process grappes', async () => {
            // farmer ships the grappes
            await this.contract.shipGrappesItem(upc, cooperative, {from: farmer});
            await this.contract.processItem(upc, {from: cooperative});
            const item = await this.contract.fetchItemBufferTwo.call(upc);
            assert.equal(STATE.PROCESSED, item.itemState);
        })
    });
});