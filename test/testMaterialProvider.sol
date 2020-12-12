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

    /////Test if unique hash is actually unique
    
     function testgetUniqueHash() public {
        bytes32 returnedHash = provider.getUniqueHash(materialAddress,1, 2, 3, 4, 5);
        Assert.equal(returnedHash, expectedHash, "We get the right unique command hash");  
     }

    ////Test that the material list count actually increase by one


    function testcreateMaterials() public {        
        uint resultingCount = provider.createMaterials(materialAddress,1, 2, 3, 4, 5);
        Assert.equal(resultingCount, expectedCount, "One Command is added to the list");
    }

         ////Test to check a commant with a submitted Material list has a value "True"
    function testgetBool() public {
        uint resultingCount = provider.createMaterials(materialAddress,1, 2, 3, 4, 5);
        bool returnedBool = provider.getBool(materialAddress,1, 2, 3, 4, 5);        
        Assert.equal(returnedBool, true, "getBool Function does not return the expected value");   
    }



}