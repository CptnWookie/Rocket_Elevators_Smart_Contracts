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
    });
  },

  setInitialMaterials: async function() {
    App.contracts.Materials.deployed().then(function(instance) {
        document.getElementById("build-material").onclick = async function() { create_material()}
    })

    return await App.updateMaterialList();
  },
 
  setInitialCommands: function() {

    App.contracts.ProjectOffice.deployed().then(async function (instance) {
      
      var projectInstance = instance;
      var count = await projectInstance.componentsCount();

      var item = [count, projectInstance]

      return item
    }).then(async function(item){

        for (var i = 0; i < item[0]; i++) {  

          var component = await item[1].getComponents(i);
          addToList(component[0], "command-list", function() {getCommandInfos(component[1],component[2],component[3],component[4],component[5])});
        } 
      })
  },

  updateMaterialList: async function() {

    App.contracts.Materials.deployed().then(async function (instance) {
      
      var MaterialInstance = instance;
      var count = await MaterialInstance.materialListCount();

      var item = [count, MaterialInstance]

      return await item
    }).then(async function(item){
        if(item[0] > 0){
          for (let i = 1; i <= item[0]; i++) {  

            var component1 = await item[1].getMaterials1(i);
            var component2 = await item[1].getMaterials2(i);
            addToList(component1[0], "material-list", function() {getMaterialInfos(component1[1],component1[2],component1[3],component2[0],component2[1],component2[2],component2[3])});
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

function getCommandInfos(item1, item2, item3, item4, item5) {
  document.getElementById("controllers").value = item1;
  document.getElementById("shafts").value = item2;
  document.getElementById("doors").value = item3;
  document.getElementById("buttons").value = item4;
  document.getElementById("displays").value = item5;
}

  function addToList(item, list_name, click_function) {
  var element = document.createElement("a")
  element.textContent = item
  element.classList.add("collection-item")
  element.onclick = function() { click_function()};
  document.getElementById(list_name).appendChild(element)
}

async function create_material(){

  await web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
    }
  
    var controllers = document.getElementById("controllers").value;
    var shafts = document.getElementById("shafts").value;
    var doors = document.getElementById("doors").value;
    var buttons = document.getElementById("buttons").value;
    var displays = document.getElementById("displays").value;

    App.contracts.Materials.deployed().then(async function(instance){
      var materialInstance = instance;

      if(controllers != "" && shafts != "" && doors != "" && buttons != "" && displays != ""){
        
        var creation = await materialInstance.createMaterials(controllers, shafts, doors, buttons, displays, {from: account});
        var count = await materialInstance.materialListCount();
        var item = [count, materialInstance];
        return item;
      }
    }).then(async function(item) {

      var component1 = await item[1].getMaterials1(item[0]);
       var component2 = await item[1].getMaterials2(item[0]);

      return  addToList(component1[0], "material-list", function() {getMaterialInfos(component1[1],component1[2],component1[3],component2[0],component2[1],component2[2],component2[3])});
    
      // return App.updateMaterialList();
    });
  });

  };





$(function() {
  $(window).load(function() {
    App.init();
  });
});
