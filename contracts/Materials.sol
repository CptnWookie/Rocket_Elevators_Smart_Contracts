// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.8.0;
pragma experimental ABIEncoderV2;

contract Materials {
    struct Command{
        address commandId;
        uint nbOfElevators;
        uint nbOfColumns;
        string quality;
        string creation_date;
    }

    struct Material{
        address materialId;
        uint aluminiumBars;
        uint stainlessSteelSheets;
        uint bumperRubberBands;
        uint interiorLightBulbs;
        uint displaylEDs;
        uint springs;
        uint256 creation_date;
    }

    Material[] materials;
    uint materialListCount;

    function createMaterialList(Command memory command) public returns (address){

        require(command.commandId != address(0), "Command doesn't exists.");

        uint aluminiumBars = command.nbOfElevators*10;
        uint stainlessSteel = command.nbOfColumns*6;
        uint rubber = command.nbOfElevators*2;
        uint lightBulbs = command.nbOfElevators*4;
        uint lEDs = command.nbOfColumns*4;
        uint springs = command.nbOfElevators*1;
        uint256 creation_date = block.timestamp;
        
        Material memory new_material = Material(msg.sender, aluminiumBars, stainlessSteel, rubber, lightBulbs, lEDs, springs, creation_date);

        materials.push(new_material);
        materialListCount++;

        return new_material.materialId;
    }

    function getMaterialList() public view returns (Material[] memory ){

        return materials;
    }
}
