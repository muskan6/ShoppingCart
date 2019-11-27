import React, {Component} from 'react';
import Data from '../data/datafile';
import './ItemList.css';
import '../images/cross.png';
import notifier from "simple-react-notifications";

notifier.configure({
    autoClose: 2000,
    position: "top-center",
    delay: 500,
    single: false,
    width: "480px"
});

class ItemList extends Component{
    constructor(props) {
        super(props);
        this.state = {datalist: Data, list: [], total: Object.keys(Data).length, cost: 0, discount:0, tdis : 0, payment: 0};
        for(let i=0; i<Object.keys(Data).length; i++){
            this.state.list.push({
                count: 1
            })
            var cost = Data[i].price;
            this.state.cost = this.state.cost + cost;
            let dis = 0
            if(Data[i].type === "fiction"){
                dis = (15/100)*(cost);
                this.state.tdis = this.state.tdis + dis;
            }
            var disc = Data[i].discount;
            this.state.discount = this.state.discount + disc
            this.state.payment = this.state.payment + cost - disc - dis;
        }

        // This binding is necessary to make `this` work in the callback
        this.increment = this.increment.bind(this);
        this.decrement = this.decrement.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.reloadData = this.reloadData.bind(this);
    }

    increment(index) {
        var list = [...this.state.list];
        let val = 0
        let cost = 0
        let disc = 0
        let dis = 0
        let p = 0
        if(list[index]) {
            list[index].count = list[index].count + 1
            val = this.state.total + 1
            cost = this.state.cost + Data[index].price;
            disc = this.state.discount + Data[index].discount;
            if(Data[index].type === "fiction"){
                dis = this.state.tdis + (15/100)*(Data[index].price);
                p = this.state.payment + Data[index].price - Data[index].discount - (15/100)*(Data[index].price)
            }else{
                dis = this.state.tdis
                p = this.state.payment + Data[index].price - Data[index].discount
            }
        }
        else {
            list[index] = {count: 1}
            dis = this.state.tdis
        }
        this.setState({
            list,
            total : val,
            cost: cost,
            discount: disc,
            tdis: dis,
            payment: p
        })
    }
    decrement(index) {
        var list = [...this.state.list];
        let val = 0
        let cost = 0
        let dis = 0
        let disc = 0
        let p = 0
        if(list[index].count > 0) {
            list[index].count = list[index].count - 1
            val = this.state.total - 1
            cost = this.state.cost - Data[index].price;
            disc = this.state.discount - Data[index].discount;
            if(Data[index].type === "fiction"){
                dis = this.state.tdis - (15/100)*(Data[index].price);
                p = this.state.payment - Data[index].price + Data[index].discount + (15/100)*(Data[index].price)
            }else{
                dis = this.state.tdis
                p = this.state.payment - Data[index].price + Data[index].discount
            }
        }
        else {
            list[index] = {count: list[index].count}
            val = this.state.total
            cost = this.state.cost
            disc = this.state.discount
            dis = this.state.tdis
            p = this.state.payment
        }
        this.setState({
            list,
            total : val,
            cost: cost,
            discount: disc,
            tdis: dis,
            payment: p
        })
    }

    removeItem(index){
        notifier.success(this.state.datalist[index].name + " has been deleted !");
        const newState = this.state;
        if(newState.list[index].count > 0) {
            newState.cost = newState.cost - newState.list[index].count * Data[index].price;
            newState.discount = newState.discount - newState.list[index].count * newState.datalist[index].discount;
            let m = 0
            if (newState.datalist[index].type === "fiction") {
                m = newState.tdis - newState.list[index].count * (15 / 100) * (newState.datalist[index].price);
            } else {
                m = newState.tdis
            }
            newState.tdis = m
            newState.payment = newState.cost - newState.discount - newState.tdis;
        }
        newState.list.splice(index, 1);
        newState.datalist.splice(index, 1);
        this.setState(newState);
    }
    reloadData() {
        const newState = this.state;
        let list = newState.renew;
        newState.datalist = list
        this.setState(newState)
        // eslint-disable-next-line
        {/*const newState = this.state;
        for(let i=0; i<this.state.renew.length; i++){
            newState.list.push({
                count: 1
            })
            var cost = newState.renew[i].price;
            newState.cost = newState.cost + cost;
            if(newState.renew[i].type === "fiction"){
                var dis = (15/100)*(cost);
                newState.tdis = newState.tdis + dis;
                newState.payment = newState.payment - dis
            }
            var disc = newState.renew[i].discount;
            newState.discount = newState.discount + disc
            newState.payment = newState.payment + cost - disc
        }
        this.setState(newState);
        */}
    }
    render() {
        return(
            <div>
            <div id="maindiv" className="wrapper">
                <div id="subdivleft">
                    {Data.map((detail, index)=>{
                        if(index === 0){
                            return (
                                <div key={index}>
                                    <hr className="tablehr"/>
                                    <div className="container" id="cards">
                                        <div id="iitem" className="head1">
                                            Items ({this.state.total})
                                        </div>
                                        <div className="head2">
                                            Qty
                                        </div>
                                        <div className="head3">
                                            Price
                                        </div>
                                    </div>
                                    <hr  className="tablehr"/>
                                        <div id="cards">
                                        <div id="iitem" className="borderdiv"><span id="imgs"><img src='{detail.img_url}'  alt=" "/></span>
                                    <span>{detail.name}</span>
                                    <button className="close-btn" type="button" name="button" onClick={this.removeItem.bind(this, index)}>
                                        ×
                                    </button>
                                    </div>
                                    <div className="col-xl-3 spans" id="iitem">
                                    <button className="minus-btn" type="button" name="button" onClick={this.decrement.bind(this, index)}>
                                    -
                                    </button>
                                    <span id="surrcount">{this.state.list[index].count}</span>
                                    <button className="plus-btn" type="button" name="button" onClick={this.increment.bind(this, index)}>
                                    +
                                    </button>
                                    </div>
                                    <div id="iitem">
                                    <span className="str">${detail.price}</span>
                                    </div>
                                    </div>
                                </div>
                            )
                        }
                    return <div key={index} id="cards">
                        <div id="iitem" className="borderdiv"><span id="imgs"><img src='{detail.img_url}'  alt=" "/></span>
                            <span>{detail.name}</span>
                            <button className="close-btn" type="button" name="button" onClick={this.removeItem.bind(this, index)}>
                                ×
                            </button>
                        </div>
                        <div className="col-xl-3 spans" id="iitem">
                            <button className="minus-btn" type="button" name="button" onClick={this.decrement.bind(this, index)}>
                                -
                            </button>
                            <span id="surrcount">{this.state.list[index].count}</span>
                            <button className="plus-btn" type="button" name="button" onClick={this.increment.bind(this, index)}>
                                +
                            </button>
                        </div>
                        <div id="iitem">
                            <span className="str">${detail.price}</span>
                        </div>
                    </div>
                })}
                </div>
                <div id="subdivright">
                    <div className="texthead">Total</div>
                    <ShowTotal total = {this.state.total} cost = {this.state.cost} discount = {this.state.discount} tdis = {this.state.tdis} payment = {this.state.payment}/>
                </div>
            </div>
            <div className="reload">
                <button className="reload-btn" type="button" name="button">
                    Reload
                </button>
            </div>
            </div>
        )
    }
}

class ShowTotal extends Component{
    render(){
        return(
            <div>
                <div id="totaldiv">
                <div className="float-left">Items ({this.props.total})</div> <div className="float-right right">${this.props.cost}</div>
                </div>
                <div id="totaldiv">
                <p className="float-left">Discount</p> <p className="float-right right"> -${this.props.discount}</p>
                </div>
                <div id="totaldiv">
                <p className="float-left">Type Discount </p> <p className="float-right right">-${this.props.tdis}</p>
                </div>
                <hr/>
                <div id="totaldiv" className="divbc">
                <p className="float-left str">Order Total </p> <p className="float-right right str">${this.props.payment}
                </p>
                </div>
            </div>
        )
    }
}

export default ItemList