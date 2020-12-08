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
    uint materialListCount;

    function createMaterials(address ads) public returns (address){

        ProjectOffice.Components[] memory components = ProjectOffice(ads).getComponents(); 

        for( uint i; i< components.length; i++){
        
        uint64 aluminiumBars = components[i].Shafts*4;
        uint64 stainlessSteel = components[i].Shafts*6 + components[i].Doors*2;
        uint64 rubber = components[i].Doors*2;
        uint64 lightBulbs = components[i].Shafts*4;
        uint64 lEDs = components[i].Buttons + components[i].Displays;
        uint64 springs = components[i].Doors*2;
        uint256 creation_date = block.timestamp;
        
        Materials memory new_material = Materials(msg.sender, aluminiumBars, stainlessSteel, rubber, lightBulbs, lEDs, springs, creation_date);

        materials.push(new_material);
        materialListCount++;
        }
    }

    function getMaterialList() public view returns (Materials[] memory ){
        return materials;
    }
}