import React, { useState, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Handle, Position } from 'reactflow';
// Firstly, we import all the necessary libraries and components needed for the project to work

// Custom node types
//here we define and design the nodes that will be used for the flow diagram
const nodeTypes = {
  start: ({ data, id }) => (
    <div style={{
      padding: '15px',
      borderRadius: '8px',
      background: '#e6f7ff',
      border: '1px solid #1890ff',
      width: '180px',
      position: 'relative',
    }}>
      <Handle
        type="source"
        position={Position.Bottom}
        id="source"
        style={{ background: '#1890ff', width: '10px', height: '10px' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ fontWeight: 'bold' }}>  Start Node</div>
      </div>
      <div>{data.label || 'Start'}</div>
    </div>
  ),
  action: ({ data, id }) => (
    <div style={{
      padding: '15px',
      borderRadius: '8px',
      background: '#f0f5ff',
      border: '1px solid #597ef7',
      width: '180px',
      position: 'relative',
    }}>
      <Handle
        type="target"
        position={Position.Top}
        id="target"
        style={{ background: '#597ef7', width: '10px', height: '10px' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source"
        style={{ background: '#597ef7', width: '10px', height: '10px' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        
        <div style={{ fontWeight: 'bold' }}>Action Node</div>
      </div>
      <div>{data.label || 'Action'}</div>
    </div>
  ),
  ifelse: ({ data, id }) => (
    <div style={{
      padding: '15px',
      borderRadius: '8px',
      background: '#fff7e6',
      border: '1px solid #ffc53d',
      width: '180px',
      position: 'relative',
    }}>
      <Handle
        type="target"
        position={Position.Top}
        id="target"
        style={{ background: '#ffc53d', width: '10px', height: '10px' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source"
        style={{ background: '#ffc53d', width: '10px', height: '10px' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>

        <div style={{ fontWeight: 'bold' }}>If / Else</div>
      </div>
      <div>{data.label || 'If / Else'}</div>
    </div>
  ),
  end: ({ data, id }) => (
    <div style={{
      padding: '15px',
      borderRadius: '8px',
      background: '#f9f0ff',
      border: '1px solid #9254de',
      width: '180px',
      position: 'relative',
    }}>
      <Handle
        type="target"
        position={Position.Top}
        id="target"
        style={{ background: '#9254de', width: '10px', height: '10px' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ fontWeight: 'bold' }}>End Node</div>
      </div>
      <div>{data.label || 'END'}</div>
    </div>
  ),
};

//This is the initial edge that connects the start and end(LVL1)
const initialNodes = [
  {
    id: 'start',
    type: 'start',
    position: { x: 300, y: 50 },
    data: { label: 'Start' },
  },
  {
    id: 'end',
    type: 'end',
    position: { x: 300, y: 400 },
    data: { label: 'END' },
  },
];

const initialEdges = [
  { 
    id: 'start->end', 
    source: 'start', 
    target: 'end', 
    type: 'smoothstep',
    sourceHandle: 'source',
    targetHandle: 'target'
  },
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges,] = useEdgesState(initialEdges); //2 default hooks
  const [nodeCount, setNodeCount] = useState(1); // unique node IDs
  const [selectedNode, setSelectedNode] = useState(null); //holds the ID of the selected node
  const [showNodeMenu, setShowNodeMenu] = useState(false); //boolean value to track if the node menu is shown or not
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 }); //to track the position of the node menu
  const [clickedEdgeId, setClickedEdgeId] = useState(null); //track the id of the edge selected 
  const [showNodeForm, setShowNodeForm] = useState(false); //boolean to track if node form is shown or not
  const [nodeFormData, setNodeFormData] = useState({ name: '', type: '' }); //to track the data entered in the node form
  const [branchCount, setBranchCount] = useState(1); //to track the number of the branches
  const reactFlowWrapper = useRef(null); //for DOM reference

  console.log('slec',selectedNode)

  // Handle node click
  const onNodeClick = (event, node) => {
    setSelectedNode(node);
    setNodeFormData({
      id: node.id,
      name: node.data.label,
      type: node.type,
      branches: node.data.branches || []
    });
    if (
      node.id === 'start' || 
      node.id === 'end' || 
      node.id.startsWith('action-') || 
      (node.id.startsWith('ifelse-') && !node.id.includes('branch') && !node.id.includes('action'))
  ) {
      setShowNodeForm(true);
  }
  };

  // Handle background click to close forms
  const onPaneClick = () => {
    setSelectedNode(null);
    setShowNodeForm(false);
    setShowNodeMenu(false);
  };

  // Handle edge click to show add node menu
  const onEdgeClick = (event, edge) => {
    setClickedEdgeId(edge.id);
    setMenuPosition({ x: 150, y: 100 });
    setShowNodeMenu(true);
  };

  // Custom edge changes handler to prevent automatic connections to end node
  const onCustomEdgesChange = (changes) => {
    setEdges((eds) => {
      // Apply the changes
      let newEdges = [...eds];
      
      for (const change of changes) {
        if (change.type === 'add') {
          // Check if this is an automatic connection to the end node from a branch action node
          if (change.item.target === 'end' && (
              // Prevent connections from branch actions to main end
              (change.item.source.includes('-branch-') && change.item.source.includes('-action')) ||
              // Prevent connections from else actions to main end
              (change.item.source.includes('-else-action'))
            )) {
            // Skip this change - don't add this edge
            continue;
          }
          newEdges.push(change.item);
        } else if (change.type === 'remove') {
          newEdges = newEdges.filter((edge) => edge.id !== change.id);
        } else if (change.type === 'replace') {
          newEdges = change.item;
        }
      }
      
      return newEdges;
    });
  };

  // Add a new node between two existing nodes
  const addNodeBetween = (nodeType) => {
    if (!clickedEdgeId) return;
    
    const edge = edges.find(e => e.id === clickedEdgeId);
    if (!edge) return;
    
    const sourceNode = nodes.find(node => node.id === edge.source);
    const targetNode = nodes.find(node => node.id === edge.target);
    
    if (!sourceNode || !targetNode) return;
    
    // Calculate position for the new node
    const newNodePosition = {
      x: (sourceNode.position.x + targetNode.position.x) / 2,
      y: (sourceNode.position.y + targetNode.position.y) / 2,
    };
    
    const newNodeId = `${nodeType}-${nodeCount}`;
    
    let newNode = {
      id: newNodeId,
      type: nodeType,
      position: newNodePosition,
      data: { label: nodeType === 'action' ? 'Action Node' : 'If / Else' },
    };
    
    // If it's an if/else node, add default branches
    if (nodeType === 'ifelse') {
      newNode.data.branches = [
        { id: 'branch-1', name: 'Branch #1' }
      ];
      
      // Create action nodes for each branch
      const actionNodes = [
        {
          id: `${newNodeId}-branch-1-action`,
          type: 'action',
          position: { 
            x: newNodePosition.x - 150, 
            y: newNodePosition.y + 100 
          },
          data: { label: 'Branch #1' }, 
        },
        {
          id: `${newNodeId}-else-action`,
          type: 'action',
          position: { 
            x: newNodePosition.x, 
            y: newNodePosition.y + 100 
          },
          data: { label: 'Else' }, 
        }
      ];
      
      // Create an end node for the else branch
      const elseEndNode = {
        id: `${newNodeId}-else-end`,
        type: 'end',
        position: { 
          x: newNodePosition.x, 
          y: newNodePosition.y + 300 
        },
        data: { label: 'END' },
      };
      
      // Create branch edges
      const branchEdges = [
        // Connect if/else directly to actions
        {
          id: `${newNodeId}-to-branch-1-action`,
          source: newNodeId,
          target: `${newNodeId}-branch-1-action`,
          type: 'smoothstep',
          sourceHandle: 'source',
          targetHandle: 'target',
        },
        {
          id: `${newNodeId}-to-else-action`,
          source: newNodeId,
          target: `${newNodeId}-else-action`,
          type: 'smoothstep',
          sourceHandle: 'source',
          targetHandle: 'target',
        },
        
        // Connect branch #1 action to target
        {
          id: `${newNodeId}-branch-1-action-to-target`,
          source: `${newNodeId}-branch-1-action`,
          target: edge.target,
          type: 'smoothstep',
          sourceHandle: 'source',
          targetHandle: 'target',
        },
        
        // Connect else action to its own end node
        {
          id: `${newNodeId}-else-action-to-end`,
          source: `${newNodeId}-else-action`,
          target: `${newNodeId}-else-end`,
          type: 'smoothstep',
          sourceHandle: 'source',
          targetHandle: 'target',
        }
      ];
      
      // Add all nodes and edges
      setNodes(nds => [...nds, newNode, ...actionNodes, elseEndNode]);
      setEdges(eds => {
        // Remove the original edge
        const filteredEdges = eds.filter(e => e.id !== clickedEdgeId);
        
        // Add new edges
        return [
          ...filteredEdges,
          {
            id: `${edge.source}-${newNodeId}`,
            source: edge.source,
            target: newNodeId,
            type: 'smoothstep',
            sourceHandle: 'source',
            targetHandle: 'target',
          },
          ...branchEdges
        ];
      });
    } else {
      // For action nodes
      setNodes(nds => [...nds, newNode]);
      
      // Update edges
      setEdges(eds => {
        // Remove the original edge
        const filteredEdges = eds.filter(e => e.id !== clickedEdgeId);
        
        // Add new edges
        return [
          ...filteredEdges,
          {
            id: `${edge.source}-${newNodeId}`,
            source: edge.source,
            target: newNodeId,
            type: 'smoothstep',
            sourceHandle: 'source',
            targetHandle: 'target',
          },
          {
            id: `${newNodeId}-${edge.target}`,
            source: newNodeId,
            target: edge.target,
            type: 'smoothstep',
            sourceHandle: 'source',
            targetHandle: 'target',
          }
        ];
      });
    }
    
    setNodeCount(nodeCount + 1);
    setShowNodeMenu(false);
  };

  // Add a new branch to an if/else node
  const addBranch = () => {
    if (!selectedNode || selectedNode.type !== 'ifelse') return;
    
    const newBranchId = `branch-${nodeFormData.branches.length + 1}`;
    const newBranch = { id: newBranchId, name: `Branch #${nodeFormData.branches.length + 1}` };
    
  
    setNodeFormData({
      ...nodeFormData,
      branches: [...nodeFormData.branches, newBranch]
    });
    
    // Get the if/else node position
    const ifElseNode = nodes.find(node => node.id === selectedNode.id);
    if (!ifElseNode) return;
    
    // Calculate position for the new branch action node
    const branchActionPosition = {
      x: ifElseNode.position.x - 150 + (nodeFormData.branches.length * 50), 
      y: ifElseNode.position.y + 100
    };
    
    // Calculate position for the new branch end node
    const branchEndPosition = {
      x: branchActionPosition.x,
      y: branchActionPosition.y + 200
    };
    
    // Create action node for the new branch
    const branchActionNode = {
      id: `${selectedNode.id}-${newBranchId}-action`,
      type: 'action',
      position: branchActionPosition,
      data: { label: `${newBranch.name}` },
    };
    
    // Create end node for the new branch
    const branchEndNode = {
      id: `${selectedNode.id}-${newBranchId}-end`,
      type: 'end',
      position: branchEndPosition,
      data: { label: 'END' },
    };
    
    // Add the new nodes
    setNodes(nds => [...nds, branchActionNode, branchEndNode]);
    
    // Create edges to connect the if/else node to the new action node and the action node to the end node
    const newEdges = [
      {
        id: `${selectedNode.id}-to-${newBranchId}-action`,
        source: selectedNode.id,
        target: branchActionNode.id,
        type: 'smoothstep',
        sourceHandle: 'source',
        targetHandle: 'target',
      },
      {
        id: `${branchActionNode.id}-to-end`,
        source: branchActionNode.id,
        target: branchEndNode.id,
        type: 'smoothstep',
        sourceHandle: 'source',
        targetHandle: 'target',
      }
    ];
    
    // Add the new edges
    setEdges(eds => [...eds, ...newEdges]);
    setBranchCount(branchCount + 1);
  };

  
  // Remove a branch from an if/else node
  const removeBranch = (branchId) => {
    if (!selectedNode || selectedNode.type !== 'ifelse') return;
  
    // Update form data by removing the branch
    setNodeFormData((prevData) => ({
      ...prevData,
      branches: prevData.branches.filter((branch) => branch.id !== branchId),
    }));
  
    // Find the action node and end node associated with this branch
    const branchActionNodeId = `${selectedNode.id}-${branchId}-action`;
    const branchEndNodeId = `${selectedNode.id}-${branchId}-end`;
  
    // Remove the action and end nodes for the branch
    setNodes((nds) =>
      nds.filter(
        (node) =>
          node.id !== branchActionNodeId && node.id !== branchEndNodeId
      )
    );
  
    // Remove edges connected to the branch's action and end nodes
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== branchActionNodeId &&
          edge.target !== branchActionNodeId &&
          edge.source !== branchEndNodeId &&
          edge.target !== branchEndNodeId
      )
    );
  
    // Ensure remaining branches are still connected to the END node
    const remainingBranches = nodeFormData.branches.filter(
      (branch) => branch.id !== branchId
    );
  
    if (remainingBranches.length === 0) {
      // If no branches remain, connect the If/Else node directly to the END node
      setEdges((eds) => [
        ...eds,
        {
          id: `${selectedNode.id}-to-end`,
          source: selectedNode.id,
          target: 'end',
          type: 'smoothstep',
        },
      ]);
    }
  };

  // Update branch name
  const updateBranchName = (branchId, newName) => {
    if (!selectedNode || selectedNode.type !== 'ifelse') return;
  
    setNodeFormData({
      ...nodeFormData,
      branches: nodeFormData.branches.map(branch => 
        branch.id === branchId ? { ...branch, name: newName } : branch
      )
    });
  
    // Update the label of the corresponding action node
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === `${selectedNode.id}-${branchId}-action`) {
          return {
            ...node,
            data: {
              ...node.data,
              label: newName, // Update the label to the new branch name
            },
          };
        }
        return node;
      })
    );
  };

  // Handle form submission for node editing
  const handleNodeFormSubmit = (e) => {
    e.preventDefault();
  
    if (!selectedNode) return;
  
    // Update the selected node's data with the updated branch names
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: nodeFormData.name,
              branches: nodeFormData.branches, // Preserve updated branch names
            },
          };
        }
  
        // Update branch action nodes with the new branch names
        if (node.type === 'action' && node.id.includes(`${selectedNode.id}-branch-`)) {
          const branchId = node.id.split('-branch-')[1].split('-action')[0];
          const matchingBranch = nodeFormData.branches.find((b) => b.id === `branch-${branchId}`);
          if (matchingBranch) {
            return {
              ...node,
              data: {
                ...node.data,
                label: matchingBranch.name, // Update the label to the branch name
              },
            };
          }
        }
  
        return node;
      })
    );
  
    setShowNodeForm(false);
    setSelectedNode(null);
  };

  // Handle node deletion
  const deleteNode = () => {
    if (!selectedNode || selectedNode.id === 'start' || selectedNode.id === 'end') return;
    
    // Find incoming and outgoing edges
    const incomingEdges = edges.filter(edge => edge.target === selectedNode.id);
    const outgoingEdges = edges.filter(edge => edge.source === selectedNode.id);
    
    // For if/else nodes, we need to handle differently
    if (selectedNode.type === 'ifelse') {
      // Find all related nodes (branch nodes, action nodes, end nodes)
      const relatedNodes = nodes.filter(node => 
        node.id.includes(selectedNode.id) || 
        (node.id.includes('branch') && node.id.includes(selectedNode.id.split('-')[1])) ||
        node.id.includes(`${selectedNode.id}-else-end`)
      );
      
      const relatedNodeIds = relatedNodes.map(node => node.id);
      
      // Find all edges connected to related nodes
      const relatedEdges = edges.filter(edge => 
        relatedNodeIds.includes(edge.source) || 
        relatedNodeIds.includes(edge.target) ||
        edge.source === selectedNode.id ||
        edge.target === selectedNode.id
      );
      
      // Remove the if/else node and all related nodes
      setNodes(nds => nds.filter(node => 
        node.id !== selectedNode.id && 
        !relatedNodeIds.includes(node.id)
      ));
      
      // Remove all edges connected to this node and related nodes
      setEdges(eds => {
        const filteredEdges = eds.filter(edge => 
          !relatedEdges.some(re => re.id === edge.id)
        );
        
        // Connect the incoming node to the next node or end
        if (incomingEdges.length > 0) {
          // Connect the incoming node directly to the end node
          filteredEdges.push({
            id: `${incomingEdges[0].source}-end`,
            source: incomingEdges[0].source,
            target: 'end',
            type: 'smoothstep',
            sourceHandle: 'source',
            targetHandle: 'target',
          });
        } else {
          // If no incoming edges (unlikely), ensure start is connected to end
          const hasStartToEndEdge = filteredEdges.some(edge => 
            edge.source === 'start' && edge.target === 'end'
          );
          
          if (!hasStartToEndEdge) {
            filteredEdges.push({
              id: 'start-end',
              source: 'start',
              target: 'end',
              type: 'smoothstep',
              sourceHandle: 'source',
              targetHandle: 'target',
            });
          }
        }
        
        return filteredEdges;
      });
    } else {
      // For regular action nodes
      // Remove just this node
      setNodes(nds => nds.filter(node => node.id !== selectedNode.id));
      
      // Remove edges connected to this node and reconnect
      setEdges(eds => {
        const filteredEdges = eds.filter(edge => 
          edge.source !== selectedNode.id && 
          edge.target !== selectedNode.id
        );
        
        // If there were both incoming and outgoing edges, connect them
        if (incomingEdges.length > 0 && outgoingEdges.length > 0) {
          filteredEdges.push({
            id: `${incomingEdges[0].source}-${outgoingEdges[0].target}`,
            source: incomingEdges[0].source,
            target: outgoingEdges[0].target,
            type: 'smoothstep',
            sourceHandle: 'source',
            targetHandle: 'target',
          });
        } else if (incomingEdges.length > 0) {
          // If only incoming edges, connect to end
          filteredEdges.push({
            id: `${incomingEdges[0].source}-end`,
            source: incomingEdges[0].source,
            target: 'end',
            type: 'smoothstep',
            sourceHandle: 'source',
            targetHandle: 'target',
          });
        } else if (outgoingEdges.length > 0) {
          // If only outgoing edges, connect start to the target
          filteredEdges.push({
            id: `start-${outgoingEdges[0].target}`,
            source: 'start',
            target: outgoingEdges[0].target,
            type: 'smoothstep',
            sourceHandle: 'source',
            targetHandle: 'target',
          });
        } else {
          // If no edges at all, ensure start is connected to end
          const hasStartToEndEdge = filteredEdges.some(edge => 
            edge.source === 'start' && edge.target === 'end'
          );
          
          if (!hasStartToEndEdge) {
            filteredEdges.push({
              id: 'start-end',
              source: 'start',
              target: 'end',
              type: 'smoothstep',
              sourceHandle: 'source',
              targetHandle: 'target',
            });
          }
        }
        
        return filteredEdges;
      });
    }
    
    setShowNodeForm(false);
    setSelectedNode(null);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onCustomEdgesChange}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
        
        <Panel position="top-left">
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Add Node button removed as requested */}
          </div>
        </Panel>
      </ReactFlow>

      {/* Node Selection Menu */}
      {showNodeMenu && (
        <div
          style={{
            position: 'absolute',
            top: `${menuPosition.y}px`,
            left: `${menuPosition.x}px`,
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            zIndex: 1000,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Add Node:</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => addNodeBetween('action')}
              style={{
                padding: '8px 12px',
                backgroundColor: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Action Node
            </button>
            <button
              onClick={() => addNodeBetween('ifelse')}
              style={{
                padding: '8px 12px',
                backgroundColor: '#ffc53d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              If / Else Node
            </button>
          </div>
        </div>
      )}
      {/* Node Form */}
      {showNodeForm && selectedNode && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            zIndex: 1000,
            transform: 'translate(-50%, -50%)',
            minWidth: '300px',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Edit Node</h3>
          <form onSubmit={handleNodeFormSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Node Name:</label>
              <input
                type="text"
                value={nodeFormData.name}
                onChange={(e) => setNodeFormData({ ...nodeFormData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solidrgb(7, 7, 7)',
                }}
              />
            </div>
            
            {selectedNode.type === 'ifelse' && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Branches:</label>
                {nodeFormData.branches.map((branch, index) => (
                  <div key={branch.id} style={{ display: 'flex', marginBottom: '5px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={branch.name}
                      onChange={(e) => updateBranchName(branch.id, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #d9d9d9',
                        marginRight: '5px',
                      }}
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeBranch(branch.id)}
                        style={{
                          padding: '8px',
                          backgroundColor: '#ff4d4f',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addBranch}
                  style={{
                    padding: '8px',
                    backgroundColor: '#52c41a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '5px',
                  }}
                >
                  Add Branch
                </button>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="submit"
                style={{
                  padding: '10px',
                  backgroundColor: '#1890ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={deleteNode}
                style={{
                  padding: '10px',
                  backgroundColor: '#ff4d4f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Delete Node
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNodeForm(false);
                  setSelectedNode(null);
                }}
                style={{
                  padding: '10px',
                  backgroundColor: '#d9d9d9',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
