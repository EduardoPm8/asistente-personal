# Mi Vida Automática - Instrucciones

Proyecto de Asistente Personal con Backend Django y Frontend React.

## Requisitos previos
- Python 3.x
- Node.js & npm

## Backend (Django)

1.  **Navegar a la carpeta backend**:
    ```bash
    cd backend
    ```

2.  **Activar entorno virtual** (si no está activo):
    - Windows: `venv\Scripts\activate` or just use the python in venv directly.
    - Linux/Mac: `source venv/bin/activate`

3.  **Instalar dependencias**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Migraciones y Usuario Inicial**:
    ```bash
    python manage.py migrate
    python create_initial_user.py 
    # (Usuario: admin, Password: admin)
    ```

5.  **Correr servidor**:
    ```bash
    python manage.py runserver
    ```
    El backend correrá en `http://127.0.0.1:8000`.

## Frontend (React)

1.  **Navegar a la carpeta frontend**:
    ```bash
    cd frontend
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Correr servidor de desarrollo**:
    ```bash
    npm run dev
    ```
    El frontend correrá en `http://localhost:5173`.

## Uso

1.  Abre `http://localhost:5173`.
2.  Login con:
    -   Usuario: **admin**
    -   Contraseña: **admin**
3.  Automáticamente verás el Dashboard.
4.  Escribe una nota en el formulario. La emoción se detectará automáticamente.
    -   Palabras clave: "ansioso", "feliz", "triste", "estresado".
