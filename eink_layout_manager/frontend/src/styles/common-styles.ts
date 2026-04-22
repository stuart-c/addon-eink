import { css } from 'lit';

export const commonStyles = css`
  :host {
    --primary-colour: #03a9f4;
    --primary-hover: #0288d1;
    --danger-colour: #f44336;
    --danger-hover: #d32f2f;
    --text-colour: #333;
    --text-muted: #666;
    --border-colour: #ddd;
    --bg-light: #f8f9fa;
    --shadow-small: 0 2px 4px rgba(0,0,0,0.1);
    --shadow-medium: 0 4px 15px rgba(0,0,0,0.15);
    --shadow-large: 0 15px 35px rgba(0,0,0,0.25);
    --border-radius: 6px;
  }

  .material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 20px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-smoothing: antialiased;
    user-select: none;
  }

  button {
    background: var(--primary-colour);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s;
  }

  button:hover {
    background: var(--primary-hover);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  button.secondary {
    background: white;
    color: var(--primary-colour);
    border: 1px solid var(--primary-colour);
  }

  button.secondary:hover {
    background: #f0faff;
  }

  button.danger {
    background: white;
    color: var(--danger-colour);
    border: 1px solid var(--danger-colour);
  }

  button.danger:hover {
    background: #fff1f0;
    border-color: #f5222d;
    color: #f5222d;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: var(--text-muted);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input, select {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border-colour);
    border-radius: var(--border-radius);
    box-sizing: border-box;
    font-size: 14px;
    transition: border-color 0.2s;
  }

  input:focus, select:focus {
    outline: none;
    border-color: var(--primary-colour);
  }

  .draggable-item {
    cursor: grab;
    user-select: none;
    transition: background-color 0.2s, opacity 0.2s, transform 0.2s;
  }

  .draggable-item:active {
    cursor: grabbing;
  }

  .draggable-item.dragging {
    opacity: 0.5;
    transform: scale(0.98);
  }

  .drag-handle {
    cursor: grab;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    transition: color 0.2s;
  }

  .drag-handle:hover {
    color: var(--primary-colour);
  }

  .drag-handle:active {
    cursor: grabbing;
  }

  /* Universal Toolbar Styles */
  .toolbar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .toolbar-title {
    font-weight: 600;
    color: var(--text-colour);
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .toolbar-actions {
    display: flex;
    gap: 0.5rem;
  }

  /* Sidebar Section Titles */
  .sidebar-section-title {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .sidebar-section-title .material-icons {
    font-size: 14px;
  }

  /* Status Badges */
  .status-badge {
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    padding: 2px 6px;
    border-radius: 4px;
    letter-spacing: 0.5px;
    vertical-align: middle;
  }
  .status-badge.active, .status-badge.ready {
    background: #e8f5e9;
    color: #2e7d32;
  }
  .status-badge.draft {
    background: #f5f5f5;
    color: #757575;
  }
`;
