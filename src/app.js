class App {
    constructor() {
        this._contract = null;
        this._userManagement = null;
        this._itemManagement = null;
        this._init();
    }

    async _init() {
        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
                // Request account access if needed
                await ethereum.enable();
                // Acccounts now exposed

            } catch (error) {
                // User denied account access...
            }
        } else if (window.web3) {
            window.web3 = new Web3(web3.currentProvider);
        } else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }

        // The default (top) wallet account from a list of test accounts
        web3.eth.defaultAccount = web3.eth.accounts[0];

        // The interface definition for your smart contract (the ABI)
        var Supply = web3.eth.contract(
            [
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_upc",
                            "type": "uint256"
                        },
                        {
                            "name": "price",
                            "type": "uint256"
                        }
                    ],
                    "name": "putForSaleItem",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x11120f65"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "addConsumer",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x112940f9"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "_upc",
                            "type": "uint256"
                        }
                    ],
                    "name": "returnHistoryTwo",
                    "outputs": [
                        {
                            "name": "",
                            "type": "string"
                        },
                        {
                            "name": "",
                            "type": "string"
                        },
                        {
                            "name": "",
                            "type": "string"
                        },
                        {
                            "name": "",
                            "type": "string"
                        },
                        {
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0x16dc7cad"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_upc",
                            "type": "uint256"
                        }
                    ],
                    "name": "boxItem",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x1c7842aa"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_upc",
                            "type": "uint256"
                        },
                        {
                            "name": "cooperative",
                            "type": "address"
                        }
                    ],
                    "name": "shipGrappesItem",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x24c966aa"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_upc",
                            "type": "uint256"
                        }
                    ],
                    "name": "ageItem",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x3c59ed15"
                },
                {
                    "constant": false,
                    "inputs": [],
                    "name": "kill",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x41c0e1b5"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_upc",
                            "type": "uint256"
                        }
                    ],
                    "name": "processItem",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x49dae766"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "isRetailer",
                    "outputs": [
                        {
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0x5da09b88"
                },
                {
                    "constant": false,
                    "inputs": [],
                    "name": "renounceConsumer",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x61e6982d"
                },
                {
                    "constant": false,
                    "inputs": [],
                    "name": "renounceDistributor",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x644241db"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "_upc",
                            "type": "uint256"
                        }
                    ],
                    "name": "fetchItemBufferTwo",
                    "outputs": [
                        {
                            "name": "itemSKU",
                            "type": "uint256"
                        },
                        {
                            "name": "itemUPC",
                            "type": "uint256"
                        },
                        {
                            "name": "productID",
                            "type": "uint256"
                        },
                        {
                            "name": "productNotes",
                            "type": "string"
                        },
                        {
                            "name": "productPrice",
                            "type": "uint256"
                        },
                        {
                            "name": "itemState",
                            "type": "uint256"
                        },
                        {
                            "name": "cooperativeID",
                            "type": "address"
                        },
                        {
                            "name": "distributorID",
                            "type": "address"
                        },
                        {
                            "name": "retailerID",
                            "type": "address"
                        },
                        {
                            "name": "consumerID",
                            "type": "address"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0x66225ff9"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "addDistributor",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x7250e224"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "_upc",
                            "type": "uint256"
                        }
                    ],
                    "name": "returnHistoryOne",
                    "outputs": [
                        {
                            "name": "",
                            "type": "string"
                        },
                        {
                            "name": "",
                            "type": "string"
                        },
                        {
                            "name": "",
                            "type": "string"
                        },
                        {
                            "name": "",
                            "type": "string"
                        },
                        {
                            "name": "",
                            "type": "string"
                        },
                        {
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0x75cf624b"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "_upc",
                            "type": "uint256"
                        }
                    ],
                    "name": "fetchItemBufferOne",
                    "outputs": [
                        {
                            "name": "itemSKU",
                            "type": "uint256"
                        },
                        {
                            "name": "itemUPC",
                            "type": "uint256"
                        },
                        {
                            "name": "ownerID",
                            "type": "address"
                        },
                        {
                            "name": "originFarmerID",
                            "type": "address"
                        },
                        {
                            "name": "originFarmName",
                            "type": "string"
                        },
                        {
                            "name": "originFarmInformation",
                            "type": "string"
                        },
                        {
                            "name": "originFarmLatitude",
                            "type": "string"
                        },
                        {
                            "name": "originFarmLongitude",
                            "type": "string"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0x77c45913"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_upc",
                            "type": "uint256"
                        },
                        {
                            "name": "_txHash",
                            "type": "string"
                        }
                    ],
                    "name": "addToHistory",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x7e723286"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "addFarmer",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x80c3f96d"
                },
                {
                    "constant": false,
                    "inputs": [],
                    "name": "renounceFarmer",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x80fc0ce4"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "isConsumer",
                    "outputs": [
                        {
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0x834ff739"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "addRetailer",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x8ec4f505"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "isDistributor",
                    "outputs": [
                        {
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0x8f0c86fa"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "isCooperative",
                    "outputs": [
                        {
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0xa3fac137"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_upc",
                            "type": "uint256"
                        },
                        {
                            "name": "_price",
                            "type": "uint256"
                        }
                    ],
                    "name": "receiveItem",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0xb50f60e7"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_upc",
                            "type": "uint256"
                        }
                    ],
                    "name": "bottleItem",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0xb585a6b1"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "isFarmer",
                    "outputs": [
                        {
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0xb9429069"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_upc",
                            "type": "uint256"
                        },
                        {
                            "name": "retailer",
                            "type": "address"
                        }
                    ],
                    "name": "shipItem",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0xbb4f288d"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_upc",
                            "type": "uint256"
                        },
                        {
                            "name": "_originFarmerID",
                            "type": "address"
                        },
                        {
                            "name": "_originFarmName",
                            "type": "string"
                        },
                        {
                            "name": "_originFarmInformation",
                            "type": "string"
                        },
                        {
                            "name": "_originFarmLatitude",
                            "type": "string"
                        },
                        {
                            "name": "_originFarmLongitude",
                            "type": "string"
                        },
                        {
                            "name": "_productNotes",
                            "type": "string"
                        }
                    ],
                    "name": "harvestItem",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0xbdd8a6a8"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_upc",
                            "type": "uint256"
                        }
                    ],
                    "name": "purchaseItem",
                    "outputs": [],
                    "payable": true,
                    "stateMutability": "payable",
                    "type": "function",
                    "signature": "0xd38ea5bf"
                },
                {
                    "constant": false,
                    "inputs": [],
                    "name": "renounceRetailer",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0xdb0e6a2f"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_upc",
                            "type": "uint256"
                        }
                    ],
                    "name": "buyItem",
                    "outputs": [],
                    "payable": true,
                    "stateMutability": "payable",
                    "type": "function",
                    "signature": "0xe7fb74c7"
                },
                {
                    "constant": false,
                    "inputs": [],
                    "name": "renounceCooperative",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0xeb34ce8c"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "addCooperative",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0xebeab3f9"
                },
                {
                    "inputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "constructor",
                    "signature": "constructor"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "name": "oldOwner",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "TransferOwnership",
                    "type": "event",
                    "signature": "0x5c486528ec3e3f0ea91181cff8116f02bfa350e03b8b6f12e00765adbb5af85c"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "name": "upc",
                            "type": "uint256"
                        }
                    ],
                    "name": "Harvested",
                    "type": "event",
                    "signature": "0x8e55ccfc9778ff8eba1646d765cf1982537ce0f9257054a17b48aad745250183"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "name": "upc",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "name": "cooperative",
                            "type": "address"
                        }
                    ],
                    "name": "GrappesShipped",
                    "type": "event",
                    "signature": "0xf4159b4f73b8c23626f19f8bc04d7e074c3d93ddc12f8b174e50d3acdb021187"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "name": "upc",
                            "type": "uint256"
                        }
                    ],
                    "name": "Processed",
                    "type": "event",
                    "signature": "0x5afe3b1bf87069693c075da5c22a98d63d1aef98a30dbbe538d0781a98b77ee5"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "name": "upc",
                            "type": "uint256"
                        }
                    ],
                    "name": "Aged",
                    "type": "event",
                    "signature": "0xfa795f995e12c074777bab440425afc98477f6cfceceba5ca50feae5089e59ce"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "name": "upc",
                            "type": "uint256"
                        }
                    ],
                    "name": "Bottled",
                    "type": "event",
                    "signature": "0x8aff1823bf9f30e2f7eacb17de47cc2917592a34188a0b47c0c228c82c38fc54"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "name": "upc",
                            "type": "uint256"
                        }
                    ],
                    "name": "Boxed",
                    "type": "event",
                    "signature": "0xe70f42326e85c2ed7f23dfdb2408f440dc9abcb0a9bc37b6e26803ed4690254a"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "name": "upc",
                            "type": "uint256"
                        }
                    ],
                    "name": "ForSale",
                    "type": "event",
                    "signature": "0xa96ae0fc3224ebd79eebfe54bd130cc9cb94416cddd1f2386115e00b72532468"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "name": "upc",
                            "type": "uint256"
                        }
                    ],
                    "name": "Sold",
                    "type": "event",
                    "signature": "0x92f64ca637d023f354075a4be751b169c1a8a9ccb6d33cdd0cb3520543995727"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "name": "upc",
                            "type": "uint256"
                        }
                    ],
                    "name": "Shipped",
                    "type": "event",
                    "signature": "0xf00b9a5725b80c54016f42114f6ed7792d22eecb116011c4afac29c57bef6c95"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "name": "upc",
                            "type": "uint256"
                        }
                    ],
                    "name": "Received",
                    "type": "event",
                    "signature": "0xa8142743f8f70a4c26f3691cf4ed59718381fb2f18070ec52be1f1022d855557"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "name": "upc",
                            "type": "uint256"
                        }
                    ],
                    "name": "Purchased",
                    "type": "event",
                    "signature": "0x653d56639fee6b566a5c804764e9689de38645f0b733df89a36a1b7b42173dd8"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "ConsumerAdded",
                    "type": "event",
                    "signature": "0x28b26e7a3d20aedbc5f8f2ebf7da671c0491723a2b78f47a097b0e46dee07142"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "ConsumerRemoved",
                    "type": "event",
                    "signature": "0xe3f5ed5f263f1f01764a96edfc7d025f511ec5f7d180e8816908b78bcf74f098"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "RetailerAdded",
                    "type": "event",
                    "signature": "0x71ae26cad02663e3d92efd6ec56031a80d74a20c0ab4183faa8bf262261c9baa"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "RetailerRemoved",
                    "type": "event",
                    "signature": "0xdb7176e79cffef81cb01767dd0447a0b24bb72ca9778d4b245581086b2a7e6db"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "DistributorAdded",
                    "type": "event",
                    "signature": "0xddbf200aa634dc3fb81cfd68583dd1040d1c751d335e1d86b631bde3e977fea8"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "DistributorRemoved",
                    "type": "event",
                    "signature": "0x126174f6cf49c81cdb4a9214c6b8f037bef55b4ec31e4fc776cea2a1c8a88d59"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "CooperativeAdded",
                    "type": "event",
                    "signature": "0x579ad2dcd69a75f5a0fe24102090ff11fdcb275fb63aaa7c529bb4d256cd3e1e"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "CooperativeRemoved",
                    "type": "event",
                    "signature": "0x09fe829558b6a955c7a2f9663311fb4100ff2614b140d4bd4ac01764b5a2f6c9"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "FarmerAdded",
                    "type": "event",
                    "signature": "0x2e0ded4123377a3c2bc9a26f1717655a129e2f20752924d42e730ec89c83dbd0"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "FarmerRemoved",
                    "type": "event",
                    "signature": "0xa5e0f060af304ab17dd418c7927e3da3ae7868189bf387aee09ab179ccc572f2"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "contractOwner",
                    "outputs": [
                        {
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0xce606ee0"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "isOwner",
                    "outputs": [
                        {
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0x8f32d59b"
                },
                {
                    "constant": false,
                    "inputs": [],
                    "name": "renounceOwnership",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x715018a6"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "transferOwnership",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0xf2fde38b"
                }
            ]
        );
        // Grab the contract at specified deployed address with the interface defined by the ABI
        this._contract = Supply.at('0x96dc23D4cAf00f371036F7c5EF5f0F395b154701');

        const defaultAddress = web3.eth.defaultAccount;
        this._userManagement = new UserManagement(this._contract, defaultAddress);
        this._itemManagement = new ItemManagement(this._contract, defaultAddress);
    }
}

window.addEventListener('load', () => {
    const app = new App();
});
