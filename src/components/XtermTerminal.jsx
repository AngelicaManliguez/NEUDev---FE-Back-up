import React, { useEffect, useRef } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import '../style/XtermOverrides.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal, faTimes } from '@fortawesome/free-solid-svg-icons';

const XtermTerminal = ({ ws, title = 'NEUDev Terminal', onClose }) => {
  const terminalRef = useRef(null);
  const termRef = useRef(null);
  const fitAddonRef = useRef(null);

  // We'll store typed data in a buffer and only send it to the server
  // once the user presses Enter (or \r). We do NOT echo it locally.
  const inputBufferRef = useRef('');

  useEffect(() => {
    // 1) Create the xterm instance
    const term = new Terminal({
      cursorBlink: true,
      fontFamily: 'Poppins, sans-serif',
      fontSize: 14,
      theme: {
        background: '#1e1e1e',
        foreground: '#ffffff',
        cursor: '#ffffff',
        selection: '#ffffff77'
      }
      // Note: no "local echo" here—our onData handler decides what to display.
    });
    termRef.current = term;

    // 2) Create and load the FitAddon
    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;
    term.loadAddon(fitAddon);

    // 3) Open the terminal and fit it
    term.open(terminalRef.current);
    fitAddon.fit();

    // 4) Resize listener so the terminal always fits
    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    // 5) WebSocket -> Terminal output
    if (ws) {
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'stdout') {
          // Replace lone \n with \r\n so lines break nicely
          term.write(data.data.replace(/\r?\n/g, '\r\n'));
        } else if (data.type === 'stderr') {
          term.write(`\r\nError: ${data.data}\r\n`);
        } else if (data.type === 'exit') {
          term.write('\r\n>>> Program Terminated\r\n');
        }
      };

      // 6) Terminal -> WebSocket (no local echo)
      term.onData((userInput) => {
        // Handle backspace (optional)
        if (userInput === '\u007F' || userInput === '\b') {
          term.write('\b \b');
          inputBufferRef.current = inputBufferRef.current.slice(0, -1);
          return;
        }
      
        // 1) Echo each typed character to the screen immediately
        term.write(userInput);
      
        // 2) Keep track of what’s typed so we can send it on Enter
        inputBufferRef.current += userInput;
      
        // 3) On Enter, send everything to the backend
        if (userInput === '\r' || userInput === '\n') {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'input', data: inputBufferRef.current }));
          }
          inputBufferRef.current = '';
        }
      });      
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      fitAddon.dispose();
    };
  }, [ws]);

  return (
    <Card
      className="shadow-sm border-0"
      style={{ backgroundColor: '#1e1e1e', color: '#fff' }}
    >
      <Card.Header
        style={{ backgroundColor: '#141414', borderBottom: '1px solid #333' }}
        className="d-flex justify-content-between align-items-center"
      >
        <div>
          <FontAwesomeIcon icon={faTerminal} style={{ marginRight: '0.5rem' }} />
          {title}
        </div>
        {onClose && (
          <Button variant="outline-light" size="sm" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        )}
      </Card.Header>
      <Card.Body style={{ padding: 0 }}>
        <div ref={terminalRef} style={{ width: '100%', height: '300px' }} />
      </Card.Body>
    </Card>
  );
};

export default XtermTerminal;