class UserManagement {
    constructor(contract, defaultAddress) {
        this._contract = contract;
        this._defaultAddress = defaultAddress;
        this._options = {
            0: 'addFarmer',
            1: 'addCooperative',
            2: 'addDistributor',
            3: 'addRetailer',
            4: 'addConsumer'
        };
        this._init();
    }

    _btnClick(event) {
        if(this._input.value) {
            const address = this._input.value;
            const option = this._select.value;
            const func = this._options[option];

            this._contract[func](address, {from: this._defaultAddress}, (err, response) => {
                if(!err) {
                    alert('User added');
                } else {
                    alert(err);
                }
            })
        } else {
            alert('Please fill the form before submit');
        }
    }

    _addListener() {
        this._btn.addEventListener('click', this._btnClick.bind(this));
    }

    _getDOMReferences() {
        this._input = document.getElementsByName('add-user-input')[0];
        this._select = document.getElementsByName('add-user-select')[0];
        this._btn = document.getElementsByName('add-user-btn')[0];
    }

    _init() {
        this._getDOMReferences();
        this._addListener();
    }
}