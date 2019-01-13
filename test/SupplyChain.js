const SupplyChain = artifacts.require('Ownable');

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
    const productPrice = web3.utils.toWei("1", "ether");
    const doubleProductPrice = web3.utils.toWei("2", "ether");
    const halfProductPrice = web3.utils.toWei("0.5", "ether");

    const retailerPrice = web3.utils.toWei("2", "ether");
    const doubleRetailerPrice = web3.utils.toWei("4", "ether");
    const halfRetailerPrice = web3.utils.toWei("1", "ether");

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
        });

        it('cooperative can age the wine', async () => {
            // farmer ships the grappes
            await this.contract.shipGrappesItem(upc, cooperative, {from: farmer});
            await this.contract.processItem(upc, {from: cooperative});
            await this.contract.ageItem(upc, {from: cooperative});
            const item = await this.contract.fetchItemBufferTwo.call(upc);
            assert.equal(STATE.AGED, item.itemState);
        });

        it('cooperative can bottle the wine', async () => {
            // farmer ships the grappes
            await this.contract.shipGrappesItem(upc, cooperative, {from: farmer});
            await this.contract.processItem(upc, {from: cooperative});
            await this.contract.ageItem(upc, {from: cooperative});
            await this.contract.bottleItem(upc, {from: cooperative});
            const item = await this.contract.fetchItemBufferTwo.call(upc);
            assert.equal(STATE.BOTTLED, item.itemState);
        });

        it('cooperative can box the wine bottles', async () => {
            // farmer ships the grappes
            await this.contract.shipGrappesItem(upc, cooperative, {from: farmer});
            await this.contract.processItem(upc, {from: cooperative});
            await this.contract.ageItem(upc, {from: cooperative});
            await this.contract.bottleItem(upc, {from: cooperative});
            await this.contract.boxItem(upc, {from: cooperative});
            const item = await this.contract.fetchItemBufferTwo.call(upc);
            assert.equal(STATE.BOXED, item.itemState);
        });

        it('cooperative can put wine boxes for sale at a price', async () => {
            // farmer ships the grappes
            await this.contract.shipGrappesItem(upc, cooperative, {from: farmer});
            await this.contract.processItem(upc, {from: cooperative});
            await this.contract.ageItem(upc, {from: cooperative});
            await this.contract.bottleItem(upc, {from: cooperative});
            await this.contract.boxItem(upc, {from: cooperative});
            await this.contract.putForSaleItem(upc, productPrice, {from: cooperative});
            const item = await this.contract.fetchItemBufferTwo.call(upc);
            assert.equal(STATE.FOR_SALE, item.itemState);
            assert.equal(productPrice, item.productPrice);
        });

        it('distributor can buy wine boxes if paid enough', async () => {
            // farmer ships the grappes
            await this.contract.shipGrappesItem(upc, cooperative, {from: farmer});
            await this.contract.processItem(upc, {from: cooperative});
            await this.contract.ageItem(upc, {from: cooperative});
            await this.contract.bottleItem(upc, {from: cooperative});
            await this.contract.boxItem(upc, {from: cooperative});
            await this.contract.putForSaleItem(upc, productPrice, {from: cooperative});

            const cooperativeInitialBalance = await web3.eth.getBalance(cooperative);
            const distributorInitialBalance = await web3.eth.getBalance(distributor);
            await this.contract.buyItem(upc, {from: distributor, value: productPrice});
            const cooperativeFinalBalance = await web3.eth.getBalance(cooperative);
            const distributorFinalBalance = await web3.eth.getBalance(distributor);
            const cooperativeDiff = cooperativeFinalBalance - cooperativeInitialBalance;
            const distributorDiff = web3.utils.fromWei((distributorInitialBalance - distributorFinalBalance).toString(), 'ether');

            const bufferOneResult = await this.contract.fetchItemBufferOne.call(upc);
            const bufferTwoResult = await this.contract.fetchItemBufferTwo.call(upc);
            const item = Object.assign(bufferOneResult, bufferTwoResult);
            assert.equal(STATE.SOLD, item.itemState);
            assert.equal(distributor, item.ownerID);
            assert.equal(distributor, item.distributorID);
            assert.equal(cooperativeDiff, productPrice);
            assert.ok(distributorDiff < 1.1);
        });

        it('distributor can buy wine boxes and receive change', async () => {
            // farmer ships the grappes
            await this.contract.shipGrappesItem(upc, cooperative, {from: farmer});
            await this.contract.processItem(upc, {from: cooperative});
            await this.contract.ageItem(upc, {from: cooperative});
            await this.contract.bottleItem(upc, {from: cooperative});
            await this.contract.boxItem(upc, {from: cooperative});
            await this.contract.putForSaleItem(upc, productPrice, {from: cooperative});

            const initialBalance = await web3.eth.getBalance(distributor);
            await this.contract.buyItem(upc, {from: distributor, value: doubleProductPrice});
            const finalBalance = await web3.eth.getBalance(distributor);
            const diff = web3.utils.fromWei((initialBalance - finalBalance).toString(), 'ether');

            const bufferOneResult = await this.contract.fetchItemBufferOne.call(upc);
            const bufferTwoResult = await this.contract.fetchItemBufferTwo.call(upc);
            const item = Object.assign(bufferOneResult, bufferTwoResult);
            assert.equal(STATE.SOLD, item.itemState);
            assert.equal(distributor, item.ownerID);
            assert.equal(distributor, item.distributorID);
            assert.ok(diff < 1.1);
        });

        it('distributor cant buy wine boxes if didnt paid enough', async () => {
            try {
                await this.contract.shipGrappesItem(upc, cooperative, {from: farmer});
                await this.contract.processItem(upc, {from: cooperative});
                await this.contract.ageItem(upc, {from: cooperative});
                await this.contract.bottleItem(upc, {from: cooperative});
                await this.contract.boxItem(upc, {from: cooperative});
                await this.contract.putForSaleItem(upc, productPrice, {from: cooperative});
                await this.contract.buyItem(upc, {from: distributor, value: halfProductPrice});
                assert(false);
            } catch (error) {
                const bufferOneResult = await this.contract.fetchItemBufferOne.call(upc);
                const bufferTwoResult = await this.contract.fetchItemBufferTwo.call(upc);
                const item = Object.assign(bufferOneResult, bufferTwoResult);
                assert.equal(STATE.FOR_SALE, item.itemState);
                assert.equal(cooperative, item.ownerID);
                assert.ok(error);
            }
        });

        it('distributor can ship wine boxes to a specified retailer', async () => {
            // farmer ships the grappes
            await this.contract.shipGrappesItem(upc, cooperative, {from: farmer});
            await this.contract.processItem(upc, {from: cooperative});
            await this.contract.ageItem(upc, {from: cooperative});
            await this.contract.bottleItem(upc, {from: cooperative});
            await this.contract.boxItem(upc, {from: cooperative});
            await this.contract.putForSaleItem(upc, productPrice, {from: cooperative});
            await this.contract.buyItem(upc, {from: distributor, value: productPrice});
            await this.contract.shipItem(upc, retailer, {from: distributor});

            const bufferOneResult = await this.contract.fetchItemBufferOne.call(upc);
            const bufferTwoResult = await this.contract.fetchItemBufferTwo.call(upc);
            const item = Object.assign(bufferOneResult, bufferTwoResult);
            assert.equal(STATE.SHIPPED, item.itemState);
            assert.equal(retailer, item.ownerID);
            assert.equal(retailer, item.retailerID);
        });

        it('retailer can set wine as received and set a new price', async () => {
            // farmer ships the grappes
            await this.contract.shipGrappesItem(upc, cooperative, {from: farmer});
            await this.contract.processItem(upc, {from: cooperative});
            await this.contract.ageItem(upc, {from: cooperative});
            await this.contract.bottleItem(upc, {from: cooperative});
            await this.contract.boxItem(upc, {from: cooperative});
            await this.contract.putForSaleItem(upc, productPrice, {from: cooperative});
            await this.contract.buyItem(upc, {from: distributor, value: productPrice});
            await this.contract.shipItem(upc, retailer, {from: distributor});
            await this.contract.receiveItem(upc, retailerPrice, {from: retailer});

            const item = await this.contract.fetchItemBufferTwo.call(upc);
            assert.equal(STATE.RECEIVED, item.itemState);
            assert.equal(retailerPrice, item.productPrice);
        });

        it('consumer can buy wine boxes if paid enough', async () => {
            // farmer ships the grappes
            await this.contract.shipGrappesItem(upc, cooperative, {from: farmer});
            await this.contract.processItem(upc, {from: cooperative});
            await this.contract.ageItem(upc, {from: cooperative});
            await this.contract.bottleItem(upc, {from: cooperative});
            await this.contract.boxItem(upc, {from: cooperative});
            await this.contract.putForSaleItem(upc, productPrice, {from: cooperative});
            await this.contract.buyItem(upc, {from: distributor, value: productPrice});
            await this.contract.shipItem(upc, retailer, {from: distributor});
            await this.contract.receiveItem(upc, retailerPrice, {from: retailer});


            const consumerInitialBalance = await web3.eth.getBalance(consumer);
            const retailerInitialBalance = await web3.eth.getBalance(retailer);
            await this.contract.purchaseItem(upc, {from: consumer, value: retailerPrice});
            const consumerFinalBalance = await web3.eth.getBalance(consumer);
            const retailerFinalBalance = await web3.eth.getBalance(retailer);
            const consumerDiff = web3.utils.fromWei((consumerInitialBalance - consumerFinalBalance).toString(), 'ether');
            const retailerDiff =  retailerFinalBalance - retailerInitialBalance;

            const bufferOneResult = await this.contract.fetchItemBufferOne.call(upc);
            const bufferTwoResult = await this.contract.fetchItemBufferTwo.call(upc);
            const item = Object.assign(bufferOneResult, bufferTwoResult);
            assert.equal(STATE.PURCHASED, item.itemState);
            assert.equal(consumer, item.ownerID);
            assert.equal(consumer, item.consumerID);
            assert.equal(retailerDiff, retailerPrice);
            assert.ok(consumerDiff < 2.1);
        });

        it('consumer can buy wine boxes and receive change', async () => {
            // farmer ships the grappes
            await this.contract.shipGrappesItem(upc, cooperative, {from: farmer});
            await this.contract.processItem(upc, {from: cooperative});
            await this.contract.ageItem(upc, {from: cooperative});
            await this.contract.bottleItem(upc, {from: cooperative});
            await this.contract.boxItem(upc, {from: cooperative});
            await this.contract.putForSaleItem(upc, productPrice, {from: cooperative});
            await this.contract.buyItem(upc, {from: distributor, value: productPrice});
            await this.contract.shipItem(upc, retailer, {from: distributor});
            await this.contract.receiveItem(upc, retailerPrice, {from: retailer});


            const consumerInitialBalance = await web3.eth.getBalance(consumer);
            await this.contract.purchaseItem(upc, {from: consumer, value: doubleRetailerPrice});
            const consumerFinalBalance = await web3.eth.getBalance(consumer);
            const consumerDiff = web3.utils.fromWei((consumerInitialBalance - consumerFinalBalance).toString(), 'ether');

            const bufferOneResult = await this.contract.fetchItemBufferOne.call(upc);
            const bufferTwoResult = await this.contract.fetchItemBufferTwo.call(upc);
            const item = Object.assign(bufferOneResult, bufferTwoResult);
            assert.equal(STATE.PURCHASED, item.itemState);
            assert.equal(consumer, item.ownerID);
            assert.equal(consumer, item.consumerID);
            assert.ok(consumerDiff < 2.1);
        });

        it('consumer cant buy wine boxes if didnt paid enough', async () => {
            // farmer ships the grappes
            try {
                await this.contract.shipGrappesItem(upc, cooperative, {from: farmer});
                await this.contract.processItem(upc, {from: cooperative});
                await this.contract.ageItem(upc, {from: cooperative});
                await this.contract.bottleItem(upc, {from: cooperative});
                await this.contract.boxItem(upc, {from: cooperative});
                await this.contract.putForSaleItem(upc, productPrice, {from: cooperative});
                await this.contract.buyItem(upc, {from: distributor, value: productPrice});
                await this.contract.shipItem(upc, retailer, {from: distributor});
                await this.contract.receiveItem(upc, retailerPrice, {from: retailer});
                await this.contract.purchaseItem(upc, {from: consumer, value: halfRetailerPrice});
                assert(false);
            } catch (error) {
                const bufferOneResult = await this.contract.fetchItemBufferOne.call(upc);
                const bufferTwoResult = await this.contract.fetchItemBufferTwo.call(upc);
                const item = Object.assign(bufferOneResult, bufferTwoResult);

                assert.equal(STATE.RECEIVED, item.itemState);
                assert.equal(retailer, item.ownerID);
                assert.ok(error);
            }
        });
    });
});