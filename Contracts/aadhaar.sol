pragma solidity ^0.4.11;
contract aadhaar
{
    address[10] public all_addresses;//always specify the number
    mapping(address => bytes32) public pass;
    
  struct use_pair
  {
      address user_address;
      address auth_address;
      bytes32 auth_name;
      bytes32 purpose;
      uint timestamp;
      uint block_number;
  }
  
  mapping(address => uint[10]) public my_serials;
 mapping(address => uint) public my_list_count;
  mapping(uint => use_pair) public user_pairs;
  mapping(address => bytes32) public identify_auth;
  uint public serial_no;
   function aadhaar(address[10] _all_addresses) {
       all_addresses=_all_addresses;
       serial_no=0;
      
      
       
       
   }
   
   function create_auth(bytes32 _auth_name,bytes32 _pass) {
       //set restriction on accounts such that they can't be both users and authority
       //we use account restriction mechanism to ensure that user and authority not share the
       //the same account. First 5 or 10 a/c for authority..testing purpose
       identify_auth[msg.sender]=_auth_name;
       pass[msg.sender]=_pass;
      
   }
   function ret_ac() returns (address,address,address) {
       return (all_addresses[5],all_addresses[6],all_addresses[7]);
   }
   function ret_details() returns(bytes32,bytes32) {
       return (pass[all_addresses[5]],pass[all_addresses[6]]);
   }
   function create_user() {
       // 5 user accounts are created.
       for(uint i=5;i<10;i++)
       pass[all_addresses[i]]="user";
   }
   
   
   function use_aadhaar(address _user_address,bytes32 _purpose,bytes32 _pass) {
       require(pass[msg.sender]==_pass);
       serial_no++;
       //need to check valid authority and valid user_pair
       //as timestamp is already recorded no back date entry possible
       my_list_count[_user_address]++;
       my_serials[_user_address][my_list_count[_user_address]-1]=serial_no;    
       user_pairs[serial_no].user_address=_user_address;
       user_pairs[serial_no].auth_address=msg.sender;
       user_pairs[serial_no].purpose=_purpose;
       user_pairs[serial_no].auth_name=identify_auth[msg.sender];
       user_pairs[serial_no].block_number=block.number;
       user_pairs[serial_no].timestamp=block.timestamp;
   }
   
  function get_my_serials(address _user_address,bytes32 _pass) returns(uint[10],uint) {
         require(pass[_user_address]==_pass); 
      
          return (my_serials[_user_address],my_list_count[_user_address]);
      
  }
  function return_trans(uint _serial_no) returns (address,bytes32,bytes32,uint,uint)
  {  //we can add require here too for password verification
      return (user_pairs[_serial_no].auth_address,user_pairs[_serial_no].auth_name,user_pairs[_serial_no].purpose,user_pairs[_serial_no].block_number,user_pairs[_serial_no].timestamp);
  }
  
   
}