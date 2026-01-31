<p align="center">
  <img src="public/Demogif.gif" width="550" alt="PC Demo">
  <img src="public/DemoPhone.gif" width="200" alt="Phone Demo">
</p>



# Frontend Service

This is the frontend service for the application, built using **React** and **React Flow**. The frontend provides an interactive interface for creating and managing flow diagrams with nodes and edges.

## Features
- Interactive Flow Diagram Allows users to create, edit, and delete nodes and edges.
- Custom Node Types Includes `Start`, `Action`, `If/Else`, and `End` nodes with unique designs and behaviors.
- Dynamic Node Editing Supports editing node properties, including branch names for `If/Else` nodes.
- React Flow Integration Utilizes React Flow for rendering and managing the flow diagram.
- Responsive Design Styled for a clean and responsive user experience.

## Prerequisites

- Node.js Ensure you have Node.js installed on your system.

## Setup Instructions

1. Clone the Repository
   ```bash
   git clone from the url: https://github.com/ArunKarthick19/technical_test.git
2.   cd technical_test/frontend
3. Once u have cded into the folder, npm install
4. Now you can start the frontend by  npm start

The app will run on http://localhost:3000

Key Components
1.  Nodes
    Start Node: Represents the starting point of the flow.
    Action Node: Represents an action in the flow.
    If/Else Node: Represents a decision point with branches.
    End Node: Represents the endpoint of the flow.
2.  Node Menu
    Allows users to add new nodes between existing edges.
    Provides options for adding Action or If/Else nodes.
3.  Node Form
    Allows users to edit node properties, such as names and branches.
    Supports adding and removing branches for If/Else nodes.
4.  React Flow Integration
    MiniMap: Displays an overview of the flow diagram.
    Controls: Provides zoom and fit-to-view options.
    Background: Adds a dotted background for better visualization.

Notes: 
-   The initial flow diagram includes a Start node connected to an End Node.
-   Custom styles for nodes and menus are defined in App.css.
    The app uses React Flow's useNodesState and useEdgesState hooks for managing state.