const horizontalCondition = () => {
	if (figmaPlus.scene.selection.length !== 1) return false;
	const selectedNode = figmaPlus.scene.selection[0];
	const rightOfSelectedNode = selectedNode.absoluteBounds.x + selectedNode.absoluteBounds.width;
	const neighborNodes = selectedNode.parent.children.filter(
		node => node.absoluteBounds.y === selectedNode.absoluteBounds.y && node.absoluteBounds.x >= rightOfSelectedNode
	);
	return neighborNodes.length > 0;
};

const verticalCondition = () => {
	if (figmaPlus.scene.selection.length !== 1) return false;
	const selectedNode = figmaPlus.scene.selection[0];
	const bottomOfSelectedNode = selectedNode.absoluteBounds.y + selectedNode.absoluteBounds.height;
	const neighborNodes = selectedNode.parent.children.filter(
		node => node.absoluteBounds.x === selectedNode.absoluteBounds.x && node.absoluteBounds.y >= bottomOfSelectedNode
	);
	return neighborNodes.length > 0;
};

const insertHorizontal = async () => {
	const selectedNode = await figmaPlus.scene.selection[0].getProperties();
	const rightOfSelectedNode = selectedNode.x + selectedNode.width;
	const absoluteRightOfSelectedNode = selectedNode.absoluteBounds.x + selectedNode.absoluteBounds.width;
	const neighborNodes = selectedNode.parent.children.filter(
		node =>
			node.absoluteBounds.y === selectedNode.absoluteBounds.y && node.absoluteBounds.x >= absoluteRightOfSelectedNode
	);
	console.log(neighborNodes);
	const nextNode = neighborNodes.sort((a, b) => {
		return a.absoluteBounds.x - b.absoluteBounds.x;
	})[0];
	console.log(nextNode);
	const gap = nextNode.absoluteBounds.x - absoluteRightOfSelectedNode;
	App.triggerAction('paste-over-selection');
	App.updateSelectionProperties({ x: rightOfSelectedNode + gap });
	await new Promise(resolve => setTimeout(resolve, 100));
	const pastedNode = figmaPlus.scene.selection[0];
	for (let neighborNode of neighborNodes) {
		const node = await neighborNode.getProperties();
		node.x = node.x + pastedNode.absoluteBounds.width + gap;
	}
	figmaPlus.scene.selection = [pastedNode];
};

const insertVertical = async () => {
	const selectedNode = await figmaPlus.scene.selection[0].getProperties();
	const bottomOfSelectedNode = selectedNode.y + selectedNode.height;
	const absoluteBottomOfSelectedNode = selectedNode.absoluteBounds.y + selectedNode.absoluteBounds.height;
	const neighborNodes = selectedNode.parent.children.filter(
		node =>
			node.absoluteBounds.x === selectedNode.absoluteBounds.x && node.absoluteBounds.y >= absoluteBottomOfSelectedNode
	);
	const nextNode = neighborNodes.sort((a, b) => {
		return a.absoluteBounds.y - b.absoluteBounds.y;
	})[0];
	const gap = nextNode.absoluteBounds.y - absoluteBottomOfSelectedNode;
	App.triggerAction('paste-over-selection');
	App.updateSelectionProperties({ y: bottomOfSelectedNode + gap });
	await new Promise(resolve => setTimeout(resolve, 100));
	const pastedNode = figmaPlus.scene.selection[0];
	for (let neighborNode of neighborNodes) {
		const node = await neighborNode.getProperties();
		node.y = node.y + pastedNode.absoluteBounds.height + gap;
	}
	figmaPlus.scene.selection = [pastedNode];
};

const deleteHorizontal = async () => {
	const selectedNode = figmaPlus.scene.selection[0];
	const rightOfSelectedNode = selectedNode.absoluteBounds.x + selectedNode.absoluteBounds.width;
	const neighborNodes = figmaPlus.scene.currentPage.children.filter(
		node => node.absoluteBounds.y === selectedNode.absoluteBounds.y && node.absoluteBounds.x >= rightOfSelectedNode
	);
	const nextNode = neighborNodes.sort((a, b) => {
		return a.absoluteBounds.x - b.absoluteBounds.x;
	})[0];
	const gap = nextNode.absoluteBounds.x - rightOfSelectedNode;
	App.triggerAction('delete-selection');
	for (let neighborNode of neighborNodes) {
		const node = await neighborNode.getProperties();
		node.x = node.x - selectedNode.absoluteBounds.width - gap;
	}
	App.sendMessage('clearSelection');
};

const deleteVertical = async () => {
	const selectedNode = figmaPlus.scene.selection[0];
	const bottomOfSelectedNode = selectedNode.absoluteBounds.y + selectedNode.absoluteBounds.height;
	const neighborNodes = selectedNode.parent.children.filter(
		node => node.absoluteBounds.x === selectedNode.absoluteBounds.x && node.absoluteBounds.y >= bottomOfSelectedNode
	);
	const nextNode = neighborNodes.sort((a, b) => {
		return a.absoluteBounds.y - b.absoluteBounds.y;
	})[0];
	const gap = nextNode.absoluteBounds.y - bottomOfSelectedNode;
	App.triggerAction('delete-selection');
	for (let neighborNode of neighborNodes) {
		const node = await neighborNode.getProperties();
		node.y = node.y - selectedNode.absoluteBounds.height - gap;
	}
	App.sendMessage('clearSelection');
};

figmaPlus.createContextMenuItem.Selection('Paste After', insertHorizontal, horizontalCondition);
figmaPlus.createContextMenuItem.Selection('Paste Below', insertVertical, verticalCondition);
figmaPlus.createContextMenuItem.Selection('Remove Frow Row', deleteHorizontal, horizontalCondition);
figmaPlus.createContextMenuItem.Selection('Remove From Column', deleteVertical, verticalCondition);
