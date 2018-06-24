import React,{Component} from 'react';

class List extends Component{	
	constructor(props){
		super(props);
		this.listClickFn=this.listClickFn.bind(this);
	}
	listClickFn(e){	           //列表点击时的处理函数
		var that=this;		
		var marker=	this.props.markers.filter(item =>{
			item.setAnimation(null); 			
			return item.title===e.target.innerText;
		});
		marker[0].setAnimation(window.google.maps.Animation.BOUNCE);
		this.props.populateInfoWindow(marker[0],that.props.infowindow);	
		var as=document.querySelectorAll('li a');
		for(var i=0;i<as.length;i++){
			as[i].style.background="none";
		}
		e.target.style.background="#ccc";
	}	
	render(){
		return (			
			 <React.Fragment>	 				 	
			 	{
			 		this.props.locations.length !==0 ? this.props.locations.map(item => <li key={item.title} id={item.id} onClick={this.listClickFn}><a href="javascript:void(0)">{item.title}</a></li>) : <li><a>暂时还没有推荐该景点哦!</a></li>
			 	}
			 </React.Fragment>	 	
		)
	}
	
}
export default List;