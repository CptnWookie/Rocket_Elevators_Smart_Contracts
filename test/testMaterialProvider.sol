pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;
//SPDX-License-Identifier: MIT
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MaterialProvider.sol";

contract TestMaterialProvider {


    address materialAddress = address(this);
    MaterialProvider provider = MaterialProvider(DeployedAddresses.MaterialProvider());




    bytes32 expectedHash = keccak256(abi.encode(materialAddress,1, 2, 3, 4, 5));
    uint expectedCount = 1;
    
     function testgetUniqueHash() public {
        bytes32 returnedHash = provider.getUniqueHash(materialAddress,1, 2, 3, 4, 5);
        Assert.equal(returnedHash, expectedHash, "We get the right unique command hash");  
     }

    function testcreateMaterials() public {        
        uint resultingCount = provider.createMaterials(materialAddress,1, 2, 3, 4, 5);
        Assert.equal(resultingCount, expectedCount, "One Command is added to the list");
    }


}