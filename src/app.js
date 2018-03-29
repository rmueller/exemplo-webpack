var template = require("./outer.handlebars");
import {minhaFuncaoQueDefineTitle} from './lib.js'

export function MeuApp() {
	document.addEventListener("DOMContentLoaded", () => {
		var div = document.createElement('div');
		div.innerHTML = template({
			segundoNivel: "Segundo nível!",
			title: minhaFuncaoQueDefineTitle()
		});
		document.body.appendChild(div);
	});
}