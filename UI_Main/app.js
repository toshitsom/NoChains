import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract'
import isa from '../../build/contracts/isa_portal.json'
import myaadhaar from '../../build/contracts/aadhaar.json'
import mypds from '../../build/contracts/tpds.json'
var aadhaar = contract(myaadhaar);
var content = ``;
var isa_portal = contract(isa);
var tpds=contract(mypds);

// AADHAAR
window.get_my_serials = function() {
    var useraddress = $("#_user_address").val();
    var pass = $("#_pass").val();
    console.log(useraddress);
    console.log(pass);
    aadhaar.deployed().then(function(contractInstance) {
        return contractInstance.get_my_serials.call(useraddress, pass.toString(), { from: web3.eth.accounts[0] }).then(function(s) {
            var list = s[1].toString();
            var l = parseInt(list);
            console.log(l);
            var serials = [];
            content = "";
            for (var i = 0; i < l; i++) {
                serials[i] = s[0][i]
                    // alert(serials[i]);
                var serial = parseInt(serials[i]);
                get_to(serial);
            }
        });
    });
}
window.get_to = function(serial) {
    aadhaar.deployed().then(function(contractInstance) {
        return contractInstance.return_trans.call(serial, { gas: 140000, from: web3.eth.accounts[0] }).then(function(a) {
            var auth_name = web3.toAscii(a[1]);
            var purpose = web3.toAscii(a[2]);
            var date = new Date(a[4] * 1000).toString()
            content+=`<div class="col-sm-12">
            <div class="well" style="border:solid">
            <table class="table table-condensed">
            
                            <thead style="background-color:darkgrey">
                                <tr>
                                    <th>Authority Ac</th>
                                    <th>Authority name</th>
                                    <th>Purpose</th>
                                    <th>Block no</th>
                                    <th>Time</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                           <td>${a[0]}</td>
                           <td>${auth_name}</td>
                           <td>${purpose}</td>
                           <td>${a[3]}</td>
                           <td>${date}</td>
                            </tbody>
            
                        </table>
            </div>
            </div>`;
            
            document.getElementById('aboutaadhaar').innerHTML = content;
        });
    });
}
window.use_aadhaar = function() {
    var consumerac = $("#_cac").val();
    var authac = $("#_authac").val();
    var purpose = $("#_purpose").val();
    var authpass=$("#_auth_pass").val();
    
    aadhaar.deployed().then(function(contractInstance) {
        contractInstance.use_aadhaar(consumerac,purpose,authpass,{gas:1500000,from:authac}).then(function(){
            alert("Transaction Successful!");
        });
    });
}

//ISA

window.create_asset = function(_asset_name) {
    var assetname = $("#_asset_name").val();
    //let assetac = $("#assetac").val();
    var _assetac = $("#assetac").val();
    isa_portal.deployed().then(function(contractInstance) {
        contractInstance.create_asset(assetname, { gas: 140000, from: _assetac }).then(function() {
            alert("Asset Created Successfully!");
            document.getElementById("aname").innerHTML = `<input type="text" class="form-control" id="_asset_name">`;
            document.getElementById("aac").innerHTML = `<input type="text" class="form-control" id="assetac">`;
        });
    });
}
window.get_trans = function() {
    var _assetac;
    var _userac;
    var _assetname;
    var _mode;
    var _description;
    isa_portal.deployed().then(function(contractInstance) {
        return contractInstance.count_serial.call({ gas: 140000, from: web3.eth.accounts[0] }).then(function(s) {
            var serialno = s.toString();
            var serial = parseInt(serialno);
            content = ``;
            for (var i = serial; i > 0; i--) {
                get_t(i);
            }
        });
    });
}
window.get_t = function(i) {
    isa_portal.deployed().then(function(contractInstance) {
        return contractInstance.get_trans.call(i, { gas: 140000, from: web3.eth.accounts[0] }).then(function(a) {
            var _assetac = a[0];
            var _userac = a[1];
            var _assetname = web3.toAscii(a[2]);
            var _mode = web3.toAscii(a[3]);
            var _description = web3.toAscii(a[4]);
            content += `
             <div class="col-sm-12">
             <div class="well" style="border:solid">
             <table class="table table-condensed">
             
                             <thead style="background-color:darkgrey">
                                 <tr>
                                     <th>Transaction no.</th>
                                     <th>Asset Ac</th>
                                     <th>User Ac</th>
                                     <th>Asset name</th>
                                     <th>Mode</th>
                                     <th>Desciption</th>
                                     
                                 </tr>
                             </thead>
                             <tbody>
                            <td>${i}</td>
                            <td>${_assetac}</td>
                            <td>${_userac}</td>
                            <td>${_assetname}</td>
                            <td>${_mode}</td>
                            <td>${_description}</td>
                             </tbody>
             
                         </table>
             </div>
             </div>
             `;
            document.getElementById('about').innerHTML = content;
        });
    });
}
window.add_trans = function(_asset_ac, _user_ac, _mode, _description) {
    let assetac = $("#_asset_ac").val();
    let mode = $("#_mode").val();
    let description = $("#_description").val();
    let userac = $("#_user_ac").val();
    console.log(userac);
    isa_portal.deployed().then(function(contractInstance) {
        contractInstance.add_trans(assetac, mode, description, { gas: 150000, from: userac }).then(function() {
            alert("Transaction successful");
            document.getElementById("_asset_ac").innerHTML = `<input type="text" class="form-control" id="_asset_ac">`;
            document.getElementById("_user_ac").innerHTML = `<input type="text" class="form-control" id="_user_ac">`;
            document.getElementById("_description").innerHTML = `<textarea rows="5" type="text" class="form-control" id="_description"></textarea>`;
        });
    });
}

//PDS

window.issue_token=function(_tokenamt,_pdspass){
    var tokenamt=$("#_tokenamt").val();
    var pdspass=$("#_pdspass").val();
    var acno=$("#_acno").val();
    tokenamt=parseInt(tokenamt);
    tpds.deployed().then(function(contractInstance){
        contractInstance.issue_token(tokenamt,pdspass,{gas:1500000,from:acno}).then(function(){
            alert("Transaction Successful!");
        });
    });
}
window.getbal=function(){
    var acno=$("#_ac_no").val();
    tpds.deployed().then(function(contractInstance){
    return contractInstance.get_balance.call({gas:1500000,from:acno}).then(function(bal){
        content=`<div class="well"style="border:solid">
        <h3 id="bal"><strong>Balance:</strong>${bal}</h3>
        <a href="#" onclick="receive_token()" class="btn btn-primary btn-md">Receive</a>
        </div>
        `;
        //document.getElementById("balance").innerHTML=content;
    return contractInstance.get_serial.call({gas:1500000,from:web3.eth.accounts[0]}).then(function(num){
        num=num.toString();
        num=parseInt(num);
       for(var i=num;i>0;i--){
           get_his(i);
       } 
    });    
    });
    });
}
window.receive_token=function(){
    var acno=$("#_ac_no").val();
    content=``;
    tpds.deployed().then(function(contractInstance){
        contractInstance.receive_token({from:acno}).then(function(){
            return contractInstance.get_balance.call({from:acno}).then(function(bal){
                alert("Received successfully!");
            content=`
            <h3 id="bal"><strong>Balance:</strong>${bal}</h3>
            
            `;
            document.getElementById("bal").innerHTML=content; 
            });   
            

        });
    });
}

window.get_his=function(sno){
   tpds.deployed().then(function(contractInstance){
      return contractInstance.get_history.call(sno,{from:web3.eth.accounts[0]}).then(function(h){
        var t = new Date(h[2] * 1000).toString()
        content+=`
        <div class="well" style="border:solid">
        <table class="table table-condensed">
        
                        <thead style="background-color:darkgrey">
                            <tr>
                                <th>Authority Ac</th>
                                <th>Token amt</th>
                                <th>Time</th>
                                <th>Block no</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                       <td>${h[0]}</td>
                       <td>${h[1]}</td>
                       <td>${t}</td>
                       <td>${h[3]}</td>
                        </tbody>
        
                    </table>
        </div>
        `;
    document.getElementById("history").innerHTML=content;
      });
   });
}

window.submit_feedback=function(){
var quality = document.getElementById('_quality').value;
var weight = document.getElementById('_weight').value;
var uac = document.getElementById('useraccount').value;
tpds.deployed().then(function(contractInstance){
contractInstance.submit_feedback(weight,quality,{gas : 1500000,from:uac} ).then(function() {
alert("Feedback Submitted");
});
});
    

}

window.get_feedback=function()
{
    tpds.deployed().then(function(contractInstance){
        return contractInstance.get_feedback.call({from:web3.eth.accounts[0]}).then(function(v){
            
            var weight = v[0].toString();
            var quality = v[1].toString();
            var count = v[2].toString();
            var date = new Date(v[3] * 1000).toString()
        content = `
        <div class="well" style="border:solid">
        <table class="table table-condensed">
        
                        <thead style="background-color:darkgrey">
                            <tr>
                                <th>Weight</th>
                                <th>Quality</th>
                                <th>Count</th>  
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                       <td>${weight}</td>
                       <td>${quality}</td>
                       <td>${count}</td>
                       <td>${date}</td>
                        </tbody>
        
                    </table>
        </div>
        `;
    document.getElementById("pdsportal").innerHTML=content;
    });
});
}

//Default

$(document).ready(function() {
    if (typeof web3 !== 'undefined') {
        console.warn("Using web3 detected from external source like Metamask")
            // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    aadhaar.setProvider(web3.currentProvider);
    isa_portal.setProvider(web3.currentProvider);
    tpds.setProvider(web3.currentProvider);
});



