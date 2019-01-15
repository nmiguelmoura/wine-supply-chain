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
                inputs: [0, 7]
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
                inputs: [0, 7]
            },
        };
        this._optionSelected = "0";
        this._init();
    }

    _btnClick(event) {
        console.log(this._optionSelected);
        switch(this._optionSelected) {
            case "0":
                this._contract.harvestItem(this._inputs[0].value, this._defaultAddress, this._inputs[1].value, this._inputs[2].value, this._inputs[3].value, this._inputs[4].value, this._inputs[5].value, {from: this._defaultAddress}, (err, response) => {
                    if(err) {
                        alert(err);
                        return;
                    }

                    alert('Transaction successful');
                });
                break;

            case "1":
                this._contract.shipGrappesItem(this._inputs[0].value, this._inputs[6].value, {from: this._defaultAddress}, (err, response) => {
                    if(err) {
                        alert(err);
                        return;
                    }

                    alert('Transaction successful');
                });
                break;

            case "2":
                this._contract.processItem(this._inputs[0].value, {from: this._defaultAddress}, (err, response) => {
                    if(err) {
                        alert(err);
                        return;
                    }

                    alert('Transaction successful');
                });
                break;

            case "3":
                this._contract.ageItem(this._inputs[0].value, {from: this._defaultAddress}, (err, response) => {
                    if(err) {
                        alert(err);
                        return;
                    }

                    alert('Transaction successful');
                });
                break;

            case "4":
                this._contract.bottleItem(this._inputs[0].value, {from: this._defaultAddress}, (err, response) => {
                    if(err) {
                        alert(err);
                        return;
                    }

                    alert('Transaction successful');
                });
                break;

            case "5":
                this._contract.boxItem(this._inputs[0].value, {from: this._defaultAddress}, (err, response) => {
                    if(err) {
                        alert(err);
                        return;
                    }

                    alert('Transaction successful');
                });
                break;

            case "6":
                this._contract.putForSaleItem(this._inputs[0].value, window.web3.toWei(this._inputs[7].value), {from: this._defaultAddress}, (err, response) => {
                    if(err) {
                        alert(err);
                        return;
                    }

                    alert('Transaction successful');
                });
                break;

            case "7":
                this._contract.buyItem(this._inputs[0].value, {from: this._defaultAddress, value: window.web3.toWei(this._inputs[7].value)}, (err, response) => {
                    if(err) {
                        alert(err);
                        return;
                    }

                    alert('Transaction successful');
                });
                break;

            case "8":
                this._contract.shipItem(this._inputs[0].value, this._inputs[6].value, {from: this._defaultAddress}, (err, response) => {
                    if(err) {
                        alert(err);
                        return;
                    }

                    alert('Transaction successful');
                });
                break;

            case "9":
                this._contract.receiveItem(this._inputs[0].value, window.web3.toWei(this._inputs[7].value), {from: this._defaultAddress}, (err, response) => {
                    if(err) {
                        alert(err);
                        return;
                    }

                    alert('Transaction successful');
                });
                break;

            case "10":
                this._contract.purchaseItem(this._inputs[0].value, {from: this._defaultAddress, value: window.web3.toWei(this._inputs[7].value)}, (err, response) => {
                    if(err) {
                        alert(err);
                        return;
                    }

                    alert('Transaction successful');
                });
                break;
        }
    }

    _selectChange(event) {
        this._optionSelected = this._select.value;
        this._changeInputs(this._optionSelected);
    }

    _hideAllInputBoxes() {
        let i;
        for(i = 0; i < 8; i++) {
            this._inputs[i].style.display = 'none';
        }
    }

    _changeInputs(option) {
        this._hideAllInputBoxes();

        const sel = this._options[option];

        let i;
        for(i = 0; i < sel.inputs.length; i++) {
            this._inputs[sel.inputs[i]].style.display = 'block';
        }
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
    }

    _init() {
        this._getDOMReferences();
        this._addListener();
        this._changeInputs(this._optionSelected);
    }
}