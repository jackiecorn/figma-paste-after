const duplicateNode = async () => {
	const selectedNode = figmaPlus.scene.selection[0];
	const rightOfSelectedNode = selectedNode.absoluteBounds.x + selectedNode.absoluteBounds.width;
	const neighborNodes = figmaPlus.scene.currentPage.children.filter(
		node => node.absoluteBounds.y === selectedNode.absoluteBounds.y && node.absoluteBounds.x >= rightOfSelectedNode
	);
	const nextNode = neighborNodes.sort((a, b) => {
		return a.absoluteBounds.x - b.absoluteBounds.x;
	})[0];
	const gap = nextNode.absoluteBounds.x - rightOfSelectedNode;
	for (let neighborNode of neighborNodes) {
		const node = await neighborNode.getProperties();
		node.x = node.x + selectedNode.absoluteBounds.width + gap;
	}
	figmaPlus.scene.selection = [selectedNode];
	App.triggerAction('duplicate');
};

const insertNode = async () => {
	const selectedNode = figmaPlus.scene.selection[0];
	const rightOfSelectedNode = selectedNode.absoluteBounds.x + selectedNode.absoluteBounds.width;
	const neighborNodes = figmaPlus.scene.currentPage.children.filter(
		node => node.absoluteBounds.y === selectedNode.absoluteBounds.y && node.absoluteBounds.x >= rightOfSelectedNode
	);
	const nextNode = neighborNodes.sort((a, b) => {
		return a.absoluteBounds.x - b.absoluteBounds.x;
	})[0];
	const gap = nextNode.absoluteBounds.x - rightOfSelectedNode;
	App.triggerAction('paste-over-selection');
	App.updateSelectionProperties({ x: rightOfSelectedNode + gap });
	await new Promise(resolve => setTimeout(resolve, 100));
	const pastedNode = figmaPlus.scene.selection[0];
	for (let neighborNode of neighborNodes) {
		const node = await neighborNode.getProperties();
		node.x = node.x + pastedNode.absoluteBounds.width + gap;
	}
};

const deleteNode = async () => {
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

duplicateNodeShortcut = {
	mac: {
		command: true,
		shift: true,
		key: 'D'
	},
	windows: {
		control: true,
		shift: true,
		key: 'D'
	}
};

deleteNodeShortcutBackspace = {
	mac: {
		command: true,
		shift: true,
		key: 'Backspace'
	},
	windows: {
		control: true,
		shift: true,
		key: 'Backspace'
	}
};

deleteNodeShortcutDelete = {
	mac: {
		command: true,
		shift: true,
		key: 'Delete'
	},
	windows: {
		control: true,
		shift: true,
		key: 'Delete'
	}
};

const condition = () => {
	if (figmaPlus.scene.selection.length !== 1) return false;
	const selectedNode = figmaPlus.scene.selection[0];
	const rightOfSelectedNode = selectedNode.absoluteBounds.x + selectedNode.absoluteBounds.width;
	const neighborNodes = figmaPlus.scene.currentPage.children.filter(
		node => node.absoluteBounds.y === selectedNode.absoluteBounds.y && node.absoluteBounds.x >= rightOfSelectedNode
	);
	return selectedNode.parent.id === figmaPlus.scene.currentPage.id && neighborNodes.length > 0;
};

figmaPlus.createPluginsMenuItem('Duplicate and Push', duplicateNode, condition, duplicateNodeShortcut);

figmaPlus.createPluginsMenuItem('Delete and Push', deleteNode, condition, deleteNodeShortcutDelete);

figmaPlus.createContextMenuItem.Selection('Duplicate and Push', duplicateNode, condition, duplicateNodeShortcut);

figmaPlus.createContextMenuItem.Selection('Delete and Push', deleteNode, condition, deleteNodeShortcutDelete);

figmaPlus.createContextMenuItem.Selection('Insert', insertNode);

figmaPlus.createKeyboardShortcut(duplicateNodeShortcut, duplicateNode, condition);

figmaPlus.createKeyboardShortcut(deleteNodeShortcutBackspace, deleteNode, condition);

figmaPlus.createKeyboardShortcut(deleteNodeShortcutDelete, deleteNode, condition);
