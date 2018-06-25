import React, { Component } from 'react';
import './App.css';
import Filter from './filter.js';
import List from './list.js';
import $ from 'jquery';

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
	            var as=document.querySelectorAll('li a');
	            var a='';                //用来保存当前marker对应的li
				for(var i=0;i<as.length;i++){
					as[i].style.background="white";
					if(as[i].innerText===this.title){
						a=as[i];
						a.style.background="#ccc";
					}						
				}		            
	        });
	        bounds.extend(that.markers[i].position);
	    }			   
	    that.map.fitBounds(bounds); 			
	}			
	populateInfoWindow(marker, infowindow){           //生成信息窗口函数
		var that=this;
		 if (infowindow.marker !==marker) {		 	
			 infowindow.setContent('');
	         infowindow.marker = marker;
	         infowindow.addListener('closeclick', function() {
	            infowindow.marker = null;
	         });
	          
	        var streetViewService = new window.google.maps.StreetViewService();      //新建一个街景
            var radius = 50;
            function getStreetView(data, status) {
            if (status === window.google.maps.StreetViewStatus.OK) {   
                infowindow.setContent('<div style="font-size:16px;  font-weight: ;">' + marker.title + '</div><div id="pano"></div><p id="infoFromWiki">loading...</p>');
                var panoramaOptions = {
                  position: marker.position,
                  pov: {
                    heading:34,
                    pitch: 5
                  }
                };
               new window.google.maps.StreetViewPanorama(           //添加全景图
                document.getElementById('pano'), panoramaOptions);
               
            } else {
              infowindow.setContent('<div style="font-size:16px;  font-weight: ;">' + marker.title + '</div>' +
                '<div>No Street View Found</div><p id="infoFromWiki">loading...</p>');
            }
          }      
          that.infofromwiki(marker.title);                       //调用维基百科内容
          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);          
          infowindow.open(that.map, marker);
        }		
	}
	
	infofromwiki(keyword){                   //获取维基百科的内容
		$.ajax({
            url: "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="+keyword+"&prop=info&inprop=url&utf8=&format=json",
            dataType:"jsonp",
            async:'true',
            success:function(response){
            		var box=document.getElementById('infoFromWiki');
            		if(box && response.query.search){
            			box.innerHTML=response.query.search[0].snippet;
            		}else if(box){
            			box.innerText="抱歉没能找到相关介绍！";
            		}           		
            },
            error:function(){
                //获取出错了
                alert("Sorry,there's something wrong within the search,please refresh this page and try again!");
            }
        });
	}
	componentDidMount(){
		var that=this;
		window.addEventListener('load',function(){	
			that.mapsHeightFn();			              //设置地图的高度
			 that.setState({
				 largeInfowindow:new window.google.maps.InfoWindow()    //创建信息窗口
			 });
			that.initMap();			
			var input=document.getElementsByTagName('input')[0];        //筛选框自动获焦
			input.focus();
		});
		window.addEventListener('resize',function(){
			that.mapsHeightFn();			
		});
	}
	mapsHeightFn(){                        //设置地图的高度
		var theMap=document.getElementById('map');
		var filterBar=document.getElementById('filter');
		theMap.style.height=filterBar.offsetHeight+"px";		
			filterBar.style.left='0';	
			
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
					<Filter locations={this.oldLocations}  filterFn={this.filterLocations}  >
						<List locations={this.state.locations} markers={this.markers}   populateInfoWindow={this.populateInfoWindow}  infowindow={this.state.largeInfowindow} />
					</Filter>
			</React.Fragment>
		)
	}
}

export default App;
