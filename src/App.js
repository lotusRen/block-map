import React, { Component } from 'react';
import './App.css';

class App extends Component {	
	constructor(props){
		super(props);
		this.markers=[];
		this.state={
			locations : [
	          {title: '梧桐山', location: {lat: 22.579332, lng: 114.219408}},
	          {title: '大梅沙', location: {lat: 22.594822, lng: 114.304446}},
	          {title: '世界之窗', location: {lat: 22.536398, lng: 113.973176}},
	          {title: '凤凰山', location: {lat: 22.671686, lng: 113.855259}},
	          {title: '莲花山公园', location: {lat: 22.554571, lng: 114.057378}}
	       ]
		};
		
		
	};
	
	componentDidMount(){
		var that=this;
		window.onload=function(){
			var map = new window.google.maps.Map(document.getElementById('map'), {               //创建地图
		      center: {lat: 22.543096, lng: 114.057865},
		      zoom: 10
		   });
		    for(var i=0;i<that.state.locations.length;i++){
			    	var marker = new window.google.maps.Marker({
					  position: that.state.locations[i].location,
					  map: map,
					  title: that.state.locations[i].title,
					  id: i
				});
		    		that.markers.push(marker);
		    }	 
		}
			
		
		
	}
	
	
  render() {
   		 
  		 	
  		 			return (
  		 				<div id="map"></div>
  		 			)
  		 	
   
  }
}

export default App;
