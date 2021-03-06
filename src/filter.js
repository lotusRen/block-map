import React, { Component } from 'react';
import './filter.css';

class Filter extends Component{	
	constructor(props){
		super(props);
		this.oldLocations=this.props.locations;    
		this.filterFn=this.filterFn.bind(this);
		this.locations=this.oldLocations;
		this.timer="";
	}
	filterFn(){	             //筛选景点
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
	

	hideOrShowMenu(){
		var filterBar=document.getElementById('filter');
		var as=document.querySelectorAll('li a');
		var input=document.getElementsByTagName('input')[0];
		if(filterBar.offsetLeft===0){                      
			filterBar.style.left=-filterBar.offsetWidth+'px';		
			for(var i=0;i<as.length;i++){
				as[i].setAttribute('tabindex','-1');          //当侧边栏隐藏时，让所有的列表和输入框跳出tab
			}			
			input.setAttribute('tabindex','-1');
		}else{
			filterBar.style.left='0';
			for(var j=0;j<as.length;j++){
				as[j].setAttribute('tabindex','2');
			}	
			input.setAttribute('tabindex','1');
		}
	}
	render(){
		return(
			<div id="filter">
				<button id="menubtn" onClick={this.hideOrShowMenu} onTouchStart={this.hideOrShowMenu}   tabIndex="3" title="点我控制侧边框是否显示哦！"><span></span><span></span><span></span></button>
				<h3>筛选你的景点</h3>
				<input type='text'  placeholder="输入你喜欢的景点进行筛选" onChange={this.filterFn} aria-label="输入景点"/>
				
				<ul role="listbox">
					{this.props.children}
				</ul>
				
			</div>
		)
		
	}
}

export default  Filter;