import { css } from 'lit';

export const commonStyles = css`
  :host {
    --primary-color: #03a9f4;
    --primary-hover: #0288d1;
    --danger-color: #f44336;
    --danger-hover: #d32f2f;
    --text-color: #333;
    --text-muted: #666;
    --border-color: #ddd;
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
    background: var(--primary-color);
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
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
  }

  button.secondary:hover {
    background: #f0faff;
  }

  button.danger {
    background: white;
    color: var(--danger-color);
    border: 1px solid var(--danger-color);
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
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    box-sizing: border-box;
    font-size: 14px;
    transition: border-color 0.2s;
  }

  input:focus, select:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;
