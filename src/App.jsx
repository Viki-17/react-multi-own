import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import Ground from "./components/Ground.jsx";
import Player from "./components/Player.jsx";
import { io } from "socket.io-client";
import UserWrapper from "./components/UserWrapper.jsx";

const App = () => {
  const [socketClient, setSocketClient] = useState(null);
  const [clients, setClients] = useState({});

  useEffect(() => {
    // On mount initialize the socket connection
    setSocketClient(io("http://localhost:4444"));

    // Dispose gracefuly
    return () => {
      if (socketClient) socketClient.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socketClient) {
      socketClient.on("move", (clients) => {
        setClients(clients);
      });
    }
  }, [socketClient]);

  return (
    <>
      {socketClient && (
        <KeyboardControls
          map={[
            { name: "forward", keys: ["ArrowUp", "w", "W"] },
            { name: "backward", keys: ["ArrowDown", "s", "S"] },
            { name: "left", keys: ["ArrowLeft", "a", "A"] },
            { name: "right", keys: ["ArrowRight", "d", "D"] },
            { name: "jump", keys: ["Space"] },
            { name: "shift", keys: ["Shift"] },
          ]}
        >
          <Canvas>
            <Ground />
            <Player socket={socketClient} />
            <gridHelper rotation={[0, 0, 0]} />
            {Object.keys(clients)
              .filter((clientKey) => clientKey !== socketClient.id)
              .map((client) => {
                const { position, rotation } = clients[client];
                // console.log("app", clients);
                return (
                  <UserWrapper
                    key={client}
                    id={client}
                    position={position}
                    rotation={rotation}
                  />
                );
              })}
          </Canvas>
        </KeyboardControls>
      )}
    </>
  );
};

export default App;
