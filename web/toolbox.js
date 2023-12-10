import { app } from "../../../scripts/app.js";
import { ComfyWidgets } from "../../../scripts/widgets.js";
import { api } from "/scripts/api.js";

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
		// console.log("[logging]", "provide custom widgets");

		return {
			JSON(node, inputName, inputData, app) {
				const inputEl = document.createElement("code");
				inputEl.className = "comfy-json-preview";
				inputEl.value = inputData.value;

				const widget = node.addDOMWidget(inputName, "customjson", inputEl, {
					getValue() {
						return inputEl.value;
					},
					setValue(v) {
						inputEl.value = v;
					},
				});
				widget.inputEl = inputEl;

				return { minWidth: 400, minHeight: 400, widget }
			}
		}

		// TODO add link and preview code
		// const defaultVal = inputData[1] || "";
		// return { widget: node.addWidget("json", inputName, defaultVal, () => {}, {}) };
		// } 
		// }
	},

	async beforeRegisterNodeDef(nodeType, nodeData, app) {
		// Run custom logic before a node definition is registered with the graph
		if (nodeType.comfyClass === "PreviewJson") { // 3

			const onNodeCreated = nodeType.prototype.onNodeCreated;
			nodeType.prototype.onNodeCreated = function () {
				const ret = onNodeCreated
					? onNodeCreated.apply(this, arguments)
					: undefined;

				let PreviewJsonNode = app.graph._nodes.filter(
					(wi) => wi.type == nodeData.name
				),
					nodeName = `${nodeData.name}_${PreviewJsonNode.length}`;

				console.log(`Create ${nodeData.name}: ${nodeName}`);

				const wi = getCustomWidgets(app).JSON(
					this,
					nodeName,
					{
						value: "Json output...",
					},
					app
				);
				wi.widget.inputEl.readOnly = true;
				return ret;
			};
			const outSet = function (texts) {
				if (texts.json_file.length > 0) {
					let widget_id = this?.widgets.findIndex(
						(w) => w.type == "customjson"
					);
					
					let currentWidget = this.widgets[widget_id]
					let request_api = async function () {

						let responseData = await api.fetchApi(
							`/toolbox/json/${texts.json_file.join("")}`,
							{
							method: "GET",
							headers: {
								"Content-Type": "application/json",
							},
							}
						);
						responseData = await responseData?.json();

						console.log(responseData)
						currentWidget.value = responseData.content;
						app.graph.setDirtyCanvas(true);
					}

					request_api();
				}
			};

			// onExecuted
			const onExecuted = nodeType.prototype.onExecuted;
			nodeType.prototype.onExecuted = function (texts) {
				onExecuted?.apply(this, arguments);
				outSet.call(this, texts);
			};
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
