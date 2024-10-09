import * as React from "react";

export function Sidebar() {
    return(
        <aside id="sidebar">
            <img id="company-logo" src="./assets/company-logo.svg" alt="Construction Company" />
            <ul id="nav-buttons">
                <li id="projects-list-page-button"><span className="material-icons-round">apartment </span>  Projects</li>
                <li id="users-list-page-button"><span className="material-icons-round">people </span>  Users</li>
                <li><span className="material-icons-round">house </span>  Projects2</li>
                <li><span className="material-icons-round">real_estate_agent </span>  Projects</li>
                <li><span className="material-icons-round">holiday_village </span>  Projects</li>
            </ul>
        </aside>
    )
}