// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract Land {
    struct Landreg {
        uint id;
        uint area;
        string city;
        string state;
        uint landPrice;
        uint propertyPID;
        uint physicalSurveyNumber;
        string ipfsHash;
        string document;
    }

    struct Buyer {
        address id;
        string name;
        uint age;
        string city;
        string aadharNumber;
        string panNumber;
        string document;
        string email;
    }

    struct Seller {
        address id;
        string name;
        uint age;
        string aadharNumber;
        string panNumber;
        string landsOwned;
        string document;
    }

    struct LandInspector {
        uint id;
        string name;
        uint age;
        string designation;
    }

    struct LandRequest {
        uint reqId;
        address sellerId;
        address buyerId;
        uint landId;
    }

    // Mappings
    mapping(uint => Landreg) public lands;
    mapping(uint => LandInspector) public InspectorMapping;
    mapping(address => Seller) public SellerMapping;
    mapping(address => Buyer) public BuyerMapping;
    mapping(uint => LandRequest) public RequestsMapping;

    mapping(address => bool) public RegisteredAddressMapping;
    mapping(address => bool) public RegisteredSellerMapping;
    mapping(address => bool) public RegisteredBuyerMapping;
    mapping(address => bool) public SellerVerification;
    mapping(address => bool) public SellerRejection;
    mapping(address => bool) public BuyerVerification;
    mapping(address => bool) public BuyerRejection;
    mapping(uint => bool) public LandVerification;
    mapping(uint => address) public LandOwner;
    mapping(uint => bool) public RequestStatus;
    mapping(uint => bool) public RequestedLands;
    mapping(uint => bool) public PaymentReceived;

    address public Land_Inspector;
    address[] public sellers;
    address[] public buyers;

    uint public landsCount;
    uint public inspectorsCount;
    uint public sellersCount;
    uint public buyersCount;
    uint public requestsCount;

    // Events
    event Registration(address _registrationId);
    event AddingLand(uint indexed _landId);
    event LandRequested(address _sellerId);
    event RequestApproved(address _buyerId);
    event Verified(address _id);
    event Rejected(address _id);

    constructor() {
        Land_Inspector = msg.sender;
        addLandInspector("Inspector 1", 45, "Tehsil Manager");
    }

    // Private functions
    function addLandInspector(string memory _name, uint _age, string memory _designation) private {
        inspectorsCount++;
        InspectorMapping[inspectorsCount] = LandInspector(inspectorsCount, _name, _age, _designation);
    }

    // Getters
    function getLandsCount() public view returns (uint) { return landsCount; }
    function getBuyersCount() public view returns (uint) { return buyersCount; }
    function getSellersCount() public view returns (uint) { return sellersCount; }
    function getRequestsCount() public view returns (uint) { return requestsCount; }

    function getArea(uint i) public view returns (uint) { return lands[i].area; }
    function getCity(uint i) public view returns (string memory) { return lands[i].city; }
    function getState(uint i) public view returns (string memory) { return lands[i].state; }
    function getPrice(uint i) public view returns (uint) { return lands[i].landPrice; }
    function getPID(uint i) public view returns (uint) { return lands[i].propertyPID; }
    function getSurveyNumber(uint i) public view returns (uint) { return lands[i].physicalSurveyNumber; }
    function getImage(uint i) public view returns (string memory) { return lands[i].ipfsHash; }
    function getDocument(uint i) public view returns (string memory) { return lands[i].document; }
    function getLandOwner(uint id) public view returns (address) { return LandOwner[id]; }

    // Verification functions
    function verifySeller(address _sellerId) public {
        require(isLandInspector(msg.sender), "Only inspector can verify");
        SellerVerification[_sellerId] = true;
        emit Verified(_sellerId);
    }

    function rejectSeller(address _sellerId) public {
        require(isLandInspector(msg.sender), "Only inspector can reject");
        SellerRejection[_sellerId] = true;
        emit Rejected(_sellerId);
    }

    function verifyBuyer(address _buyerId) public {
        require(isLandInspector(msg.sender), "Only inspector can verify");
        BuyerVerification[_buyerId] = true;
        emit Verified(_buyerId);
    }

    function rejectBuyer(address _buyerId) public {
        require(isLandInspector(msg.sender), "Only inspector can reject");
        BuyerRejection[_buyerId] = true;
        emit Rejected(_buyerId);
    }

    function verifyLand(uint _landId) public {
        require(isLandInspector(msg.sender), "Only inspector can verify");
        LandVerification[_landId] = true;
    }

    // Boolean checkers (explicit returns)
    function isLandVerified(uint _id) public view returns (bool) { return LandVerification[_id]; }
    function isVerified(address _id) public view returns (bool) { return SellerVerification[_id] || BuyerVerification[_id]; }
    function isRejected(address _id) public view returns (bool) { return SellerRejection[_id] || BuyerRejection[_id]; }
    function isSeller(address _id) public view returns (bool) { return RegisteredSellerMapping[_id]; }
    function isBuyer(address _id) public view returns (bool) { return RegisteredBuyerMapping[_id]; }
    function isRegistered(address _id) public view returns (bool) { return RegisteredAddressMapping[_id]; }
    function isLandInspector(address _id) public view returns (bool) { return Land_Inspector == _id; }
    function isRequested(uint _id) public view returns (bool) { return RequestedLands[_id]; }
    function isApproved(uint _id) public view returns (bool) { return RequestStatus[_id]; }
    function isPaid(uint _landId) public view returns (bool) { return PaymentReceived[_landId]; }

    // Core functions
    function addLand(uint _area, string memory _city, string memory _state, uint landPrice, uint _propertyPID, uint _surveyNum, string memory _ipfsHash, string memory _document) public {
        require(isSeller(msg.sender) && isVerified(msg.sender), "Only verified seller can add land");
        landsCount++;
        lands[landsCount] = Landreg(landsCount, _area, _city, _state, landPrice, _propertyPID, _surveyNum, _ipfsHash, _document);
        LandOwner[landsCount] = msg.sender;
        emit AddingLand(landsCount);
    }

    function registerSeller(string memory _name, uint _age, string memory _aadharNumber, string memory _panNumber, string memory _landsOwned, string memory _document) public {
        require(!RegisteredAddressMapping[msg.sender], "Seller already registered");
        RegisteredAddressMapping[msg.sender] = true;
        RegisteredSellerMapping[msg.sender] = true;
        sellersCount++;
        SellerMapping[msg.sender] = Seller(msg.sender, _name, _age, _aadharNumber, _panNumber, _landsOwned, _document);
        sellers.push(msg.sender);
        emit Registration(msg.sender);
    }

    function updateSeller(string memory _name, uint _age, string memory _aadharNumber, string memory _panNumber, string memory _landsOwned) public {
        require(isSeller(msg.sender), "Not a registered seller");
        SellerMapping[msg.sender].name = _name;
        SellerMapping[msg.sender].age = _age;
        SellerMapping[msg.sender].aadharNumber = _aadharNumber;
        SellerMapping[msg.sender].panNumber = _panNumber;
        SellerMapping[msg.sender].landsOwned = _landsOwned;
    }

    function getSeller() public view returns (address[] memory) { return sellers; }
    function getSellerDetails(address i) public view returns (string memory, uint, string memory, string memory, string memory, string memory) {
        Seller memory s = SellerMapping[i];
        return (s.name, s.age, s.aadharNumber, s.panNumber, s.landsOwned, s.document);
    }

    function registerBuyer(string memory _name, uint _age, string memory _city, string memory _aadharNumber, string memory _panNumber, string memory _document, string memory _email) public {
        require(!RegisteredAddressMapping[msg.sender], "Buyer already registered");
        RegisteredAddressMapping[msg.sender] = true;
        RegisteredBuyerMapping[msg.sender] = true;
        buyersCount++;
        BuyerMapping[msg.sender] = Buyer(msg.sender, _name, _age, _city, _aadharNumber, _panNumber, _document, _email);
        buyers.push(msg.sender);
        emit Registration(msg.sender);
    }

    function updateBuyer(string memory _name, uint _age, string memory _city, string memory _aadharNumber, string memory _email, string memory _panNumber) public {
        require(isBuyer(msg.sender), "Not a registered buyer");
        BuyerMapping[msg.sender].name = _name;
        BuyerMapping[msg.sender].age = _age;
        BuyerMapping[msg.sender].city = _city;
        BuyerMapping[msg.sender].aadharNumber = _aadharNumber;
        BuyerMapping[msg.sender].email = _email;
        BuyerMapping[msg.sender].panNumber = _panNumber;
    }

    function getBuyer() public view returns (address[] memory) { return buyers; }
    function getBuyerDetails(address i) public view returns (string memory, string memory, string memory, string memory, string memory, uint, string memory) {
        Buyer memory b = BuyerMapping[i];
        return (b.name, b.city, b.panNumber, b.document, b.email, b.age, b.aadharNumber);
    }

    function requestLand(address _sellerId, uint _landId) public {
        require(isBuyer(msg.sender) && isVerified(msg.sender), "Only verified buyer can request");
        requestsCount++;
        RequestsMapping[requestsCount] = LandRequest(requestsCount, _sellerId, msg.sender, _landId);
        RequestStatus[requestsCount] = false;
        RequestedLands[requestsCount] = true;
        emit LandRequested(_sellerId);
    }

    function getRequestDetails(uint i) public view returns (address, address, uint, bool) {
        LandRequest memory r = RequestsMapping[i];
        return (r.sellerId, r.buyerId, r.landId, RequestStatus[i]);
    }

    function approveRequest(uint _reqId) public {
        require(isSeller(msg.sender) && isVerified(msg.sender), "Only verified seller can approve");
        RequestStatus[_reqId] = true;
        emit RequestApproved(RequestsMapping[_reqId].buyerId);
    }

    function LandOwnershipTransfer(uint _landId, address _newOwner) public {
        require(isLandInspector(msg.sender), "Only inspector can transfer land");
        LandOwner[_landId] = _newOwner;
    }

    function payment(address payable _receiver, uint _landId) public payable {
        PaymentReceived[_landId] = true;
        _receiver.transfer(msg.value);
    }
}
