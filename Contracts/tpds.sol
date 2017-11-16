pragma solidity ^0.4.11;
contract tpds {
    mapping(address => uint) public token_balance;
    mapping(address => uint) public feedback_token;
    struct issue_history
    {
        address auth_ac;
        uint token_amount;
        uint timestamp;
        uint block_number;
    }
    mapping(uint => issue_history) public history;
    uint public serial_no;
    uint public total_count;
    mapping(address => bytes32) public pass;
    struct feedback
    {
        uint weight; //out of five
        uint quality;//out of five
        uint count;
        uint timestamp;
        
    }
    feedback public feedback_instance;
    address[] public all_addresses;
    function tpds(address[] _all_addresses) {
        all_addresses=_all_addresses;
        serial_no=0;
        total_count=8;//total user accounts
    }
    function create_auth(bytes32 _pass) {
        pass[msg.sender]=_pass;
    }
    function issue_token(uint _token_amount,bytes32 _pass) {
        require(pass[msg.sender]==_pass);
        serial_no++;
        uint individual_amount = (_token_amount)/8;
        history[serial_no].auth_ac=msg.sender;
        history[serial_no].token_amount=_token_amount;
        history[serial_no].timestamp=block.timestamp;
        history[serial_no].block_number=block.number;
        for(uint i=2;i<=9;i++)
        {
            token_balance[all_addresses[i]]=0;
            token_balance[all_addresses[i]]=individual_amount;
            feedback_token[all_addresses[i]]=0;
            feedback_token[all_addresses[i]]=1;
        }
    }
    function receive_token() {
        require(token_balance[msg.sender]>0);
        token_balance[msg.sender]=0;
    }
    function submit_feedback(uint _weight,uint _quality) {
           require(feedback_token[msg.sender]>0&&feedback_instance.count<total_count&&token_balance[msg.sender]==0);
                   feedback_token[msg.sender]=0;
                   uint temp= feedback_instance.weight*feedback_instance.count;
                   temp+=_weight;
                   temp=temp/(feedback_instance.count+1);
                   feedback_instance.weight=temp;
                   temp=0;
                   temp=feedback_instance.quality*feedback_instance.count;
                   temp+=_quality;
                   temp=temp/(feedback_instance.count+1);
                   feedback_instance.quality=temp;
                   feedback_instance.timestamp=block.timestamp;
                   feedback_instance.count++;
            }
    function get_serial() returns (uint){
        return serial_no;
    }
    function get_balance() returns (uint) {
        return (token_balance[msg.sender]);
    }
    function get_history(uint _serial_no) returns(address,uint,uint,uint) {
        return (history[_serial_no].auth_ac,history[_serial_no].token_amount,history[_serial_no].timestamp,history[_serial_no].block_number);
    }
    function get_feedback() returns(uint,uint,uint,uint) {
        return (feedback_instance.weight,feedback_instance.quality,feedback_instance.count,feedback_instance.timestamp);
    }
    
}