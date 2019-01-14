class ItemManagement {
    constructor(contract, defaultAddress) {
        this._contract = contract;
        this._defaultAddress = defaultAddress;
        this._options = {
            0: {
                funcName: 'harvestItem',
                inputs: [0, 1, 2, 3, 4, 5]
            },
            1: {
                funcName: 'shipGrappesItem',
                inputs: [0, 6]
            },
            2: {
                funcName: 'processItem',
                inputs: [0]
            },
            3: {
                funcName: 'ageItem',
                inputs: [0]
            },
            4: {
                funcName: 'bottleItem',
                inputs: [0]
            },
            5: {
                funcName: 'boxItem',
                inputs: [0]
            },
            6: {
                funcName: 'putForSaleItem',
                inputs: [0, 7]
            },
            7: {
                funcName: 'buyItem',
                inputs: [0]
            },
            8: {
                funcName: 'shipItem',
                inputs: [0, 6]
            },
            9: {
                funcName: 'receiveItem',
                inputs: [0, 7]
            },
            10: {
                funcName: 'purchaseItem',
                inputs: [0]
            },
        };
        this._optionSelected = 0;
        this._init();
    }

    _btnClick(event) {
        console.log('oi');
    }

    _selectChange(event) {
        this._optionSelected = this._select.value;

        const sel = this._options[this._optionSelected];
    }

    _addListener() {
        this._select.addEventListener('change', this._selectChange.bind(this));
        this._btn.addEventListener('click', this._btnClick.bind(this));
    }

    _getDOMReferences() {
        this._inputs = {
            0: document.getElementsByName('item-management-upc')[0],
            1: document.getElementsByName('item-management-farm-name')[0],
            2: document.getElementsByName('item-management-farm-info')[0],
            3: document.getElementsByName('item-management-latitude')[0],
            4: document.getElementsByName('item-management-longitude')[0],
            5: document.getElementsByName('item-management-product-notes')[0],
            6: document.getElementsByName('item-management-new-owner')[0],
            7: document.getElementsByName('item-management-price')[0],
        };
        this._select = document.getElementsByName('item-management-select')[0];
        this._btn = document.getElementsByName('item-management-btn')[0];

        // this._contract.harvestItem(124, this._defaultAddress, "My farm", "This is a farm", "12", "13", "Good grappes", {from: this._defaultAddress}, (err, response) => {
        //     console.log(err, response);
        // })
    }

    _init() {
        this._getDOMReferences();
        this._addListener();
    }
}