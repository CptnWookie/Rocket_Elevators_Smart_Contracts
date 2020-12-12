pragma solidity >=0.5.0 <0.8.0;
pragma experimental ABIEncoderV2;
//import "./ProjectOffice.sol";
// SPDX-License-Identifier: MIT



contract MaterialProvider {

    address project;

    ////////Define a list of material for a given command

    struct Materials{
        address materialId;
        bytes32 commandId;
        uint aluminiumBars;
        uint stainlessSteelSheets;
        uint bumperRubberBands;
        uint interiorLightBulbs;
        uint displaylEDs;
        uint springs;
        uint256 creation_date;
    }

    mapping(uint => Materials) public materials;

    ///When a Material List is submitted fro a given command, we associate the commandAddress to the value "true", which
        //tells us that the command was created (A mapping return "false" by default, so any mappping from a commandAddress
        // that is not yet created will return "false"). THis is just a check so that each command has a unique Material list.
    mapping (bytes32 => bool) public addresses;

    constructor(address homies) public {
        project = homies;
    }

    ////Indexing the various material lists

    uint public materialListCount = 0;



    ///////////Various getters//////////
        /////////////WE had to make two getMaterial method, since solidity has a maximum number of returned values
        /////Also, it doesnt return struct, hence why we return the attributes has an array.
        function getMaterials1(uint index) public view returns (bytes32, uint, uint, uint ){

            require(materials[index].materialId != address(0), "List of material doesn't exist");
            return (materials[index].commandId, materials[index].aluminiumBars, materials[index].stainlessSteelSheets,materials[index].bumperRubberBands);
        }

        function getMaterials2(uint index) public view returns (uint, uint, uint, uint256){

            require(materials[index].materialId != address(0), "List of material doesn't exist");
            return (materials[index].interiorLightBulbs, materials[index].displaylEDs, materials[index].springs, materials[index].creation_date);
        }

        function getBool(address index, uint64 controllers, uint64 shafts, uint64 doors, uint64 buttons, uint64 displays) public view returns (bool){
            bytes32 commandId = getUniqueHash(index, controllers, shafts, doors, buttons, displays);
            return addresses[commandId];

        }

        function getAddress() public view returns (address){
            return msg.sender;
        }
//////This gives a unique hash to a material list, so that it is easily identifiable////////////

        function getUniqueHash(address index, uint64 controllers, uint64 shafts, uint64 doors, uint64 buttons, uint64 displays) public pure returns (bytes32){
            return keccak256(abi.encode(index,controllers, shafts, doors, buttons, displays));
        }

///////Create list of material from a command and add it to mapping

     function createMaterials( address index, uint64 controllers, uint64 shafts, uint64 doors, uint64 buttons, uint64 displays ) public returns (uint){

                
        Materials memory new_material;

        ///////This is used to give a unique hash to a given command. Since it depend on all of it'sa attribute,
        //////Any change in the comman change the hash, thus making it unique to that command/////////////

        bytes32 commandId = getUniqueHash(index, controllers, shafts, doors, buttons, displays);

        new_material.materialId = msg.sender;
        new_material.commandId = commandId;
        new_material.aluminiumBars = shafts*4;
        new_material.stainlessSteelSheets = shafts*6 + doors*2;
        new_material.bumperRubberBands = doors*2;
        new_material.interiorLightBulbs = shafts*4;
        new_material.displaylEDs = buttons + displays + controllers;
        new_material.springs = doors*2;
        new_material.creation_date = block.timestamp;
            
        materialListCount++;
        materials[materialListCount] = new_material;

        ////THis is used to check if a command already submitted a material list////////////////
        addresses[commandId] = true;

        return  materialListCount;
         }


}