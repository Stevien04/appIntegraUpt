# IntegraUPT - Desarrollo Local
Este proyecto está dividido en dos carpetas:
- `integraupt-backend`: API construida con Spring Boot (Maven).
- `integraupt-frontend`: Aplicación web en React + Vite.
Para trabajar de forma cómoda se añadió un script que inicia ambas partes al mismo tiempo desde el frontend.
## Requisitos previos
- Node.js 18+ y npm
- Java 17+ (para Spring Boot)
- Maven disponible en la línea de comandos
## Instalación de dependencias
```bash
cd integraupt-frontend
npm install
```
## Levantar frontend y backend juntos
Desde la carpeta `integraupt-frontend` ejecuta:
```bash
npm run dev:full
```
Este comando:
1. Ejecuta `mvn spring-boot:run` dentro de `../integraupt-backend` para levantar la API.
2. Inicia Vite con `npm run dev -- --host` para servir el frontend.
3. Mantiene ambos procesos activos y, al cerrar el comando, finaliza los dos servidores.
Si necesitas ejecutar solo una parte puedes usar `npm run backend` o `npm run dev` según corresponda.

## Scripts disponibles

- `npm run dev` – Levanta únicamente el frontend con Vite.
- `npm run backend` – Inicia la API de Spring Boot.
- `npm run dev:full` – Levanta backend y frontend en paralelo.
- `npm run build` – Compila el frontend para producción.
- `npm run lint` – Ejecuta ESLint.
- `npm run preview` – Visualiza el build generado por Vite.