import { app } from "../../../web/scripts/app.js";
import { $el } from "../../../web/scripts/ui.js";

const ext = {
	// Unique name for the extension
	name: "Comfyui.ToolboxExtension",
	async init(app) {
		// Any initial setup to run as soon as the page loads
	},
	async setup(app) {
		// Any setup to run after the app is created
	},
	async addCustomNodeDefs(defs, app) {
		// Add custom node definitions
		// These definitions will be configured and registered automatically
	},
	async getCustomWidgets(app) {
		// Return custom widget types
		// See ComfyWidgets for widget examples
		console.log("[logging]", "provide custom widgets");

		return {
			JSON(node, inputName, inputData, app) {
			    const inputEl = document.createElement("code");
				inputEl.className = "comfy-json-preview";
				inputEl.value = inputData[1];

				const widget = node.addDOMWidget(inputName, "customjson", inputEl, {
					getValue() {
						return inputEl.value;
					},
					setValue(v) {
						inputEl.value = v;
					},
				});
				widget.inputEl = inputEl;

				return { minWidth: 400, minHeight: 400, widget };
			} 
		}
	},
	
	async beforeRegisterNodeDef(nodeType, nodeData, app) {
		// Run custom logic before a node definition is registered with the graph
		if (node?.comfyClass === "PreviewJson") { // 3
			const onExecuted = nodeType.prototype.onExecuted;                     // 4
			nodeType.prototype.onExecuted = function (message) {
				onExecuted?.apply(this, arguments);                           // 5
				console.log(message)                          // 6
			}
		}
	},
	async registerCustomNodes(app) {
		// Register any custom node implementations here allowing for more flexability than a custom node def
	},
	loadedGraphNode(node, app) {
		// Fires for each node when loading/dragging/etc a workflow json or png
		// If you break something in the backend and want to patch workflows in the frontend
	},
	nodeCreated(node, app) {
		// Fires every time a node is constructed
		// You can modify widgets/add handlers/etc here
	}
};

app.registerExtension(ext);
