import { css } from 'lit';

export const commonStyles = css`
  :host {
    --primary-colour: #2196f3;
    --primary-hover: #1976d2;
    --secondary-colour: #607d8b;
    --danger-colour: #ff5252;
    --danger-hover: #e53935;
    --text-colour: #263238;
    --text-muted: #546e7a;
    --border-colour: rgba(0, 0, 0, 0.08);
    --bg-light: #f5f7fa;
    --bg-white: #ffffff;
    --shadow-small: 0 2px 8px rgba(0,0,0,0.06);
    --shadow-medium: 0 8px 16px rgba(0,0,0,0.08);
    --shadow-large: 0 16px 32px rgba(0,0,0,0.12);
    --border-radius: 12px;
    --glass-bg: rgba(255, 255, 255, 0.7);
    --glass-border: rgba(255, 255, 255, 0.3);
  }

  .glass {
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-small);
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    box-shadow: var(--shadow-medium);
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
    background: linear-gradient(135deg, var(--primary-colour), var(--primary-hover));
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(33, 150, 243, 0.2);
  }

  button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
    filter: brightness(1.05);
  }

  button:active {
    transform: translateY(0);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(1);
    box-shadow: none;
  }

  button.secondary {
    background: white;
    color: var(--primary-colour);
    border: 1px solid rgba(33, 150, 243, 0.3);
    box-shadow: var(--shadow-small);
  }

  button.secondary:hover {
    background: #f8fbff;
    border-color: var(--primary-colour);
    box-shadow: var(--shadow-medium);
  }

  button.danger {
    background: white;
    color: var(--danger-colour);
    border: 1px solid rgba(255, 82, 82, 0.3);
    box-shadow: var(--shadow-small);
  }

  button.danger:hover {
    background: #fffcfc;
    border-color: var(--danger-colour);
    box-shadow: var(--shadow-medium);
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  input, select, textarea {
    width: 100%;
    padding: 12px;
    background: var(--bg-white);
    border: 1px solid var(--border-colour);
    border-radius: 8px;
    box-sizing: border-box;
    font-size: 15px;
    color: var(--text-colour);
    transition: all 0.2s;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
  }

  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: var(--primary-colour);
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1), inset 0 1px 2px rgba(0,0,0,0.02);
  }
`;
