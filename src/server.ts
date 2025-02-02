import MenuSystem from './classes/MenuSystem.js';
import AddSystem from './classes/AddSystem.js';
import UpdateSystem from './classes/UpdateSystem.js';
import DeleteSystem from './classes/DeleteSystem.js';
import { connectToDb } from './utils/connection.js';

await connectToDb();

// CREATE MENU, SUBMENUS, AND OPTIONS
// SEE MenuSystem.ts in classes for logic behind menu system
async function main() {
    // init menu system
    const menuSystem = new MenuSystem();
    // init all the 'add' to DB logic
    const addSystem = new AddSystem();
    // init all the 'update' to DB logic
    const updateSystem = new UpdateSystem();
    // init all the 'delete' to DB logic
    const deleteSystem = new DeleteSystem();

    // Create VIEW submenu - Contains all logic for choices inside option async function
    // First parameter = SubMenu name to attach the object 
    // Second parameter = string = menu option and explanation of what the function does
    const viewSubmenu = menuSystem.createSubMenu();
    menuSystem.addSubMenuItem(viewSubmenu, 'View all employees', async () => {
        console.log('Viewing all employees...');
        // Add logic here
    });
    menuSystem.addSubMenuItem(viewSubmenu, 'View employees by manager', async () => {
        console.log('Viewing employees by manager...');
        // Add logic here
    });
    menuSystem.addSubMenuItem(viewSubmenu, 'View employees by department', async () => {
        console.log('Viewing employees by department...');
        // Add logic here
    });
    menuSystem.addSubMenuItem(viewSubmenu, 'View all departments', async () => {
        console.log('Viewing all departments...');
        // Add logic here
    });
    menuSystem.addSubMenuItem(viewSubmenu, 'View all roles', async () => {
        console.log('Viewing all roles...');
        // Add logic here
    });

    //Create ADD submenu
    const addSubmenu = menuSystem.createSubMenu();
    menuSystem.addSubMenuItem(addSubmenu, 'Add an employee', async () => {
        console.log('Adding an employee...');
        await addSystem.addEmployee();

    });
    menuSystem.addSubMenuItem(addSubmenu, 'Add role', async () => {
        console.log('Adding a role...');
        await addSystem.addRole();
    });
    menuSystem.addSubMenuItem(addSubmenu, 'Add department', async () => {
        console.log('Adding a department...');
        await addSystem.addDept();
    });

    // Create UPDATE submenu
    const updateSubmenu = menuSystem.createSubMenu();
    menuSystem.addSubMenuItem(updateSubmenu, 'Update employee role', async () => {
        console.log('Updating employee role...');
        await updateSystem.updateEmployeeRole();
    });
    menuSystem.addSubMenuItem(updateSubmenu, 'Update employee manager', async () => {
        console.log('Updating employee manager...');
        await updateSystem.updateEmployeeManager();
    });

    // Create DELETE submenu
    const deleteSubmenu = menuSystem.createSubMenu();
    menuSystem.addSubMenuItem(deleteSubmenu, 'Delete an employee', async () => {
        console.log('Deleting an employee...');
        await deleteSystem.deleteEmployee();
    });
    menuSystem.addSubMenuItem(deleteSubmenu, 'Delete a role', async () => {
        console.log('Deleting a role...');
        await deleteSystem.deleteRole();
    });
    menuSystem.addSubMenuItem(deleteSubmenu, 'Delete a department', async () => {
        console.log('Deleting a department...');
        await deleteSystem.deleteDepartment();
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