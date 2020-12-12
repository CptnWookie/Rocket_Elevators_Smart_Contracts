pragma solidity >=0.5.0 <0.8.0;
pragma experimental ABIEncoderV2;
//SPDX-License-Identifier: MIT


/////////////MOST OF THE CODE HERE COME FROM ALIMOURA'S CONTRACT, WE JUST ADDED  A FEW THING, LIKE THE CONSTRUCTOR/////////
contract ProjectOffice {

    address requester;

    struct Components {
        address componentId;
        uint64 Controllers;
        uint64 Shafts;
        uint64 Doors;
        uint64 Buttons;
        uint64 Displays;
    }

    Components[] components;

    uint public componentsCount = 0;

    function getComponents(uint index) public view returns (address, uint64, uint64, uint64, uint64, uint64){
        return (components[index].componentId, components[index].Controllers, components[index].Shafts,components[index].Doors,components[index].Buttons, components[index].Displays);
    }

    function getComponentsCount() public view returns (uint){
        return componentsCount;
    }

    constructor(address request) public {

        Components memory m;
        Components memory n;
        Components memory x;

        m.componentId = request;
        m.Shafts = 1;
        m.Controllers = 2;
        m.Doors = 3;
        m.Buttons = 4;
        m.Displays = 5;

        n.componentId = request;
        n.Shafts = 5;
        n.Controllers = 4;
        n.Doors = 3;
        n.Buttons = 2;
        n.Displays = 1;

        x.componentId = request;
        x.Shafts = 2;
        x.Controllers = 4;
        x.Doors = 1;
        x.Buttons = 5;
        x.Displays = 3;


        componentsCount++;
        componentsCount++;
        componentsCount++;
        
        components.push(m);
        components.push(n);
        components.push(x);

        requester = request;
    }

    function addComponents(uint64 Batteries, uint64 Columns, uint64 Elevators, uint64 Floors) public
    {
        Components memory m;
        m.componentId = msg.sender;
        m.Shafts = Elevators;
        m.Controllers = Batteries;
        m.Doors = (Elevators * 2) + (Floors * 2);
        m.Buttons = (Elevators * 8) + (Columns * 16);
        m.Displays = Elevators;

        componentsCount++;
        components.push(m);


    }
}