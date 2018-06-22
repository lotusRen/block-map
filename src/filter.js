import React, { Component } from 'react';
import './filter.css';

class Filter extends Component{
	
	constructor(props){
		super(props);
		this.oldLocations=this.props.locations;    
		this.filterFn=this.filterFn.bind(this);
		this.listClickFn=this.listClickFn.bind(this);
		this.locations=this.oldLocations;
		this.timer="";
	}
	filterFn(){	
		clearTimeout(this.timer);
		var that=this;
		this.timer=setTimeout(function(){
			var input=document.getElementsByTagName('input')[0];
			var val=input.value.toLowerCase();
						
			if(val===("" || " ")){
				that.locations=that.oldLocations;
				
			}else{
				that.locations=that.oldLocations.filter(function(item){
					return item.pingyin.indexOf(val) > -1 || item.abbreviation.indexOf(val)>-1 || item.title.indexOf(val) >-1;
				});
			}
			that.props.filterFn(that.locations);	   //更改app中地址状态
		},400);			
	}
	
	listClickFn(e){	
		var that=this;
		var marker=	this.props.markers.filter(item =>{
			item.setAnimation(null); 			
			return item.title===e.target.innerText;
		});
		marker[0].setAnimation(window.google.maps.Animation.BOUNCE);
		this.props.populateInfoWindow(marker[0],this.props.infowindow);
		
	}
	
	render(){
		return(
			<div id="filter">
				<h3>筛选你的景点</h3>
				<input type='text'  placeholder="输入你喜欢的景点进行筛选" onChange={this.filterFn}/>
				<ul>
				{
				this.locations.length !==0 ? this.locations.map(item => <li key={item.title} id={item.id} onClick={this.listClickFn}>{item.title}</li>) : <li>暂时还没有推荐该景点哦！</li>
				}
				</ul>
			</div>
		)
		
	}
}

export default  Filter;