(function(){
/**
 props 参数JSON格式为：{image:imgElem, up:[0,0,50,50], over:[50,0,50,50], down:[100,0,50,50], disabled:[150,0,50,50]}。
 */
var Button = Elf.Button = function(props){
	this.state = Button.UP;
	this.enabled = true;
    
	this.props = props || {};
	this.id = props.id || Elf.UID.create("Button");
	Elf.merge(this, props, true);
	Elf.DisplayObject.call(this,props);
	
	this.onInit();
};

Button.prototype = new Elf.DisplayObject();
Button.prototype.onInit = function(){
	var props = this.props;
	this._skin = new Elf.MovieClip({id:"skin", image:props.image});
	this.addChild(this._skin);
	this._skin.stop();
	
	if(props.useHandCursor === undefined) this.useHandCursor = true;
	if(props.up) this.setUpState(props.up);
	if(props.over) this.setOverState(props.over);
	if(props.down) this.setDownState(props.down);
	if(props.disabled) this.setDisabledState(props.disabled);
	
	this.bind(touchstart,this.onDispatchEvent).bind(touchend,this.onDispatchEvent);
};

/**
 * 按钮的弹起状态。常数。
 */
Button.UP = "up";
/**
 * 按钮的经过状态。常数。
 */
Button.OVER = "over";
/**
 * 按钮的按下状态。常数。
 */
Button.DOWN = "down";
/**
 * 按钮的不可用状态。常数。
 */
Button.DISABLED = "disabled";

/**
 * 设置按钮弹起状态的显示帧。
 */
Button.prototype.setUpState = function(upState)
{
	upState.label = Button.UP;
	this._skin.setFrame(upState, 0);
	this.upState = upState;
	return this;
};

/**
 * 设置按钮经过状态的显示帧。
 */
Button.prototype.setOverState = function(overState)
{
	overState.label = Button.OVER;
	this._skin.setFrame(overState, 1);
	this.overState = overState;
	return this;
};

/**
 * 设置按钮按下状态的显示帧。
 */
Button.prototype.setDownState = function(downState)
{
	downState.label = Button.DOWN;
	this._skin.setFrame(downState, 2);
	this.downState = downState;
	return this;
};

/**
 * 设置按钮不可用状态的显示帧。
 */
Button.prototype.setDisabledState = function(disabledState)
{
	disabledState.label = Button.DISABLED;
	this._skin.setFrame(disabledState, 3);
	this.disabledState = disabledState;
	return this;
};

/**
 * 设置按钮是否启用。
 */
Button.prototype.setEnabled = function(enabled)
{
	if(this.enabled == enabled) return this;
	this.eventEnabled = this.enabled = enabled;	 

	if(!enabled){
		if(this.disabledState){
			this._skin.gotoAndStop(Button.DISABLED);
		}else{
			this._skin.gotoAndStop(Button.UP);
		}
	}else{
		if(this._skin.currentFrame == 3) this._skin.gotoAndStop(Button.UP);
	}
	return this;
};

/**
 * 改变按钮的状态。
 */
Button.prototype.changeState = function(state){
	
	if(this.state == state) return;
	this.state = state;

	switch(state){
		case Button.OVER:
		case Button.DOWN:
		case Button.UP:
			if(!this.enabled) this.eventEnabled = this.enabled = true;
			this._skin.gotoAndStop(state);
			break;
		case Button.DISABLED:
			this.setEnabled(false);
			break;
	}
	return this;
};

/**
 * 按钮的默认事件处理行为。
 * @private
 */
Button.prototype.onDispatchEvent = function(e){
	if(!this.enabled) return;
	
	switch(e.type){
		case "mousemove":
			if(this.overState) this.changeState(Button.OVER);		
			break;
		case "mousedown":
		case "touchstart":
		case "touchmove":
			if(this.downState) this.changeState(Button.DOWN);
			break;
		case "mouseup":
			if(this.overState) this.changeState(Button.OVER);
			else this.changeState(Button.UP);
			break;
		case "mouseout":
		case "touchout":
		case "touchend":
			if(this.upState) this.changeState(Button.UP);
			break;
	}
};

})();