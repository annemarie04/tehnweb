--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

-- Started on 2022-04-17 22:06:42 EEST

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

--
-- TOC entry 832 (class 1247 OID 16443)
-- Name: categ_colectie; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.categ_colectie AS ENUM (
    'primavara',
    'vara',
    'toamna',
    'iarna'
);


ALTER TYPE public.categ_colectie OWNER TO postgres;

--
-- TOC entry 841 (class 1247 OID 24587)
-- Name: roluri; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.roluri AS ENUM (
    'admin',
    'moderator',
    'comun'
);


ALTER TYPE public.roluri OWNER TO postgres;

--
-- TOC entry 835 (class 1247 OID 16452)
-- Name: tipuri_produse; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipuri_produse AS ENUM (
    'rochii',
    'fuste',
    'topuri',
    'pantaloni',
    'sacouri'
);


ALTER TYPE public.tipuri_produse OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 24608)
-- Name: accesari; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accesari (
    id integer NOT NULL,
    ip character varying(100) NOT NULL,
    user_id integer,
    pagina character varying(500) NOT NULL,
    data_accesare timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.accesari OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 24607)
-- Name: accesari_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accesari_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accesari_id_seq OWNER TO postgres;

--
-- TOC entry 3633 (class 0 OID 0)
-- Dependencies: 215
-- Name: accesari_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accesari_id_seq OWNED BY public.accesari.id;


--
-- TOC entry 212 (class 1259 OID 16464)
-- Name: articole; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.articole (
    id integer NOT NULL,
    nume character varying(50) NOT NULL,
    descriere text,
    pret numeric(8,2) NOT NULL,
    an_colectie integer NOT NULL,
    tip_produs public.tipuri_produse DEFAULT 'rochii'::public.tipuri_produse,
    marime integer NOT NULL,
    categorie public.categ_colectie DEFAULT 'vara'::public.categ_colectie,
    materiale character varying[],
    culoare character varying(50) NOT NULL,
    sold_out boolean DEFAULT false NOT NULL,
    imagine character varying(300),
    data_adaugare timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT articole_an_colectie_check CHECK ((an_colectie >= 0)),
    CONSTRAINT articole_marime_check CHECK ((marime >= 0))
);


ALTER TABLE public.articole OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 16463)
-- Name: articole_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.articole_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.articole_id_seq OWNER TO postgres;

--
-- TOC entry 3634 (class 0 OID 0)
-- Dependencies: 211
-- Name: articole_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.articole_id_seq OWNED BY public.articole.id;


--
-- TOC entry 210 (class 1259 OID 16396)
-- Name: tabel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tabel (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    price integer DEFAULT 100 NOT NULL
);


ALTER TABLE public.tabel OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 16395)
-- Name: tabel_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tabel ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tabel_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 214 (class 1259 OID 24594)
-- Name: utilizatori; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilizatori (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    nume character varying(100) NOT NULL,
    prenume character varying(100) NOT NULL,
    parola character varying(500) NOT NULL,
    rol public.roluri DEFAULT 'comun'::public.roluri NOT NULL,
    email character varying(100) NOT NULL,
    culoare_chat character varying(50) NOT NULL,
    data_adaugare timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cod character varying(200),
    confirmat_mail boolean DEFAULT false
);


ALTER TABLE public.utilizatori OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 24593)
-- Name: utilizatori_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilizatori_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.utilizatori_id_seq OWNER TO postgres;

--
-- TOC entry 3637 (class 0 OID 0)
-- Dependencies: 213
-- Name: utilizatori_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilizatori_id_seq OWNED BY public.utilizatori.id;


--
-- TOC entry 3466 (class 2604 OID 24611)
-- Name: accesari id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accesari ALTER COLUMN id SET DEFAULT nextval('public.accesari_id_seq'::regclass);


--
-- TOC entry 3455 (class 2604 OID 16467)
-- Name: articole id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articole ALTER COLUMN id SET DEFAULT nextval('public.articole_id_seq'::regclass);


--
-- TOC entry 3462 (class 2604 OID 24597)
-- Name: utilizatori id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilizatori ALTER COLUMN id SET DEFAULT nextval('public.utilizatori_id_seq'::regclass);


--
-- TOC entry 3627 (class 0 OID 24608)
-- Dependencies: 216
-- Data for Name: accesari; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3623 (class 0 OID 16464)
-- Dependencies: 212
-- Data for Name: articole; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.articole (id, nume, descriere, pret, an_colectie, tip_produs, marime, categorie, materiale, culoare, sold_out, imagine, data_adaugare) VALUES (1, 'Pink dress', 'Pink dress, with floral design', 7.50, 2020, 'rochii', 32, 'vara', '{"cotton 90%","polyester 10%"}', 'pink', false, 'pink-dress.jpg', '2022-03-28 17:07:28.239614');
INSERT INTO public.articole (id, nume, descriere, pret, an_colectie, tip_produs, marime, categorie, materiale, culoare, sold_out, imagine, data_adaugare) VALUES (2, 'Red dress', 'Red dress, casual and formal', 5.50, 2021, 'rochii', 34, 'primavara', '{"cotton 50%","silk 50%"}', 'red', false, 'red-dress.jpg', '2022-03-28 17:07:28.239614');
INSERT INTO public.articole (id, nume, descriere, pret, an_colectie, tip_produs, marime, categorie, materiale, culoare, sold_out, imagine, data_adaugare) VALUES (3, 'Blue jacket', 'Blue jacket, for outdoor events', 6.50, 2022, 'sacouri', 34, 'toamna', '{"silk 90%","polyester 10%"}', 'blue', true, 'blue-jacket.jpg', '2022-03-28 17:07:28.239614');
INSERT INTO public.articole (id, nume, descriere, pret, an_colectie, tip_produs, marime, categorie, materiale, culoare, sold_out, imagine, data_adaugare) VALUES (4, 'Yellow sweatshirt', 'Yellow sweatshirt, perfect for any occasion', 7.00, 2022, 'topuri', 36, 'primavara', '{"cotton 100%"}', 'yellow', false, 'yellow-sweatshirt.jpg', '2022-03-28 17:07:28.239614');
INSERT INTO public.articole (id, nume, descriere, pret, an_colectie, tip_produs, marime, categorie, materiale, culoare, sold_out, imagine, data_adaugare) VALUES (5, 'Black Skirt', 'Back skirt, formal and classy', 4.00, 2020, 'fuste', 40, 'vara', '{"cotton 40%","polyester 10%","silk 50%"}', 'black', true, 'black-skirt.jpg', '2022-03-28 17:07:28.239614');


--
-- TOC entry 3621 (class 0 OID 16396)
-- Dependencies: 210
-- Data for Name: tabel; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tabel (id, name, price) OVERRIDING SYSTEM VALUE VALUES (1, 'abcd', 200);
INSERT INTO public.tabel (id, name, price) OVERRIDING SYSTEM VALUE VALUES (2, 'mouse', 100);
INSERT INTO public.tabel (id, name, price) OVERRIDING SYSTEM VALUE VALUES (3, 'zzzz', 50);


--
-- TOC entry 3625 (class 0 OID 24594)
-- Dependencies: 214
-- Data for Name: utilizatori; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.utilizatori (id, username, nume, prenume, parola, rol, email, culoare_chat, data_adaugare, cod, confirmat_mail) VALUES (1, 'prof8967', 'Gogulescu', 'Gogu', '561a135618e8c0b94c0087048e46f63726ed89bdbe2fd62769127cdebd875d4914ad05de400c37fec504e68d2a91a4e50c0bcfaf4e7185ec718dc3ea2bf68f8b', 'comun', 'profprofprof007@gmail.com', 'red', '2022-04-12 23:24:58.210652', NULL, false);


--
-- TOC entry 3638 (class 0 OID 0)
-- Dependencies: 215
-- Name: accesari_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accesari_id_seq', 1, false);


--
-- TOC entry 3639 (class 0 OID 0)
-- Dependencies: 211
-- Name: articole_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.articole_id_seq', 5, true);


--
-- TOC entry 3640 (class 0 OID 0)
-- Dependencies: 209
-- Name: tabel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tabel_id_seq', 3, true);


--
-- TOC entry 3641 (class 0 OID 0)
-- Dependencies: 213
-- Name: utilizatori_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilizatori_id_seq', 1, true);


--
-- TOC entry 3479 (class 2606 OID 24616)
-- Name: accesari accesari_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accesari
    ADD CONSTRAINT accesari_pkey PRIMARY KEY (id);


--
-- TOC entry 3471 (class 2606 OID 16479)
-- Name: articole articole_nume_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articole
    ADD CONSTRAINT articole_nume_key UNIQUE (nume);


--
-- TOC entry 3473 (class 2606 OID 16477)
-- Name: articole articole_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articole
    ADD CONSTRAINT articole_pkey PRIMARY KEY (id);


--
-- TOC entry 3469 (class 2606 OID 16401)
-- Name: tabel tabel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tabel
    ADD CONSTRAINT tabel_pkey PRIMARY KEY (id);


--
-- TOC entry 3475 (class 2606 OID 24604)
-- Name: utilizatori utilizatori_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilizatori
    ADD CONSTRAINT utilizatori_pkey PRIMARY KEY (id);


--
-- TOC entry 3477 (class 2606 OID 24606)
-- Name: utilizatori utilizatori_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilizatori
    ADD CONSTRAINT utilizatori_username_key UNIQUE (username);


--
-- TOC entry 3480 (class 2606 OID 24617)
-- Name: accesari accesari_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accesari
    ADD CONSTRAINT accesari_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.utilizatori(id);


--
-- TOC entry 3635 (class 0 OID 0)
-- Dependencies: 210
-- Name: TABLE tabel; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tabel TO anne;


--
-- TOC entry 3636 (class 0 OID 0)
-- Dependencies: 209
-- Name: SEQUENCE tabel_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tabel_id_seq TO anne;


-- Completed on 2022-04-17 22:06:42 EEST

--
-- PostgreSQL database dump complete
--

