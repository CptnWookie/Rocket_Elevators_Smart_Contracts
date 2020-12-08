pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Materials.sol";

contract TestMaterials {

 Materials materials = Materials(DeployedAddresses.Materials());

     struct Command{
        address commandId;
        uint nbOfElevators;
        uint nbOfColumns;
        string quality;
        string creation_date;
    }

 address expectedAddress = address(this);

 Command testCommand = Command({
     commandId:123456,
      nbOfElevators:2,
      nbOfColumns:2,
      quality:"Premium",
      creation_date:"Today"
      });

 function testCreateMaterialList() public {
  address returnedAddress = materials.createMaterialList(testCommand);

  Assert.equal(returnedAddress, expectedAddress, "Address of the expected command should match what is returned.");
}

}
