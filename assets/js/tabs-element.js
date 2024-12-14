class TabsElement extends HTMLElement {
	constructor() {
		super();

		const self = this;

		let heading = self.querySelector(`#${self.getAttribute('aria-labelledby')}`);

		let tabList = CustomElementHelpers.createElementFromString(`
			<div
				role="tablist"
				aria-labelledby="${heading.id}"
			></div>
		`);
		
		let tabPanels = Array.from(self.querySelectorAll(':scope > section'));
		
		this.insertBefore(tabList, tabPanels[0]);

		tabList = self.querySelector(':scope > [role="tablist"]');

		tabPanels.forEach((tabPanel, i) => {
			let tab = CustomElementHelpers.createElementFromString(`<button type="button" role="tab" aria-controls="${tabPanel.id}" aria-selected="false"></button>`),
				nameChildNodes = tabPanel.querySelector(`#${tabPanel.getAttribute('aria-labelledby')}`).childNodes;

			tabList.appendChild(tab);

			tab = tabList.children[i];

			tab.addEventListener('click', (e) => {
				self.activateTab(e.currentTarget);
			});

			for (let node of nameChildNodes) {
				tab.appendChild(node.cloneNode(true));
			}

			tabPanel.setAttribute('role', 'tabpanel');
		});

		window.addEventListener('keydown', e => {
			if (!document.activeElement) return;
			
			if (!document.activeElement.closest('[role="tablist"]')) return;

			if (self !== document.activeElement.closest('[is="tabs-element"]')) return;

			if ('BUTTON' !== document.activeElement.tagName) return;

			if (
				('ArrowLeft' !== e.key)
				&& ('ArrowRight' !== e.key)
			) {
				return;
			}

			switch (e.key) {
				case 'ArrowLeft':
					if (!document.activeElement.previousElementSibling) return; 
					
					if ('tab' !== document.activeElement.previousElementSibling.getAttribute('role')) return;

					if ('-1' !== document.activeElement.previousElementSibling.getAttribute('tabindex')) return;

					let previousTab = document.activeElement.previousElementSibling;

					self.activateTab(previousTab);

					break;
				case 'ArrowRight':
					if (!document.activeElement.nextElementSibling) return;

					if ('tab' !== document.activeElement.nextElementSibling.getAttribute('role')) return;

					if ('-1' !== document.activeElement.nextElementSibling.getAttribute('tabindex')) return;

					let nextTab = document.activeElement.nextElementSibling;

					self.activateTab(nextTab);

					break;
			}
		});

		self.activateTab(tabList.children[0]);
	}

	activateTab(newTab) {
		let instance = newTab.closest('[is="tabs-element"]'),
			newTabPanel = instance.querySelector(`#${newTab.getAttribute('aria-controls')}`),
			tabs = instance.querySelectorAll('[role="tab"]'),
			selectedTextStrongElement = CustomElementHelpers.createElementFromString(`<strong class="selected-text" aria-hidden="true">Selected: </strong>`);

		for (let tab of tabs) {
			let tabPanel = instance.querySelector(`#${tab.getAttribute('aria-controls')}`),
				selectedTextStrongElement = tab.querySelector('strong.selected-text');

			CustomElementHelpers.hide(tabPanel);

			tab.setAttribute('tabindex', '-1');
			tab.setAttribute('aria-selected', 'false');
			if (selectedTextStrongElement) {
				tab.removeChild(selectedTextStrongElement);
			}
		}

		CustomElementHelpers.show(newTabPanel);

		newTab.setAttribute('tabindex', '0');
		newTab.setAttribute('aria-selected', 'true');
		newTab.insertBefore(selectedTextStrongElement, newTab.childNodes[0]);

		newTab.focus();
	}
}

customElements.define(
    'tabs-element',
    TabsElement,
    {
        extends: 'section'
    }
);