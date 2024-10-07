// Defining a custom HTML element class called "Header"
class Header extends HTMLElement {
    // Constructor method for the Header class
    constructor() {
        super(); // Call the constructor of the HTMLElement superclass
    }

    // Method call when the element is added to the DOM
    connectedCallback() {
        // Set the inner HTML of the custom element
        this.innerHTML = `
    <nav>
    <div class="navbar">
        <a href="/home">Home</a>
        <div class="dropdown">
            <button class="dropbtn">Activity
            </button>
            <div class="dropdown-content">
                <a href="/requests">Requests</a>
                <a href="/approval">Approvals</a>
            </div>
        </div>
        <a href="/location" class="rig">Location</a>
        <a href="/assets">Assets</a>
        <a href="/employee">Employee</a>
        <a href="/my" class="rig" style="float: right;">My Profile</a>
        <a href="/logout" style="float:right;">Logout</a>
    </div>
    </nav>
    `;
    }
}

// Defining custom element <navigation-bar> using the Header class
customElements.define('navigation-bar', Header);