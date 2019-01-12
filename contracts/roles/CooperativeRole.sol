pragma solidity >=0.4.21 <0.6.0;

import './Roles.sol';

contract CooperativeRole {
    using Roles for Roles.Role;

    event CooperativeAdded(address indexed account);
    event CooperativeRemoved(address indexed account);

    Roles.Role private cooperatives;

    constructor() public {
        _addCooperative(msg.sender);
    }

    modifier onlyCooperative() {
        require(isCooperative(msg.sender));
        _;
    }

    function isCooperative(address account) public view returns (bool) {
        return cooperatives.has(account);
    }

    function addCooperative(address account) public onlyCooperative {
        _addCooperative(account);
    }

    function renounceCooperative() public {
        _removeCooperative(msg.sender);
    }

    function _addCooperative(address account) internal {
        cooperatives.add(account);
        emit CooperativeAdded(account);
    }

    function _removeCooperative(address account) internal {
        cooperatives.remove(account);
        emit CooperativeRemoved(account);
    }
}
