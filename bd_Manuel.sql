--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: clientes; Type: TABLE; Schema: public; Owner: Oscar
--

CREATE TABLE public.clientes (
    id integer NOT NULL,
    numero_telefono character varying(20) NOT NULL,
    nombre text,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ultima_interaccion timestamp without time zone
);


ALTER TABLE public.clientes OWNER TO "Oscar";

--
-- Name: clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: Oscar
--

CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clientes_id_seq OWNER TO "Oscar";

--
-- Name: clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Oscar
--

ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;


--
-- Name: mensajes_predefinidos; Type: TABLE; Schema: public; Owner: Oscar
--

CREATE TABLE public.mensajes_predefinidos (
    id integer NOT NULL,
    tipo character varying(50),
    mensaje text,
    precio text
);


ALTER TABLE public.mensajes_predefinidos OWNER TO "Oscar";

--
-- Name: mensajes_predefinidos_id_seq; Type: SEQUENCE; Schema: public; Owner: Oscar
--

CREATE SEQUENCE public.mensajes_predefinidos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mensajes_predefinidos_id_seq OWNER TO "Oscar";

--
-- Name: mensajes_predefinidos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Oscar
--

ALTER SEQUENCE public.mensajes_predefinidos_id_seq OWNED BY public.mensajes_predefinidos.id;


--
-- Name: clientes id; Type: DEFAULT; Schema: public; Owner: Oscar
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);


--
-- Name: mensajes_predefinidos id; Type: DEFAULT; Schema: public; Owner: Oscar
--

ALTER TABLE ONLY public.mensajes_predefinidos ALTER COLUMN id SET DEFAULT nextval('public.mensajes_predefinidos_id_seq'::regclass);


--
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: Oscar
--

COPY public.clientes (id, numero_telefono, nombre, fecha_registro, ultima_interaccion) FROM stdin;
1	59164214603	Manuel	2024-09-17 10:43:27.639468	2024-09-19 11:22:50.079455
\.


--
-- Data for Name: mensajes_predefinidos; Type: TABLE DATA; Schema: public; Owner: Oscar
--

COPY public.mensajes_predefinidos (id, tipo, mensaje, precio) FROM stdin;
1	consulta_chatbots	Consulta sobre nuestros Chatbots \n🔍Ofrecemos chatbots completamente personalizados para una variedad de industrias.\n🔸 Beneficios:\n1️⃣ Mejora la atención al cliente.\n2️⃣ Automatiza tareas repetitivas.\n3️⃣ Responde 24/7 a tus clientes.\n💼 Planes a tu medida. Para obtener los planes y precios escribe *precio*	Chatbot Básico 💬\n\t\t\tEste plan incluye:\n\t\t\t\n\t\t\tRespuestas automáticas básicas.\n\t\t\tIntegración con WhatsApp.\n\t\t\tSoporte técnico estándar.\n\t\t\tPrecio: 890 bs\n\t\t\t\n\t\t\tChatbot Avanzado 🚀\n\t\t\tEste plan incluye:\n\t\t\t\n\t\t\tRespuestas personalizadas avanzadas.\n\t\t\tIntegración con múltiples plataformas.\n\t\t\tAnálisis y reportes de uso.\n\t\t\tSoporte técnico prioritario.\n\t\t\tPrecio: 1800 bs\n\t\t\tEstos planes son de 3 a 5 años
\.


--
-- Name: clientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Oscar
--

SELECT pg_catalog.setval('public.clientes_id_seq', 1, true);


--
-- Name: mensajes_predefinidos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Oscar
--

SELECT pg_catalog.setval('public.mensajes_predefinidos_id_seq', 2, true);


--
-- Name: clientes clientes_numero_telefono_key; Type: CONSTRAINT; Schema: public; Owner: Oscar
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_numero_telefono_key UNIQUE (numero_telefono);


--
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: Oscar
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- Name: mensajes_predefinidos mensajes_predefinidos_pkey; Type: CONSTRAINT; Schema: public; Owner: Oscar
--

ALTER TABLE ONLY public.mensajes_predefinidos
    ADD CONSTRAINT mensajes_predefinidos_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

