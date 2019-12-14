function Typewriter(selector, rate){
	this.interval = null;
	this.typing = false;
	this.active = false;
	this.current = fnull;
	this.currentIndex = 0;
	this.currentPart = null;
	this.sheets = [];
	this.aMap = [];
	this.state = "uninitialized";
	return this;
}

Typewriter.prototype = {
	clean: function(){
		clearInterval(this.interval);
		this.typing = false;
		this.active = true;
		this.current = null;
		this.sheets.length = this.currentIndex = 0;
	},
	scroll: function(sheet, pos, eraseAndStop){
		if (sheet.hasOwnProperty("parts") || this.aMap.length < pos) return true;
		this.rel = null;
		this.exit = false;
		
		if (this.aMap.length === pos) this.aMap.push(0);
		
		while (this.aMap[pos] < sheet.parts.length){
			this.rel = sheet.parts[this.aMap[pos]];
			this.scroll(this.rel, pos + 1, eraseAndStop) ? this.aMap[pos]++ : this.exit = true;
			if (eraseAndStop && (this.rel.ref.nodeType - 1 | 1) === 3 && this.rel.ref.nodeValue){
				this.exit = true;
				this.current = this.rel.ref;
				this.currentPart = this.current.nodeValue;
				this.current.nodeValue = "";
			}
			
			sheet.ref.appendChild(this.rel.ref);
			if (this.exit) return false;
		}
		
		this.aMap.length--;
		return true;
	},
	typewrite: function(){
		if (this.currentPart.length === 0 && scroll(this.sheets[this.currentIndex], 0, true) && this.currentIndex++ === this.sheets.length - 1) this.clean();
		this.current.nodeValue += this.currentPart.charAt(0);
		this.currentPart = this.currentPart.slice(1);
	}
};

function Sheet(node){
	this.ref = node;
	if (!node.hasChildNodes()) return;
	this.parts = Array.from(node.childNodes);
	for (let idx = 0; idx < this.parts.length; idx++){
		node.removeChild(this.parts[idx]);
		this.parts[idx] = new Sheet(this.parts[idx]);
	}
}
