import inquirer from 'inquirer';

type MenuAction = () => Promise<void>;
type SubMenu = Map<string, MenuAction>;

interface MenuItem {
    name: string;
    value: string;
    submenu?: SubMenu;
}

class MenuSystem {
    private mainMenu: MenuItem[];
    private menuMap: Map<string, SubMenu>;

    constructor() {
        this.mainMenu = [];
        this.menuMap = new Map();
    }

    // Method to add a main menu with optional submenu
    addMainMenuItem(name: string, value: string, submenu?: SubMenu): void {
        this.mainMenu.push({ name, value, submenu });
        if (submenu) {
            this.menuMap.set(value, submenu);
        }
    }

    // Method to create a new SubMenu map
    createSubMenu(): SubMenu {
        return new Map<string, MenuAction>();
    }

    // Method to add a submenu item
    addSubMenuItem(submenu: SubMenu, name: string, action: MenuAction): void {
        submenu.set(name, action);
    }

    // Handle submenu selection
    private async handleSubMenu(submenu: SubMenu): Promise<void> {
        const choices = Array.from(submenu.keys());
        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'Select an option:',
                choices: [...choices, 'Back']
            }
        ]);

        if (choice === 'Back') {
            await this.start();
            return;
        }

        const action = submenu.get(choice);
        if (action) {
            await action();
            // Return to submenu after action completes
            await this.handleSubMenu(submenu);
        }
    }

    // Start the menu system
    async start(): Promise<void> {
        const { menuChoice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'menuChoice',
                message: 'Select an option:',
                choices: [
                    ...this.mainMenu.map(item => ({
                        name: item.name,
                        value: item.value
                    })),
                    { name: 'Exit', value: 'exit' }
                ]
            }
        ]);

        if (menuChoice === 'exit') {
            console.log('Goodbye!');
            process.exit(0);
        }

        const selectedItem = this.mainMenu.find(item => item.value === menuChoice);
        if (selectedItem?.submenu) {
            await this.handleSubMenu(selectedItem.submenu);
        }
    }
}

export default MenuSystem;