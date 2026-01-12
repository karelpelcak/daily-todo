# Task API Endpoints Documentation

Všechny endpointy vyžadují autentizaci pomocí JWT tokenu v `Authorization` headeru.

**Base URL prefix:** `/task`

---

## 1. Získat všechny dnešní úkoly

**Endpoint:** `GET /task/get`

**Autentizace:** Vyžadována (JWT token)

**Popis:** Vrátí všechny úkoly pro aktuálně přihlášeného uživatele vytvořené dnes (od 00:00:00 do 23:59:59).

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "message": "Get task for user with ID: 123",
  "tasks": [
    {
      "id": 1,
      "title": "Název úkolu",
      "isFinished": false
    },
    {
      "id": 2,
      "title": "Další úkol",
      "isFinished": true
    }
  ]
}
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch tasks"
}
```

---

## 2. Získat konkrétní úkol

**Endpoint:** `GET /task/get/:taskId`

**Autentizace:** Vyžadována (JWT token)

**Popis:** Vrátí detaily konkrétního úkolu podle ID.

**URL Parameters:**
- `taskId` (number) - ID úkolu

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "message": "Get task for user with ID: 123",
  "tasks": [
    {
      "id": 1,
      "title": "Název úkolu",
      "description": "Popis úkolu",
      "isFinished": false,
      "createdAt": "2026-01-12T10:30:00.000Z"
    }
  ]
}
```

**Error Responses:**

400 Bad Request - neplatné taskId:
```json
{
  "error": "Invalid task ID"
}
```

404 Not Found - úkol nenalezen:
```json
{
  "error": "Task not found"
}
```

500 Internal Server Error:
```json
{
  "error": "Failed to fetch task"
}
```

---

## 3. Aktualizovat status úkolu

**Endpoint:** `PATCH /task/update/status/:taskId`

**Autentizace:** Vyžadována (JWT token)

**Popis:** Aktualizuje pouze status (isFinished) konkrétního úkolu.

**URL Parameters:**
- `taskId` (number) - ID úkolu

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "isFinished": true
}
```

**Response (200 OK):**
```json
{
  "message": "Update task status for task ID: 1 and user ID: 123",
  "updatedTask": {
    "id": 1,
    "userId": 123,
    "title": "Název úkolu",
    "description": "Popis úkolu",
    "isFinished": true,
    "createdAt": "2026-01-12T10:30:00.000Z"
  }
}
```

**Error Responses:**

400 Bad Request - neplatné taskId:
```json
{
  "error": "Invalid task ID"
}
```

400 Bad Request - isFinished není boolean:
```json
{
  "error": "isFinished must be a boolean"
}
```

404 Not Found - úkol nenalezen:
```json
{
  "error": "Task not found"
}
```

500 Internal Server Error:
```json
{
  "error": "Failed to update task status"
}
```

---

## 4. Aktualizovat úkol

**Endpoint:** `PATCH /task/update/:taskId`

**Autentizace:** Vyžadována (JWT token)

**Popis:** Aktualizuje title, description nebo isFinished konkrétního úkolu. Lze aktualizovat jedno nebo více polí najednou.

**URL Parameters:**
- `taskId` (number) - ID úkolu

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Aktualizovaný název",
  "description": "Aktualizovaný popis",
  "isFinished": true
}
```

**Poznámka:** Všechna pole jsou volitelná, ale alespoň jedno musí být posláno.

**Response (200 OK):**
```json
{
  "message": "Update task status for task ID: 1 and user ID: 123",
  "updatedTask": {
    "id": 1,
    "userId": 123,
    "title": "Aktualizovaný název",
    "description": "Aktualizovaný popis",
    "isFinished": true,
    "createdAt": "2026-01-12T10:30:00.000Z"
  }
}
```

**Error Responses:**

400 Bad Request - neplatné taskId:
```json
{
  "error": "Invalid task ID"
}
```

400 Bad Request - žádné pole není posláno:
```json
{
  "error": "At least one field must be provided"
}
```

404 Not Found - úkol nenalezen:
```json
{
  "error": "Task not found"
}
```

500 Internal Server Error:
```json
{
  "error": "Failed to update task"
}
```

---

## 5. Vytvořit nový úkol

**Endpoint:** `POST /task/new`

**Autentizace:** Vyžadována (JWT token)

**Popis:** Vytvoří nový úkol pro přihlášeného uživatele.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Název úkolu",
  "description": "Popis úkolu (volitelné)",
  "isFinished": false
}
```

**Povinná pole:**
- `title` (string) - max 255 znaků, nesmí být prázdný

**Volitelná pole:**
- `description` (string) - může být null
- `isFinished` (boolean) - výchozí hodnota false

**Response (201 Created):**
```json
{
  "message": "Create task for user ID: 123 with title: Název úkolu",
  "task": {
    "id": 1,
    "userId": 123,
    "title": "Název úkolu",
    "description": "Popis úkolu",
    "isFinished": false,
    "createdAt": "2026-01-12T10:30:00.000Z"
  }
}
```

**Error Responses:**

400 Bad Request - title chybí nebo je prázdný:
```json
{
  "error": "Title is required"
}
```

400 Bad Request - title je příliš dlouhý:
```json
{
  "error": "Title is too long (max 255 characters)"
}
```

500 Internal Server Error:
```json
{
  "error": "Failed to create task"
}
```

---

## 6. Smazat úkol

**Endpoint:** `DELETE /task/delete/:taskId`

**Autentizace:** Vyžadována (JWT token)

**Popis:** Smaže konkrétní úkol podle ID.

**URL Parameters:**
- `taskId` (number) - ID úkolu

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "message": "Delete task with ID: 1 for user ID: 123"
}
```

**Error Responses:**

400 Bad Request - neplatné taskId:
```json
{
  "error": "Invalid task ID"
}
```

404 Not Found - úkol nenalezen:
```json
{
  "error": "Task not found"
}
```

500 Internal Server Error:
```json
{
  "error": "Failed to delete task"
}
```

---

## Obecné poznámky

### Autentizace
Všechny endpointy vyžadují JWT token v Authorization headeru:
```
Authorization: Bearer <jwt_token>
```

### Bezpečnost
- Každý endpoint ověřuje, že úkol patří přihlášenému uživateli
- Uživatel může manipulovat pouze se svými vlastními úkoly

### Formát data
- Všechna data jsou ve formátu ISO 8601 (např. `2026-01-12T10:30:00.000Z`)
- Časová zóna je UTC

### HTTP Status Codes
- `200 OK` - úspěšná operace (GET, PATCH, DELETE)
- `201 Created` - úspěšné vytvoření (POST)
- `400 Bad Request` - neplatný vstup
- `404 Not Found` - zdroj nenalezen
- `500 Internal Server Error` - serverová chyba
