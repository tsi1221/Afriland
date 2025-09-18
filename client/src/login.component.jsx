import React, { Component } from "react";
import './index.css';
import getWeb3 from "./getWeb3";
import LandContract from "./artifacts/Land.json";
import { Button } from "reactstrap";
import { Navigate } from "react-router-dom";

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            role: null,
            redirect: null,
            landInspector: '',
            seller: '',
            buyer: '',
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount = async () => {
        if (!window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
        }

        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = LandContract.networks[networkId];
            const instance = new web3.eth.Contract(
                LandContract.abi,
                deployedNetwork && deployedNetwork.address
            );

            const currentAddress = await web3.currentProvider.selectedAddress;

            this.setState({ LandInstance: instance, web3: web3, account: accounts[0] });

            const seller = await instance.methods.isSeller(currentAddress).call();
            const buyer = await instance.methods.isBuyer(currentAddress).call();
            const landInspector = await instance.methods.isLandInspector(currentAddress).call();

            this.setState({ seller, buyer, landInspector });

        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`);
            console.error(error);
        }
    };

    handleInputChange(event) {
        this.setState({
            role: event.target.value,
            redirect: "/Register" + event.target.value
        });
    }

    submit() {
        // Instead of history.push, we set redirect state
        this.setState({ redirect: this.state.redirect });
    }

    render() {
        // If already registered, show dashboard buttons
        if (this.state.seller || this.state.buyer || this.state.landInspector) {
            return (
                <div className="bodyC">
                    <div className="img-wrapper">
                        <img src="https://i.pinimg.com/originals/71/6e/00/716e00537e8526347390d64ec900107d.png" className="logo" />
                        <div className="wine-text-container">
                            <div className="site-title wood-text">Land Registry</div>
                        </div>
                    </div>
                    <div className="auth-wrapper">
                        <div className="auth-inner">
                            <h1>You are already registered.</h1>
                            <Button href="/Seller/SellerDashboard" disabled={!this.state.seller} className="btn-block" style={{ margin: "2px", backgroundColor: "peru" }}>Seller Dashboard</Button>
                            <br />
                            <Button href="/admin/dashboard" disabled={!this.state.buyer} className="btn-block" style={{ margin: "2px", backgroundColor: "peru" }}>Buyer Dashboard</Button>
                            <br />
                            <Button href="/LI/LIdashboard" disabled={!this.state.landInspector} className="btn-block" style={{ margin: "2px", backgroundColor: "peru" }}>Land Inspector Dashboard</Button>
                        </div>
                    </div>
                </div>
            );
        }

        // If redirect state is set, navigate
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect} replace />;
        }

        return (
            <div className="bodyC">
                <a href="/Help" className="faq" style={{ borderRadius: "10%", textDecoration: "none", fontWeight: "bolder" }}>
                    <h3 style={{ color: "wheat" }}>Help?</h3>
                </a>
                <div className="img-wrapper">
                    <img src="https://i.pinimg.com/originals/71/6e/00/716e00537e8526347390d64ec900107d.png" className="logo" />
                    <div className="wine-text-container">
                        <div className="site-title wood-text">Land Registry</div>
                    </div>
                </div>
                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <div>
                            <h1 style={{ letterSpacing: "3px", fontWeight: 500, color: "black" }}>Welcome !</h1>
                            <h4 style={{ letterSpacing: "2px", color: 'black' }}>Making the Most of Digital Era!</h4>
                            <hr style={{ color: "#696969", height: 1 }} />

                            <div className="form-group" style={{ color: "black" }}>
                                <label className="control-label" htmlFor="Company" style={{ fontSize: "18px", padding: "2px" }}>Select Role</label>
                                <select id="Company" className="form-control" name="Company" onChange={this.handleInputChange}>
                                    <option selected disabled>Select Role</option>
                                    <option value="Buyer">Buyer</option>
                                    <option value="Seller">Seller</option>
                                </select>
                            </div>

                            <div>
                                <button onClick={this.submit} className="btn btn-primary btn-block" style={{ marginBottom: "10px", marginTop: "10px" }}>Register</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
