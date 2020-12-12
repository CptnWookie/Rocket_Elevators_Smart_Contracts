# Rocket_Elevators_Smart_Contracts

###Material Provider #2


Quick readme! 

-First, to make the app work, you have to run the following commands :

npm install
truffle migrate 
npm run dev

The app is set up to listen to 127.0.0.1:7545. 
-NOTE: that we had problem making Metamask acting properly on IEdge. However, everything work perfect on Google Chrome, so if you have any problem with IEdge, we suggest you switch.

### Material Provider Contract##

-First, we mention that we used Alimouran's ProjectOffice.sol contract to emplement ours. The file is mostly as he gave it to us, except with instantiated three commands in the constructor to have something to play with.

-In tHe MaterialProvider contract is defined a Material struct, which are the various list of Materials, and a mapping from the count of Material List to those structs :

```
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
    uint public materialListCount = 0;
```

-Aside from the various getters, we defined the method getUniqueHash, which takes the input in a given coommand from ProjectOffice and return a hash : this hash uniquely define each Material List, since any change in the command would change the hash :

```
        function getUniqueHash(address index, uint64 controllers, uint64 shafts, uint64 doors, uint64 buttons, uint64 displays) public pure returns (bytes32){
            return keccak256(abi.encode(index,controllers, shafts, doors, buttons, displays));
        }
```

-Finally, the createMaterial create a material list, give it a unique hash, change the count and assign the resulting struct in the mapping.

-Using the first two addresses ganache create for us, we then deploy the two contract as such :

```
  deployer.deploy(ProjectOffice, accounts[1]).then (  (ProjectOffice) => {
	    return deployer.deploy(MaterialProvider, accounts[0]);
  });

```

-Most of the work is then in the src/js/app.js file. Following the pet shop template, we first initialize the web 3 instances, then the initCOntract method initiate the two contracts, one after the other:

```
    $.getJSON('MaterialProvider.json', function(data) {

      var MaterialsArtifact = data;     
      App.contracts.Materials = TruffleContract(MaterialsArtifact);
      App.contracts.Materials.setProvider(App.web3Provider);
  //////Set initial material  lists
      return App.setInitialMaterials();

    }).done( function() {

    $.getJSON('ProjectOffice.json', function(data) {

      var ProjectOfficeArtifact = data;
      App.contracts.ProjectOffice = TruffleContract(ProjectOfficeArtifact);
      App.contracts.ProjectOffice.setProvider(App.web3Provider);
      
      ////////Set initial command list
      return App.setInitialCommands();
           
      });
```

-We return methods that populate the Commands list and Material List in the view from the existing commands, add we set the title to the right address :

```
return App.setTitle();
```

-The rest of the code are the various methods that sets the "onclick" eventlistener on the two lists and the submit button. For example :

```
  setInitialMaterials: async function() {
    App.contracts.Materials.deployed().then(function(instance) {

      ////////////Add "Onclick" function to submit buttonfor creating Material List/////////////
        document.getElementById("build-material").onclick = async function() { create_material()}
    })

    return await App.updateMaterialList();
  },
```

-This set the "onclick" event of the submit button to the "create_material" function, add the created command to the command list and update the list :

```

    var commandAddress = document.getElementById("commandAddress").value;
    var controllers = document.getElementById("controllers").value;
    var shafts = document.getElementById("shafts").value;
    var doors = document.getElementById("doors").value;
    var buttons = document.getElementById("buttons").value;
    var displays = document.getElementById("displays").value;

    //////Check if all fields are non-empty, so we don't make wrong material lists/////////////

    if(controllers.length != 0 && shafts.length != 0 && doors.length != 0 && buttons.length != 0 && displays.length != 0){

      App.contracts.Materials.deployed().then(async function(instance){
        
          var materialInstance = instance;

          await materialInstance.createMaterials( commandAddress, controllers, shafts, doors, buttons, displays, {from: account});
          var count = await materialInstance.materialListCount();

          var item = [count, materialInstance];

          return item;
        
      }).then(async function(item) {
        var component1 = await item[1].getMaterials1(item[0]);
        var component2 = await item[1].getMaterials2(item[0]);

        return  addToList(component1[0], componen       
```

-Finally, the already_submitted method is called when clicking on a command list, and check if a Material list is already created. If so, the button is disabled (you might have to click twice. This a an async function and might not disable the button instantenously) :

``` App.contracts.Materials.deployed().then(async function(instance){
        
      var materialInstance = instance;

      var bool = await materialInstance.getBool(commandAddress, controllers, shafts, doors, buttons, displays);
      
      return bool;
      
    }).then(async function(bool){
      console.log(bool);
      var button = document.getElementById("build-material");

      if (bool){
        return button.disabled = true;
      }else {
        return button.disabled = false;

      }
```

-All call to the contract are made throught the deployed() method on each instance of a contract :

```
 App.contracts.Materials.deployed().then(async function(instance){ ... }
 ```

 -Asynchronicity is made possible by using promises on each request, which can then be chained to get the returned informations. 

 -Finally, we added three tests, which are just small tests checking the basic functions and ensuring that they return the desired values.

 Thank you very much, I hope you enjoy it. 

 Alexandre Leblanc
 Andre DeSantana
 Kemtardif