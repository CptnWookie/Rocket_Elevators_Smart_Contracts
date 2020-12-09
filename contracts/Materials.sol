// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.8.0;
pragma experimental ABIEncoderV2;
import "./ProjectOffice.sol";


contract MaterialProvider {

    struct Materials{
        address materialId;
        uint64 aluminiumBars;
        uint64 stainlessSteelSheets;
        uint64 bumperRubberBands;
        uint64 interiorLightBulbs;
        uint64 displaylEDs;
        uint64 springs;
        uint256 creation_date;
    }

    Materials[] materials;
    uint public materialListCount;

     function createMaterials( uint controllers, uint shafts, uint doors, uint buttons, uint dislays ) public returns (uint){

        
         uint64 aluminiumBars = shafts*4;
         uint64 stainlessSteel = shafts*6 + doors*2;
         uint64 rubber = doors*2;
         uint64 lightBulbs = shafts*4;
         uint64 lEDs = buttons + displays + controllers;
         uint64 springs = doors*2;
         uint256 creation_date = block.timestamp;
        
         Materials memory new_material = Materials(msg.sender, aluminiumBars, stainlessSteel, rubber, lightBulbs, lEDs, springs, creation_date);

        materials.push(new_material);
        materialListCount++;

        return  materialListCount;
         }
     }

  //  function getMaterialList() public view returns (Materials[] memory ){
      //  return materials;
    //}
}