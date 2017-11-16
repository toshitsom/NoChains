pragma solidity ^0.4.11;
contract isa_portal
{
    struct trans
    {
        address asset_ac;
        address user_ac;
        bytes32 asset_name;
        bytes32 mode;
        bytes32 description;
    }
    mapping(uint => trans) public  trans_mapping;
    mapping(address => bytes32) public asset_mapping;
    
    uint public serial_no;
    address public default_ac;
    address[] public all_users;
    function isa_portal(address[] user_addresses)
    {
        all_users=user_addresses;
        default_ac=msg.sender;
        serial_no=0;
    } 
    function add_trans(address _asset_ac,bytes32 _mode,bytes32 _description) {
        // We also have to check that msg.sender is a legitimate user.
        if((_asset_ac==msg.sender)&&(_mode=="update"))
        {
        serial_no++;
        trans_mapping[serial_no].asset_ac=_asset_ac;
        trans_mapping[serial_no].user_ac=msg.sender;
        trans_mapping[serial_no].asset_name=asset_mapping[_asset_ac];
        trans_mapping[serial_no].mode=_mode;
        trans_mapping[serial_no].description=_description;
    }
    else
    if((_asset_ac!=msg.sender)&&(_mode=="complain"))
    {
        serial_no++;
        trans_mapping[serial_no].asset_ac=_asset_ac;
        trans_mapping[serial_no].user_ac=msg.sender;
        trans_mapping[serial_no].asset_name=asset_mapping[_asset_ac];
        trans_mapping[serial_no].mode=_mode;
        trans_mapping[serial_no].description=_description;
    }
    else
    return;
    }
    function create_asset(bytes32 _asset_name) {
        asset_mapping[msg.sender]=_asset_name;
    }
    function count_serial() returns (uint)
    {
        return serial_no;
    }
    function get_trans(uint _serial_no) returns(address,address,bytes32,bytes32,bytes32)
    {
        return (trans_mapping[_serial_no].asset_ac,trans_mapping[_serial_no].user_ac,trans_mapping[_serial_no].asset_name,trans_mapping[_serial_no].mode,trans_mapping[_serial_no].description);
    }
}
