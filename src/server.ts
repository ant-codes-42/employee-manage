import MenuSystem from './classes/MenuSystem.js';
import { /*pool,*/ connectToDb } from './connection.js';

await connectToDb();

// CREATE MENU, SUBMENUS, AND OPTIONS
// SEE MenuSystem.ts in classes for logic behind menu system
async function main() {
    const menuSystem = new MenuSystem();

    // Create VIEW submenu - Contains all logic for choices inside option async function
    // First parameter = SubMenu name to attach the object 
    // Second parameter = string = menu option and explanation of what the function does
    const viewSubmenu = menuSystem.createSubMenu();
    menuSystem.addSubMenuItem(viewSubmenu, 'View all employees', async () => {
        console.log('Viewing all employees...');
        // Add your logic here
    });
    menuSystem.addSubMenuItem(viewSubmenu, 'View employees by manager', async () => {
        console.log('Viewing employees by manager...');
        // Add your logic here
    });
    menuSystem.addSubMenuItem(viewSubmenu, 'View employees by department', async () => {
        console.log('Viewing employees by department...');
        // Add your logic here
    });
    menuSystem.addSubMenuItem(viewSubmenu, 'View all departments', async () => {
        console.log('Viewing all departments...');
        // Add your logic here
    });
    menuSystem.addSubMenuItem(viewSubmenu, 'View all roles', async () => {
        console.log('Viewing all roles...');
        // Add your logic here
    });

    //Create ADD submenu
    const addSubmenu = menuSystem.createSubMenu();
    menuSystem.addSubMenuItem(addSubmenu, 'Add an employee', async () => {
        console.log('Adding an employee...');
        // Add your logic here
    });
    menuSystem.addSubMenuItem(addSubmenu, 'Add role', async () => {
        console.log('Adding a role...');
        // Add your logic here
    });
    menuSystem.addSubMenuItem(addSubmenu, 'Add department', async () => {
        console.log('Adding a department...');
        // Add your logic here
    });

    // Create UPDATE submenu
    const updateSubmenu = menuSystem.createSubMenu();
    menuSystem.addSubMenuItem(updateSubmenu, 'Update employee role', async () => {
        console.log('Updating employee role...');
        // Add your logic here
    });
    menuSystem.addSubMenuItem(updateSubmenu, 'Update employee manager', async () => {
        console.log('Updating employee manager...');
        // Add your logic here
    });

    // Create DELETE submenu
    const deleteSubmenu = menuSystem.createSubMenu();
    menuSystem.addSubMenuItem(deleteSubmenu, 'Delete an employee', async () => {
        console.log('Deleting an employee...');
        // Add your logic here
    });
    menuSystem.addSubMenuItem(deleteSubmenu, 'Delete a role', async () => {
        console.log('Deleting a role...');
        // Add your logic here
    });
    menuSystem.addSubMenuItem(deleteSubmenu, 'Delete a department', async () => {
        console.log('Deleting a department...');
        // Add your logic here
    });

    // Add main menu items
    menuSystem.addMainMenuItem('View', 'view', viewSubmenu);
    menuSystem.addMainMenuItem('Add', 'add', addSubmenu);
    menuSystem.addMainMenuItem('Update', 'update', updateSubmenu);
    menuSystem.addMainMenuItem('Delete', 'delete', deleteSubmenu);

    // Start the menu system
    await menuSystem.start();
}

main()
.catch(console.error);