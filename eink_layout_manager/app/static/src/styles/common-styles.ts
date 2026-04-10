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
    --bg-white: #ffffff;
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

  button:active {
    transform: translateY(1px);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  button.secondary {
    background: white;
    color: var(--primary-colour);
    border: 1px solid var(--primary-colour);
    box-shadow: none;
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

  input, select, textarea {
    width: 100%;
    padding: 10px;
    background: var(--bg-white);
    border: 1px solid var(--border-colour);
    border-radius: var(--border-radius);
    box-sizing: border-box;
    font-size: 14px;
    color: var(--text-colour);
    transition: border-color 0.2s;
  }

  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: var(--primary-colour);
  }
`;
`;
