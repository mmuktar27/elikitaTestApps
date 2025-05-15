

//const WS_URL = "wss://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net";
//const WS_URL = "ws://localhost:4000"; // Change this if needed
const WS_URL = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL.replace('https://', 'wss://').replace('/api/v2', '')
  : "wss://localhost:4000";
export const createWebSocket = (onMessage: (data: any) => void) => {
  let socket: WebSocket | null = null;

  let reconnectTimeout: ReturnType<typeof setTimeout>;


  let isConnecting = false;
  let reconnectAttempts = 0; // Add this variable
  
  const connect = () => {
    if (isConnecting) return;
    
    isConnecting = true;
    clearTimeout(reconnectTimeout);
    
    // Close existing socket if it exists
    if (socket) {
      socket.onclose = null; // Remove the existing onclose handler
      socket.close();
    }
    
    console.log("Connecting to WebSocket...");
    socket = new WebSocket(WS_URL);
    
    socket.onopen = () => {
      console.log("WebSocket connection established");
      isConnecting = false;
      reconnectAttempts = 0; // Reset reconnect counter on successful connection
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    
    socket.onclose = () => {
      console.log("WebSocket connection closed. Reconnecting...");
      isConnecting = false;
      reconnectAttempts++; // Increment attempt counter
      
      // Reconnect with exponential backoff (starting at 1s, max 30s)
      const reconnectDelay = Math.min(30000, 1000 * Math.pow(1.5, reconnectAttempts));
      reconnectTimeout = setTimeout(connect, reconnectDelay);
    };
  };
  
  // Initial connection
  connect();
  
  return {
    close: () => { // Change from disconnect to close for consistency
      if (socket) {
        socket.onclose = null; // Prevent reconnection
        socket.close();
      }
      clearTimeout(reconnectTimeout);
    }
  };
};