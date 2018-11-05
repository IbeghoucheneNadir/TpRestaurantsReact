import React, { Component } from 'react';
import './App.css';

//import Restaurant from './components/Restaurant';


class App extends Component {
  
  constructor(props) {
    super(props);
      
    this.state = {
      restaurants:[],
      unResto: {"nom":"", "cuisine":""},
      newResName: '',
      newResCuisine: '',
      nomRestaurant:'',
      nomCuisine:'',
      nomRechercher:'',
      value2:null,
      nbResto: 10,
      page: 1,
      showDiv: false,
      showDivEdit:false,
      a:1,
      b:2,
      c:3,
      maxPage:'',
    }
    this.update = this.update.bind(this);
  }
  
	update(event){
    let target = event.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name] : value
    });
  }
  
  removeRestaurants(restaurant) {
	
	const oldRestaurants = this.state.restaurants.filter(
      (elem, index) => {
        console.log(elem)
        return (elem !== restaurant) ? elem : null;
      }
    );	
		this.setState({
			restaurants: oldRestaurants
		});
  }
  
 
  getDataFromServer() {
     fetch('http://localhost:8080/api/restaurants?page='+ this.state.page + "&pagesize=" + this.state.nbResto+"&name="+this.state.nomRestaurant)
     .then(response => {
       return response.json() // transforme le json texte en objet js
     })
     .then(res => { // data c'est le texte json de response ci-dessus
       let restaurants = [];
       res.data.forEach((el) => {
         let restaurant = {
            name:el.name,
            cuisine:el.cuisine
          }
         restaurants.push(restaurant);
       });
       this.setState({
        restaurants: restaurants
      });
       
     }).catch(err => {
       console.log("erreur dans le get : " + err)
     });
  }

  getMaxPage(){
    fetch("http://localhost:8080/api/restaurants/count")
    .then(response => {
      return response.json();
    }).then(resp => {
      let maxpagevalue = Math.ceil(resp.data/this.state.nbResto)-1;
      this.setState({maxPage: maxpagevalue, page:maxpagevalue});

    }).catch(err => {
      console.log("erreur dans le get : " + err)
    });
  }
  
  componentWillMount() {
    console.log("Component will mount");
    this.getDataFromServer();
  }

  change =e => {
    this.setState({
      [e.target.name]:e.target.value
    })
  }

  changeOutputTable(event){
    let nomRechercher = document.getElementById("nomRechercher").value;
      if(this.state.nomRestaurant !== nomRechercher){
        this.setState({nomRestaurant: nomRechercher},() =>  this.componentWillMount());
      } 
  }

  showInsertForm(event){
    let showDiv=this.state.showDiv;
    this.setState({showDiv:!showDiv,showDivEdit:false});
  }

  showUpdateForm(event){
    let showDivEdit=this.state.showDivEdit;
    this.setState({showDivEdit:!showDivEdit,showDiv:false});
  }

  naviger(event){
    let num = event.target.innerText;
    if(num=="Max"){
      this.getMaxPage();
      this.state.c=this.state.maxPage-1;
      this.state.b=this.state.maxPage-2;
    }
    else
    {
    if(num==this.state.b && this.state.b!=2)
    {
     this.state.b-=1;
     this.state.c-=1;
    }
    else if(num==this.state.a)
    {
      this.state.b=2;
      this.state.c=3;
    }
    else if(num==this.state.c)
    {
      this.state.c+=1;
      this.state.b+=1;
    }
  }
    this.setState({page: num}, () => this.componentWillMount());
  }

  nombreElementParPage(event){
    let select = document.getElementById("nbChoisit");
    let choice = select.selectedIndex;
    let valeur = select.options[choice].value;
    let num = parseInt(valeur);
    
    this.setState({nbResto: num}, () => this.componentWillMount());
  }
  editRestaurant=e=>{
  //  let Resto= ;
   // let Cuisine=;
  }
  addRestaurant=e=>{
    let oldRestaurants = this.state.restaurants;
    let newRestaurant = {
      name : this.state.nomRestaurant,
      cuisine : this.state.nomCuisine
    }
		this.setState({
      restaurants: oldRestaurants.concat(newRestaurant),
    });

    let inputs = document.getElementsByTagName("input");
    for(var item of inputs){
      item.value="";
    }
  }
  
  render() {

    let listeRestos = this.state.restaurants.map( (resto, index) => {
      return(
        <tr v-for="(restaurant,index) in filteredrestaurants" key={index}>
          <td>{resto.name}</td>
          <td>{resto.cuisine}</td>
          <td>
            <button id="deleteBtn" onClick={() => this.removeRestaurants(resto)}>Delete</button>
            <button id="edit" type="button" onClick={(event) => this.showUpdateForm(event)}>Edit</button>
          </td>
        </tr>
      )}
    );
    
    return (
      <div id="app">
      <div id="entete">
              <h3>Table des restaurants :</h3>
              Nombre de restaurants : {this.state.restaurants.length}
              <div id="nbElemAfficher">  
              <button type="button" id="createButton" onClick={(event) => this.showInsertForm(event)}><p>+</p></button><br/>

              <br/><label>Elements par page  </label>
              
                <select id="nbChoisit" defaultValue="10" onChange={(event) => this.nombreElementParPage(event)}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                </select> 
                </div><br/>
               
                <div id="blocRecherche">
                    <form>
                      <input 
                      name="nomRechercher"
                      onChange={(event)=>this.changeOutputTable(event)}  //  onChange={this.changeInputMessage.bind(this)}
                      ref="nomRechercher"
                      type="text"
                      id="nomRechercher"
                      placeholder="Chercher par nom"
                      /> 
                    </form>
                </div><br/>           
              </div>
                <div id="divGlobal">
                <div id="divLeft"></div>
                <div id="bloc-center">

                <table  id="myTable" >
                <thead >
                <tr>
                    <th><p>Nom</p></th>
                    <th><p>Cuisine</p></th>
                    <th><p>Action</p></th>
                </tr>
                </thead>
                <tbody>
                   {listeRestos}
                </tbody>
                </table>
                <div className="navigation"><br/>
                        <button type="button" id="idButton1" onClick={(event) => this.naviger(event)}><p>{this.state.a}</p></button>
                        <button type="button" id="idButton2" onClick={(event) => this.naviger(event)}><p>{this.state.b}</p></button>
                        <button type="button" id="idButton3" onClick={(event) => this.naviger(event)}><p>{this.state.c}</p></button>
                        ........<button type="button" id="idButtonMax" onClick={(event) => this.naviger(event)}><p>Max</p></button>
                </div><br/><br/>      
            </div>
          { this.state.showDiv &&  <div id="ajoutRestaurant" >
          <div>
                <form id="formAjout" >
                <h3>Ajouter un restaurant </h3>

                    <div  ><label id="AjoutResto">Nom</label><br/>
                          <input type="text" 
                          id="AjoutRestoInp"
                          name="nomRestaurant"
                          placeholder="Michel's restaurant" 
                          value={this.state.nomRestaurant}
                          onChange={e=>this.change(e)}
                          ref="nomResto" />
                    </div>
                    <div > <label id="AjoutResto">Cuisine</label><br/>
                          <input type="text"
                          id="AjoutRestoInp"
                          name="nomCuisine"
                          placeholder="Michel's cuisine"
                          value={this.state.cuisineRestaurant}
                          onChange={e=>this.change(e) }
                          ref="cuisineResto" />
                          
                    </div>
                    <div >
                      <button id="boutonAjout" onClick={e=>this.addRestaurant(e)}>Créer un restaurant</button>
               </div>
              </form>
             </div>
             </div>}
               { this.state.showDivEdit &&  <div id="ajoutRestaurant" >
                <div>
                <form id="formAjout" >
                <h3>Modifier le restaurant </h3>
                    <div  ><label id="AjoutResto">Nom</label><br/>
                          <input type="text" 
                          id="AjoutRestoInp"
                          name="nomRestaurant"
                          onChange={e=>this.change(e)}
                          required defaultValue={this.state.unResto.name}
                          ref="nomResto" />
                    </div>
                    <div > <label id="AjoutResto">Cuisine</label><br/>
                          <input type="text"
                          id="AjoutRestoInp"
                          name="nomCuisine"
                          required defaultValue={this.state.unResto.cuisine}
                          onChange={e=>this.change(e) }
                          ref="cuisineResto" />
                          
                    </div>
                    <div >
                            <button id="boutonAjout" onClick={e=>this.editRestaurant(e)}>Modifier</button>
                    </div>
                </form>
                </div>
                </div>}
          </div>
          </div>
    );
  }
}
export default App;



