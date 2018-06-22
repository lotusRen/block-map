import React, { Component } from 'react';
import './App.css';
import Filter from './filter.js'

class App extends Component {	
	constructor(props){
		super(props);
		this.markers=[];                              //用来保存所有的标记
		this.map={};
		this.oldLocations=[                              //存一个不变的值，后期从中筛选
	          {title: '梧桐山', location: {lat: 22.579332, lng: 114.219408},pingyin:'wutongshan',abbreviation:'wts'},
	          {title: '大梅沙', location: {lat: 22.594822, lng: 114.304446},pingyin:'dameisha',abbreviation:'dms'},
	          {title: '世界之窗', location: {lat: 22.536398, lng: 113.973176},pingyin:'shijiezhichuang',abbreviation:'sjzc'},
	          {title: '凤凰山', location: {lat: 22.671686, lng: 113.855259},pingyin:'fenghuangshan',abbreviation:'fhs'},
	          {title: '莲花山公园', location: {lat: 22.554571, lng: 114.057378},pingyin:'lianhuashangongyuan',abbreviation:'lhsgy'}
	       ];
		this.state={
			locations : this.oldLocations,
			largeInfowindow:{}
		};	
		this.filterLocations=this.filterLocations.bind(this);		
		this.initMap=this.initMap.bind(this);
		this.populateInfoWindow=this.populateInfoWindow.bind(this);
	};
	initMap(){    
		var that=this;
		that.map = new window.google.maps.Map(document.getElementById('map'), {               //创建地图
			      center: {lat: 22.543096, lng: 114.057865},
			      zoom: 10
		    });
			
	   	    var bounds = new window.google.maps.LatLngBounds();       //新建边界
	   		
		    for(var i=0;i<that.state.locations.length;i++){		
			    	var marker = new window.google.maps.Marker({
					  position: that.state.locations[i].location,
					  map: that.map,
					  title: that.state.locations[i].title,
					  animation: window.google.maps.Animation.DROP,
					  id: i
				});
		    		that.markers.push(marker);		    		
		    		marker.addListener('click', function() {       //给每个marker添加点击事件
		           that.populateInfoWindow(this, that.state.largeInfowindow);
		            that.markers.forEach(item =>{             
		            		item.setAnimation(null);          //清除所有marker的动画
		            });
		            this.setAnimation(window.google.maps.Animation.BOUNCE);
		        });
		        bounds.extend(that.markers[i].position);
		    }			   
		    that.map.fitBounds(bounds); 
			
	}
	
	 populateInfoWindow(marker, infowindow) {    //给marker添加信息窗口函数
	 		var that=this;
	        if (infowindow.marker !==marker) {
	          infowindow.marker = marker;
	          infowindow.setContent('<div>' + marker.title + '</div>');
	        	  infowindow.open(that.map, marker);
	          infowindow.addListener('closeclick',function(){
	            infowindow.setMarker = null;
	          });
	        }
	    }		
	
	componentDidMount(){
		var that=this;
		window.addEventListener('load',function(){			
			 that.setState({
				 largeInfowindow:new window.google.maps.InfoWindow()    //创建信息窗口
			 });
			that.initMap();			
			var input=document.getElementsByTagName('input')[0];
			input.focus();
		});
	}
	filterLocations(obj){                 //用来改变筛选完后的地址				
		 this.setState({
		 	locations : obj
		 });
	}
	
	componentDidUpdate(){                      
		var that=this;
		var markers=this.markers;
		var loc=that.state.locations;
		var newMarkers=[];              //用来存储筛选后出现的标记
		markers.forEach(item => {          //首先去掉地图上所有的标记
	 		item.setMap(null);
	 	}); 	
	 	for(var i=0;i<loc.length;i++){
	 		for(var j=0;j<markers.length;j++){
	 			if(loc[i].title===markers[j].title){
	 				newMarkers.push(markers[j]);
	 			}			 			
	 		}			 		 
	 	}
	 	newMarkers.forEach(function(item){  //筛选后显示匹配的标记
	 		item.setMap(that.map);
	 	});		
	}
	
  render() { 
	return (
		 <React.Fragment>
			<div id="map" role="application" ></div>
			<Filter locations={this.oldLocations}  filterFn={this.filterLocations} markers={this.markers} populateInfoWindow={this.populateInfoWindow}  
			map={this.map} infowindow={this.state.largeInfowindow}/>
		</React.Fragment>
	)

  }
}

export default App;
