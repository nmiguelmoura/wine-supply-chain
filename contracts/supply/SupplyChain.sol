pragma solidity >=0.4.21 <0.6.0;

import '../roles/FarmerRole.sol';
import '../roles/CooperativeRole.sol';
import '../roles/DistributorRole.sol';
import '../roles/RetailerRole.sol';
import '../roles/ConsumerRole.sol';

// Define a contract 'Supplychain'
contract SupplyChain is FarmerRole, CooperativeRole, DistributorRole, RetailerRole, ConsumerRole {

    // Define 'owner'
    address payable owner;

    // Define a variable called 'upc' for Universal Product Code (UPC)
    uint  upc;

    // Define a variable called 'sku' for Stock Keeping Unit (SKU)
    uint sku;

    // Define a public mapping 'items' that maps the UPC to an Item.
    mapping(uint => Item) items;

    // Define a public mapping 'itemsHistory' that maps the UPC to an array of TxHash,
    // that track its journey through the supply chain -- to be sent from DApp.
    mapping(uint => string[]) itemsHistory;

    // Define enum 'State' with the following values:
    enum State
    {
        Harvested, // 0
        GrappesShipped, // 1
        Processed, // 2
        Aged, // 3
        Bottled, // 4
        Boxed, // 5
        ForSale, // 6
        Sold, // 7
        Shipped, // 8
        Received, // 9
        Purchased // 10
    }

    State constant defaultState = State.Harvested;

    // Define a struct 'Item' with the following fields:
    struct Item {
        uint sku;  // Stock Keeping Unit (SKU)
        uint upc; // Universal Product Code (UPC), generated by the Farmer, goes on the package, can be verified by the Consumer
        address ownerID;  // Metamask-Ethereum address of the current owner as the product moves through 8 stages
        address originFarmerID; // Metamask-Ethereum address of the Farmer
        string originFarmName; // Farmer Name
        string originFarmInformation;  // Farmer Information
        string originFarmLatitude; // Farm Latitude
        string originFarmLongitude;  // Farm Longitude
        uint productID;  // Product ID potentially a combination of upc + sku
        string productNotes; // Product Notes
        uint productPrice; // Product Price
        State itemState;  // Product State as represented in the enum above
        address cooperativeID; // Metamask-Ethereum address of the Cooperative
        address distributorID;  // Metamask-Ethereum address of the Distributor
        address retailerID; // Metamask-Ethereum address of the Retailer
        address consumerID; // Metamask-Ethereum address of the Consumer
    }

    // Define 8 events with the same 8 state values and accept 'upc' as input argument
    event Harvested(uint upc);
    event GrappesShipped(uint upc, address cooperative);
    event Processed(uint upc);
    event Aged(uint upc);
    event Bottled(uint upc);
    event Boxed(uint upc);
    event ForSale(uint upc);
    event Sold(uint upc);
    event Shipped(uint upc);
    event Received(uint upc);
    event Purchased(uint upc);

    // Define a modifer that checks to see if msg.sender == owner of the contract
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyItemOwner(uint _upc) {
        Item memory item = items[_upc];
        require(msg.sender == item.ownerID);
        _;
    }

    // Define a modifer that verifies the Caller
    modifier verifyCaller (address _address) {
        require(msg.sender == _address);
        _;
    }

    // Define a modifier that checks if the paid amount is sufficient to cover the price
    modifier paidEnough(uint _price) {
        require(msg.value >= _price);
        _;
    }

    // Define a modifier that checks the price and refunds the remaining balance
    modifier checkValue(uint _upc) {
        _;
        uint _price = items[_upc].productPrice;
        uint amountToReturn = msg.value - _price;
        //items[_upc].consumerID.transfer(amountToReturn);
    }

    // Define a modifier that checks if an item.state of a upc is Harvested
    modifier harvested(uint _upc) {
        require(items[_upc].itemState == State.Harvested);
        _;
    }

    // Define a modifier that checks if an item.state of a upc is GrappesShipped
    modifier grappesShipped(uint _upc) {
        require(items[_upc].itemState == State.GrappesShipped);
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Processed
    modifier processed(uint _upc) {
        require(items[_upc].itemState == State.Processed);
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Aged
    modifier aged(uint _upc) {
        require(items[_upc].itemState == State.Aged);
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Bottled
    modifier bottled(uint _upc) {
        require(items[_upc].itemState == State.Bottled);
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Boxed
    modifier boxed(uint _upc) {
        require(items[_upc].itemState == State.Boxed);
        _;
    }

    // Define a modifier that checks if an item.state of a upc is ForSale
    modifier forSale(uint _upc) {
        require(items[_upc].itemState == State.ForSale);
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Sold
    modifier sold(uint _upc) {
        require(items[_upc].itemState == State.Sold);
        _;
    }

    // Define a mgodifier that checks if an item.state of a upc is Shipped
    modifier shipped(uint _upc) {
        require(items[_upc].itemState == State.Shipped);
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Received
    modifier received(uint _upc) {
        require(items[_upc].itemState == State.Received);
        _;
    }

    // Define a modifierc that checks if an item.state of a upc is Purchased
    modifier purchased(uint _upc) {
        require(items[_upc].itemState == State.Purchased);
        _;
    }

    // In the constructor set 'owner' to the address that instantiated the contract
    // and set 'sku' to 1
    // and set 'upc' to 1
    constructor() public payable {
        owner = msg.sender;
        sku = 1;
        upc = 1;
    }

    // Define a function 'kill' if required
    function kill() public {
        if (msg.sender == owner) {
            selfdestruct(owner);
        }
    }

    // Define a function 'harvestItem' that allows a farmer to mark an item 'Harvested'
    function harvestItem(uint _upc, address _originFarmerID, string memory _originFarmName, string memory _originFarmInformation, string memory _originFarmLatitude, string memory _originFarmLongitude, string memory _productNotes) onlyFarmer public
    {
        // Add the new item as part of Harvest
        Item memory item = Item({
            sku : sku,
            upc : _upc,
            ownerID : _originFarmerID,
            originFarmerID : _originFarmerID,
            originFarmName : _originFarmName,
            originFarmInformation : _originFarmInformation,
            originFarmLatitude : _originFarmLatitude,
            originFarmLongitude : _originFarmLongitude,
            productPrice : 0,
            productID : sku + _upc,
            productNotes : _productNotes,
            itemState : defaultState,
            cooperativeID : address(0),
            distributorID : address(0),
            retailerID : address(0),
            consumerID : address(0)
            });

        items[_upc] = item;

        // Increment sku
        sku = sku + 1;

        // Set upc to match _upc
        upc = _upc;

        // Emit the appropriate event
        emit Harvested(_upc);
    }

    function shipGrappesItem(uint _upc, address cooperative) harvested(_upc) onlyItemOwner(_upc) onlyFarmer public {
        // Update the appropriate fields
        Item memory item = items[_upc];
        item.itemState = State.GrappesShipped;
        item.ownerID = cooperative;
        item.cooperativeID = cooperative;
        items[_upc] = item;

        // Emit the appropriate event
        emit GrappesShipped(_upc, cooperative);
    }

    // Define a function 'processtItem' that allows a farmer to mark an item 'Processed'
    function processItem(uint _upc) grappesShipped(_upc) onlyItemOwner(_upc) onlyCooperative public {
        // Update the appropriate fields
        Item memory item = items[_upc];
        item.itemState = State.Processed;
        items[_upc] = item;

        // Emit the appropriate event
        emit Processed(_upc);
    }

    // Define a function 'packItem' that allows a farmer to mark an item 'Packed'
    function packItem(uint _upc) public
        // Call modifier to check if upc has passed previous supply chain stage

        // Call modifier to verify caller of this function

    {
        // Update the appropriate fields

        // Emit the appropriate event

    }

    // Define a function 'sellItem' that allows a farmer to mark an item 'ForSale'
    function sellItem(uint _upc, uint _price) public
        // Call modifier to check if upc has passed previous supply chain stage

        // Call modifier to verify caller of this function

    {
        // Update the appropriate fields

        // Emit the appropriate event

    }

    // Define a function 'buyItem' that allows the disributor to mark an item 'Sold'
    // Use the above defined modifiers to check if the item is available for sale, if the buyer has paid enough,
    // and any excess ether sent is refunded back to the buyer
    function buyItem(uint _upc) public payable
        // Call modifier to check if upc has passed previous supply chain stage

        // Call modifer to check if buyer has paid enough

        // Call modifer to send any excess ether back to buyer

    {

        // Update the appropriate fields - ownerID, distributorID, itemState

        // Transfer money to farmer

        // emit the appropriate event

    }

    // Define a function 'shipItem' that allows the distributor to mark an item 'Shipped'
    // Use the above modifers to check if the item is sold
    function shipItem(uint _upc) public
        // Call modifier to check if upc has passed previous supply chain stage

        // Call modifier to verify caller of this function

    {
        // Update the appropriate fields

        // Emit the appropriate event

    }

    // Define a function 'receiveItem' that allows the retailer to mark an item 'Received'
    // Use the above modifiers to check if the item is shipped
    function receiveItem(uint _upc) public
        // Call modifier to check if upc has passed previous supply chain stage

        // Access Control List enforced by calling Smart Contract / DApp
    {
        // Update the appropriate fields - ownerID, retailerID, itemState

        // Emit the appropriate event

    }

    // Define a function 'purchaseItem' that allows the consumer to mark an item 'Purchased'
    // Use the above modifiers to check if the item is received
    function purchaseItem(uint _upc) public
        // Call modifier to check if upc has passed previous supply chain stage

        // Access Control List enforced by calling Smart Contract / DApp
    {
        // Update the appropriate fields - ownerID, consumerID, itemState

        // Emit the appropriate event

    }

    // Define a function 'fetchItemBufferOne' that fetches the data
    function fetchItemBufferOne(uint _upc) public view returns
    (
        uint itemSKU,
        uint itemUPC,
        address ownerID,
        address originFarmerID,
        string memory originFarmName,
        string memory originFarmInformation,
        string memory originFarmLatitude,
        string memory originFarmLongitude
    )
    {
        // Assign values to the 8 parameters
        Item memory item = items[_upc];

        return
        (
        item.sku,
        item.upc,
        item.ownerID,
        item.originFarmerID,
        item.originFarmName,
        item.originFarmInformation,
        item.originFarmLatitude,
        item.originFarmLongitude
        );
    }

    // Define a function 'fetchItemBufferTwo' that fetches the data
    function fetchItemBufferTwo(uint _upc) public view returns
    (
        uint itemSKU,
        uint itemUPC,
        uint productID,
        string memory productNotes,
        uint productPrice,
        uint itemState,
        address cooperativeID,
        address distributorID,
        address retailerID,
        address consumerID
    )
    {
        // Assign values to the 9 parameters
        Item memory item = items[_upc];

        return
        (
        item.sku,
        item.upc,
        item.productID,
        item.productNotes,
        item.productPrice,
        uint(item.itemState),
        item.cooperativeID,
        item.distributorID,
        item.retailerID,
        item.consumerID
        );
    }
}
