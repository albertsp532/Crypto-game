var web3 = new Web3(Web3.givenProvider);//Wallet will inject the selected network
ethereum.autoRefreshOnNetworkChange = false;
var instance;
var user;
var contractAddress = "0x4ac4a8af13159e9cAb5a862a3b983F2730C6Ca60";//update after contract is deployed

async function connectWallet() {
    return window.ethereum.enable().then(function(accounts){
        user = accounts[0];
        instance = new web3.eth.Contract(abi, contractAddress, user, {from: user});
        instance.events.Birth()
            .on('data', function(event){
                console.log(event);
                let owner = event.returnValues.owner;
                let birdId = event.returnValues.birdId;
                let mumId = event.returnValues.mumId;
                let dadId = event.returnValues.dadId;
                let genes = event.returnValues.genes;
                $('#birdCreation').css("display", "block");
                $('#birdCreation').text("Bird successfully created on the blockchain! Owner: " + owner 
                                    + " | BirdID: " + birdId 
                                    + " | MumID: " + mumId 
                                    + " | DadID: " + dadId
                                    + " | Genes: " + genes);
            })
            .on('error', console.error);
    })
};

async function sendBirdToBlockchain() {
    await instance.methods.createBirdGen0(getDna()).send({}, function(error, txHash){
        if(error) {
            alert(error);
        }
    })
};

async function getBirdsOfOwner() {
    var arrayOfIds = [];
    var bird;
    try {
        arrayOfIds = await instance.methods.getAllBirdsOfOwner(user).call();
        console.log(arrayOfIds);
    } catch (error) {
        console.log(error);
    }
    return arrayOfIds;
};

async function buildBirdList(arrayOfIds){
    for (let i = 0; i < arrayOfIds.length; i++) {
        bird = await instance.methods.getBird(arrayOfIds[i]).call();
        console.log(bird);
        appendBird(bird, arrayOfIds[i])
    }
}

async function getBirdDna(id) {
    return await instance.methods.getBird(id).call();
}

async function breedBird(mumId, dadId) {
    await instance.methods.breed(mumId, dadId).send({}, function(error, txHash){
        if(error) {
            alert(error);
        }
    })
};