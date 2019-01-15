class ItemInfo {
    constructor(contract, defaultAddress) {
        this._contract = contract;
        this._defaultAddress = defaultAddress;
        this.STATE = {
            0: 'Harvested',
            1: 'Grappes Shipped',
            2: 'Processed',
            3: 'Aged',
            4: 'Bottled',
            5: 'Boxed',
            6: 'For Sale',
            7: 'Sold',
            8: 'Shipped',
            9: 'Received',
            10: 'Purchased'
        };
        this._init();
    }

    _btnClick(event) {
        if(this._input.value) {
            const self = this;
            const upc = this._input.value;

            this._contract.fetchItemBufferOne(upc, {from: this._defaultAddress}, (err, resp) => {
                if(!err) {
                    self._p[0].innerText = `
                        SKU: ${resp[0].toNumber()}
                        UPC: ${resp[1].toNumber()}
                        Owner ID: ${resp[2]}
                        Farmer ID: ${resp[3]}
                        Farm Name: ${resp[4]}
                        Farm Info: ${resp[5]}
                        Farm latitude: ${resp[6]}
                        Farm longitude: ${resp[7]}
                    `;
                } else {
                    alert(err);
                }
            });

            this._contract.fetchItemBufferTwo(upc, {from: this._defaultAddress}, (err, resp) => {
                if(!err) {
                    self._p[1].innerText = `
                        Product ID: ${resp[2]}
                        Product Notes: ${resp[3]}
                        Product Price: ${web3.fromWei(resp[4].toNumber(), 'ether')} ether
                        Product State: ${this.STATE[resp[5].toNumber()]}
                        Cooperative ID: ${resp[6]}
                        Distributor ID: ${resp[7]}
                        Retailer ID: ${resp[8]}
                        Consumer ID: ${resp[9]}
                    `;
                } else {
                    alert(err);
                }
            });
        } else {
            alert('Please fill the form before submit');
        }
    }

    _addListener() {
        this._btn.addEventListener('click', this._btnClick.bind(this));
    }

    _getDOMReferences() {
        this._input = document.getElementsByName('item-info-input')[0];
        this._btn = document.getElementsByName('item-info-btn')[0];
        this._p = document.getElementsByName('item-info-p');
    }

    _init() {
        this._getDOMReferences();
        this._addListener();
    }
}