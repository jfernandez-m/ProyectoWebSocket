import { useEffect, useRef, useState } from "react";
import { useChat } from "./useChat.js";

const AVATARES = [
  "/avatares/1.png", "/avatares/2.png", "/avatares/3.png", "/avatares/4.png", "/avatares/5.png",
  "/avatares/6.png", "/avatares/7.png", "/avatares/8.png", "/avatares/9.png", "/avatares/10.png",
];

const COLORES = [
  "#b71c1c", "#1b5e20", "#0d47a1", "#6a1b9a", "#bf360c",
  "#00695c", "#ad1457", "#4e342e", "#37474f", "#827717",
];


const asignados = new Map();
let disponibles = [];

function avatarDe(nombre) {
  if (!asignados.has(nombre)) {
    if (disponibles.length === 0) disponibles = [...AVATARES];
    const i = Math.floor(Math.random() * disponibles.length);
    asignados.set(nombre, disponibles.splice(i, 1)[0]);
  }
  return asignados.get(nombre);
}

function colorDe(nombre) {
  return COLORES[AVATARES.indexOf(avatarDe(nombre))];
}


function Burbuja({ nombre, texto, hora, tipo, esMio }) {
  if (tipo === "sistema") return <p className="sistema">{texto} · {hora}</p>;
  return (
    <div className={esMio ? "burbuja mia" : "burbuja"}>
      <strong style={{ color: colorDe(nombre) }}>
        <img className="avatar" src={avatarDe(nombre)} alt="" /> {!esMio && nombre}
      </strong>

      <span>{texto}</span>
      <small>{hora}</small>
    </div>
  );
}

function Chat({ nombre }) {
  const { mensajes, usuarios, conectado, enviar } = useChat(nombre);
  const [texto, setTexto] = useState("");
  const fin = useRef(null);

  useEffect(() => {
    fin.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  function onSubmit(e) {
    e.preventDefault();
    if (!texto.trim()) return;
    enviar(texto);
    setTexto("");
  }

  return (
    <div className="chat">
      <header>
        <h1>Chat TICS316</h1>
        <span className={conectado ? "estado ok" : "estado"}>
          {conectado ? "● conectado" : "○ reconectando…"}
        </span>
        <button onClick={() => document.body.classList.toggle("oscuro")}>Modo oscuro</button>
        <small>{usuarios.length} en línea: {usuarios.join(", ")}</small>
      </header>
      <main>
        {mensajes.map((m, i) => (
          <Burbuja key={i} {...m} esMio={m.nombre === nombre} />
        ))}
        <div ref={fin} />
      </main>
      <form onSubmit={onSubmit}>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe un mensaje…"
          maxLength={300}
          autoFocus
        />
        <button disabled={!conectado}>Enviar</button>
      </form>
    </div>
  );
}

export default function App() {
  const [nombre, setNombre] = useState("");
  const [borrador, setBorrador] = useState("");

  if (!nombre) {
    return (
      <form
        className="entrada"
        onSubmit={(e) => {
          e.preventDefault();
          if (borrador.trim()) setNombre(borrador.trim());
        }}
      >
        <h1>Chat TICS316</h1>
        <input
          value={borrador}
          onChange={(e) => setBorrador(e.target.value)}
          placeholder="Tu nombre"
          maxLength={20}
          autoFocus
        />
        <button>Entrar</button>
      </form>
    );
  }
  return <Chat nombre={nombre} />;
}
