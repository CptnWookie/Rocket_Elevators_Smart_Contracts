var App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load materials.
    $.getJSON('../materials.json', function(data) {
      var materialsRow = $('#materialsRow');
      var materialsTemplate = $('#materialsTemplate');

      for (i = 0; i < data.length; i ++) {
        materialsTemplate.find('.panel-title').text(data[i].name);
        materialsTemplate.find('img').attr('src', data[i].picture);
        materialsTemplate.find('.materials-sku').text(data[i].sku);
        materialsTemplate.find('.materials-quantity').text(data[i].quantity);
        materialsTemplate.find('.materials-brand').text(data[i].brand);
        materialsTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        materialsRow.append(materialsTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {

    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {

        await window.ethereum.enable();
      } catch (error) {

        console.error("User denied account access")
      }
    }

    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }

    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

        return App.initContract();
      },

  initContract: function() {
    $.getJSON('MaterialProvider.json', function(data) {

      var MaterialsArtifact = data;     
      App.contracts.Materials = TruffleContract(MaterialsArtifact);
      App.contracts.Materials.setProvider(App.web3Provider);
  
      return App.setInitialMaterials();

    }).done( function() {

    $.getJSON('ProjectOffice.json', function(data) {

      var ProjectOfficeArtifact = data;
      App.contracts.ProjectOffice = TruffleContract(ProjectOfficeArtifact);
      App.contracts.ProjectOffice.setProvider(App.web3Provider);
      
      return App.setInitialCommands();
           
      });

      return App.setTitle();
    });
  },
  setTitle: async function(){
      App.contracts.Materials.deployed().then(async function(instance) {
         
      var materialInstance = instance;
      var address = await materialInstance.getAddress();

      document.getElementById("material-provider-address").innerHTML = address;

    })
  },
  setInitialMaterials: async function() {
    App.contracts.Materials.deployed().then(function(instance) {
        document.getElementById("build-material").onclick = async function() { create_material()}
    })

    return await App.updateMaterialList();
  },
 
  setInitialCommands: async function() {

    App.contracts.ProjectOffice.deployed().then(async function (instance) {
      
      var projectInstance = instance;
      var count = await projectInstance.componentsCount();

      var item = [count, projectInstance]

      return item
    }).then(async function(item){

        for (let i = 0; i < item[0]; i++) {  

          var component = await item[1].getComponents(i);
          await addToList(i, component[0], "command-list", async () => getCommandInfos(i));
        } 
      })
  },

  updateMaterialList: async function() {

    App.contracts.Materials.deployed().then(async function (instance) {
      
      var MaterialInstance = instance;
      var count = await MaterialInstance.materialListCount();

      var item = [count, MaterialInstance]

      return item
    }).then(async function(item){
        if(item[0] > 0){
          for (let i = 1; i <= item[0]; i++) {  
            
            var component1 = await item[1].getMaterials1(i);
            var component2 = await item[1].getMaterials2(i);
            await addToList(i, component1[0], "material-list", async function() {getMaterialInfos( component1[1],component1[2],component1[3],component2[0],component2[1],component2[2],component2[3])});
          } 
        }
      })
  },

};

function getMaterialInfos(item1, item2, item3, item4, item5, item6, item7) {
  $("#aluminium").text(item1);
  $("#steel").text(item2);
  $("#bumper").text(item3);
  $("#light").text(item4);
  $("#led").text(item5);
  $("#spring").text(item6);
  $("#date").text(item7);

}

async function getCommandInfos(index) {

  App.contracts.ProjectOffice.deployed().then(async function (instance) {
      
    var projectInstance = instance;
    var count = await projectInstance. getComponents(index);

    return count
  }).then(async function(item){
  
  document.getElementById("commandAddress").value = item[0];
  document.getElementById("controllers").value = item[1];
  document.getElementById("shafts").value = item[2];
  document.getElementById("doors").value = item[3];
  document.getElementById("buttons").value = item[4];
  document.getElementById("displays").value = item[5];
  
  });
}

  async function addToList(index, item, list_name, click_function) {
  var element = document.createElement("a");
    element.setAttribute("id", index);
    element.textContent = item
    element.classList.add("collection-item")
    element.addEventListener("click", click_function);
    element.addEventListener("click", async function() {alreadySubmitted();});
    document.getElementById(list_name).appendChild(element)

  //  return await alreadySubmitted();
  }

  async function alreadySubmitted() {

    var commandAddress = document.getElementById("commandAddress").value;
    var controllers = document.getElementById("controllers").value;
    var shafts = document.getElementById("shafts").value;
    var doors = document.getElementById("doors").value;
    var buttons = document.getElementById("buttons").value;
    var displays = document.getElementById("displays").value;

    App.contracts.Materials.deployed().then(async function(instance){
        
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

    })
  }

async function create_material(){

  await web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
    }

    var account = accounts[0];

    var commandAddress = document.getElementById("commandAddress").value;
    var controllers = document.getElementById("controllers").value;
    var shafts = document.getElementById("shafts").value;
    var doors = document.getElementById("doors").value;
    var buttons = document.getElementById("buttons").value;
    var displays = document.getElementById("displays").value;

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

        return  addToList(component1[0], component1[0], "material-list", function() {getMaterialInfos(component1[1],component1[2],component1[3],component2[0],component2[1],component2[2],component2[3])});
      });
    }
  });

  };





$(function() {
  $(window).load(async function() {
    await App.init();
  });
});
