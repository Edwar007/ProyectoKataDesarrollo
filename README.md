# Proyecto Kata - Gestión de Onboardings

Este proyecto es una aplicación web desarrollada con Spring Boot para gestionar procesos de onboarding de colaboradores. Permite registrar sesiones, colaboradores, organizadores, y enviar notificaciones por correo electrónico en distintos eventos.

---

## ✅ Tecnologías utilizadas

- **Java 21**
- **Spring Boot 3.5.3**
- **Spring Data JPA**
- **Hibernate Validator**
- **Base de datos H2 (en memoria)**
- **HTML, CSS, JavaScript puro (Frontend básico en `/static`)**
- **Lombok**
- **Envío de correos SMTP (Gmail)**

---

## ⚙️ Requisitos para ejecutar el proyecto

### 1. JDK
- Java 21 instalado

### 2. Maven
- Asegúrate de tener Maven instalado y configurado correctamente.

---

## 🔐 Variables de entorno necesarias

El proyecto **envía correos electrónicos** usando SMTP de Gmail. Para proteger tus credenciales, debes definir dos variables de entorno en tu sistema:

| Variable | Descripción |
|---------|-------------|
| `SPRING_MAIL_USERNAME` | Tu correo de Gmail |
| `SPRING_MAIL_PASSWORD` | Tu contraseña de aplicación de Gmail |

### Cómo crearlas en Windows (CMD):
```bash
setx SPRING_MAIL_USERNAME "tu_correo@gmail.com"
setx SPRING_MAIL_PASSWORD "tu_contraseña_de_aplicación"
```


## 🛢️ Base de datos H2

El proyecto utiliza **H2 en memoria**, por lo tanto, **los datos se pierden al cerrar la aplicación**.

Puedes acceder a la consola de H2 para visualizar y probar las tablas:

📍 URL: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

- **JDBC URL:** `jdbc:h2:mem:testdb`
- **Usuario:** `sa`
- **Contraseña:** *(vacía)*

---

## ➕ Recomendaciones

- 🔧 Crea datos de prueba antes de comenzar a usar la aplicación.
- 🌐 Si accedes desde el navegador, puedes abrir directamente los archivos `.html` que están dentro del directorio `src/main/resources/static/`.

---

## 🌐 URL principal de la aplicación

Una vez ejecutado el proyecto, puedes ingresar directamente desde tu navegador a:

👉 **[http://localhost:8080/](http://localhost:8080/)**
