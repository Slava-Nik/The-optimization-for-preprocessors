	function findBem(options){
		var html = options.html;
		var htmlText = html.innerHTML;
		var notSureBlocks = [];
		var result = "touch ";

		var elems = getAllElements();
		
		for(var i = 0; i < elems.length; i++){
			var elem= elems[i];
			var blockClass = getBlockClass(elem);
			if(blockClass){
				result+= blockClass + ".scss ";
			}
		}
		var startMenu = document.getElementById('start-menu');
		var outputMenu = document.getElementById('output');

		if(notSureBlocks.length){

			outputMenu.firstElementChild.hidden = false;

			setTimeout(function(){ startMenu.hidden = true;}, 2000);

			var disputList = outputMenu.querySelector(".output__disputList");

			for(var j = 0; j < notSureBlocks.length; j++ ){
				var li = document.createElement("li");
				var p = document.createElement("p");
				p.textContent = notSureBlocks[j].cloneNode(false).outerHTML;
				li.appendChild(p);
				var button = document.createElement("div");
				button.className = "button-delete";
				li.appendChild(button);

				disputList.appendChild(li);
			}
		}
		outputMenu.classList.add("animation-shift"); 

		
		
	function getAllElements(){
			return html.querySelectorAll("[class]");
		}


		function getBlockClass(elem){
			
			var className = elem.getAttribute("class");
			if(!className) return false;
			var classes = className.split(" ");
			for(var i = 0; i < classes.length; i++) {
				
				if( (classes[i].indexOf("__") + 1) || (classes[i].indexOf("--") + 1) ) { 
					continue;
				}
			  // Да, элемент имеет класс похожий на блок, проверим содержит ли он подобные БЭМ-элементы, если да - это БЭМ-блок
				if( isContainBemElems(elem, classes[i]) ) return classes[i]; //возвращаем класс БЭМ-блока

				// Если внутри нет подобных БЭМ-элементов, то мы точно не знаем является ли он БЭМ-блоком
				else {
					notSureBlocks.push(elem);
					return false;
				}
				 
			}
			return false;

			function isContainBemElems(elem,classOfBlock) {
				var allChildren = elem.getElementsByTagName("*");
				for(var i = 0; i < allChildren.length; i++){
					var childClassName = allChildren[i].getAttribute("class");
					if(childClassName){
							if( childClassName.indexOf(classOfBlock + "__") + 1)  return true;
					}else continue;

				}
				return false;
			}

		}

		function getResult(){

				addChosenClasses();
				outputMenu.firstElementChild.hidden = true;

				var outputResultBlock = document.querySelector('.output__result-wrapper');
				outputResultBlock.hidden = false;
				outputResultBlock.children[1].innerHTML = result;

				function addChosenClasses() {
					var items = disputList.children;
					for(var i = 0; i < items.length; i++){
						var blockText = items[i].firstElementChild.innerHTML;
						var blockClass = getBlockClass(blockText);
						if(blockClass){
							result += blockClass + ".scss ";
						}
					}
					function getBlockClass(blockText){
						var startChar = blockText.indexOf("class=") + 7;
						var endChar = blockText.indexOf("\"", startChar + 1 );
						if(endChar === -1){
							endChar = blockText.indexOf("\'", startChar + 1 );
						}
						var blockClassName = blockText.slice(startChar,endChar);
						var blockClasses = blockClassName.split(" ");
						for(var i = 0; i < blockClasses.length; i++){
							if( (blockClasses[i].indexOf("__") + 1) || (blockClasses[i].indexOf("--") + 1) ) { 
								continue;
							}else return blockClasses[i];
						}
					}
			}

	}


		document.onclick = function(e){
			var target = e.target;
			if(!target.classList.contains("button-delete")) return;
			 var item = target.parentNode;
			 item.parentNode.removeChild(item);
		};

		resultButton.onclick = function(){
			getResult();
		};


	}


	findBlocks.onclick = function(){ 

		var html = document.getElementById("initialHtml");
		if (!html.value) return;
		var mainBlock = document.getElementById("main-block");
		mainBlock.insertAdjacentHTML("afterBegin", html.value);
		findBem({html: mainBlock});
	};
